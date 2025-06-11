import axios from "axios";
import { useAuthStore } from "@/store/useStore";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a separate instance for refresh token calls to avoid circular dependency
const refreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token using the separate API instance
        const token = useAuthStore.getState().token;
        const refreshResponse = await refreshApi.post(
          "/auth/refresh-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (refreshResponse.data.success) {
          const { token: newToken, user } = refreshResponse.data.data;
          useAuthStore.getState().validateAndSetAuth(newToken, user);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // If it's still 401 after refresh attempt, logout
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

// Auth API - Updated with new OTP flow and admin login
export const authAPI = {
  // NEW: Voter OTP Authentication Flow
  requestVoterLogin: async (nin: string, vin: string) => {
    const response = await api.post("/auth/voter/request-login", { nin, vin });
    return response.data;
  },

  verifyVoterOTP: async (userId: string, otpCode: string) => {
    const response = await api.post("/auth/voter/verify-otp", {
      userId,
      otpCode,
    });
    return response.data;
  },

  resendVoterOTP: async (userId: string) => {
    const response = await api.post("/auth/voter/resend-otp", { userId });
    return response.data;
  },

  // NEW: Admin login with NIN and password (no OTP)
  adminLogin: async (nin: string, password: string) => {
    const response = await api.post("/auth/admin-login", { nin, password });
    return response.data;
  },

  // DEPRECATED: Legacy login methods (keep for backward compatibility for now)
  login: async (identifier: string, password: string) => {
    const response = await api.post("/auth/login", {
      nin: identifier,
      vin: password,
    });
    return response.data;
  },

  register: async (data: {
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
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  verifyMFA: async (userId: string, token: string) => {
    const response = await api.post("/auth/verify-mfa", { userId, token });
    return response.data;
  },

  setupMFA: async () => {
    const response = await api.post("/auth/setup-mfa");
    return response.data;
  },

  enableMFA: async (token: string) => {
    const response = await api.post("/auth/enable-mfa", { token });
    return response.data;
  },

  disableMFA: async (token: string) => {
    const response = await api.post("/auth/disable-mfa", { token });
    return response.data;
  },

  generateBackupCodes: async () => {
    const response = await api.post("/auth/generate-backup-codes");
    return response.data;
  },

  verifyBackupCode: async (code: string) => {
    const response = await api.post("/auth/verify-backup-code", { code });
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  forgotPassword: async (identifier: string) => {
    const response = await api.post("/auth/forgot-password", { identifier });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },

  // USSD Authentication
  ussdAuthenticate: async (nin: string, vin: string, phoneNumber: string) => {
    const response = await api.post("/auth/ussd/authenticate", {
      nin,
      vin,
      phoneNumber,
    });
    return response.data;
  },

  ussdVerifySession: async (sessionCode: string) => {
    const response = await api.post("/auth/ussd/verify-session", {
      sessionCode,
    });
    return response.data;
  },
};

// Voter API
export const voterAPI = {
  getProfile: async () => {
    const response = await api.get("/voter/profile");
    return response.data;
  },

  updateProfile: async (data: {
    phoneNumber?: string;
    state?: string;
    lga?: string;
    ward?: string;
  }) => {
    const response = await api.put("/voter/profile", data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put("/voter/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getPollingUnit: async () => {
    const response = await api.get("/voter/polling-unit");
    return response.data;
  },

  getPollingUnits: async (page = 1, limit = 10) => {
    const response = await api.get("/voter/polling-units", {
      params: { page, limit },
    });
    return response.data;
  },

  getPollingUnitById: async (id: string) => {
    const response = await api.get(`/voter/polling-units/${id}`);
    return response.data;
  },

  getNearbyPollingUnits: async (
    latitude: number,
    longitude: number,
    radius = 5
  ) => {
    const response = await api.get("/voter/polling-units/nearby", {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },

  getVerificationStatus: async () => {
    const response = await api.get("/voter/verification-status");
    return response.data;
  },

  submitVerification: async (data: any) => {
    const response = await api.post("/voter/submit-verification", data);
    return response.data;
  },

  getEligibility: async (electionId: string) => {
    const response = await api.get(`/voter/eligibility/${electionId}`);
    return response.data;
  },

  getVoteHistory: async (page = 1, limit = 10) => {
    const response = await api.get("/voter/vote-history", {
      params: { page, limit },
    });
    return response.data;
  },

  getVotingHistory: async (page = 1, limit = 10) => {
    const response = await api.get("/voter/voting-history", {
      params: { page, limit },
    });
    return response.data;
  },

  verifyVote: async (receiptCode: string) => {
    const response = await api.get(`/voter/verify-vote/${receiptCode}`);
    return response.data;
  },

  reportVoteIssue: async (data: {
    voteId: string;
    issueType: "technical" | "fraud" | "coercion" | "other";
    description: string;
  }) => {
    const response = await api.post("/voter/report-vote-issue", data);
    return response.data;
  },

  verifyIdentity: async (data: any) => {
    const response = await api.post("/voter/verify-identity", data);
    return response.data;
  },

  verifyAddress: async (data: any) => {
    const response = await api.post("/voter/verify-address", data);
    return response.data;
  },

  deactivateAccount: async () => {
    const response = await api.post("/voter/deactivate-account");
    return response.data;
  },

  // NEW: Comprehensive dashboard endpoint
  getDashboard: async (
    electionId: string,
    options?: {
      userId?: string;
      includeRealTime?: boolean;
      includeRegionalBreakdown?: boolean;
    }
  ) => {
    const response = await api.get(`/voter/dashboard/${electionId}`, {
      params: options,
    });
    return response.data;
  },
};

// Election API
export const electionAPI = {
  getElections: async (
    status = "active",
    type?: string,
    page = 1,
    limit = 10
  ) => {
    const response = await api.get("public/elections", {
      params: { status, type, page, limit },
    });
    return response.data;
  },

  getElectionDetails: async (id: string) => {
    const response = await api.get(`/elections/${id}`);
    return response.data;
  },

  // New comprehensive dashboard endpoint
  getElectionDashboard: async (electionId: string) => {
    const response = await api.get(`/elections/${electionId}/dashboard`);
    return response.data;
  },

  getCandidates: async (
    electionId: string,
    search?: string,
    page = 1,
    limit = 50
  ) => {
    const response = await api.get(`/elections/${electionId}/candidates`, {
      params: { search, page, limit },
    });
    return response.data;
  },

  castVote: async (electionId: string, candidateId: string) => {
    const response = await api.post(`/elections/${electionId}/vote`, {
      candidateId,
    });
    return response.data;
  },

  getVotingStatus: async (electionId: string) => {
    const response = await api.get(`/elections/${electionId}/voting-status`);
    return response.data;
  },

  getOfflinePackage: async (electionId: string) => {
    const response = await api.get(`/elections/${electionId}/offline-package`);
    return response.data;
  },

  submitOfflineVotes: async (electionId: string, data: any) => {
    const response = await api.post(
      `/elections/${electionId}/submit-offline`,
      data
    );
    return response.data;
  },

  verifyOfflineVote: async (electionId: string, receiptCode: string) => {
    const response = await api.get(
      `/elections/${electionId}/offline-votes/${receiptCode}`
    );
    return response.data;
  },

  // Admin endpoints
  createElection: async (data: any) => {
    const response = await api.post("/elections", data);
    return response.data;
  },

  updateElection: async (id: string, data: any) => {
    const response = await api.put(`/elections/${id}`, data);
    return response.data;
  },

  deleteElection: async (id: string) => {
    const response = await api.delete(`/elections/${id}`);
    return response.data;
  },

  addCandidate: async (electionId: string, data: any) => {
    const response = await api.post(
      `/elections/${electionId}/candidates`,
      data
    );
    return response.data;
  },

  updateCandidate: async (
    electionId: string,
    candidateId: string,
    data: any
  ) => {
    const response = await api.put(
      `/elections/${electionId}/candidates/${candidateId}`,
      data
    );
    return response.data;
  },

  deleteCandidate: async (electionId: string, candidateId: string) => {
    const response = await api.delete(
      `/elections/${electionId}/candidates/${candidateId}`
    );
    return response.data;
  },

  getElectionResults: async (electionId: string) => {
    const response = await api.get(`/elections/${electionId}/results`);
    return response.data;
  },
};

// Results API
export const resultsAPI = {
  getLiveResults: async (electionId: string) => {
    const response = await api.get(`/results/live/${electionId}`);
    return response.data;
  },

  getStatistics: async (electionId: string) => {
    const response = await api.get(`/results/statistics/${electionId}`);
    return response.data;
  },

  getDetailedResults: async (
    electionId: string,
    includePollingUnitBreakdown = false
  ) => {
    const response = await api.get(`/results/elections/${electionId}`, {
      params: { includePollingUnitBreakdown },
    });
    return response.data;
  },

  getLiveStatistics: async () => {
    const response = await api.get("/results/live");
    return response.data;
  },

  getRegionalResults: async (electionId: string, region?: string) => {
    const response = await api.get(`/results/region/${electionId}`, {
      params: region ? { region } : {},
    });
    return response.data;
  },

  getElectionStatistics: async (electionId: string) => {
    const response = await api.get(
      `/results/elections/${electionId}/statistics`
    );
    return response.data;
  },

  getRealTimeResults: async (electionId: string) => {
    const response = await api.get(`/results/live/${electionId}`);
    return response.data;
  },

  getRegionalBreakdown: async (electionId: string, region: string) => {
    const response = await api.get(
      `/results/elections/${electionId}/regions/${region}`
    );
    return response.data;
  },

  getAllElectionResults: async () => {
    const response = await api.get("/results/elections");
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Admin User Management
  getAdminUsers: async (
    role?: string,
    status = "active",
    page = 1,
    limit = 50
  ) => {
    const response = await api.get("/admin/users", {
      params: { role, status, page, limit },
    });
    return response.data;
  },

  createAdminUser: async (data: {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post("/admin/users", data);
    return response.data;
  },

  updateAdminUser: async (id: string, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteAdminUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Polling Unit Management
  getPollingUnits: async (
    state?: string,
    lga?: string,
    page = 1,
    limit = 50
  ) => {
    const response = await api.get("/admin/polling-units", {
      params: { state, lga, page, limit },
    });
    return response.data;
  },

  createPollingUnit: async (data: any) => {
    const response = await api.post("/admin/polling-units", data);
    return response.data;
  },

  updatePollingUnit: async (id: string, data: any) => {
    const response = await api.put(`/admin/polling-units/${id}`, data);
    return response.data;
  },

  deletePollingUnit: async (id: string) => {
    const response = await api.delete(`/admin/polling-units/${id}`);
    return response.data;
  },

  // Verification Management
  getVerificationRequests: async (status?: string, page = 1, limit = 50) => {
    const response = await api.get("/admin/verification-requests", {
      params: { status, page, limit },
    });
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async (
    userId?: string,
    actionType?: string,
    page = 1,
    limit = 50
  ) => {
    const response = await api.get("/admin/audit-logs", {
      params: { userId, actionType, page, limit },
    });
    return response.data;
  },

  // Combined Dashboard Data (single API call)
  getDashboardData: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  // Election Management
  createElection: async (data: {
    electionName: string;
    electionType: string;
    startDate: string;
    endDate: string;
    description?: string;
    eligibilityRules?: object;
  }) => {
    const response = await api.post("/admin/elections", data);
    return response.data;
  },

  addCandidateToElection: async (
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
    const response = await api.post(
      `/admin/elections/${electionId}/candidates`,
      data
    );
    return response.data;
  },

  // Register a new voter (admin only)
  registerVoter: async (data: {
    nin: string;
    vin: string;
    phoneNumber: string;
    dateOfBirth: string;
    fullName: string;
    pollingUnitCode: string;
    state: string;
    gender: string;
    lga: string;
    ward: string;
    autoVerify?: boolean;
  }) => {
    const response = await api.post("/admin/register-voter", data);
    return response.data;
  },

  // Get pending verification requests
  getPendingVerifications: async (page = 1, limit = 50) => {
    const response = await api.get("/admin/pending-verifications", {
      params: { page, limit },
    });
    return response.data;
  },

  // Approve verification request
  approveVerification: async (id: string, notes?: string) => {
    const response = await api.post(`/admin/approve-verification/${id}`, {
      notes,
    });
    return response.data;
  },

  // Reject verification request
  rejectVerification: async (id: string, reason: string) => {
    const response = await api.post(`/admin/reject-verification/${id}`, {
      reason,
    });
    return response.data;
  },

  // Get security logs
  getSecurityLogs: async (
    severity?: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 50
  ) => {
    const response = await api.get("/admin/security-logs", {
      params: { severity, startDate, endDate, page, limit },
    });
    return response.data;
  },

  // Regional polling units management
  getRegionalPollingUnits: async (
    state: string,
    page = 1,
    limit = 50,
    search?: string,
    lga?: string,
    ward?: string
  ) => {
    const response = await api.get(`/admin/regions/${state}/polling-units`, {
      params: { page, limit, search, lga, ward },
    });
    return response.data;
  },

  // Regional statistics
  getRegionalStatistics: async (state: string) => {
    const response = await api.get(`/admin/regions/${state}/statistics`);
    return response.data;
  },

  // Result verification
  verifyResults: async (electionId: string) => {
    const response = await api.post("/admin/verify-results", {
      electionId,
    });
    return response.data;
  },

  // Publish results
  publishResults: async (electionId: string, publishLevel = "preliminary") => {
    const response = await api.post("/admin/publish-results", {
      electionId,
      publishLevel,
    });
    return response.data;
  },

  // Reject results
  rejectResults: async (electionId: string, reason: string) => {
    const response = await api.post("/admin/reject-results", {
      electionId,
      reason,
    });
    return response.data;
  },

  // Generate encryption keys for election
  generateElectionKeys: async (electionId: string) => {
    const response = await api.post(
      `/admin/elections/${electionId}/generate-keys`
    );
    return response.data;
  },
};

// Public API (no authentication required)
export const publicAPI = {
  getElections: async (
    status = "active",
    type?: string,
    page = 1,
    limit = 10
  ) => {
    const response = await axios.get(`${API_URL}/public/elections`, {
      params: { status, type, page, limit },
    });
    return response.data;
  },

  getPollingUnits: async (
    regionId?: string,
    search?: string,
    page = 1,
    limit = 50
  ) => {
    const response = await axios.get(`${API_URL}/public/polling-units`, {
      params: { regionId, search, page, limit },
    });
    return response.data;
  },

  getPollingUnitById: async (id: string) => {
    const response = await axios.get(`${API_URL}/public/polling-units/${id}`);
    return response.data;
  },

  getNearbyPollingUnits: async (
    latitude: number,
    longitude: number,
    radius = 5,
    limit = 10
  ) => {
    const response = await axios.get(`${API_URL}/public/polling-units/nearby`, {
      params: { latitude, longitude, radius, limit },
    });
    return response.data;
  },
};

export default api;
