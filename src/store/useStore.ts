import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  nin?: string;
  vin?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  role: "voter" | "admin";
  isVerified: boolean;
  isActive: boolean;
  dateOfBirth?: string;
  gender?: "Male" | "Female";
  state?: string;
  lga?: string;
  ward?: string;
  pollingUnitCode?: string;
  registrationDate?: string;
  lastLogin?: string;
  // Admin specific fields
  adminRole?:
    | "SystemAdministrator"
    | "ElectoralCommissioner"
    | "SecurityOfficer"
    | "SystemAuditor"
    | "RegionalElectoralOfficer"
    | "ElectionManager"
    | "ResultVerificationOfficer";
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  requiresMfa: boolean;
  isInitialized: boolean;
  setAuth: (token: string, user: User, requiresMfa?: boolean) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setMfaRequired: (required: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  validateAndSetAuth: (
    token: string,
    user: User,
    requiresMfa?: boolean
  ) => void;
}

const cookieStorage = {
  getItem: (name: string) => {
    try {
      const value = Cookies.get(name);
      if (!value) return null;

      // Try to parse the value to ensure it's valid JSON
      JSON.parse(value);
      return value;
    } catch (error) {
      // Remove corrupted cookie
      Cookies.remove(name);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      // Validate that the value is valid JSON before storing
      JSON.parse(value);
      Cookies.set(name, value, {
        expires: 30 / 1440, // 30 minutes (30/1440 days)
        secure: process.env.NODE_ENV === "production", // Only use secure in production
        sameSite: "strict", // Protect against CSRF
      });
    } catch (error) {
      console.error(`Failed to store cookie ${name}:`, error);
    }
  },
  removeItem: (name: string) => {
    try {
      Cookies.remove(name);
    } catch (error) {}
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      requiresMfa: false,
      isInitialized: false,
      setAuth: (token, user, requiresMfa = false) =>
        set({
          token,
          user,
          isAuthenticated: true,
          requiresMfa,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          requiresMfa: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setMfaRequired: (required) => set({ requiresMfa: required }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      validateAndSetAuth: (token, user, requiresMfa = false) =>
        set({
          token,
          user,
          isAuthenticated: true,
          requiresMfa,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

interface Election {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "presidential" | "gubernatorial" | "senate" | "house" | "local";
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  candidates?: any[];
  candidateCount?: number;
  // Voter count fields from API
  registeredVotersCount?: number;
  votesCastCount?: number;
  // Original API field names for backward compatibility
  electionName?: string;
  electionType?: string;
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  image?: string;
  bio?: string;
  manifesto?: string;
  electionId: string;
  votes?: number;
  percentage?: number;
  color?: string;
}

interface ElectionResults {
  electionId: string;
  electionName: string;
  totalVotes: number;
  candidates: Candidate[];
  lastUpdated?: string;
  turnout?: number;
}

interface ElectionState {
  currentElection: Election | null;
  elections: Election[];
  candidates: Candidate[];
  results: ElectionResults | null;
  setCurrentElection: (election: Election) => void;
  setElections: (elections: Election[]) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setResults: (results: ElectionResults) => void;
  clearElectionData: () => void;
}

export const useElectionStore = create<ElectionState>()(
  persist(
    (set) => ({
      currentElection: null,
      elections: [],
      candidates: [],
      results: null,
      setCurrentElection: (election) => set({ currentElection: election }),
      setElections: (elections) => {
        set({ elections });
      },
      setCandidates: (candidates) => set({ candidates }),
      setResults: (results) => set({ results }),
      clearElectionData: () =>
        set({
          currentElection: null,
          candidates: [],
          results: null,
        }),
    }),
    {
      name: "election-storage",
    }
  )
);

interface VotingState {
  hasVoted: { [electionId: string]: string | null }; // Store candidate ID instead of boolean
  votingStatus: { [electionId: string]: any };
  eligibility: { [electionId: string]: any };
  voteReceipts: { [electionId: string]: string };
  setHasVoted: (electionId: string, candidateId: string | null) => void;
  setVotingStatus: (electionId: string, status: any) => void;
  setEligibility: (electionId: string, eligibility: any) => void;
  setVoteReceipt: (electionId: string, receiptCode: string) => void;
  clearVotingData: () => void;
}

export const useVotingStore = create<VotingState>()(
  persist(
    (set) => ({
      hasVoted: {},
      votingStatus: {},
      eligibility: {},
      voteReceipts: {},
      setHasVoted: (electionId, candidateId) =>
        set((state) => ({
          hasVoted: { ...state.hasVoted, [electionId]: candidateId },
        })),
      setVotingStatus: (electionId, status) =>
        set((state) => ({
          votingStatus: { ...state.votingStatus, [electionId]: status },
        })),
      setEligibility: (electionId, eligibility) =>
        set((state) => ({
          eligibility: { ...state.eligibility, [electionId]: eligibility },
        })),
      setVoteReceipt: (electionId, receiptCode) =>
        set((state) => ({
          voteReceipts: { ...state.voteReceipts, [electionId]: receiptCode },
        })),
      clearVotingData: () =>
        set({
          hasVoted: {},
          votingStatus: {},
          eligibility: {},
          voteReceipts: {},
        }),
    }),
    {
      name: "voting-storage",
    }
  )
);

interface UIState {
  isLoading: boolean;
  error: string | null;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  error: null,
  notifications: [],
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

interface PollingUnit {
  id: string;
  pollingUnitName: string;
  pollingUnitCode: string;
  address: string;
  state: string;
  lga: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  registeredVoters?: number;
  assignedOfficer?: string;
  isActive: boolean;
}

interface VoterState {
  profile: User | null;
  pollingUnit: PollingUnit | null;
  verificationStatus: any | null;
  voteHistory: any[];
  setProfile: (profile: User) => void;
  setPollingUnit: (pollingUnit: PollingUnit) => void;
  setVerificationStatus: (status: any) => void;
  setVoteHistory: (history: any[]) => void;
  clearVoterData: () => void;
}

export const useVoterStore = create<VoterState>()(
  persist(
    (set) => ({
      profile: null,
      pollingUnit: null,
      verificationStatus: null,
      voteHistory: [],
      setProfile: (profile) => set({ profile }),
      setPollingUnit: (pollingUnit) => set({ pollingUnit }),
      setVerificationStatus: (status) => set({ verificationStatus: status }),
      setVoteHistory: (history) => set({ voteHistory: history }),
      clearVoterData: () =>
        set({
          profile: null,
          pollingUnit: null,
          verificationStatus: null,
          voteHistory: [],
        }),
    }),
    {
      name: "voter-storage",
    }
  )
);

interface AdminState {
  adminUsers: any[];
  pollingUnits: PollingUnit[];
  verificationRequests: any[];
  auditLogs: any[];
  systemStatistics: any | null;
  suspiciousActivities: any[];
  setAdminUsers: (users: any[]) => void;
  setPollingUnits: (units: PollingUnit[]) => void;
  setVerificationRequests: (requests: any[]) => void;
  setAuditLogs: (logs: any[]) => void;
  setSystemStatistics: (stats: any) => void;
  setSuspiciousActivities: (activities: any[]) => void;
  clearAdminData: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminUsers: [],
      pollingUnits: [],
      verificationRequests: [],
      auditLogs: [],
      systemStatistics: null,
      suspiciousActivities: [],
      setAdminUsers: (users) => set({ adminUsers: users }),
      setPollingUnits: (units) => set({ pollingUnits: units }),
      setVerificationRequests: (requests) =>
        set({ verificationRequests: requests }),
      setAuditLogs: (logs) => set({ auditLogs: logs }),
      setSystemStatistics: (stats) => set({ systemStatistics: stats }),
      setSuspiciousActivities: (activities) =>
        set({ suspiciousActivities: activities }),
      clearAdminData: () =>
        set({
          adminUsers: [],
          pollingUnits: [],
          verificationRequests: [],
          auditLogs: [],
          systemStatistics: null,
          suspiciousActivities: [],
        }),
    }),
    {
      name: "admin-storage",
    }
  )
);
