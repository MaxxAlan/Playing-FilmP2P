import React from 'react';
import type { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="my-8 md:my-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">{title}</h2>
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mb-4">
          {movies.map(movie => (
            <div key={movie.id} className="flex-shrink-0 w-40 sm:w-44 md:w-48 lg:w-52">
              <MovieCard movie={movie} />
            </div>
          ))}
          <div className="flex-shrink-0 w-1"></div> {/* Spacer at the end */}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;
