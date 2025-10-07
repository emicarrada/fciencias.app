import { IStorageService } from '../interfaces/IStorageService';

/**
 * In-memory implementation of IStorageService
 * Useful for testing and server-side rendering
 */
export class MemoryStorageService implements IStorageService {
  private storage = new Map<string, string>();

  get<T>(key: string): T | null {
    try {
      const item = this.storage.get(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing item from memory storage with key "${key}":`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in memory storage with key "${key}":`, error);
    }
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }

  keys(): string[] {
    return Array.from(this.storage.keys());
  }
}