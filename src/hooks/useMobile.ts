import { useCallback } from 'react';
import { useUIStore } from '@/store/useStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useMobile = () => {
  const { setLoading, setError } = useUIStore();

  const login = useCallback(
    async (data: {
      nin: string;
      vin: string;
      password: string;
      deviceInfo: {
        deviceId: string;
        deviceModel: string;
        osVersion: string;
        appVersion: string;
      };
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/mobile/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Login failed');
        }
        return result.data;
      } catch (error: any) {
        setError(error.message || 'Login failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const verifyDevice = useCallback(
    async (data: { deviceId: string; verificationCode: string }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/mobile/auth/verify-device`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Device verification failed');
        }
        return result.data;
      } catch (error: any) {
        setError(error.message || 'Device verification failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getOfflinePackage = useCallback(
    async (electionId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_URL}/mobile/vote/offline-package?electionId=${electionId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to get offline package');
        }
        return result.data;
      } catch (error: any) {
        setError(error.message || 'Failed to get offline package');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const submitOfflineVotes = useCallback(
    async (electionId: string, data: {
      encryptedVotes: Array<{
        candidateId: string;
        encryptedVote: string;
      }>;
      signature: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/mobile/vote/submit-offline/${electionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to submit offline votes');
        }
        return result.data;
      } catch (error: any) {
        setError(error.message || 'Failed to submit offline votes');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getNearbyPollingUnits = useCallback(
    async (data: {
      latitude: number;
      longitude: number;
      radius?: number;
      limit?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams({
          latitude: data.latitude.toString(),
          longitude: data.longitude.toString(),
          ...(data.radius && { radius: data.radius.toString() }),
          ...(data.limit && { limit: data.limit.toString() }),
        });
        const response = await fetch(
          `${API_URL}/mobile/polling-units/nearby?${queryParams}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to get nearby polling units');
        }
        return result.data;
      } catch (error: any) {
        setError(error.message || 'Failed to get nearby polling units');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const syncData = useCallback(
    async (data: {
      type: 'elections' | 'candidates' | 'pollingUnits' | 'profile';
      data?: object;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/mobile/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to sync data');
        }
        return result.data;
      } catch (error: any) {
        setError(error.message || 'Failed to sync data');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    login,
    verifyDevice,
    getOfflinePackage,
    submitOfflineVotes,
    getNearbyPollingUnits,
    syncData,
  };
}; 