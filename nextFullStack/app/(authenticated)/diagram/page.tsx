"use client";

import React, { useEffect, useState } from 'react'

import MermaidChart from '../../Components/MermaidChart'
import diagramSystemPrompt from '@/lib/diagramSystemPrompt'
import axios from 'axios'
import { Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/GlobalRedux/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, sessionProps } from '@/utils/functions'

    type Props = {}
    
    const page = (props: Props) => {
      const router = useRouter();
      const { user, isLoadingCookie } = useSelector((state: RootState) => state.auth);
      const searchParams = useSearchParams();
      const sessionId = searchParams.get('sessionId');
      const userId = user?.userId;
      const dispatch=useDispatch()
        const [response,setResponse]=useState("")
        const [isLoading,setIsLoading]=useState(true);

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

        useEffect(() => {
          if (sessionId && userId) {
      
            getSession(sessionId, userId).then((response:sessionProps) => {
              setSessionData(response)
              
            });
          }
        }, [sessionId, userId]);

        const parseContent = (content: string) => {
          try {
              // Remove Markdown formatting
              const sanitizedContent = content.replace(/```mermaid|```/g, '').trim();
              return sanitizedContent;
          } catch (error) {
              return null;
          }
      };
        useEffect(()=>{
           if(sessionData.context){
            axios.post("api/diagram",{context:sessionData.context}).then(async (res)=>{
              const finalData:string=await res.data.result;
              console.log(typeof(finalData))
               const parsed=parseContent(finalData);
                  setResponse(parsed)
                console.log("this is parsed "+parsed)
              setIsLoading(false)
      })
           }

        },[sessionData])
      return (
<div className="flex justify-center items-center " style={{height:'calc(100vh - 56px)'}}>
      {!isLoading?<MermaidChart chart={response} />:<Spin size='large'></Spin>}
    </div>    
    )
    }
    
    export default page

