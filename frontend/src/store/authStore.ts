'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';
import { authApi } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const authResponse: AuthResponse = await authApi.login(credentials);
          
          // Guardar tokens en localStorage
          localStorage.setItem('accessToken', authResponse.accessToken);
          localStorage.setItem('refreshToken', authResponse.refreshToken);
          
          set({
            user: authResponse.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const authResponse: AuthResponse = await authApi.register(userData);
          
          // Guardar tokens en localStorage
          localStorage.setItem('accessToken', authResponse.accessToken);
          localStorage.setItem('refreshToken', authResponse.refreshToken);
          
          set({
            user: authResponse.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
