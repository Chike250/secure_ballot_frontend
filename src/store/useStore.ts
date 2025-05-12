import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

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

const cookieStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 5/1440 }); // 5 minutes (5/1440 days)
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  },
};

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
      storage: createJSONStorage(() => cookieStorage),
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