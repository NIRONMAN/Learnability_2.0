/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import diagramSystemPrompt from "@/lib/diagramSystemPrompt";
import { NextRequest, NextResponse } from "next/server";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.API_KEY2;
  const genAI = new GoogleGenerativeAI(apiKey);
  

  
  


  export async function POST(req:NextRequest,res:NextResponse) {
    const body=await req.json();
    const systemPrompt=diagramSystemPrompt;
    const context=body.context;
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction:systemPrompt,
      });
      
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };
    try {
        const chatSession = model.startChat({
            generationConfig,
         // safetySettings: Adjust safety settings
         // See https://ai.google.dev/gemini-api/docs/safety-settings
            history: [],
          });
        
          const result = await chatSession.sendMessage("This is the context: "+context);
          const output=result.response.text();
          return NextResponse.json({result:output})
    } catch (error) {
        return NextResponse.json({result:"Something Wrong "+error})

    }
  }