import React, { useState, useMemo } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import type { Movie } from '../types';

const TrailersPage: React.FC = () => {
  const { movies, isLoading, error } = useMovies();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  // Memoized filtering logic to re-calculate only when movies or filters change
  const filteredMovies = useMemo(() => {
    let list = movies;

    if (query) {
      list = list.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (genre) {
      list = list.filter(m =>
        (m.genre || []).some(g => g.toLowerCase().includes(genre.toLowerCase()))
      );
    }

    if (year) {
      list = list.filter(m => String(m.year) === year);
    }

    return list;
  }, [movies, query, genre, year]);

  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  const inputClass = "w-full px-4 py-3 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">Movie Trailers</h1>
        <p className="text-muted mt-2">Find and watch the latest movie trailers</p>
      </div>

      {/* Search and Filter Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
        <input
          type="search"
          placeholder="Search by title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={inputClass}
          aria-label="Search trailers by title"
        />
        <input
          type="search"
          placeholder="Filter by genre..."
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className={inputClass}
          aria-label="Filter trailers by genre"
        />
        <input
          type="number"
          placeholder="Filter by year..."
          min="1900"
          max="2100"
          value={year}
          onChange={e => setYear(e.target.value)}
          className={inputClass}
          aria-label="Filter trailers by year"
        />
      </section>

      {/* Grid Display Section */}
      {isLoading ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {Array.from({ length: 18 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      ) : filteredMovies.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      ) : (
        <p className="text-center text-muted mt-10">No trailers found matching your criteria.</p>
      )}
    </div>
  );
};

export default TrailersPage;


