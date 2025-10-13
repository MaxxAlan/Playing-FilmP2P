import React, { useState, useMemo } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Spinner from '../components/Spinner';

const CategoriesPage: React.FC = () => {
  const { movies, isLoading: isLoadingMovies, error } = useMovies();
  const [genreTerm, setGenreTerm] = useState('');

  const filteredMovies = useMemo(() => {
    if (!genreTerm) return movies;
    return movies.filter(movie => {
      return (movie.genre || []).some(g => g.toLowerCase().includes(genreTerm.toLowerCase()));
    });
  }, [movies, genreTerm]);
  
  const { visibleItems, lastElementRef, hasMore, isLoading: isLoadingMore } = useInfiniteScroll(filteredMovies);

  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">Thể loại phim</h1>
        <p className="text-muted mt-2">Khám phá bộ sưu tập phim đa dạng của chúng tôi</p>
      </div>
      
      <section className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          id="genreInput"
          type="search"
          placeholder="🔍 Tìm theo thể loại (ví dụ: Sci-Fi)"
          value={genreTerm}
          onChange={(e) => setGenreTerm(e.target.value)}
          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
        />
      </section>

      {isLoadingMovies ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      ) : visibleItems.length > 0 ? (
        <>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {visibleItems.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>
          <div ref={lastElementRef} style={{ height: '1px' }} />
          {isLoadingMore && <Spinner />}
          {!isLoadingMore && !hasMore && visibleItems.length > 0 && (
            <p className="text-center text-muted mt-10">Đã tải tất cả phim.</p>
          )}
        </>
      ) : (
        <p className="text-center text-muted mt-10">Không tìm thấy phim nào phù hợp.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
