import { useUIStore } from '@/src/store/useStore';

export const useLoading = () => {
  const { isLoading, error, setLoading, setError } = useUIStore();

  const withLoading = async <T>(
    operation: () => Promise<T>,
    errorMessage = 'Operation failed'
  ): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (error: any) {
      setError(error.response?.data?.message || errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    error,
    setLoading,
    setError,
    withLoading,
  };
}; 