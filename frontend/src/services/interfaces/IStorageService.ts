/**
 * Interface for storage operations
 * Abstracts storage implementation (localStorage, sessionStorage, memory, etc.)
 */
export interface IStorageService {
  /**
   * Get value from storage
   */
  get<T>(key: string): T | null;
  
  /**
   * Set value in storage
   */
  set<T>(key: string, value: T): void;
  
  /**
   * Remove value from storage
   */
  remove(key: string): void;
  
  /**
   * Clear all storage
   */
  clear(): void;
  
  /**
   * Check if key exists in storage
   */
  has(key: string): boolean;
  
  /**
   * Get all keys in storage
   */
  keys(): string[];
}