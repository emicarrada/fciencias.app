import axios, { AxiosInstance, AxiosError } from 'axios';
import { IApiClient, RequestConfig } from '../interfaces/IApiClient';
import { IStorageService } from '../interfaces/IStorageService';

/**
 * Axios implementation of IApiClient
 * Handles HTTP requests with automatic token management
 */
export class AxiosApiClient implements IApiClient {
  private instance: AxiosInstance;
  private storageService: IStorageService;

  constructor(baseURL: string, storageService: IStorageService) {
    this.storageService = storageService;
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.storageService.get<string>('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = this.storageService.get<string>('refreshToken');
            if (refreshToken) {
              const response = await this.instance.post('/auth/refresh', { refreshToken });
              const { accessToken } = response.data;
              
              this.storageService.set('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, clear tokens and redirect to login
            this.storageService.remove('accessToken');
            this.storageService.remove('refreshToken');
            
            // Only redirect if we're in the browser
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.instance.defaults.headers, headers);
  }

  setAuthorizationHeader(token: string): void {
    this.instance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  removeAuthorizationHeader(): void {
    delete this.instance.defaults.headers.Authorization;
  }
}