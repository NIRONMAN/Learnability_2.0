"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from "@ai-sdk/react";
import { getSession, sessionProps, updateSession } from '@/utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import ChatBot from '@/app/Components/ChatBot';
import MessageList from '@/app/Components/MessageList';
import Suggestions from '@/app/Components/Suggestions';
import { SuggestionsProvider } from '@/app/Components/SuggestionsContext';
import { updateString } from '@/app/GlobalRedux/Features/string/stringSlice';
import revisionSystemPrompt from '@/lib/revisionSystemPrompt';




const RevisingPage = () => {
  const router = useRouter();
  const { user, isLoadingCookie } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const userId = user?.userId;
  const dispatch=useDispatch()
  
  
  useEffect(() => {
    if (!isLoadingCookie && !user) {
      router.replace("/signup-login");
    }
  }, [isLoadingCookie, user, router]);

  const [sessionData,setSessionData]=useState<sessionProps>({
    context:"",
    messages: [],
    sessionType:"",
    contextType:"",
    sessionTitle:"",
    fileUrl:"",
  })
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages,setInput } = useChat({
    api: "api/v1",
    initialMessages: sessionData.messages?sessionData.messages:[]
  });
  useEffect(() => {
    if (sessionId && userId&&sessionData) {

      getSession(sessionId, userId).then((response:sessionProps) => {
        setSessionData(response)
        setMessages(response.messages);
        
      });
    }
  }, [sessionId, userId,setMessages]);

  useEffect(()=>{
    dispatch(
      updateString(
       revisionSystemPrompt + `This is the Context from ${sessionData.contextType}` + sessionData.context
      )
    );
   },[sessionData,messages])
////////////////////////////////////////////
  const saveSession = useCallback(async () => {
    if (sessionId && userId && messages.length > 0) {
      await updateSession(sessionId, messages, userId);
      console.log("Session saved successfully");
    }
  }, [sessionId, userId, messages]);

  useEffect(() => {
    if (sessionId && userId) {
      getSession(sessionId, userId).then((response:sessionProps) => {
        setSessionData(response)
        setMessages(response.messages);
      });
    }
  }, [sessionId, userId, setMessages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSession();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      saveSession(); // Save when unmounting
    };
  }, [saveSession]);

  // Save session when sessionId changes
  useEffect(() => {
    return () => {
      saveSession();
    };
  }, [sessionId, saveSession]);

 

  if (isLoadingCookie) {
    return <Spin />;
  }

  return (
    <SuggestionsProvider>
      <div className=" bg-[#121212] grid grid-cols-10 text-white" style={{height:'calc(100vh - 56px)'}}>
       <div className=' col-span-8 overflow-y-auto'>

        <ChatBot 
          MessageList={MessageList}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          input={input}
          messages={messages}
          isLoading={isLoading}
          />
          </div>
        <div className="col-span-2 bg-[#333333] flex flex-col items-center">
          <h1 className='p-4'>Suggestions</h1>
          <div className='flex flex-grow flex-col gap-2'>
            <Button type='dashed' onClick={() => setInput("Skip this Question")}>Skip this Question</Button>
            <Button type='dashed' onClick={() => setInput("Explain further")}>Explain further</Button>
            <Button type='dashed' onClick={() => setInput("Move to next topic")}>Move to next topic</Button>
          </div>
          <Suggestions />
        </div>
      </div>
    </SuggestionsProvider>
  );
}

export default RevisingPage;