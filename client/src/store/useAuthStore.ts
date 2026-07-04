import { create } from 'zustand';
import { api } from '../lib/axios';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// Zustand creates a "global store" that any component can read from.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start true while we check if they have a cookie

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // This function pings our backend to see if the user's HTTP-Only cookie is valid.
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If it fails, they are not logged in.
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
