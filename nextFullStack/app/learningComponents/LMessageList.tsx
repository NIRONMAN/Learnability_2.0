import React, { useEffect, useRef } from 'react';
import MarkdownContent from '../Components/Markdown';

interface Props {
    arr: any[];
}

function LMessageList({ arr }: Props) {
    
    const endRef=useRef(null)
    const scrollToBottom = () => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    useEffect(()=>{
        scrollToBottom();
    },[arr])

    return (
        <div id="chatElement" className="text-white flex flex-col">
            {arr?.map((element: any, index: number) => (
                <div
                    key={element.id}
                    className={`${
                        element.role === 'user' ? 'self-end bg-[#2f2f2f] ml-auto text-left' : 'bg-[#212121]'
                    } p-2 mb-2 rounded-lg `}
                >
                    <MarkdownContent rawText={element.content}></MarkdownContent>
                </div>
            ))}
            <div ref={endRef}></div>
        </div>
    );
}

export default LMessageList;