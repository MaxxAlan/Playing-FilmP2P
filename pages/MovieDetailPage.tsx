// File: maxxalan/playing-filmp2p/Playing-FilmP2P-main/pages/MovieDetailPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import Spinner from '../components/Spinner';
import type { Episode } from '../types';
import RecommendedMovies from '../components/RecommendedMovies';
import StarIcon from '../components/icons/StarIcon';
import LazyImage from '../components/LazyImage';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { movies, isLoading, error } = useMovies();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const movie = useMemo(() => movies.find(m => String(m.id) === id), [movies, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (movie) {
      if (movie.episodes && movie.episodes.length > 0) {
        setSelectedEpisode(movie.episodes[0]);
      } else {
        setSelectedEpisode(null);
      }
    }
  }, [movie]);
  
  const playerSrc = useMemo(() => {
    if (selectedEpisode?.driveUrl) {
      return `https://drive.google.com/file/d/${selectedEpisode.driveUrl}/preview`;
    }
    if (movie?.driveUrl) {
      return `https://drive.google.com/file/d/${movie.driveUrl}/preview`;
    }
    return '';
  }, [movie, selectedEpisode]);

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 mt-10">Error loading movies: {error.message}</p>;
  if (!movie) return <p className="text-center text-muted mt-10">Không tìm thấy phim.</p>;

  return (
    <div className="py-8">
      {/* FIX 1: Thêm aspect-video vào container để đảm bảo tỷ lệ 16:9 responsive */}
      <div className="w-full bg-input rounded-lg overflow-hidden shadow-lg border border-border aspect-video">
        {playerSrc ? (
            <iframe
                title={movie.title}
                src={playerSrc}
                // FIX 2: Đặt kích thước là 100% để lấp đầy container aspect-video
                className="w-full h-full border-0"
                // FIX 3: Thêm các thuộc tính toàn màn hình để tối đa hóa khả năng tương thích trên di động/tablet
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
            ></iframe>
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-muted">
                Không có nguồn video
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
        <div className="md:col-span-3 lg:col-span-2">
            <LazyImage 
                placeholderClassName="aspect-[2/3] w-full rounded-lg shadow-lg"
                src={movie.posterUrl} 
                alt={`Poster for ${movie.title}`}
                className="object-cover rounded-lg"
            />
        </div>

        <div className="md:col-span-9 lg:col-span-10 text-foreground">
          <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-muted text-sm mt-3">
            <span>{movie.year}</span>
            <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500"/>
                <span className="font-semibold">8.5</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
              {movie.genre?.map(g => (
                  <span key={g} className="text-xs bg-input text-muted px-3 py-1.5 rounded-full">{g}</span>
              ))}
          </div>
          <p className="mt-6 text-muted leading-relaxed">{movie.summary}</p>
        </div>
      </div>
      
      {movie.episodes && movie.episodes.length > 0 && (
        <div className="my-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Danh sách tập</h3>
          <div className="flex flex-wrap gap-2">
            {movie.episodes.map((ep, index) => (
              <button
                key={ep.driveUrl || index}
                onClick={() => setSelectedEpisode(ep)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${selectedEpisode?.driveUrl === ep.driveUrl && selectedEpisode?.title === ep.title
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-input border-border hover:border-primary hover:text-link'}`}
              >
                {ep.title || `Tập ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Trailer</h3>
        {movie.trailerUrl ? (
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerUrl}`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-input border-2 border-dashed border-border rounded-lg">
            <p className="text-muted">Trailer không có sẵn.</p>
          </div>
        )}
      </div>
      
      <RecommendedMovies currentMovie={movie} />

    </div>
  );
};

export default MovieDetailPage;