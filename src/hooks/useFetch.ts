import { useState, useCallback, useEffect, useRef } from 'react';
import { useUIStore } from '@/src/store/useStore';

interface FetchOptions {
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface FetchState<T> {
  data: T | null;
  error: any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

interface FetchActions {
  refetch: () => Promise<void>;
  reset: () => void;
}

const cache = new Map<string, { data: any; timestamp: number }>();

export const useFetch = <T>(
  url: string,
  options: FetchOptions = {}
): FetchState<T> & FetchActions => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const { setLoading, setError } = useUIStore();
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isError: false,
    isSuccess: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cachedData = cache.get(url);
    if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
      setState({
        data: cachedData.data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      onSuccess?.(cachedData.data);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    let retries = 0;
    const fetchWithRetry = async (): Promise<T> => {
      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw error;
        }

        if (retries < retryCount) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return fetchWithRetry();
        }

        throw error;
      }
    };

    try {
      setLoading(true);
      setError(null);
      setState((prev) => ({ ...prev, isLoading: true }));

      const data = await fetchWithRetry();

      // Update cache
      cache.set(url, { data, timestamp: Date.now() });

      setState({
        data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      onSuccess?.(data);
    } catch (error: any) {
      setState({
        data: null,
        error,
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, cacheTime, retryCount, retryDelay, onSuccess, onError, setLoading, setError]);

  const refetch = useCallback(async () => {
    // Clear cache for this URL
    cache.delete(url);
    await fetchData();
  }, [url, fetchData]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    ...state,
    refetch,
    reset,
  };
}; 