import { useCallback } from 'react';
import { resultsAPI } from '@/services/api';
import { useUIStore } from '@/store/useStore';

export const useResults = () => {
  const { setLoading, setError } = useUIStore();

  const getLiveResults = useCallback(
    async (electionId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await resultsAPI.getLiveResults(electionId);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch live results');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getStatistics = useCallback(
    async (electionId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await resultsAPI.getStatistics(electionId);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch statistics');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getDetailedResults = useCallback(
    async (electionId: string, includePollingUnitBreakdown = false) => {
      try {
        setLoading(true);
        setError(null);
        const response = await resultsAPI.getDetailedResults(
          electionId,
          includePollingUnitBreakdown
        );
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch detailed results');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getLiveStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultsAPI.getLiveStatistics();
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch live statistics');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getRegionalResults = useCallback(
    async (electionId: string, regionId?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await resultsAPI.getRegionalResults(electionId, regionId);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch regional results');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    getLiveResults,
    getStatistics,
    getDetailedResults,
    getLiveStatistics,
    getRegionalResults,
  };
}; 