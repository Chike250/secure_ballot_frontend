import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUIStore } from '@/store/useStore';
import { authAPI } from '@/services/api';

export const useAuth = () => {
  const router = useRouter();
  const { 
    token, 
    user, 
    isAuthenticated, 
    requiresMfa,
    setAuth, 
    logout: logoutStore, 
    updateUser,
    setMfaRequired 
  } = useAuthStore();
  
  const { setLoading, setError, addNotification } = useUIStore();
  
  const [isLoading, setIsLoading] = useState(false);

  // Login function
  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login(identifier, password);
      
      if (response.success) {
        const { token, voter, requiresMfa } = response.data;
        
        // Set auth data
        setAuth(token, { ...voter, role: 'voter' }, requiresMfa);
        
        if (requiresMfa) {
          // Redirect to MFA verification page
          router.push('/auth/verify-mfa');
        } else {
          addNotification({
            type: 'success',
            message: 'Login successful!',
          });
          router.push('/dashboard');
        }
        
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin login function
  const adminLogin = async (nin: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.adminLogin(nin, password);
      
      if (response.success) {
        const { token, admin, requiresMfa } = response.data;
        
        // Set auth data
        setAuth(token, { ...admin, role: 'admin' }, requiresMfa);
        
        if (requiresMfa) {
          // Redirect to MFA verification page
          router.push('/auth/verify-mfa');
        } else {
          addNotification({
            type: 'success',
            message: 'Admin login successful!',
          });
          router.push('/admin');
        }
        
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: {
    nin: string;
    vin: string;
    phoneNumber: string;
    dateOfBirth: string;
    password: string;
    fullName: string;
    pollingUnitCode: string;
    state: string;
    gender: string;
    lga: string;
    ward: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.register(data);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Registration successful! Please login to continue.',
        });
        router.push('/auth/login');
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify MFA
  const verifyMFA = async (userId: string, token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.verifyMFA(userId, token);
      
      if (response.success) {
        setMfaRequired(false);
        addNotification({
          type: 'success',
          message: 'MFA verification successful!',
        });
        
        // Redirect based on user role
        if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'MFA verification failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Setup MFA
  const setupMFA = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.setupMFA();
      
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to setup MFA';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Enable MFA
  const enableMFA = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.enableMFA(token);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'MFA enabled successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to enable MFA';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Disable MFA
  const disableMFA = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.disableMFA(token);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'MFA disabled successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to disable MFA';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate backup codes
  const generateBackupCodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.generateBackupCodes();
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Backup codes generated successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate backup codes';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify backup code
  const verifyBackupCode = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.verifyBackupCode(code);
      
      if (response.success) {
        setMfaRequired(false);
        addNotification({
          type: 'success',
          message: 'Backup code verification successful!',
        });
        
        // Redirect based on user role
        if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Backup code verification failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      
      if (response.success) {
        const { token, user: updatedUser } = response.data;
        setAuth(token, updatedUser, requiresMfa);
        return response.data;
      }
    } catch (error: any) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
    } catch (error) {
      // Even if logout API fails, clear local state
      console.error('Logout API failed:', error);
    } finally {
      logoutStore();
      addNotification({
        type: 'success',
        message: 'Logged out successfully!',
      });
      router.push('/');
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (identifier: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.forgotPassword(identifier);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Password reset instructions sent to your phone/email!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset instructions';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.resetPassword(token, newPassword);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Password reset successful! Please login with your new password.',
        });
        router.push('/auth/login');
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // USSD Authentication
  const ussdAuthenticate = async (nin: string, vin: string, phoneNumber: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.ussdAuthenticate(nin, vin, phoneNumber);
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'USSD authentication initiated! Check your phone for the session code.',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'USSD authentication failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify USSD session
  const ussdVerifySession = async (sessionCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.ussdVerifySession(sessionCode);
      
      if (response.success) {
        const { token, voter } = response.data;
        setAuth(token, { ...voter, role: 'voter' });
        
        addNotification({
          type: 'success',
          message: 'USSD session verified successfully!',
        });
        router.push('/dashboard');
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'USSD session verification failed';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    token,
    user,
    isAuthenticated,
    requiresMfa,
    isLoading,

    // Actions
    login,
    adminLogin,
    register,
    logout,
    verifyMFA,
    setupMFA,
    enableMFA,
    disableMFA,
    generateBackupCodes,
    verifyBackupCode,
    refreshToken,
    forgotPassword,
    resetPassword,
    ussdAuthenticate,
    ussdVerifySession,
    updateUser,

    // Computed values
    isVoter: user?.role === 'voter',
    isAdmin: user?.role === 'admin',
    isVerified: user?.isVerified || false,
    isActive: user?.isActive || false,
  };
}; 