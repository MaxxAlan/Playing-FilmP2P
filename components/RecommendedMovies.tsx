import React from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieCard from './MovieCard';
import type { Movie } from '../types';

interface RecommendedMoviesProps {
  currentMovie: Movie;
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ currentMovie }) => {
  const { movies } = useMovies();

  const recommended = movies.filter(movie => {
    if (String(movie.id) === String(currentMovie.id)) return false;
    const hasCommonGenre = movie.genre?.some(g => currentMovie.genre?.includes(g));
    return hasCommonGenre;
  }).sort(() => 0.5 - Math.random()).slice(0, 6);

  if (recommended.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Có thể bạn cũng thích</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {recommended.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedMovies;
