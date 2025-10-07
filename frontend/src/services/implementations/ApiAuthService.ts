import { IAuthService } from '../interfaces/IAuthService';
import { IApiClient } from '../interfaces/IApiClient';
import { IStorageService } from '../interfaces/IStorageService';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';

/**
 * API implementation of IAuthService
 * Handles authentication through HTTP API calls
 */
export class ApiAuthService implements IAuthService {
  constructor(
    private apiClient: IApiClient,
    private storageService: IStorageService
  ) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens
      if (response.accessToken) {
        this.storageService.set('accessToken', response.accessToken);
      }
      if (response.refreshToken) {
        this.storageService.set('refreshToken', response.refreshToken);
      }
      
      // Store user data
      if (response.user) {
        this.storageService.set('user', response.user);
      }
      
      return response;
    } catch (error) {
      // Clear any existing tokens on login failure
      this.storageService.remove('accessToken');
      this.storageService.remove('refreshToken');
      this.storageService.remove('user');
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<{ message: string; email: string }> {
    return this.apiClient.post<{ message: string; email: string }>('/auth/register', userData);
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate server-side session
      await this.apiClient.post('/auth/logout', {});
    } catch (error) {
      // Continue with local logout even if server call fails
      console.error('Server logout failed:', error);
    } finally {
      // Always clear local storage
      this.storageService.remove('accessToken');
      this.storageService.remove('refreshToken');
      this.storageService.remove('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.storageService.get<User>('user');
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.storageService.get<string>('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.apiClient.post<{ accessToken: string }>('/auth/refresh', {
        refreshToken
      });
      
      const { accessToken } = response;
      this.storageService.set('accessToken', accessToken);
      
      return accessToken;
    } catch (error) {
      // Clear tokens if refresh fails
      this.storageService.remove('accessToken');
      this.storageService.remove('refreshToken');
      this.storageService.remove('user');
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const user = this.storageService.get<User>('user');
    const token = this.storageService.get<string>('accessToken');
    return !!(user && token);
  }
}