
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
}

// FIX: Add ChatMessage interface for chatbot functionality.
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
