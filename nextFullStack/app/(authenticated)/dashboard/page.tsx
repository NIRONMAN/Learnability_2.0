"use client";

import { setPdf } from "@/app/GlobalRedux/Features/counter/counterSlice";
import { addSession } from "@/app/GlobalRedux/Features/sessions/sessionsSlice";
import {
  setContextType,
  setIsContextSet,
  setLearningMode,
  updateURL,
} from "@/app/GlobalRedux/Features/string/stringSlice";
import { RootState } from "@/app/GlobalRedux/store";
import { createSession, uploadPdfToFirebase } from "@/utils/functions";
import { FileOutlined, YoutubeOutlined, BookOutlined, EditOutlined, ProjectOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Spin, Upload, message, Card, Tabs, Radio } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import removeMarkdown from "markdown-to-text";

const { TabPane } = Tabs;

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoadingCookie } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;
  const pdfObject = useSelector((state: RootState) => state.counter.file);
  const learningMode = useSelector((state: RootState) => state.string.learningMode);
  const contextType = useSelector((state: RootState) => state.string.contextType);
  const isContextSet = useSelector((state: RootState) => state.string.isContextSet);
  const [localurl, setLocalUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localContext, setLocalContext] = useState({
    context: "",
    title: "",
  });
  const [inputMethod, setInputMethod] = useState("pdf");
  const [uploadLoader, setUploadLoader] = useState(false);

  useEffect(() => {
    if (!isLoadingCookie && !user) {
      router.replace("/signup-login");
    }
  }, [isLoadingCookie, user, router]);

  const handleNavigation = useCallback(async () => {
    if (!userId || !isContextSet) return;

    setIsLoading(true);
    try {
      const sessionId = await createSession(
        {
          fileUrl: localurl,
          sessionType: learningMode,
          contextType: contextType,
          context: localContext.context,
          sessionTitle: removeMarkdown(localContext.title),
          messages: [],
        },
        userId
      );

      dispatch(addSession({ id: sessionId, title: localContext.title }));

      const pathname = `/${learningMode}`;
      const query = { sessionId };
      const queryString = new URLSearchParams(query).toString();
      router.push(`${pathname}?${queryString}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      message.error("Failed to create session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, isContextSet, localurl, learningMode, contextType, localContext, dispatch, router]);

  useEffect(() => {
    handleNavigation();
  }, [isContextSet, handleNavigation]);

  const handleFinalClick = async (mode) => {
    setIsLoading(true);
    try {
      dispatch(setLearningMode(mode));
      if (contextType === "ytlink") {
        if (localurl) {
          const res = await axios.post("/api/ytExtracter", { url: localurl });
          setLocalContext({
            context: res.data.result.context,
            title: res.data.result.title,
          });
        } else {
          throw new Error("No URL provided");
        }
      } else if (contextType === "pdf") {
        const res = await axios.post("/api/pdfExtract", {
          data: { objectUrl: pdfObject },
        });
        setLocalContext({ context: res.data.context, title: res.data.text });
      }
      dispatch(setIsContextSet());
    } catch (error) {
      console.error("Error processing content:", error);
      message.error("Failed to process content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadHandler = async (info) => {
    setUploadLoader(true);
    const { file } = info;
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const pdfData = e.target?.result as string;
        dispatch(setPdf(pdfData));
      };
      reader.readAsDataURL(file.originFileObj);
      
      if(file.status==="done"){
        const url = await uploadPdfToFirebase(pdfObject, file.name);
        setLocalUrl(url);
        dispatch(setContextType("pdf"));
        message.success(`${file.name} uploaded successfully`);
        setUploadLoader(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      if(file.status==="done"){
        message.error(`${file.name} upload failed.`);
      }
    }
  };

  const handleYoutubeSubmit = () => {
    if (localurl) {
      dispatch(updateURL(localurl));
      dispatch(setContextType("ytlink"));
      message.success('YouTube URL added successfully');
    } else {
      message.error('Please enter a valid YouTube URL');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white" style={{minHeight: 'calc(100vh - 56px)'}}>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div className="w-full max-w-4xl p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg shadow-xl border border-indigo-500">
          <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">What do you want to learn today !</h1>
          
          <Card 
            title={<span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-300 to-blue-300">Add Your Study Material</span>} 
            className="w-full mb-8 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-cyan-600 text-center "
            headStyle={{ borderBottom: '1px solid #4a5568', background: 'transparent' }}
            bodyStyle={{ background: 'transparent' }}
          >
            <div className="flex flex-col items-center">
              <Radio.Group  
                onChange={(e) => setInputMethod(e.target.value)} 
                value={inputMethod} 
                className="mb-6 text-white"
              >
                <Radio value="pdf" className="text-white">
                  <span className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                    <FileOutlined className="mr-2" /> PDF
                  </span>
                </Radio>
                <Radio value="youtube" className="text-white">
                  <span className="flex items-center text-pink-400 hover:text-pink-300 transition-colors">
                    <YoutubeOutlined className="mr-2" /> YouTube
                  </span>
                </Radio>
              </Radio.Group>
              
              <div className="w-full max-w-md">
                {inputMethod === "pdf" ? (
                  <Upload
                    accept=".pdf"
                    onChange={uploadHandler}
                    showUploadList={false}
                  >
                    <Button 
                      icon={uploadLoader ? <Spin indicator={<LoadingOutlined spin />} /> : <FileOutlined />} 
                      disabled={uploadLoader} 
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-none transition-all duration-300"
                    >
                      Upload PDF
                    </Button>
                  </Upload>
                ) : (
                  <div className="">
                    <Input
                      placeholder="Paste YouTube URL"
                      value={localurl}
                      onChange={(e) => setLocalUrl(e.target.value)}
                      className="mb-4 bg-gray-700 text-black border-gray-600 focus:border-pink-500 transition-all duration-300"
                    />
                    <Button 
                      onClick={handleYoutubeSubmit} 
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-none transition-all duration-300"
                    >
                      Add YouTube Video
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Tabs 
            defaultActiveKey="1" 
            centered 
            className="text-white"
            tabBarStyle={{ borderBottom: '1px solid #4a5568' }}
          >
            <TabPane tab={<span className="text-emerald-400 hover:text-emerald-300 transition-colors"><BookOutlined /> Learn</span>} key="1">
              <Button 
                size="large" 
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-none transition-all duration-300" 
                onClick={() => handleFinalClick("learn")}
              >
                Start Learning Session
              </Button>
            </TabPane>
            
            <TabPane tab={<span className="text-amber-400 hover:text-amber-300 transition-colors"><EditOutlined /> Revise</span>} key="2">
              <Button 
                size="large" 
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-none transition-all duration-300" 
                onClick={() => handleFinalClick("revise")}
              >
                Start Revision Session
              </Button>
            </TabPane>
            
            <TabPane tab={<span className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"><ProjectOutlined /> Mindmap</span>} key="3">
              <Button 
                size="large" 
                className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white border-none transition-all duration-300" 
                onClick={() => handleFinalClick("diagram")}
              >
                Create New Mindmap
              </Button>
            </TabPane>
            
            <TabPane tab={<span className="text-rose-400 hover:text-rose-300 transition-colors"><FileOutlined /> Flashcards</span>} key="4">
              <Button 
                size="large" 
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white border-none transition-all duration-300" 
                onClick={() => handleFinalClick("flashcard")}
              >
                Open Flashcards
              </Button>
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Page;