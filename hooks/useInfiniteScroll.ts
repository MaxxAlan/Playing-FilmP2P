import { useState, useEffect, useRef, useCallback } from 'react';

const PAGE_SIZE = 24;

export const useInfiniteScroll = <T,>(items: T[]) => {
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // FIX: Initialize useRef with null to provide an argument and ensure it's a mutable ref.
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Reset when the source item list changes (e.g., due to filtering)
  useEffect(() => {
    setPage(1);
    const initialItems = items.slice(0, PAGE_SIZE);
    setVisibleItems(initialItems);
    setHasMore(items.length > PAGE_SIZE);
    setIsLoading(false); // Ensure loading is reset on filter change
  }, [items]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simulate network delay for better UX, otherwise state change might be too fast to see loader
    setTimeout(() => {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        const newItems = items.slice(0, nextPage * PAGE_SIZE);
        setVisibleItems(newItems);
        setHasMore(newItems.length < items.length);
        setIsLoading(false);
        return nextPage;
      });
    }, 300);

  }, [items, hasMore, isLoading]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);

  return { visibleItems, lastElementRef, hasMore, isLoading };
};
