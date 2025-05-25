import { useCallback } from 'react';
import { useUIStore } from '@/store/useStore';
import { authAPI, voterAPI } from '@/services/api';

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
        const result = await authAPI.login(data.nin, data.password);
        return result;
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
        // Using MFA verification as device verification equivalent
        const result = await authAPI.verifyMFA(data.deviceId, data.verificationCode);
        return result;
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
        // Mobile offline functionality not implemented in current API
        throw new Error('Offline package functionality not available');
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
        // Mobile offline voting not implemented in current API
        throw new Error('Offline voting functionality not available');
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
        const result = await voterAPI.getNearbyPollingUnits(data.latitude, data.longitude, data.radius);
        return result;
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
        // Mobile sync functionality not implemented in current API
        throw new Error('Data sync functionality not available');
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