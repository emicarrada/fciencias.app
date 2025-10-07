import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';

/**
 * Interface for authentication service
 * Handles all authentication-related operations
 */
export interface IAuthService {
  /**
   * Authenticate user with credentials
   */
  login(credentials: LoginRequest): Promise<AuthResponse>;
  
  /**
   * Register a new user
   */
  register(userData: RegisterRequest): Promise<{ message: string; email: string }>;
  
  /**
   * Log out current user
   */
  logout(): Promise<void>;
  
  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<string>;
  
  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean;
}