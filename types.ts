
export interface Episode {
  title: string;
  driveUrl: string;
}

export interface Movie {
  id: string | number;
  title: string;
  posterUrl: string;
  summary?: string;
  genre?: string[];
  year?: number;
  driveUrl?: string;
  episodes?: Episode[];
  trailerUrl?: string;
  rating?: number | null;
}

// FIX: Add ChatMessage interface for chatbot functionality.
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// Interface for the response from Gemini API
export interface GeminiAPIResponse {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  summary: string;
  genre: string[];
  rating: number | null;
}