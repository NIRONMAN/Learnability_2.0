"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, Button, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { RootState } from '@/app/GlobalRedux/store';
import { getSession, sessionProps } from '@/utils/functions';

const Page = () => {
  const router = useRouter();
  const { user, isLoadingCookie } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const userId = user?.userId;
  const [response, setResponse] = useState<{ question: string; answer: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionData, setSessionData] = useState<sessionProps>({
    context: "",
    messages: [],
    sessionType: "",
    contextType: "",
    sessionTitle: "",
    fileUrl: "",
  });

  useEffect(() => {
    if (!isLoadingCookie && !user) {
      router.replace("/signup-login");
    }
  }, [isLoadingCookie, user, router]);

  useEffect(() => {
    if (sessionId && userId) {
      getSession(sessionId, userId).then((response: sessionProps) => {
        setSessionData(response);
      });
    }
  }, [sessionId, userId]);

  useEffect(() => {
    if (sessionData.context) {
      axios.post("api/flashCardExtract", { context: sessionData.context }).then(async (res) => {
        const finalData: string = await res.data.result;
        const parsed = JSON.parse(finalData);
        setResponse(parsed);
        setIsLoading(false);
      });
    }
  }, [sessionData]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % response.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + response.length) % response.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 p-4" style={{height:'calc(100vh - 56px)'}}>
      <Card
        className="w-full max-w-lg cursor-pointer"
        style={{
          perspective: '1000px',
          backgroundColor: 'transparent',
        }}
        onClick={handleFlip}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '250px',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : '',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p className="text-xl font-semibold text-center">
              {response[currentCardIndex].question}
            </p>
          </div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backgroundColor: '#1890ff',
              color: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xl font-semibold text-center">
              {response[currentCardIndex].answer}
            </p>
          </div>
        </div>
      </Card>
      <div className="flex justify-between w-full max-w-md mt-8">
        <Button onClick={handlePrev} icon={<LeftOutlined />}>
          Previous
        </Button>
        <Button onClick={handleNext} icon={<RightOutlined />}>
          Next
        </Button>
      </div>
      <p className="mt-4 text-white">
        Card {currentCardIndex + 1} of {response.length}
      </p>
    </div>
  );
};

export default Page;