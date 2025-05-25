import { useCallback } from 'react';
import { voterAPI } from '@/services/api';
import { useUIStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useStore';

// Define interfaces for profile data
interface VoterProfile {
  id: string;
  nin: string;
  vin: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: string;
  pollingUnit?: PollingUnit;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  hasMFA: boolean;
}

interface PollingUnit {
  id: string;
  name: string;
  code: string;
  ward: string;
  lga: string;
  state: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface VotingHistoryItem {
  id: string;
  electionId: string;
  electionName: string;
  electionType: string;
  candidateId: string;
  candidateName: string;
  candidateParty: string;
  voteDate: string;
  receiptCode: string;
}

export const useVoterProfile = () => {
  const { setLoading, setError } = useUIStore();
  const { user } = useAuthStore();

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
        setError(error.response?.data?.message || 'Failed to report issue');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    userId: user?.id,
    userFullName: user?.fullName,
    getProfile,
    updateProfile,
    changePassword,
    getPollingUnit,
    getVotingHistory,
    verifyVote,
    reportVoteIssue,
  };
}; 