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

// Admin API
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
};

export default api; 