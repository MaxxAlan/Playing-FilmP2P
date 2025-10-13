import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import StarIcon from './icons/StarIcon';
import LazyImage from './LazyImage';
import { useTrailerSearch } from '../hooks/useTrailerSearch';
import Spinner from './Spinner';
import VolumeUpIcon from './icons/VolumeUpIcon';
import VolumeOffIcon from './icons/VolumeOffIcon';


interface HeroProps {
  movie?: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { trailerId, isLoading, error, searchTrailer } = useTrailerSearch();

  useEffect(() => {
    // Reset trailer when the featured movie changes
    setIsHovering(false);
  }, [movie]);
  
  if (!movie) {
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden my-8 shadow-2xl bg-subtle animate-pulse"></section>
    );
  }

  const handleMouseEnter = () => {
    if (movie?.title && movie?.year) {
      setIsHovering(true);
      searchTrailer(movie.title, movie.year);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const trailerUrl = trailerId ? `https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerId}&playsinline=1` : '';

  return (
    <section 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden my-8 shadow-2xl animate-hero-fade-in group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <LazyImage
          placeholderClassName="w-full h-full"
          src={movie.posterUrl} 
          alt={`Poster for ${movie.title}`} 
          className="object-cover object-center animate-hero-ken-burns"
        />
      </div>

      {/* Trailer Video Player */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isHovering && trailerId ? 'opacity-100' : 'opacity-0'}`}>
        {trailerUrl && (
          <iframe
            src={trailerUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full scale-110"
          ></iframe>
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent"></div>
      
      {/* Loading Spinner */}
       {isHovering && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Spinner />
        </div>
      )}

      {/* Movie Info Content */}
      <div className={`relative z-10 flex flex-col justify-end h-full p-6 md:p-12 text-foreground transition-opacity duration-300 ${isHovering && trailerId ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-xl animate-hero-content">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">{movie.title}</h1>
          <div className="flex items-center gap-4 text-muted mb-4">
              <span className="font-semibold">{movie.year}</span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500"/>
                <span className="font-semibold">8.5</span>
              </div>
          </div>
          <p className="text-muted mb-6 line-clamp-3 leading-relaxed drop-shadow-md">
            {movie.summary}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {movie.genre?.slice(0, 3).map(g => (
              <span key={g} className="text-xs backdrop-blur-sm bg-black/10 dark:bg-white/10 px-3 py-1.5 rounded-full">{g}</span>
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
      
      {/* Mute/Unmute Button */}
      {isHovering && trailerId && (
        <div className="absolute z-20 bottom-6 right-6 md:bottom-12 md:right-12">
            <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="w-10 h-10 rounded-full border-2 border-white/50 bg-black/30 text-white/80 hover:border-white hover:text-white transition flex items-center justify-center backdrop-blur-sm"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeOffIcon className="w-5 h-5"/> : <VolumeUpIcon className="w-5 h-5"/>}
            </button>
        </div>
      )}
    </section>
  );
};

export default Hero;