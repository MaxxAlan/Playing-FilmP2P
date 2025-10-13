import React, { useMemo, useEffect, useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieRow from '../components/MovieRow';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import Hero from '../components/Hero';
import type { Movie } from '../types';

const HERO_ROTATION_INTERVAL = 4000; // 4 seconds

const SkeletonRow = () => (
  <div className="my-8 md:my-12">
    <div className="h-8 bg-subtle rounded w-1/4 mb-4 animate-pulse"></div>
    <div className="flex space-x-4 md:space-x-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-40 sm:w-44 md:w-48 lg:w-52">
          <MovieCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const { movies, isLoading, error } = useMovies();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | undefined>();

  // Set initial and rotating featured movie
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
  }, [movies, featuredMovie]);

  const categorizedMovies = useMemo(() => {
    if (!movies || movies.length === 0) return {};

    const shuffle = (array: Movie[]) => [...array].sort(() => 0.5 - Math.random());

    const trending = shuffle(movies.filter(m => m.year && m.year >= 2022)).slice(0, 15);
    const newReleases = shuffle(movies).slice(0, 15);
    const action = shuffle(movies.filter(m => m.genre?.includes('Hành Động'))).slice(0, 15);
    const horror = shuffle(movies.filter(m => m.genre?.includes('Kinh Dị'))).slice(0, 15);
    const comedy = shuffle(movies.filter(m => m.genre?.includes('Hài Hước'))).slice(0, 15);

    return {
      trending,
      newReleases,
      action,
      horror,
      comedy,
    };
  }, [movies]);

  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <div>
      <Hero movie={featuredMovie} key={featuredMovie?.id} />

      {isLoading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : (
        <>
          <MovieRow title="Phim Thịnh Hành" movies={categorizedMovies.trending} />
          <MovieRow title="Mới Phát Hành" movies={categorizedMovies.newReleases} />
          <MovieRow title="Phim Hành Động" movies={categorizedMovies.action} />
          <MovieRow title="Phim Kinh Dị" movies={categorizedMovies.horror} />
          <MovieRow title="Phim Hài Hước" movies={categorizedMovies.comedy} />
        </>
      )}
    </div>
  );
};

export default HomePage;
