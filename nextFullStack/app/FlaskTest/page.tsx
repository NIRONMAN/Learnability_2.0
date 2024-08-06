"use client"

import axios from 'axios';
import React, { useState } from 'react';

interface Props {
  newIndex: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
}

const ChatPage: React.FC<Props> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/query", {
        data:{
          
            question: input,
            newIndex: "test",
          
        }
      });

      const data = await response.data;
      const botMessage: Message = {
        id: Date.now().toString() + 1,
        text: data.answer, // Assuming the response has an 'answer' field
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#232323] items-center h-screen">
      <div className="flex-grow w-full max-w-3xl p-8 overflow-y-auto">
        <LMessageList messages={messages} />
      </div>
      <div className="w-full max-w-3xl p-4 bg-[#232323]">
        <form onSubmit={handleSubmit} className="flex items-center justify-center w-full">
          <div className="flex gap-3 items-center w-full">
            <input
              value={input}
              type="text"
              className="bg-[#2f2f2f] text-sm rounded-full border-2 border-[#2f2f2f] focus:border-blue-500 w-full focus:outline-none py-2 px-4 text-white"
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface Message {
  id: string;
  text: string;
  sender: string;
}

interface LMessageListProps {
  messages: Message[];
}

const LMessageList: React.FC<LMessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white text-right' : 'bg-gray-700 text-white'}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
};


export default ChatPage;
