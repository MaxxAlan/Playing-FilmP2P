import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbot } from '../hooks/useChatbot';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import ChatMessageComponent from './ChatMessage';

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Xử lý redirect khi có message từ AI
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'ai' && lastMessage.type === 'redirect') {
      const { data } = lastMessage;
      // Hiển thị message optional nếu có
      if (data.message) {
        console.log(data.message); // Hoặc thêm vào UI nếu cần
      }
      // Redirect đến trang xem phim
      navigate(`/movie/${data.movie_id}`);
    }
  }, [messages, navigate]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);
  
  const chatbotWindowClass = `
    fixed bottom-24 right-4 sm:right-6 md:right-8 z-50
    w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[600px]
    bg-card border border-border
    rounded-2xl shadow-2xl flex flex-col
    transition-transform opacity-300 ease-in-out
    ${isOpen ? 'transform-none opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
  `;

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-110"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <CloseIcon className="w-7 h-7" /> : <ChatIcon className="w-7 h-7" />}
      </button>

      <div className={chatbotWindowClass} style={{transform: isOpen ? 'translateY(0)' : 'translateY(2rem)'}}>
        {/* Header */}
        <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
          <h2 className="font-bold text-lg text-foreground">Trợ lý phim AI</h2>
          <button onClick={toggleChat} aria-label="Close chat" className="text-muted hover:text-foreground">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ChatMessageComponent message={{ id: 'initial', role: 'model', text: 'Chào bạn! Bạn muốn tìm phim gì hôm nay? Hãy hỏi tôi về một thể loại, hoặc bất cứ điều gì bạn thích!' }} />
          {messages.map((msg) => (
            <ChatMessageComponent key={msg.id} message={msg} />
          ))}
          {isLoading && <ChatMessageComponent message={{ id: 'loading', role: 'model', text: '...' }} />}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 bg-input border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-10 h-10 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;