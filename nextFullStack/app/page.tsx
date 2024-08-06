// "use client";
// import { Button, Input } from 'antd';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';
// import ytdl from 'ytdl-core';

// // Explicitly declaring the type of props as an empty object
// type Props = {};

// const Page: React.FC<Props> = (props) => {
 
//   const router = useRouter();
//   const [url,setUrl]=useState<string>("")

//   const handleRevisionNavigation = () => {

//     const pathname = "/revising";
//     const query = { sessionId: "new-Chat" }; // Ensure sessionId is a string
//     const queryString = new URLSearchParams(query).toString();
//     router.push(`${pathname}?${queryString}`);
//   };
//   async function handleClick(){
    
//     const pathName="/youtube";
//     const query ={url}
//     const queryString= new URLSearchParams(query).toString()
//     router.push(`${pathName}?${queryString}`)
// }
//   return (
//     <div className=' bg-slate-900 h-screen flex justify-center items-center flex-col gap-5'>
//       <Button 
//         onClick={() => {
//           router.push("/learning");
//         }}
//         color='blue'
//       >
//         Go to Learning
//       </Button>
//       <Button 
//         color='yellow' 
//         onClick={handleRevisionNavigation}
//       >
//         Go to Revision
//       </Button>
//       <div className='p-4 w-full flex flex-col justify-center items-center'>
//         <h2 className='text-white p-2'>Enter the URL of a Youtube video</h2>
//       <Input 
//       className='w-2/3' 
//       onChange={(e)=>{
//         setUrl(e.target.value)
//       }}
//       ></Input>
//       </div>
      
//       <Button onClick={handleClick}>click to Submit</Button>
//     </div>
//   );
// };

// export default Page;

"use client";
import React from "react";
import ParticlsBackground from "./Components/ParticlsBackground";
import Landing from "./Components/Landing";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ParticlsBackground />
      <Landing />
      <div className="flex-grow flex flex-col items-center justify-center">
      </div>
    </div>
  );
};

export default Page;
