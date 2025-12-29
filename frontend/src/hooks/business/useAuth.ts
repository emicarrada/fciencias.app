'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ServiceLocator } from '@/di/ServiceRegistry';
import { LoginUseCase } from '@/domain/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@/domain/use-cases/auth/RegisterUseCase';
import { LogoutUseCase } from '@/domain/use-cases/auth/LogoutUseCase';
import { LoginRequest, RegisterRequest, User } from '@/types/auth';

/**
 * Custom hook for authentication operations
 * Bridges between UI state and business logic
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    clearError,
    // We'll keep the store actions for now and gradually replace them
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
  } = useAuthStore();

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authService = ServiceLocator.getAuthService();
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    };

    initializeAuth();
  }, [setUser]);

  // New login function using use case
  const login = async (credentials: LoginRequest): Promise<void> => {
    clearError();
    
    try {
      const authService = ServiceLocator.getAuthService();
      const loginUseCase = new LoginUseCase(authService);
      
      const result = await loginUseCase.execute(credentials);
      
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      // For now, fall back to store login to maintain compatibility
      await storeLogin(credentials);
    }
  };

  // New register function using use case
  const register = async (userData: RegisterRequest): Promise<{ message: string; email: string }> => {
    clearError();
    
    try {
      const authService = ServiceLocator.getAuthService();
      const registerUseCase = new RegisterUseCase(authService);
      
      const result = await registerUseCase.execute(userData);
      
      if (result.success) {
        return {
          message: result.message || 'Registration successful',
          email: result.email || userData.email
        };
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // New logout function using use case
  const logout = async (): Promise<void> => {
    try {
      const authService = ServiceLocator.getAuthService();
      const logoutUseCase = new LogoutUseCase(authService);
      
      await logoutUseCase.execute();
      setUser(null);
    } catch (error) {
      // For now, fall back to store logout to maintain compatibility
      storeLogout();
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    setUser,
  };
};