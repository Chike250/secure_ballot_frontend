import { useState, useCallback, useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface InfiniteScrollState {
  isFetching: boolean;
  hasMore: boolean;
  error: any;
}

interface InfiniteScrollActions {
  loadMore: () => Promise<void>;
  reset: () => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export const useInfiniteScroll = <T>(
  fetchItems: (page: number) => Promise<{ items: T[]; hasMore: boolean }>,
  options: InfiniteScrollOptions = {}
): InfiniteScrollState & InfiniteScrollActions => {
  const {
    threshold = 0.5,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const [state, setState] = useState<InfiniteScrollState>({
    isFetching: false,
    hasMore: true,
    error: null,
  });

  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (state.isFetching || !state.hasMore) return;

    try {
      setState((prev) => ({ ...prev, isFetching: true, error: null }));

      const { items, hasMore } = await fetchItems(page);

      setState((prev) => ({
        ...prev,
        isFetching: false,
        hasMore,
      }));

      setPage((prev) => prev + 1);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isFetching: false,
        error,
      }));
    }
  }, [fetchItems, page, state.isFetching, state.hasMore]);

  const reset = useCallback(() => {
    setState({
      isFetching: false,
      hasMore: true,
      error: null,
    });
    setPage(1);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !state.isFetching && state.hasMore) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current = observer;

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, threshold, rootMargin, state.isFetching, state.hasMore, loadMore]);

  return {
    ...state,
    loadMore,
    reset,
    targetRef,
  };
}; 