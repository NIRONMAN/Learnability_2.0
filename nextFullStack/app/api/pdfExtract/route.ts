// pages/api/extract-text.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

// type Data = {
//   text: string;
//   error?: string;
// };

export async function POST(req: NextRequest, res: NextResponse) {
    
    const body=await req.json();
    const  objectUrl  =  body.data.objectUrl;
    
    
    if (!objectUrl) {
        NextResponse.json({ text: '', error: 'Object URL is required' });
        return;
    }
   
  try {
    const base64Regex = /^data:application\/pdf;base64,/;
  let pdfBuffer: Buffer;

  if (base64Regex.test(objectUrl)) {
    const base64Data = objectUrl.replace(base64Regex, '');
    pdfBuffer = Buffer.from(base64Data, 'base64');
  } else {
    throw new Error('Invalid data URL');
  }
  
  const data=await pdf(pdfBuffer)

    const extractedText = data.text;
    ///////////////
    const genAI = new GoogleGenerativeAI(process.env.API_KEY2);
let model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

let prompt = "Generate a concise, single-line title that encapsulates the essence of this content:" +extractedText
        
     

let result = await model.generateContent(prompt)
    //////////////////
    return NextResponse.json({ text:result.response.text(),context:extractedText});
  } catch (error) {
    console.log(error)
    NextResponse.json({ text: '', error: error.message });
  }
}

