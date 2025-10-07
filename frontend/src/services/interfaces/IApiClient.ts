/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
}

/**
 * Interface for HTTP client operations
 * Abstracts HTTP implementation (axios, fetch, etc.)
 */
export interface IApiClient {
  /**
   * GET request
   */
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  
  /**
   * POST request
   */
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  
  /**
   * PUT request
   */
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  
  /**
   * DELETE request
   */
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
  
  /**
   * PATCH request
   */
  patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  
  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void;
  
  /**
   * Set authorization header
   */
  setAuthorizationHeader(token: string): void;
  
  /**
   * Remove authorization header
   */
  removeAuthorizationHeader(): void;
}