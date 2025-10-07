import { LocalStorageService } from '@/services/implementations/LocalStorageService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      const result = service.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should return parsed value for existing key', () => {
      const testData = { name: 'test', value: 123 };
      localStorageMock.setItem('test-key', JSON.stringify(testData));
      
      const result = service.get('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for invalid JSON', () => {
      localStorageMock.setItem('invalid-json', 'invalid json string');
      
      const result = service.get('invalid-json');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store value as JSON string', () => {
      const testData = { name: 'test', value: 123 };
      
      service.set('test-key', testData);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    it('should handle storage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });
      
      // Should not throw
      expect(() => service.set('test', 'value')).not.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove item from storage', () => {
      service.remove('test-key');
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('clear', () => {
    it('should clear all storage', () => {
      service.clear();
      
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      localStorageMock.setItem('existing-key', 'value');
      
      const result = service.has('existing-key');
      expect(result).toBe(true);
    });

    it('should return false for non-existent key', () => {
      const result = service.has('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('keys', () => {
    it('should return all storage keys', () => {
      localStorageMock.setItem('key1', 'value1');
      localStorageMock.setItem('key2', 'value2');
      
      const result = service.keys();
      expect(result).toEqual(['key1', 'key2']);
    });
  });
});