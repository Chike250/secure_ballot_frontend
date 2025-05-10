import { useCallback } from 'react';
import { useUIStore } from '@/store/useStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useUSSD = () => {
  const { setLoading, setError } = useUIStore();

  const startSession = useCallback(
    async (data: { nin: string; vin: string; phoneNumber: string }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/ussd/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to start USSD session');
        }
        return result.data;
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
        const response = await fetch(`${API_URL}/ussd/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to cast vote');
        }
        return result.data;
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
        const response = await fetch(
          `${API_URL}/ussd/session-status?sessionCode=${sessionCode}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to check session status');
        }
        return result.data;
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
        const response = await fetch(`${API_URL}/ussd/verify-vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to verify vote');
        }
        return result.data;
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