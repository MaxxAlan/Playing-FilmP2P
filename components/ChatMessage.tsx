import React from 'react';
import type { ChatMessage } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const bubbleClasses = isUser
    ? 'bg-cyan-500 text-white self-end'
    : 'bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 self-start';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  
  const LoadingDots = () => (
    <div className="flex items-center space-x-1">
        <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  );

  return (
    <div className={`flex ${containerClasses} my-2`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${bubbleClasses}`}>
        {message.text === '...' ? <LoadingDots/> : message.text}
      </div>
    </div>
  );
};

export default ChatMessageComponent;