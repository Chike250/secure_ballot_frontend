import { useState, useEffect } from 'react';
import { useAdminStore, useUIStore, useAuthStore } from '@/store/useStore';
import { adminAPI } from '@/services/api';

export const useAdminData = () => {
  const { 
    adminUsers,
    pollingUnits,
    verificationRequests,
    auditLogs,
    systemStatistics,
    suspiciousActivities,
    setAdminUsers,
    setPollingUnits,
    setVerificationRequests,
    setAuditLogs,
    setSystemStatistics,
    setSuspiciousActivities,
    clearAdminData
  } = useAdminStore();
  
  const { user } = useAuthStore();
  const { setLoading, setError, addNotification } = useUIStore();
  
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Admin User Management
  const fetchAdminUsers = async (role?: string, status = 'active', page = 1, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getAdminUsers(role, status, page, limit);
      if (response.success) {
        setAdminUsers(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch admin users';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminUser = async (data: {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
    role: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.createAdminUser(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Admin user created successfully!',
        });
        // Refresh admin users list
        await fetchAdminUsers();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create admin user';
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

  const updateAdminUser = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.updateAdminUser(id, data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Admin user updated successfully!',
        });
        // Refresh admin users list
        await fetchAdminUsers();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update admin user';
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

  const deleteAdminUser = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.deleteAdminUser(id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Admin user deleted successfully!',
        });
        // Refresh admin users list
        await fetchAdminUsers();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete admin user';
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

  // Polling Unit Management
  const fetchPollingUnits = async (state?: string, lga?: string, page = 1, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getPollingUnits(state, lga, page, limit);
      if (response.success) {
        setPollingUnits(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch polling units';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPollingUnit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.createPollingUnit(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Polling unit created successfully!',
        });
        // Refresh polling units list
        await fetchPollingUnits();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create polling unit';
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

  const updatePollingUnit = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.updatePollingUnit(id, data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Polling unit updated successfully!',
        });
        // Refresh polling units list
        await fetchPollingUnits();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update polling unit';
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

  const deletePollingUnit = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.deletePollingUnit(id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Polling unit deleted successfully!',
        });
        // Refresh polling units list
        await fetchPollingUnits();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete polling unit';
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

  // Verification Management
  const fetchVerificationRequests = async (status?: string, page = 1, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getVerificationRequests(status, page, limit);
      if (response.success) {
        setVerificationRequests(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch verification requests';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveVerification = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.approveVerification(id);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Verification approved successfully!',
        });
        // Refresh verification requests
        await fetchVerificationRequests();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to approve verification';
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

  const rejectVerification = async (id: string, reason: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.rejectVerification(id, reason);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Verification rejected successfully!',
        });
        // Refresh verification requests
        await fetchVerificationRequests();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reject verification';
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

  // Audit Logs
  const fetchAuditLogs = async (userId?: string, actionType?: string, page = 1, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getAuditLogs(userId, actionType, page, limit);
      if (response.success) {
        setAuditLogs(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch audit logs';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // System Statistics
  const fetchSystemStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getSystemStatistics();
      if (response.success) {
        setSystemStatistics(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch system statistics';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Security
  const fetchSuspiciousActivities = async (page = 1, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getSuspiciousActivities(page, limit);
      if (response.success) {
        setSuspiciousActivities(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch suspicious activities';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const blockUser = async (userId: string, reason: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.blockUser(userId, reason);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'User blocked successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to block user';
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

  const unblockUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.unblockUser(userId);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'User unblocked successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to unblock user';
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

  // System Settings Management
  const updateSystemSettings = async (settings: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, store in localStorage as fallback
      // In production, this would call an actual API
      localStorage.setItem('admin-system-settings', JSON.stringify(settings));
      
      addNotification({
        type: 'success',
        message: 'System settings updated successfully!',
      });
      return { success: true, data: settings };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update system settings';
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

  const getSystemSettings = async () => {
    try {
      // For now, get from localStorage as fallback
      // In production, this would call an actual API
      const settings = localStorage.getItem('admin-system-settings');
      return settings ? JSON.parse(settings) : null;
    } catch (error: any) {
      console.error('Failed to get system settings:', error);
      return null;
    }
  };

  // Combined Dashboard Data Fetch
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardData();
      if (response.success) {
        // Update all state with the combined data
        const data = response.data;
        if (data.adminUsers) setAdminUsers(data.adminUsers);
        if (data.pollingUnits) setPollingUnits(data.pollingUnits);
        if (data.verificationRequests) setVerificationRequests(data.verificationRequests);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.systemStatistics) setSystemStatistics(data.systemStatistics);
        if (data.suspiciousActivities) setSuspiciousActivities(data.suspiciousActivities);
        
        addNotification({
          type: 'success',
          message: 'Dashboard data loaded successfully!',
        });
        return data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data';
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

  // Lightweight refresh for real-time data
  const refreshCriticalData = async () => {
    try {
      setError(null);
      await Promise.all([
        fetchSystemStatistics(),
        fetchSuspiciousActivities(),
      ]);
    } catch (error: any) {
      console.error('Failed to refresh critical data:', error);
    }
  };

  // Election Management
  const createElection = async (data: {
    electionName: string;
    electionType: string;
    startDate: string;
    endDate: string;
    description?: string;
    eligibilityRules?: object;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.createElection(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Election created successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create election';
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

  const addCandidateToElection = async (electionId: string, data: {
    fullName: string;
    partyCode: string;
    partyName: string;
    bio?: string;
    photoUrl?: string;
    position?: string;
    manifesto?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.addCandidateToElection(electionId, data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Candidate added successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add candidate';
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

  // Auto-fetch data on mount if user is admin
  useEffect(() => {
    if (isAdmin) {
      fetchSystemStatistics();
      fetchVerificationRequests();
      fetchSuspiciousActivities();
    }
  }, [isAdmin]);

  return {
    // State
    adminUsers,
    pollingUnits,
    verificationRequests,
    auditLogs,
    systemStatistics,
    suspiciousActivities,
    isLoading,
    isAdmin,

    // Admin User Management
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,

    // Polling Unit Management
    fetchPollingUnits,
    createPollingUnit,
    updatePollingUnit,
    deletePollingUnit,

    // Verification Management
    fetchVerificationRequests,
    approveVerification,
    rejectVerification,

    // Audit & Security
    fetchAuditLogs,
    fetchSystemStatistics,
    fetchSuspiciousActivities,
    blockUser,
    unblockUser,

    // System Settings
    updateSystemSettings,
    getSystemSettings,

    // Election Management
    createElection,
    addCandidateToElection,

    // Combined Data Loading
    fetchDashboardData,
    refreshCriticalData,

    // Utility
    clearAdminData,

    // Computed values
    totalAdminUsers: adminUsers.length,
    totalPollingUnits: pollingUnits.length,
    pendingVerifications: verificationRequests.filter(req => req.status === 'pending').length,
    totalSuspiciousActivities: suspiciousActivities.length,
  };
}; 