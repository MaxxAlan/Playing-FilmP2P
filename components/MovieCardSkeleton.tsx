import React from 'react';

const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden animate-pulse border border-border">
      <div className="aspect-[2/3] w-full bg-subtle"></div>
      <div className="p-4">
        <div className="h-4 bg-subtle rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-subtle rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
