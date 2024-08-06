import React, { useState } from "react";
import InputFormCompo from "./InputFormCompo";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../GlobalRedux/store";

export default function ChatBot({MessageList,messages,input,handleInputChange,handleSubmit,isLoading}) {
  const isContextSet=useSelector((state:RootState)=>state.string.isContextSet)

  return (
    <div className="flex flex-col bg-[#232323] items-center h-full">
        <div className="flex-grow w-full max-w-3xl p-8 overflow-y-auto">
         {/* {isContextSet? <MessageList arr={messages} />:<AllInputCompo></AllInputCompo>} */}
         <MessageList arr={messages} />
        </div>
        {isLoading?<Spin></Spin>:null}
        <div className="w-full max-w-3xl p-4 bg-[#232323]">
          <InputFormCompo
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setUpload={() => {}}
          ></InputFormCompo>
        </div>
      </div>
  );
}






