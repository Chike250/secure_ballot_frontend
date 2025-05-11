import { useCallback } from 'react';
import { useElectionStore } from '@/store/useStore';
import { electionAPI } from '@/services/api';
import { useUIStore } from '@/store/useStore';

export const useElections = () => {
  const { setCurrentElection, setElections, currentElection, elections } = useElectionStore();
  const { setLoading, setError } = useUIStore();

  const fetchElections = useCallback(
    async (status = 'active', type?: string, page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);
        const response = await electionAPI.getElections(status, type, page, limit);
        setElections(response.data);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch elections');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setElections, setLoading, setError]
  );

  const fetchElectionDetails = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await electionAPI.getElectionDetails(id);
        setCurrentElection(response.data);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch election details');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setCurrentElection, setLoading, setError]
  );

  const fetchCandidates = useCallback(
    async (electionId: string, search?: string, page = 1, limit = 50) => {
      try {
        setLoading(true);
        setError(null);
        const response = await electionAPI.getCandidates(electionId, search, page, limit);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch candidates');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const castVote = useCallback(
    async (electionId: string, candidateId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await electionAPI.castVote(electionId, candidateId);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to cast vote');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getVotingStatus = useCallback(
    async (electionId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await electionAPI.getVotingStatus(electionId);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to get voting status');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    currentElection,
    elections,
    fetchElections,
    fetchElectionDetails,
    fetchCandidates,
    castVote,
    getVotingStatus,
  };
}; 