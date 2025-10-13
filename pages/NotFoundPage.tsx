// File: maxxalan/playing-filmp2p/Playing-FilmP2P-demoUI/pages/NotFoundPage.tsx

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';

const NotFoundPage: React.FC = () => {
  const { movies, isLoading } = useMovies();

  const randomMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    return [...movies].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [movies]);

  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-8xl font-extrabold bg-gradient-to-r from-cyan-400 to-amber-400 text-transparent bg-clip-text mb-4">404</h1>
      <p className="text-2xl font-semibold text-foreground mb-8">Rất tiếc, trang bạn đang tìm kiếm không tồn tại.</p>
      
      <div className="my-12">
        <h2 className="text-xl font-semibold text-muted mb-6">Có thể bạn sẽ thích những bộ phim này:</h2>
        {isLoading ? <Spinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mx-auto">
            {randomMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      <Link to="/" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition">
        ← Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;