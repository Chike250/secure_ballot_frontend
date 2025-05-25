import axios from 'axios';
import { useAuthStore } from '@/store/useStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
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
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (identifier: string, password: string) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  },

  adminLogin: async (email: string, password: string) => {
    const response = await api.post('/auth/admin-login', { email, password });
    return response.data;
  },

  register: async (data: {
    nin: string;
    vin: string;
    phoneNumber: string;
    dateOfBirth: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  verifyMFA: async (userId: string, token: string) => {
    const response = await api.post('/auth/verify-mfa', { userId, token });
    return response.data;
  },

  setupMFA: async () => {
    const response = await api.post('/auth/setup-mfa');
    return response.data;
  },

  enableMFA: async (token: string) => {
    const response = await api.post('/auth/enable-mfa', { token });
    return response.data;
  },

  disableMFA: async (token: string) => {
    const response = await api.post('/auth/disable-mfa', { token });
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

// Voter API
export const voterAPI = {
  getProfile: async () => {
    const response = await api.get('/voter/profile');
    return response.data;
  },

  updateProfile: async (data: { phoneNumber?: string }) => {
    const response = await api.put('/voter/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/voter/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getPollingUnit: async () => {
    const response = await api.get('/voter/polling-unit');
    return response.data;
  },

  getVotingHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/voter/voting-history', {
      params: { page, limit },
    });
    return response.data;
  },

  getEligibility: async (electionId: string) => {
    const response = await api.get(`/voter/eligibility/${electionId}`);
    return response.data;
  },

  verifyVote: async (receiptCode: string) => {
    const response = await api.get(`/voter/verify-vote/${receiptCode}`);
    return response.data;
  },

  reportVoteIssue: async (data: {
    voteId: string;
    issueType: 'technical' | 'fraud' | 'coercion' | 'other';
    description: string;
  }) => {
    const response = await api.post('/voter/report-vote-issue', data);
    return response.data;
  },
};

// Election API
export const electionAPI = {
  getElections: async (status = 'active', type?: string, page = 1, limit = 10) => {
    const response = await api.get('/elections', {
      params: { status, type, page, limit },
    });
    return response.data;
  },

  getElectionDetails: async (id: string) => {
    const response = await api.get(`/elections/${id}`);
    return response.data;
  },

  getCandidates: async (electionId: string, search?: string, page = 1, limit = 50) => {
    const response = await api.get(`/elections/${electionId}/candidates`, {
      params: { search, page, limit },
    });
    return response.data;
  },

  castVote: async (electionId: string, candidateId: string) => {
    const response = await api.post(`/elections/${electionId}/vote`, { candidateId });
    return response.data;
  },

  getVotingStatus: async (electionId: string) => {
    const response = await api.get(`/elections/${electionId}/voting-status`);
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

  getDetailedResults: async (electionId: string, includePollingUnitBreakdown = false) => {
    const response = await api.get(`/results/elections/${electionId}`, {
      params: { includePollingUnitBreakdown },
    });
    return response.data;
  },

  getLiveStatistics: async () => {
    const response = await api.get('/results/live');
    return response.data;
  },

  getRegionalResults: async (electionId: string, regionId?: string) => {
    const response = await api.get(`/results/region/${electionId}`, {
      params: { regionId },
    });
    return response.data;
  },
};

// Mobile API
export const mobileAPI = {
  login: async (data: {
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
    const response = await api.post('/mobile/auth/login', data);
    return response.data;
  },

  verifyDevice: async (data: { deviceId: string; verificationCode: string }) => {
    const response = await api.post('/mobile/auth/verify-device', data);
    return response.data;
  },

  getOfflinePackage: async (electionId: string) => {
    const response = await api.get(`/mobile/vote/offline-package?electionId=${electionId}`);
    return response.data;
  },

  submitOfflineVotes: async (electionId: string, data: {
    encryptedVotes: Array<{
      candidateId: string;
      encryptedVote: string;
    }>;
    signature: string;
  }) => {
    const response = await api.post(`/mobile/vote/submit-offline/${electionId}`, data);
    return response.data;
  },

  getNearbyPollingUnits: async (data: {
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
      ...(data.radius && { radius: data.radius.toString() }),
      ...(data.limit && { limit: data.limit.toString() }),
    });
    const response = await api.get(`/mobile/polling-units/nearby?${queryParams}`);
    return response.data;
  },

  submitBiometricData: async (data: FormData) => {
    const response = await api.post('/mobile/voter/biometric-capture', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  syncData: async (data: {
    type: 'elections' | 'candidates' | 'pollingUnits' | 'profile';
    data?: object;
  }) => {
    const response = await api.post('/mobile/sync', data);
    return response.data;
  },
};

// USSD API
export const ussdAPI = {
  startSession: async (data: { nin: string; vin: string; phoneNumber: string }) => {
    const response = await api.post('/ussd/start', data);
    return response.data;
  },

  castVote: async (data: { sessionCode: string; electionId: string; candidateId: string }) => {
    const response = await api.post('/ussd/vote', data);
    return response.data;
  },

  getSessionStatus: async (sessionCode: string) => {
    const response = await api.get(`/ussd/session-status?sessionCode=${sessionCode}`);
    return response.data;
  },

  verifyVote: async (data: { receiptCode: string; phoneNumber: string }) => {
    const response = await api.post('/ussd/verify-vote', data);
    return response.data;
  },
};

// Admin API (expanded)
export const adminAPI = {
  getUsers: async (role?: string, status = 'active', page = 1, limit = 50) => {
    const response = await api.get('/admin/users', {
      params: { role, status, page, limit },
    });
    return response.data;
  },

  createUser: async (data: {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  getAuditLogs: async (params: {
    actionType?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  createElection: async (data: {
    electionName: string;
    electionType: string;
    startDate: string;
    endDate: string;
    description?: string;
    eligibilityRules?: object;
  }) => {
    const response = await api.post('/admin/elections', data);
    return response.data;
  },

  getSecurityLogs: async (params: {
    severity?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/security-logs', { params });
    return response.data;
  },

  publishResults: async (electionId: string, publishLevel = 'preliminary') => {
    const response = await api.post('/admin/results/publish', {
      electionId,
      publishLevel,
    });
    return response.data;
  },

  getUser: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, data: {
    fullName?: string;
    phoneNumber?: string;
    role?: string;
    status?: 'active' | 'inactive' | 'suspended';
  }) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getElection: async (electionId: string) => {
    const response = await api.get(`/admin/elections/${electionId}`);
    return response.data;
  },

  updateElection: async (electionId: string, data: {
    electionName?: string;
    electionType?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    eligibilityRules?: object;
    status?: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  }) => {
    const response = await api.put(`/admin/elections/${electionId}`, data);
    return response.data;
  },

  deleteElection: async (electionId: string) => {
    const response = await api.delete(`/admin/elections/${electionId}`);
    return response.data;
  },

  getAdminElections: async (params: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/elections', { params });
    return response.data;
  },

  addCandidate: async (electionId: string, data: {
    name: string;
    party: string;
    bio?: string;
    photo?: string;
  }) => {
    const response = await api.post(`/admin/elections/${electionId}/candidates`, data);
    return response.data;
  },

  getCandidate: async (electionId: string, candidateId: string) => {
    const response = await api.get(`/admin/elections/${electionId}/candidates/${candidateId}`);
    return response.data;
  },

  updateCandidate: async (electionId: string, candidateId: string, data: {
    name?: string;
    party?: string;
    bio?: string;
    photo?: string;
    status?: 'active' | 'withdrawn' | 'disqualified';
  }) => {
    const response = await api.put(`/admin/elections/${electionId}/candidates/${candidateId}`, data);
    return response.data;
  },

  removeCandidate: async (electionId: string, candidateId: string) => {
    const response = await api.delete(`/admin/elections/${electionId}/candidates/${candidateId}`);
    return response.data;
  },

  getKeyManagement: async () => {
    const response = await api.get('/admin/key-management');
    return response.data;
  },

  requestKeyCeremony: async (electionId: string) => {
    const response = await api.post('/admin/key-ceremony/request', { electionId });
    return response.data;
  },

  submitKeyShare: async (data: {
    electionId: string;
    keyShare: string;
    signature: string;
  }) => {
    const response = await api.post('/admin/key-ceremony/submit-share', data);
    return response.data;
  },

  requestResultsCalculation: async (electionId: string) => {
    const response = await api.post('/admin/results/calculate', { electionId });
    return response.data;
  },

  finalizeResults: async (electionId: string, publishLevel = 'preliminary') => {
    const response = await api.post('/admin/results/publish', {
      electionId,
      publishLevel,
    });
    return response.data;
  },
};

export default api; 