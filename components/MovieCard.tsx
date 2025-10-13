import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import LazyImage from './LazyImage';
import PlayIcon from './icons/PlayIcon';
import PlusIcon from './icons/PlusIcon';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const movieLink = `/movie/${movie.id}`;

  return (
    <Link to={movieLink} className="block bg-card rounded-lg overflow-hidden group border border-border hover:border-primary/50 hover:scale-105 hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <LazyImage
          placeholderClassName="aspect-[2/3] w-full"
          src={movie.posterUrl}
          alt={`Poster for ${movie.title}`}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <button aria-label="Add to my list" className="w-10 h-10 rounded-full border-2 border-white/50 bg-black/30 text-white/80 hover:border-white hover:text-white transition flex items-center justify-center backdrop-blur-sm">
              <PlusIcon className="w-5 h-5" />
            </button>
            <button aria-label="Play" className="w-12 h-12 rounded-full border-2 border-white/50 bg-black/30 text-white/80 hover:border-white hover:text-white transition flex items-center justify-center backdrop-blur-sm">
              <PlayIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-card-foreground truncate group-hover:text-link transition-colors duration-200" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-muted mt-1">{movie.year}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
