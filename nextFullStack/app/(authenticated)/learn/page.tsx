"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useChat } from "@ai-sdk/react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import YtVidRenderer from '@/app/learningComponents/YtVidRenderer';
import PdfViewer from '@/app/learningComponents/PdfViewer';
import LMessageList from '@/app/learningComponents/LMessageList';
import ChatBot from '@/app/Components/ChatBot';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import { getSession, sessionProps, updateSession } from '@/utils/functions';
import {  setLearningMode, setLearnSessionId, setOnLearn, updateString } from '@/app/GlobalRedux/Features/string/stringSlice';
import learningSystemPrompt from '@/lib/learningSystemPrompt';


type Props = {
    
}

const page = (props: Props) => {
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
        dispatch(setOnLearn())
        dispatch(setLearnSessionId({sessionId,userId}))
      });
    }
  }, [sessionId, userId,setMessages]);
   /////////////////
   useEffect(()=>{
    dispatch(
      updateString(
       learningSystemPrompt + `This is the Context from ${sessionData.contextType}` + sessionData.context
      )
    );
   },[sessionData,messages])
   //////////////////////

      const saveSession = useCallback(async () => {
        if (sessionId && userId && messages.length > 0) {
          await updateSession(sessionId, messages, userId);
          console.log("Session saved successfully");
        }
      }, [sessionId, userId, messages]);
    
     
    
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
    <div className=' grid grid-cols-10 bg-[#232323] ' style={{height:'calc(100vh - 56px)'}}>
      
        <div className={`col-span-5`}>
          {(sessionData.contextType==="ytlink")&&<YtVidRenderer url={sessionData.fileUrl} ></YtVidRenderer>}
          {(sessionData.contextType==="pdf")&&<PdfViewer objectUrl={sessionData.fileUrl}></PdfViewer>}
        </div>
        <div className={`col-span-5 flex-grow w-full overflow-y-auto`}>
        <ChatBot 
          MessageList={LMessageList}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          input={input}
          messages={messages}
          isLoading={isLoading}
        /> </div>
    </div>
  )
}

export default page