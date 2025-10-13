// File: maxxalan/playing-filmp2p/Playing-FilmP2P-demoUI/pages/HomePage.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import Pagination from '../components/Pagination';
import Hero from '../components/Hero';
import type { Movie } from '../types';

const PAGE_SIZE = 18;
const HERO_ROTATION_INTERVAL = 3999; // 4 seconds

const HomePage: React.FC = () => {
  const { movies, isLoading, error } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | undefined>();

  useEffect(() => {
    if (movies.length > 0) {
      if (!featuredMovie) {
        setFeaturedMovie(movies.find(m => m.id === 1) || movies[0]);
      }
      const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * movies.length);
        setFeaturedMovie(movies[randomIndex]);
      }, HERO_ROTATION_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  const totalPages = Math.ceil(filteredMovies.length / PAGE_SIZE);
  
  const currentMovies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredMovies.slice(start, end);
  }, [filteredMovies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const grid = document.getElementById('movie-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <>
      <Hero movie={featuredMovie} key={featuredMovie?.id} />
      <section className="py-8">
        <div className="relative">
          <input
            id="searchInput"
            type="search"
            placeholder="Tìm kiếm phim bạn yêu thích..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            aria-label="Search movies"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </section>
      
      <h2 className="text-2xl font-bold mb-6 text-foreground scroll-mt-20" id="movie-grid">Phim Mới Cập Nhật</h2>
      
      {isLoading && !movies.length ? (
         <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      ) : filteredMovies.length > 0 ? (
        <>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {currentMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-muted mt-10">Không tìm thấy phim nào.</p>
      )}
    </>
  );
};

export default HomePage;