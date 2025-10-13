import React, { useState, useEffect } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import Spinner from '../components/Spinner';
import type { Movie } from '../types';

const SearchPage: React.FC = () => {
  const { movies, isLoading, error } = useMovies();
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('relevance');

  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    setIsFiltering(true);
    
    const filterTimeout = setTimeout(() => {
        const calculateScore = (movie: Movie, queryText: string): number => {
          const lowerQuery = queryText.toLowerCase();
          if (!lowerQuery) return 1;

          let score = 0;
          const lowerTitle = movie.title.toLowerCase();
          const lowerSummary = movie.summary?.toLowerCase() || '';
          const lowerGenres = (movie.genre || []).join(' ').toLowerCase();

          if (lowerTitle.includes(lowerQuery)) {
            score += 10;
            if (lowerTitle.startsWith(lowerQuery)) {
              score += 5;
            }
          }
          if (lowerGenres.includes(lowerQuery)) {
            score += 3;
          }
          if (lowerSummary.includes(lowerQuery)) {
            score += 2;
          }
          return score;
        };

        let list = movies.filter(m => {
          const okYear = !year || String(m.year) === year;
          const okGenre = !genre || (m.genre || []).join(' ').toLowerCase().includes(genre.toLowerCase());
          return okYear && okGenre;
        });

        if (sort === 'relevance' && query) {
            list = list
                .map(movie => ({ movie, score: calculateScore(movie, query) }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.movie);
        } else {
            if (query) {
                list = list.filter(m => 
                    `${m.title} ${m.summary}`.toLowerCase().includes(query.toLowerCase())
                );
            }
            switch (sort) {
                case 'title_asc': list.sort((a, b) => a.title.localeCompare(b.title)); break;
                case 'title_desc': list.sort((a, b) => b.title.localeCompare(a.title)); break;
                case 'year_desc': list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0)); break;
                case 'year_asc': list.sort((a, b) => Number(a.year || 0) - Number(b.year || 0)); break;
                default: break;
            }
        }
        
        setDisplayedMovies(list);
        setIsFiltering(false);
    }, 50);

    return () => clearTimeout(filterTimeout);
  }, [movies, query, year, genre, sort, isLoading]);


  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  const inputClass = "w-full px-4 py-3 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";

  return (
    <div className="py-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <input id="q" type="search" placeholder="Tìm tên hoặc mô tả" value={query} onChange={e => setQuery(e.target.value)} className={inputClass} />
        <input id="year" type="number" placeholder="Năm" min="1900" max="2100" value={year} onChange={e => setYear(e.target.value)} className={inputClass} />
        <input id="genre" type="search" placeholder="Thể loại (vd: Hành Động)" value={genre} onChange={e => setGenre(e.target.value)} className={inputClass} />
        <select id="sort" value={sort} onChange={e => setSort(e.target.value)} className={inputClass}>
          <option value="relevance">Liên quan</option>
          <option value="title_asc">Tên (A→Z)</option>
          <option value="title_desc">Tên (Z→A)</option>
          <option value="year_desc">Năm (mới→cũ)</option>
          <option value="year_asc">Năm (cũ→mới)</option>
        </select>
      </section>

      {isLoading ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      ) : isFiltering ? (
        <Spinner />
      ) : displayedMovies.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {displayedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      ) : (
        <p className="text-center text-muted mt-10">Không tìm thấy phim nào khớp với tiêu chí của bạn.</p>
      )}
    </div>
  );
};

export default SearchPage;
