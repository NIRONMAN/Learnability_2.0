import { PayloadAction, createSlice } from "@reduxjs/toolkit";



export const stringSlice=createSlice({
    name:"string",
    initialState:{
        systemPrompt:"",
        url:"",
        contextType:null,
        isContextSet:false,
        learningMode:"",
        onLearn:false,
        learnSessionId:{
            sessionId:"",
            userId:""
        }
    },
    reducers:{
        updateString:(state,action:PayloadAction<string>)=>{
            state.systemPrompt=action.payload;
        },
        updateURL:(state,action:PayloadAction<string>)=>{
            state.url=action.payload;
        },
        setContextType:(state,action:PayloadAction<string>)=>{
            state.contextType=action.payload;
        },
        setIsContextSet:(state)=>{
            state.isContextSet=!state.isContextSet;
        },
        setLearningMode:(state,action:PayloadAction<string>)=>{
            state.learningMode=action.payload;
        },
        setOnLearn:(state)=>{
            state.onLearn=!state.onLearn
        },
        setLearnSessionId:(state,action:PayloadAction<{sessionId:string,userId:string}>)=>{
            state.learnSessionId=action.payload;
        }


    }
})

export const {updateString,updateURL,setContextType,setIsContextSet,setLearningMode,setLearnSessionId,setOnLearn}=stringSlice.actions
export default stringSlice.reducer;