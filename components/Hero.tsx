import React, { useState, useEffect, useRef } from 'react';
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
  t?: (key: string) => string;
}

// Cache global để tránh fetch lại trailer cho cùng một phim
const trailerCache = new Map<string, string>();

const Hero: React.FC<HeroProps> = ({ movie, t = (key) => key }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showError, setShowError] = useState(false);
  const [hasFetchedTrailer, setHasFetchedTrailer] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { trailerId, isLoading, error, searchTrailer } = useTrailerSearch();

  // Key để cache trailer
  const cacheKey = movie ? `${movie.title}-${movie.year}` : '';

  // Reset states khi movie thay đổi
  useEffect(() => {
    setIsHovering(false);
    setShowError(false);
    setHasFetchedTrailer(false);
  }, [movie?.id]);

  // Hiển thị lỗi nếu fetch trailer thất bại
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Điều khiển mute/unmute qua YouTube Player API
  useEffect(() => {
    if (iframeRef.current && trailerId) {
      const command = isMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  }, [isMuted, trailerId]);

  // Lưu trailer ID vào cache khi có
  useEffect(() => {
    if (trailerId && cacheKey) {
      trailerCache.set(cacheKey, trailerId);
    }
  }, [trailerId, cacheKey]);

  // Loading state cho skeleton
  if (!movie) {
    return (
      <section 
        className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden my-8 shadow-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
        role="region"
        aria-label="Loading featured movie"
      />
    );
  }

  // Handler cho hover/touch - chỉ fetch trailer 1 lần
  const handleInteractionStart = () => {
    if (!movie?.title || !movie?.year) return;
    
    setIsHovering(true);
    
    // Kiểm tra cache hoặc state đã fetch chưa
    const cachedTrailerId = trailerCache.get(cacheKey);
    if (!cachedTrailerId && !trailerId && !hasFetchedTrailer) {
      setHasFetchedTrailer(true);
      searchTrailer(movie.title, movie.year);
    }
  };

  const handleInteractionEnd = () => {
    setIsHovering(false);
  };

  // Lấy trailer ID từ cache hoặc state
  const cachedTrailerId = trailerCache.get(cacheKey) || trailerId;
  const trailerUrl = cachedTrailerId 
    ? `https://www.youtube.com/embed/${cachedTrailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${cachedTrailerId}&playsinline=1&enablejsapi=1` 
    : '';

  const displayRating = movie.rating?.toFixed(1) ?? 'N/A';

  return (
    <section 
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onFocus={handleInteractionStart}
      onBlur={handleInteractionEnd}
      tabIndex={0}
      role="region"
      aria-label={`Featured movie: ${movie.title}`}
      className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden my-8 shadow-2xl group cursor-pointer"
    >
      {/* Background Poster với Ken Burns Animation */}
      <div className="absolute inset-0">
        <LazyImage
          src={movie.posterUrl} 
          alt={`Poster for ${movie.title}`} 
          className={`w-full h-full object-cover object-center transition-transform duration-[5.999s] ease-linear ${
            isHovering ? '' : 'scale-100 animate-[ken-burns_4s_ease-in-out_infinite]'
          }`}
          placeholderClassName="w-full h-full"
        />
      </div>

      {/* Trailer Video Player */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          isHovering && cachedTrailerId ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isHovering || !cachedTrailerId}
      >
        {trailerUrl && (
          <iframe
            ref={iframeRef}
            src={trailerUrl}
            title={`${movie.title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full scale-110"
          />
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      
      {/* Loading Spinner */}
      {isHovering && isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
          role="status"
          aria-live="polite"
        >
          <Spinner />
          <span className="sr-only">Loading trailer</span>
        </div>
      )}

      {/* Error Message Overlay */}
      {showError && (
        <div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-[fade-in_0.3s_ease-out]"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm font-semibold">Failed to load trailer</p>
        </div>
      )}

      {/* Movie Info Content */}
      <div 
        className={`relative z-10 flex flex-col justify-end h-full p-6 md:p-12 text-white transition-opacity duration-500 ${
          isHovering && cachedTrailerId ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden={isHovering && !!cachedTrailerId}
      >
        <div className="max-w-2xl animate-[fade-up_0.6s_ease-out]">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold mb-2 drop-shadow-lg">
          {movie.title}
          </h1>

          
          <div className="flex items-center gap-4 text-gray-200 mb-8">
            <span className="text-lg font-semibold">{movie.year}</span>
            <div 
              className="flex items-center gap-1.5" 
              role="group" 
              aria-label={`Rating: ${displayRating} out of 10`}
            >
              <StarIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />
              <span className="text-lg font-semibold">{displayRating}</span>
            </div>
          </div>
          
          <p className="text-gray-100 text-base md:text-lg mb-6 line-clamp-3 leading-relaxed drop-shadow-md">
            {movie.summary}
          </p>
          
          <div 
            className="flex flex-wrap gap-2 mb-8" 
            role="list" 
            aria-label="Movie genres"
          >
            {movie.genre?.slice(0, 3).map(g => (
              <span 
                key={g} 
                role="listitem"
                className="text-xs md:text-sm backdrop-blur-sm bg-white/20 px-3 py-1.5 rounded-full font-medium"
              >
                {g}
              </span>
            ))}
          </div>
          
          <Link 
            to={`/movie/${movie.id}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-300"
            aria-label={`Watch ${movie.title} now`}
          >
            {t('Xem Phim')}
          </Link>
        </div>
      </div>
      
      {/* Mute/Unmute Button */}
      {isHovering && cachedTrailerId && (
        <div className="absolute z-20 bottom-6 right-6 md:bottom-12 md:right-12 animate-[fade-in_0.3s_ease-out]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }} 
            className="w-12 h-12 rounded-full border-2 border-white/50 bg-black/40 text-white/80 hover:border-white hover:bg-black/60 hover:text-white transition-all duration-200 flex items-center justify-center backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/50"
            aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
            aria-pressed={!isMuted}
          >
            {isMuted ? (
              <VolumeOffIcon className="w-6 h-6" aria-hidden="true" />
            ) : (
              <VolumeUpIcon className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;