import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import StarIcon from './icons/StarIcon';
import LazyImage from './LazyImage';

interface HeroProps {
  movie?: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  if (!movie) {
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden my-8 shadow-2xl bg-slate-200 dark:bg-gray-900 animate-pulse"></section>
    );
  }

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden my-8 shadow-2xl animate-hero-fade-in">
      <div className="absolute inset-0">
        <LazyImage
          placeholderClassName="w-full h-full"
          src={movie.posterUrl} 
          alt={`Poster for ${movie.title}`} 
          className="object-cover object-center animate-hero-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#090b10] via-slate-50/50 dark:via-[#090b10]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-[#090b10] via-slate-50/30 dark:via-[#090b10]/30 to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-12 text-slate-900 dark:text-white">
        <div className="max-w-xl animate-hero-content">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">{movie.title}</h1>
          <div className="flex items-center gap-4 text-slate-700 dark:text-gray-300 mb-4">
              <span className="font-semibold">{movie.year}</span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500 dark:text-yellow-400"/>
                <span className="font-semibold">8.5</span>
              </div>
          </div>
          <p className="text-slate-700 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed drop-shadow-md">
            {movie.summary}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {movie.genre?.slice(0, 3).map(g => (
              <span key={g} className="text-xs backdrop-blur-sm bg-black/10 dark:bg-white/10 text-slate-800 dark:text-gray-200 px-3 py-1.5 rounded-full">{g}</span>
            ))}
          </div>
          <Link 
            to={`/movie/${movie.id}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg"
          >
            Xem ngay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;