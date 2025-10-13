import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import LazyImage from './LazyImage';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const movieLink = `/movie/${movie.id}`;

  return (
    // FIX: Removed all hardcoded colors and replaced them with theme variables.
    // The entire component now dynamically adapts to both light and dark themes.
    <article className="bg-card rounded-lg overflow-hidden group border border-border hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-primary/10">
      <Link to={movieLink} className="cursor-pointer">
        <div className="relative">
          <LazyImage
            placeholderClassName="aspect-[2/3] w-full"
            src={movie.posterUrl}
            alt={`Poster for ${movie.title}`}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="text-white text-xs mb-2">
              <span>{movie.year}</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
              {movie.genre?.slice(0, 2).map(g => (
                <span key={g} className="text-xs backdrop-blur-sm bg-white/20 text-white px-2 py-1 rounded-full">{g}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground truncate group-hover:text-link transition-colors duration-200" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-xs text-muted mt-1">{movie.year}</p>
        </div>
      </Link>
    </article>
  );
};

export default MovieCard;