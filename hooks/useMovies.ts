
import { useState, useEffect } from 'react';
import type { Movie } from '../types';

let cachedMovies: Movie[] = [];

// Interface for the raw movie data structure from the JSON API
interface RawMovie {
  id: string | number;
  title: string;
  poster: string;
  desc?: string;
  genre?: string[];
  year?: number;
  driveId?: string;
  episodes?: { name: string; driveId: string }[];
  trailerUrl?: string; // This field is not in the sample, but we keep it for flexibility
  [key: string]: any; // Allow other properties
}


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
        const rawData: RawMovie[] = await response.json();
        
        // Map the raw data from the API to the internal Movie interface used by the application
        const formattedMovies: Movie[] = rawData.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.poster, // Map 'poster' to 'posterUrl'
          summary: movie.desc,     // Map 'desc' to 'summary'
          genre: movie.genre,
          year: movie.year,
          driveUrl: movie.driveId, // Map 'driveId' to 'driveUrl' for single movies
          episodes: movie.episodes?.map(ep => ({
            title: ep.name,        // Map episode 'name' to 'title'
            driveUrl: ep.driveId,  // Map episode 'driveId' to 'driveUrl'
          })),
          trailerUrl: movie.trailerUrl,
        }));

        cachedMovies = formattedMovies;
        setMovies(formattedMovies);
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
