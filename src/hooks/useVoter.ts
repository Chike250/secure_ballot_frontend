import { useCallback } from 'react';
import { voterAPI } from '@/services/api';
import { useUIStore } from '@/store/useStore';

export const useVoter = () => {
  const { setLoading, setError } = useUIStore();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await voterAPI.getProfile();
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateProfile = useCallback(
    async (data: { phoneNumber?: string }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await voterAPI.updateProfile(data);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to update profile');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await voterAPI.changePassword(currentPassword, newPassword);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to change password');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getPollingUnit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await voterAPI.getPollingUnit();
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch polling unit');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getVotingHistory = useCallback(
    async (page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);
        const response = await voterAPI.getVotingHistory(page, limit);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch voting history');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const verifyVote = useCallback(
    async (receiptCode: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await voterAPI.verifyVote(receiptCode);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to verify vote');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const reportVoteIssue = useCallback(
    async (data: {
      voteId: string;
      issueType: 'technical' | 'fraud' | 'coercion' | 'other';
      description: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await voterAPI.reportVoteIssue(data);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to report vote issue');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    getProfile,
    updateProfile,
    changePassword,
    getPollingUnit,
    getVotingHistory,
    verifyVote,
    reportVoteIssue,
  };
}; 