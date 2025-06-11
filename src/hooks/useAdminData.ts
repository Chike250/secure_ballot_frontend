import { useState, useEffect, useCallback } from "react";
import { useAdminStore, useUIStore, useAuthStore } from "@/store/useStore";
import { adminAPI } from "@/services/api";

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
    clearAdminData,
  } = useAdminStore();

  const { user } = useAuthStore();
  const { setLoading, setError, addNotification } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Admin User Management
  const fetchAdminUsers = async (
    role?: string,
    status = "active",
    page = 1,
    limit = 50
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getAdminUsers(role, status, page, limit);
      if (response.success) {
        setAdminUsers(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch admin users";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Admin user created successfully!",
        });
        // Refresh admin users list
        await fetchAdminUsers();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create admin user";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Admin user updated successfully!",
        });
        // Refresh admin users list
        await fetchAdminUsers();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update admin user";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Admin user deleted successfully!",
        });
        // Refresh admin users list
        await fetchAdminUsers();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete admin user";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Polling Unit Management
  const fetchPollingUnits = async (
    state?: string,
    lga?: string,
    page = 1,
    limit = 50
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      if (state) {
        const response = await adminAPI.getRegionalPollingUnits(
          state,
          page,
          limit,
          undefined,
          lga
        );
        if (response.success) {
          setPollingUnits(response.data);
          return response.data;
        }
      } else {
        // If no state provided, get from dashboard data
        const response = await adminAPI.getDashboardData();
        if (response.success && response.data.pollingUnits) {
          setPollingUnits(response.data.pollingUnits);
          return response.data.pollingUnits;
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch polling units";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Polling unit created successfully!",
        });
        // Refresh polling units list
        await fetchPollingUnits();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create polling unit";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Polling unit updated successfully!",
        });
        // Refresh polling units list
        await fetchPollingUnits();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update polling unit";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Polling unit deleted successfully!",
        });
        // Refresh polling units list
        await fetchPollingUnits();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete polling unit";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verification Management - wrap with useCallback
  const fetchVerificationRequests = useCallback(
    async (status?: string, page = 1, limit = 50) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await adminAPI.getPendingVerifications(page, limit);
        if (response.success) {
          setVerificationRequests(response.data);
          return response.data;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch verification requests";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setError, addNotification, setVerificationRequests]
  );

  const approveVerification = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.approveVerification(id);
      if (response.success) {
        addNotification({
          type: "success",
          message: "Verification approved successfully!",
        });
        // Refresh verification requests
        await fetchVerificationRequests();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve verification";
      setError(errorMessage);
      addNotification({
        type: "error",
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
          type: "success",
          message: "Verification rejected successfully!",
        });
        // Refresh verification requests
        await fetchVerificationRequests();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reject verification";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Audit Logs - wrap with useCallback
  const fetchAuditLogs = useCallback(
    async (userId?: string, actionType?: string, page = 1, limit = 50) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await adminAPI.getAuditLogs(
          userId,
          actionType,
          page,
          limit
        );
        if (response.success) {
          setAuditLogs(response.data);
          return response.data;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch audit logs";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setError, addNotification, setAuditLogs]
  );

  // System Statistics - wrap with useCallback to prevent infinite loops
  const fetchSystemStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Get statistics from dashboard API instead
      const response = await adminAPI.getDashboardData();
      if (response.success && response.data.systemStatistics) {
        setSystemStatistics(response.data.systemStatistics);
        return response.data.systemStatistics;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch system statistics";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [setError, addNotification, setSystemStatistics]);

  // Security - wrap with useCallback
  const fetchSuspiciousActivities = useCallback(
    async (page = 1, limit = 50) => {
      try {
        setIsLoading(true);
        setError(null);
        // Get suspicious activities from dashboard API or security logs
        const response = await adminAPI.getDashboardData();
        if (response.success && response.data.suspiciousActivities) {
          setSuspiciousActivities(response.data.suspiciousActivities);
          return response.data.suspiciousActivities;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch suspicious activities";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setError, addNotification, setSuspiciousActivities]
  );

  // User blocking functionality not available in current API
  const blockUser = async (userId: string, reason: string) => {
    throw new Error("Block user functionality not available");
  };

  const unblockUser = async (userId: string) => {
    throw new Error("Unblock user functionality not available");
  };

  // System Settings Management (Local Storage Only - No API Available)
  const updateSystemSettings = async (settings: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Store in localStorage since no API endpoint exists for system settings
      localStorage.setItem("admin-system-settings", JSON.stringify(settings));

      addNotification({
        type: "success",
        message: "System settings updated successfully!",
      });
      return { success: true, data: settings };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update system settings";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemSettings = async () => {
    try {
      // Get from localStorage since no API endpoint exists for system settings
      const settings = localStorage.getItem("admin-system-settings");
      return settings ? JSON.parse(settings) : null;
    } catch (error: any) {
      console.error("Failed to get system settings:", error);
      return null;
    }
  };

  // Combined Dashboard Data Fetch - wrap with useCallback
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardData();
      if (response.success) {
        // Update all state with the combined data
        const data = response.data;
        if (data.adminUsers) setAdminUsers(data.adminUsers);
        if (data.pollingUnits) setPollingUnits(data.pollingUnits);
        if (data.verificationRequests)
          setVerificationRequests(data.verificationRequests);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.systemStatistics) setSystemStatistics(data.systemStatistics);
        if (data.suspiciousActivities)
          setSuspiciousActivities(data.suspiciousActivities);

        addNotification({
          type: "success",
          message: "Dashboard data loaded successfully!",
        });
        return data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load dashboard data";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [
    setError,
    addNotification,
    setAdminUsers,
    setPollingUnits,
    setVerificationRequests,
    setAuditLogs,
    setSystemStatistics,
    setSuspiciousActivities,
  ]);

  // Lightweight refresh for real-time data
  const refreshCriticalData = async () => {
    try {
      setError(null);
      await Promise.all([fetchSystemStatistics(), fetchSuspiciousActivities()]);
    } catch (error: any) {
      console.error("Failed to refresh critical data:", error);
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
          type: "success",
          message: "Election created successfully!",
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create election";
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addCandidateToElection = async (
    electionId: string,
    data: {
      fullName: string;
      partyCode: string;
      partyName: string;
      bio?: string;
      photoUrl?: string;
      position?: string;
      manifesto?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.addCandidateToElection(electionId, data);
      if (response.success) {
        addNotification({
          type: "success",
          message: "Candidate added successfully!",
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add candidate";
      setError(errorMessage);
      addNotification({
        type: "error",
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
    totalAdminUsers: adminUsers?.length || 0,
    totalPollingUnits: pollingUnits?.length || 0,
    pendingVerifications: Array.isArray(verificationRequests)
      ? verificationRequests.filter((req) => req.status === "pending").length
      : 0,
    totalSuspiciousActivities: suspiciousActivities?.length || 0,
  };
};
