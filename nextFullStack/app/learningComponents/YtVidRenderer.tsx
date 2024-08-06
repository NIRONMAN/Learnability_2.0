import youtubeSystemPrompt from '@/lib/youtubeSystemPrompt';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import ytdl from 'ytdl-core';
import {  setIsContextSet, updateString } from '../GlobalRedux/Features/string/stringSlice';

type Props = {
    url:string,
    
}

const YtVidRenderer = ({url}: Props) => {
    const videoID=ytdl.getURLVideoID(url)
    
    
  return (
    <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoID}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
  )
}

export default YtVidRenderer




