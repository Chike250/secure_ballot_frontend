import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/useStore';
import { authAPI } from '@/src/services/api';
import { useUIStore } from '@/src/store/useStore';

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();
  const { setLoading, setError } = useUIStore();

  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.login(identifier, password);
        setAuth(response.token, response.user);
        router.push('/dashboard');
      } catch (error: any) {
        setError(error.response?.data?.message || 'Login failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router, setAuth, setLoading, setError]
  );

  const register = useCallback(
    async (data: {
      nin: string;
      vin: string;
      phoneNumber: string;
      dateOfBirth: string;
      password: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.register(data);
        setAuth(response.token, response.user);
        router.push('/dashboard');
      } catch (error: any) {
        setError(error.response?.data?.message || 'Registration failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router, setAuth, setLoading, setError]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      storeLogout();
      router.push('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, [router, storeLogout, setLoading, setError]);

  const verifyMFA = useCallback(
    async (userId: string, token: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.verifyMFA(userId, token);
        return response;
      } catch (error: any) {
        setError(error.response?.data?.message || 'MFA verification failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const setupMFA = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.setupMFA();
      return response;
    } catch (error: any) {
      setError(error.response?.data?.message || 'MFA setup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const enableMFA = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.enableMFA(token);
        return response;
      } catch (error: any) {
        setError(error.response?.data?.message || 'MFA enablement failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const disableMFA = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.disableMFA(token);
        return response;
      } catch (error: any) {
        setError(error.response?.data?.message || 'MFA disablement failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.forgotPassword(email);
        return response;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Password reset request failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authAPI.resetPassword(token, newPassword);
        return response;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Password reset failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    verifyMFA,
    setupMFA,
    enableMFA,
    disableMFA,
    forgotPassword,
    resetPassword,
  };
}; 