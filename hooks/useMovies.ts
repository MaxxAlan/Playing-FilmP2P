
import { useState, useEffect } from 'react';
import type { Movie } from '../types';

let cachedMovies: Movie[] = [];

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>(cachedMovies);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedMovies.length);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedMovies.length > 0) {
      return;
    }

    const fetchMovies = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
        if (!response.ok) {
          throw new Error('Failed to fetch movie data');
        }
        const data: Movie[] = await response.json();
        cachedMovies = data;
        setMovies(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { movies, isLoading, error };
};
