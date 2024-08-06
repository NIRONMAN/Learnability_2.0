// // app/api/extract/route.ts
// import toWav from "audiobuffer-to-wav"
// import { NextRequest, NextResponse } from 'next/server';
// import ytdl from 'ytdl-core';
// import fetch from 'node-fetch';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: NextRequest) {
//   const url  = "https://youtube.com/shorts/mmK0vV_Efs0?si=yyrZHipZ0bAqCvoY"
//   try {
//     const info = await ytdl.getInfo(url);
//     const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
//     const audioUrl = audioFormats[0].url;
//     // const audioResponse = await fetch(audioUrl);
    
//     // console.log(audioFormats)
//     // // console.log(audioResponse.body)
//     // let audioBuffer = await audioResponse.buffer();

//     // // console.log(audioBuffer);

//     // const dir = path.resolve('public', 'audio');
//     // if (!fs.existsSync(dir)) {
  //     //   fs.mkdirSync(dir, { recursive: true });
  //     // }
  
  //     // const filePath = path.join(dir, 'audio.webm');
  //     // fs.writeFileSync(filePath,audioBuffer);
  
  //     // console.log("in req")
  //     // const newAudio=new File(audioBuffer,"audio.mp3")
  //     return NextResponse.json({ uri:audioUrl });
  //   } catch (error) {
    //     console.log(error)
    //     return NextResponse.json({ error: 'Failed to extract and download audio' }, { status: 500 });
    //   }
    // }
    
    
    
import { GoogleAIFileManager } from "@google/generative-ai/files";
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  // The Gemini 1.5 models are versatile and work with multimodal prompts
  model:"gemini-1.5-pro",
  generationConfig: { responseMimeType: "application/json" }, 
});

export async function POST(req: NextRequest) {
  const body = await req.json()
  const url = body.url;
  console.log("this is url",url)
  const ffmpegPath = path.resolve('bin', 'ffmpeg');
  ffmpeg.setFfmpegPath(ffmpegPath);

  try {
    const outputDir = path.resolve('./public/audio');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilePath = path.join(outputDir, 'audio.mp3');

    await new Promise((resolve, reject) => {
      const stream = ytdl(url, { filter: 'audioonly',requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Cookie':'VISITOR_INFO1_LIVE=tis14rf-zCA; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgKQ%3D%3D; SID=g.a000lghanX2molElW5g1gF4qJ1m5M7I6CZhCNvJve5neAWdg-gFbq71BKUOuceuBNXNbS_kK3AACgYKAYwSARISFQHGX2Mi6WKQmBBcc-og9oF7BLxXChoVAUF8yKpVUyuMLBEXRt9N_ND7jJOp0076; __Secure-1PSID=g.a000lghanX2molElW5g1gF4qJ1m5M7I6CZhCNvJve5neAWdg-gFbYU_g7_CABBpTfKrsI0_BVAACgYKAZcSARISFQHGX2MiYW-XPTm8SH8ov14rk4C83BoVAUF8yKq17rafcTwAe432g0W-G4ak0076; __Secure-3PSID=g.a000lghanX2molElW5g1gF4qJ1m5M7I6CZhCNvJve5neAWdg-gFbkA8NZhfXA0pvMQoBrEPtKQACgYKAaISARISFQHGX2MiLJ8nIYBI5G3suDUPjCSl0hoVAUF8yKqKYJvCHd7ZbF9utCSUqQ6W0076; HSID=AodzwcZ-BTWdqum0V; SSID=ASiH48sM6P71xs7JQ; APISID=6UGJAQD5tkuiZfyf/ALOO3-444WDcJcPJu; SAPISID=gH9iJhe-JVeuKMvk/AHcsSfAte3DvsieSL; __Secure-1PAPISID=gH9iJhe-JVeuKMvk/AHcsSfAte3DvsieSL; __Secure-3PAPISID=gH9iJhe-JVeuKMvk/AHcsSfAte3DvsieSL; LOGIN_INFO=AFmmF2swRQIhAORwN9ii3QM6HCrPDY5zALxQ1g1zvz4kj2xCb4jfpvtvAiAVl3lEQvHM9qpFWZ_ecTR7yuAZZ4SckgzXchpacNxqvg:QUQ3MjNmejBYU1dRZXU5dmJ2VU9QU3Z2dUxiWUxXekFoYUR1cElQaEdza2FnSEM0SE1iWlNCTUhVd1VNTGhmdzNoLTBQSEZLcTVCcG1HZkJLTHI0anZfSk5LM1dTVTVrX2hkTTJfMy1LTFl1U1NTZWpkdks3OGFjeWoxa0V6M3dpYl84aGZ4bDdBTEluZGViOVl2Z29DTm9JUzBUMl9FM2FR; PREF=f4=4000000&f6=40000000&tz=Asia.Calcutta&f7=100&f5=30000; YSC=L9KRaU2-Ee8; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwODI5LjA3X3AxGgJlbiADGgYIgJnPpwY; __Secure-1PSIDTS=sidts-CjEB4E2dkQ6bwJ-HsYCMvkfEWV4q6PGoPz1CHtAC966_Uy5tjAYg-jT9bx1jfq9yeouzEAA; __Secure-3PSIDTS=sidts-CjEB4E2dkQ6bwJ-HsYCMvkfEWV4q6PGoPz1CHtAC966_Uy5tjAYg-jT9bx1jfq9yeouzEAA; SIDCC=AKEyXzVDYojOR0pK1YKJISsESTdKhcY2YAAJyJLX6Z0HONGD6rXPE9o308aVQFmFjqO7r-lesg; __Secure-1PSIDCC=AKEyXzVFJ398_Aq4ksWFjPs2wXtaUlHwm37TVFhgnniOM1H9Ez7rXtvLcspO-p-8Hp673SfFXA; __Secure-3PSIDCC=AKEyXzUNPKjZQ1dxNvDIUNsHV9AO73B8NTsmFmWA0Tfgu5HGmfCsjC0oAk2d72xYODeBx-FfMQ'
        }
      } });
      
      ffmpeg(stream)
        .audioBitrate(128)
        .toFormat('mp3')
        .on('end', () => {
          console.log('Download and conversion finished.');
          resolve(null);
        })
        .on('error', (err) => {
          console.error('Error:', err);
          reject(err);
        })
        .save(outputFilePath);
    });
    ///Now the gemini part


const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const uploadResult = await fileManager.uploadFile(outputFilePath, {
  mimeType: "audio/mp3",
  displayName: "Sample youtube audio",
});

console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri
        }
      },
      { text: "Give the response in following schema and also exclude markdown just give plain text inside the respective value attribute of the key: "+JSON.stringify({
        title:"A suitable title which sums up the contents in the audio",
        context:"summary of the audio in full detail."
        
      })},
    ]);

    ///
    
    fs.unlinkSync(outputFilePath)
    await fileManager.deleteFile(uploadResult.file.name);
console.log(`Deleted ${uploadResult.file.displayName}`);
    // console.log(JSON.parse(result.response.candidates[0].content.parts[0].text))
    return NextResponse.json({ result:JSON.parse(result.response.candidates[0].content.parts[0].text) });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to extract and download audio' }, { status: 500 });
  }
}


//using cookies

// import { GoogleAIFileManager } from "@google/generative-ai/files";
// import { NextRequest, NextResponse } from 'next/server';
// import ytdl from 'ytdl-core';
// import fs from 'fs';
// import path from 'path';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { exec } from 'child_process';
// import util from 'util';

// const execPromise = util.promisify(exec);

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro",
//   generationConfig: { responseMimeType: "application/json" },
// });

// async function downloadWithRetry(url: string, outputFilePath: string, maxRetries = 3) {
//   const cookieString = 'VISITOR_INFO1_LIVE=tis14rf-zCA; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgKQ%3D%3D; SID=g.a000lghanX2molElW5g1gF4qJ1m5M7I6CZhCNvJve5neAWdg-gFbq71BKUOuceuBNXNbS_kK3AACgYKAYwSARISFQHGX2Mi6WKQmBBcc-og9oF7BLxXChoVAUF8yKpVUyuMLBEXRt9N_ND7jJOp0076; __Secure-1PSID=g.a000lghanX2molElW5g1gF4qJ1m5M7I6CZhCNvJve5neAWdg-gFbYU_g7_CABBpTfKrsI0_BVAACgYKAZcSARISFQHGX2MiYW-XPTm8SH8ov14rk4C83BoVAUF8yKq17rafcTwAe432g0W-G4ak0076; __Secure-3PSID=g.a000lghanX2molElW5g1gF4qJ1m5M7I6CZhCNvJve5neAWdg-gFbkA8NZhfXA0pvMQoBrEPtKQACgYKAaISARISFQHGX2MiLJ8nIYBI5G3suDUPjCSl0hoVAUF8yKqKYJvCHd7ZbF9utCSUqQ6W0076; HSID=AodzwcZ-BTWdqum0V; SSID=ASiH48sM6P71xs7JQ; APISID=6UGJAQD5tkuiZfyf/ALOO3-444WDcJcPJu; SAPISID=gH9iJhe-JVeuKMvk/AHcsSfAte3DvsieSL; __Secure-1PAPISID=gH9iJhe-JVeuKMvk/AHcsSfAte3DvsieSL; __Secure-3PAPISID=gH9iJhe-JVeuKMvk/AHcsSfAte3DvsieSL; LOGIN_INFO=AFmmF2swRQIhAORwN9ii3QM6HCrPDY5zALxQ1g1zvz4kj2xCb4jfpvtvAiAVl3lEQvHM9qpFWZ_ecTR7yuAZZ4SckgzXchpacNxqvg:QUQ3MjNmejBYU1dRZXU5dmJ2VU9QU3Z2dUxiWUxXekFoYUR1cElQaEdza2FnSEM0SE1iWlNCTUhVd1VNTGhmdzNoLTBQSEZLcTVCcG1HZkJLTHI0anZfSk5LM1dTVTVrX2hkTTJfMy1LTFl1U1NTZWpkdks3OGFjeWoxa0V6M3dpYl84aGZ4bDdBTEluZGViOVl2Z29DTm9JUzBUMl9FM2FR; PREF=f4=4000000&f6=40000000&tz=Asia.Calcutta&f7=100&f5=30000; YSC=L9KRaU2-Ee8; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwODI5LjA3X3AxGgJlbiADGgYIgJnPpwY; __Secure-1PSIDTS=sidts-CjEB4E2dkQ6bwJ-HsYCMvkfEWV4q6PGoPz1CHtAC966_Uy5tjAYg-jT9bx1jfq9yeouzEAA; __Secure-3PSIDTS=sidts-CjEB4E2dkQ6bwJ-HsYCMvkfEWV4q6PGoPz1CHtAC966_Uy5tjAYg-jT9bx1jfq9yeouzEAA; SIDCC=AKEyXzVDYojOR0pK1YKJISsESTdKhcY2YAAJyJLX6Z0HONGD6rXPE9o308aVQFmFjqO7r-lesg; __Secure-1PSIDCC=AKEyXzVFJ398_Aq4ksWFjPs2wXtaUlHwm37TVFhgnniOM1H9Ez7rXtvLcspO-p-8Hp673SfFXA; __Secure-3PSIDCC=AKEyXzUNPKjZQ1dxNvDIUNsHV9AO73B8NTsmFmWA0Tfgu5HGmfCsjC0oAk2d72xYODeBx-FfMQ'; // Replace with actual YouTube cookies

//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       console.log(`Attempt ${i + 1}: Starting download`);
//       await new Promise((resolve, reject) => {
//         const stream = ytdl(url, {
//           filter: 'audioonly',
//           quality: 'highestaudio',
//           requestOptions: {
//             headers: {
//               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//               'Cookie': cookieString
//             }
//           }
//         });

//         stream.on('info', (info, format) => {
//           console.log(`Video info received. Title: ${info.videoDetails.title}`);
//         });

//         stream.pipe(fs.createWriteStream(outputFilePath))
//           .on('finish', () => {
//             console.log('Download finished.');
//             resolve(null);
//           })
//           .on('error', (err) => {
//             console.error('Download Error:', err);
//             reject(err);
//           });

//         // Add a timeout to prevent hanging
//         setTimeout(() => {
//           reject(new Error('Download timed out after 5 minutes'));
//         }, 5 * 60 * 1000);
//       });

//       console.log('Starting conversion to MP3');
//       const ffmpegCommand = `ffmpeg -i "${outputFilePath}" -acodec libmp3lame -b:a 128k "${outputFilePath.replace('.webm', '.mp3')}"`;
//       await execPromise(ffmpegCommand);
//       console.log('Conversion to MP3 finished.');

//       fs.unlinkSync(outputFilePath);
//       console.log('Original webm file removed.');

//       return;
//     } catch (error) {
//       console.error(`Attempt ${i + 1} failed:`, error);
//       if (i === maxRetries - 1) throw error;
//       const delay = Math.pow(2, i) * 1000;
//       console.log(`Retrying in ${delay / 1000} seconds...`);
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const url = body.url;
//   console.log("Processing URL:", url);

//   try {
//     const outputDir = path.resolve('./public/audio');
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir, { recursive: true });
//     }

//     const outputFilePath = path.join(outputDir, 'audio.webm');
//     const mp3FilePath = outputFilePath.replace('.webm', '.mp3');

//     await downloadWithRetry(url, outputFilePath);

//     console.log('Starting file upload to Google AI');
//     const fileManager = new GoogleAIFileManager(process.env.API_KEY);

//     const uploadResult = await fileManager.uploadFile(mp3FilePath, {
//       mimeType: "audio/mp3",
//       displayName: "Sample youtube audio",
//     });

//     console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);
    
//     console.log('Generating content with Google AI');
//     const result = await model.generateContent([
//       {
//         fileData: {
//           mimeType: uploadResult.file.mimeType,
//           fileUri: uploadResult.file.uri
//         }
//       },
//       {
//         text: "Give the response in following schema and also exclude markdown just give plain text inside the respective value attribute of the key: " + JSON.stringify({
//           title: "A suitable title which sums up the contents in the audio",
//           context: "summary of the audio in full detail."
//         })
//       },
//     ]);

//     fs.unlinkSync(mp3FilePath);
//     await fileManager.deleteFile(uploadResult.file.name);
//     console.log(`Deleted ${uploadResult.file.displayName}`);

//     console.log('Sending response');
//     return NextResponse.json({ result: JSON.parse(result.response.candidates[0].content.parts[0].text) });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'Failed to extract and download audio' }, { status: 500 });
//   }
// }