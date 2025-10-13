import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useMovies } from './useMovies';
import type { ChatMessage, Movie } from '../types';

const formatMoviesForPrompt = (movies: Movie[]): string => {
  const essentialData = movies.map(m => ({
    id: m.id,
    title: m.title,
    year: m.year,
    genre: m.genre,
    summary: m.summary?.substring(0, 150) + '...' // Truncate summary
  }));
  return JSON.stringify(essentialData);
};

export const useChatbot = () => {
  const { movies } = useMovies();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(() => {
    if (movies.length > 0 && !chatRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const movieListString = formatMoviesForPrompt(movies);
        
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `Bạn là trợ lý đề xuất phim thân thiện và hữu ích cho trang web 'XemPhim'.
Mục tiêu của bạn là giúp người dùng khám phá phim từ danh sách được cung cấp.
- Chỉ đề xuất những phim có trong dữ liệu JSON được cung cấp bên dưới. Không tự sáng tạo phim.
- Khi đề xuất phim, vui lòng đề cập đến tên phim và năm sản xuất.
- Trả lời ngắn gọn và mang tính hội thoại.
- Bạn có thể trả lời các câu hỏi về tóm tắt cốt truyện hoặc thể loại phim dựa trên dữ liệu.
- Không đề cập đến nguồn dữ liệu JSON với người dùng. Chỉ sử dụng nó làm cơ sở kiến ​​thức của bạn.
- Trả lời bằng tiếng Việt.

Các phim có sẵn:
${movieListString}`,
          },
        });
      } catch (e) {
        console.error("Failed to initialize Gemini:", e);
        setError("Không thể khởi tạo trợ lý AI. Vui lòng kiểm tra API key.");
      }
    }
  }, [movies]);

  const sendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    initializeChat();
    
    if (!chatRef.current) {
        setError("Trợ lý AI chưa sẵn sàng. Vui lòng thử lại sau giây lát.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: text });
      
      let botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: '',
      };
      setMessages(prev => [...prev, botMessage]);

      for await (const chunk of stream) {
        botMessage.text += chunk.text;
        setMessages(prev => prev.map(m => m.id === botMessage.id ? { ...m, text: botMessage.text } : m));
      }

    } catch (e) {
      console.error("Gemini API error:", e);
      const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to get response from AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};
