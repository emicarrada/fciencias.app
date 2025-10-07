import { IStorageService } from '../interfaces/IStorageService';

/**
 * LocalStorage implementation of IStorageService
 * Uses browser's localStorage for persistence
 */
export class LocalStorageService implements IStorageService {
  private readonly isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  get<T>(key: string): T | null {
    if (!this.isClient) return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage with key "${key}":`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage with key "${key}":`, error);
    }
  }

  remove(key: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage with key "${key}":`, error);
    }
  }

  clear(): void {
    if (!this.isClient) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  has(key: string): boolean {
    if (!this.isClient) return false;
    
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking if key "${key}" exists in localStorage:`, error);
      return false;
    }
  }

  keys(): string[] {
    if (!this.isClient) return [];
    
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }
}