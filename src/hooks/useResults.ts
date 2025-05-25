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

  const getHistoricalData = useCallback(
    async (electionId: string, timeRange: string) => {
      try {
        setLoading(true);
        setError(null);
        // Since this isn't defined in the API, we're simulating it with existing endpoints
        // In a real implementation, you'd call the actual API endpoint
        const response = await resultsAPI.getDetailedResults(electionId, false);
        
        // Create mock time points based on the detailed results
        const mockTimePoints = Array(21).fill(0).map((_, index) => ({
          time: `Day ${index + 1}`,
          votes: Math.round(response.data.totalVotes * ((index + 1) / 21)),
          timestamp: new Date(Date.now() - (21 - index) * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        return {
          electionId,
          timeRange,
          timePoints: mockTimePoints
        };
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch historical data');
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
    getHistoricalData,
  };
}; 