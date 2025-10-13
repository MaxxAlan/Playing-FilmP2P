import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai'; // giữ như yêu cầu
import { useMovies } from './useMovies';
import type { ChatMessage, Movie } from '../types';

// Utils
const trim = (s?: string, len = 150) =>
  s ? (s.length > len ? s.substring(0, len).trim() + '...' : s) : '';

const formatMoviesForPrompt = (movies: Movie[]) =>
  JSON.stringify(
    movies.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      genre: m.genre,
      summary: trim(m.summary, 150),
    }))
  );

// Hook
export const useChatbot = () => {
  const { movies } = useMovies();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const isMounted = useRef(true);

  // Memoize movie prompt payload
  const movieListString = useMemo(() => formatMoviesForPrompt(movies || []), [movies]);

  // Initialize AI chat once when movies available
  const initializeChat = useCallback(() => {
    if (chatRef.current) return;
    try {
      const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || '';
      if (!apiKey) {
        setError('Missing API key for Gemini.');
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      aiRef.current = ai;

      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `Bạn là trợ lý đề xuất phim cho trang 'XemPhim'.
- Chỉ sử dụng dữ liệu phim có sẵn dưới đây. Không tự tạo phim.
- Khi người dùng yêu cầu "xem phim <tên>" hoặc tương tự, phản hồi CHỈ BẰNG JSON theo schema:
  {
    "action": "watch_movie",
    "movie_id": "<id>",
    "movie_title": "<title>",
    "message": "<optional message>"
  }
- Nếu không phải lệnh xem phim thì trả về text bình thường (tiếng Việt).
- Trả lời ngắn gọn, hội thoại.
Các phim có sẵn: ${movieListString}`,
        },
      });
    } catch (e) {
      console.error('initializeChat error', e);
      setError('Không thể khởi tạo trợ lý AI.');
    }
  }, [movieListString]);

  useEffect(() => {
    isMounted.current = true;
    // Initialize automatically when movie list appears
    if (movies && movies.length > 0) initializeChat();
    return () => {
      isMounted.current = false;
      // no explicit dispose function in this SDK here; keep ref for GC
      chatRef.current = null;
      aiRef.current = null;
    };
  }, [movies, initializeChat]);

  // Helper to push message safely
  const pushMessage = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  // Main sendMessage
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text?.trim()) return null;
      if (isLoading) return null;

      setError(null);
      setIsLoading(true);

      // Ensure chat initialized
      initializeChat();
      if (!chatRef.current) {
        setError('Trợ lý AI chưa sẵn sàng. Vui lòng thử lại.');
        setIsLoading(false);
        return null;
      }

      // user message
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text,
        sender: 'user',
      };
      pushMessage(userMsg);

      // provisional bot message (streaming updates will patch this)
      const botId = (Date.now() + 1).toString();
      let botMessage: ChatMessage = {
        id: botId,
        role: 'model',
        text: '',
        sender: 'ai',
      };
      pushMessage(botMessage);

      try {
        // sendMessageStream per original pattern
        const stream = await chatRef.current.sendMessageStream({ message: text });

        // accumulate text chunks
        let accumulated = '';
        for await (const chunk of stream) {
          // chunk.text per original SDK assumption
          const chunkText = typeof chunk.text === 'string' ? chunk.text : '';
          accumulated += chunkText;

          // update provisional message incrementally
          botMessage = { ...botMessage, text: accumulated };
          // only update if still mounted
          if (isMounted.current) {
            setMessages((prev) => prev.map((m) => (m.id === botId ? botMessage : m)));
          }
        }

        // After stream ends, attempt to parse structured JSON (redirect)
        let parsed: any = null;
        try {
          const trimmed = accumulated.trim();
          // detect JSON block (starts with { or [)
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            parsed = JSON.parse(trimmed);
          }
        } catch {
          parsed = null;
        }

        if (parsed && parsed.action === 'watch_movie' && parsed.movie_id) {
          // replace last bot message with redirect object
          const redirectMsg: ChatMessage = {
            id: botId,
            role: 'model',
            sender: 'ai',
            type: 'redirect',
            data: {
              movie_id: String(parsed.movie_id),
              movie_title: parsed.movie_title || '',
              message: parsed.message || '',
            },
            text: parsed.message || `Đang chuyển đến phim ${parsed.movie_title || parsed.movie_id}...`,
          };
          if (isMounted.current) {
            setMessages((prev) => prev.map((m) => (m.id === botId ? redirectMsg : m)));
          }
          setIsLoading(false);
          return redirectMsg;
        } else {
          // normal text response (already accumulated)
          const finalMsg: ChatMessage = {
            id: botId,
            role: 'model',
            sender: 'ai',
            text: accumulated || '...',
          };
          if (isMounted.current) {
            setMessages((prev) => prev.map((m) => (m.id === botId ? finalMsg : m)));
          }
          setIsLoading(false);
          return finalMsg;
        }
      } catch (e) {
        console.error('sendMessage error', e);
        const errorMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: 'model',
          sender: 'ai',
          text: 'Xin lỗi, đã có lỗi khi kết nối tới AI. Vui lòng thử lại.',
        };
        if (isMounted.current) pushMessage(errorMsg);
        setError('Failed to get response from AI.');
        setIsLoading(false);
        return null;
      }
    },
    [initializeChat, isLoading, pushMessage]
  );

  return { messages, isLoading, error, sendMessage };
};

export default useChatbot;
