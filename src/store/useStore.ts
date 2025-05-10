import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  fullName?: string;
  role: 'voter' | 'admin';
  nin?: string;
  vin?: string;
  phoneNumber?: string;
  isVerified: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface ElectionState {
  currentElection: any | null;
  elections: any[];
  setCurrentElection: (election: any) => void;
  setElections: (elections: any[]) => void;
}

export const useElectionStore = create<ElectionState>()(
  persist(
    (set) => ({
      currentElection: null,
      elections: [],
      setCurrentElection: (election) => set({ currentElection: election }),
      setElections: (elections) => set({ elections }),
    }),
    {
      name: 'election-storage',
    }
  )
);

interface UIState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
})); 