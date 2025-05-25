import { useCallback } from 'react';
import { useUIStore } from '@/store/useStore';
import { authAPI } from '@/services/api';

export const useUSSD = () => {
  const { setLoading, setError } = useUIStore();

  const startSession = useCallback(
    async (data: { nin: string; vin: string; phoneNumber: string }) => {
      try {
        setLoading(true);
        setError(null);
        const result = await authAPI.ussdAuthenticate(data.nin, data.vin, data.phoneNumber);
        return result;
      } catch (error: any) {
        setError(error.message || 'Failed to start USSD session');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const castVote = useCallback(
    async (data: { sessionCode: string; electionId: string; candidateId: string }) => {
      try {
        setLoading(true);
        setError(null);
        // USSD voting not implemented in current API
        throw new Error('USSD voting functionality not available');
      } catch (error: any) {
        setError(error.message || 'Failed to cast vote');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const checkSessionStatus = useCallback(
    async (sessionCode: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await authAPI.ussdVerifySession(sessionCode);
        return result;
      } catch (error: any) {
        setError(error.message || 'Failed to check session status');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const verifyVote = useCallback(
    async (data: { receiptCode: string; phoneNumber: string }) => {
      try {
        setLoading(true);
        setError(null);
        // USSD vote verification not implemented in current API
        throw new Error('USSD vote verification functionality not available');
      } catch (error: any) {
        setError(error.message || 'Failed to verify vote');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    startSession,
    castVote,
    checkSessionStatus,
    verifyVote,
  };
}; 