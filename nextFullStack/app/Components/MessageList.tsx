import React, { useEffect, useRef } from 'react';
import MarkdownContent from './Markdown';
import { useSuggestions } from './SuggestionsContext';
import { Button } from 'antd';

interface Props {
    arr: any[];
}

function MessageList({ arr }: Props) {
    const { setCurrentSuggestions, showHint, setShowHint } = useSuggestions();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const latestAssistantMessage = arr.slice().reverse().find(message => message.role === 'assistant');
        if (latestAssistantMessage) {
            const parsedContent = parseContent(latestAssistantMessage.content);
            if (parsedContent) {
                setCurrentSuggestions(parsedContent);
            }
        }
        scrollToBottom();
    }, [arr, setCurrentSuggestions]);

    const parseContent = (content: string) => {
        try {
            // Remove Markdown formatting
            const sanitizedContent = content.replace(/```json|```/g, '').trim();
            return JSON.parse(sanitizedContent);
        } catch (error) {
            return null;
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="chatElement" className="text-white flex flex-col overflow-auto">
            {arr.map((element: any) => {
                const parsedContent = element.role === 'assistant' ? parseContent(element.content) : null;

                return (
                    <div
                        key={element.id}
                        className={`${
                            element.role === 'user' ? 'self-end bg-[#2f2f2f] ml-auto text-left' : 'bg-[#212121]'
                        } p-2 mb-2 rounded-lg `}
                    >
                        {element.role === 'assistant' && parsedContent ? (
                            <div>
                                {parsedContent.content && (
                                    <MarkdownContent rawText={parsedContent.content}></MarkdownContent>
                                )}
                                {showHint && parsedContent.hint && (
                                    <MarkdownContent rawText={parsedContent.hint}></MarkdownContent>
                                )}
                                {!showHint && parsedContent.hint && (
                                    <Button onClick={() => setShowHint(true)}>Show Hint</Button>
                                )}
                            </div>
                        ) : (
                            <MarkdownContent rawText={element.content} />
                        )}
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
