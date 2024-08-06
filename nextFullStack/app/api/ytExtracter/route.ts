import { exec } from "child_process";

import { promisify } from "util";

const execAsync = promisify(exec);

import { GoogleAIFileManager } from "@google/generative-ai/files";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY4);
const YT_DLP_PATH = `"${path.resolve("bin", "yt-dlp")}"`;

const model = genAI.getGenerativeModel({
  // The Gemini 1.5 models are versatile and work with multimodal prompts
  model: "gemini-1.5-pro",
  generationConfig: { responseMimeType: "application/json" },
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = body.url;
  console.log("this is url", url);

  try {
    const outputDir = path.resolve("./public/audio");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilePath = path.join(outputDir, "audio.mp3");

    const command = `${YT_DLP_PATH} -x --audio-format mp3 -o "${outputFilePath}" ${url}`;
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);

    const fileManager = new GoogleAIFileManager(process.env.API_KEY4);

    const uploadResult = await fileManager.uploadFile(outputFilePath, {
      mimeType: "audio/mp3",
      displayName: "Sample youtube audio",
    });

    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      {
        text:
          "Give the response in following schema and also exclude markdown just give plain text inside the respective value attribute of the key: " +
          JSON.stringify({
            title: "A suitable title which sums up the contents in the audio",
            context: "summary of the audio in full detail.",
          }),
      },
    ]);

    ///

    fs.unlinkSync(outputFilePath);
    await fileManager.deleteFile(uploadResult.file.name);
    console.log(`Deleted ${uploadResult.file.displayName}`);
    return NextResponse.json({
      result: JSON.parse(result.response.candidates[0].content.parts[0].text),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to extract and download audio" },
      { status: 500 }
    );
  }
}
