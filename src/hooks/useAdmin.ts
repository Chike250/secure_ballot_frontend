import { useCallback } from 'react';
import { adminAPI } from '@/services/api';
import { useUIStore } from '@/store/useStore';

export const useAdmin = () => {
  const { setLoading, setError } = useUIStore();

  const getUsers = useCallback(
    async (role?: string, status = 'active', page = 1, limit = 50) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.getUsers(role, status, page, limit);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch users');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const createUser = useCallback(
    async (data: {
      email: string;
      fullName: string;
      phoneNumber: string;
      password: string;
      role: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.createUser(data);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to create user');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getAuditLogs = useCallback(
    async (params: {
      actionType?: string;
      startDate?: string;
      endDate?: string;
      userId?: string;
      page?: number;
      limit?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.getAuditLogs(params);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch audit logs');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const createElection = useCallback(
    async (data: {
      electionName: string;
      electionType: string;
      startDate: string;
      endDate: string;
      description?: string;
      eligibilityRules?: object;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.createElection(data);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to create election');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getSecurityLogs = useCallback(
    async (params: {
      severity?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.getSecurityLogs(params);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch security logs');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const publishResults = useCallback(
    async (electionId: string, publishLevel = 'preliminary') => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.publishResults(electionId, publishLevel);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to publish results');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    getUsers,
    createUser,
    getAuditLogs,
    createElection,
    getSecurityLogs,
    publishResults,
  };
}; 