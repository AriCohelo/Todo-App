import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { secureStorage } from '../secureStorage';

// Mock localStorage with proper store access
let mockStore: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => mockStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStore[key];
  }),
  clear: vi.fn(() => {
    mockStore = {};
  }),
  get length() {
    return Object.keys(mockStore).length;
  },
  key: vi.fn((index: number) => Object.keys(mockStore)[index] || null)
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true
});

// Mock Object.keys to work with localStorage
const originalObjectKeys = Object.keys;
vi.spyOn(Object, 'keys').mockImplementation((obj: any) => {
  if (obj === localStorage) {
    return originalObjectKeys(mockStore);
  }
  return originalObjectKeys(obj);
});

// Mock console methods to test warnings/errors
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock Date for consistent timestamps
const mockTimestamp = 1640995200000; // 2022-01-01T00:00:00.000Z
vi.setSystemTime(new Date(mockTimestamp));

describe('secureStorage', () => {
  beforeEach(() => {
    mockStore = {};
    localStorageMock.clear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setItem', () => {
    it('stores valid data with version, timestamp, and checksum metadata', () => {
      const testData = { name: 'John', age: 30 };
      const result = secureStorage.setItem('user', testData);

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'todo_app_user',
        expect.stringContaining('"data":{"name":"John","age":30}')
      );
      
      const storedValue = localStorageMock.getItem('todo_app_user');
      const parsed = JSON.parse(storedValue!);
      expect(parsed.metadata).toEqual({
        version: '1.0',
        timestamp: mockTimestamp,
        checksum: expect.any(String)
      });
    });

    it('rejects malicious data and invalid inputs', () => {
      const testCases = [
        { data: JSON.parse('{"__proto__": {"isAdmin": true}}'), name: '__proto__ pollution' },
        { data: { constructor: { prototype: { isAdmin: true } } }, name: 'constructor pollution' },
        { data: { code: 'function() { alert("xss") }' }, name: 'function injection' },
        { data: { url: 'javascript:alert("xss")' }, name: 'javascript: protocol' },
        { data: { content: '<script>alert("xss")</script>' }, name: 'script tags' },
        { data: null, name: 'null data' },
        { data: undefined, name: 'undefined data' }
      ];

      testCases.forEach(({ data, name }) => {
        consoleWarnSpy.mockClear();
        const result = secureStorage.setItem(`test-${name}`, data);
        expect(result).toBe(false);
        expect(consoleWarnSpy).toHaveBeenCalledWith('SecureStorage: Invalid data rejected');
      });
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = secureStorage.setItem('test', { data: 'test' });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'SecureStorage: Failed to store item',
        expect.any(Error)
      );
    });
  });

  describe('getItem', () => {
    it('retrieves valid stored data', () => {
      const testData = { name: 'Alice', role: 'user' };
      secureStorage.setItem('valid-user', testData);

      const retrieved = secureStorage.getItem('valid-user');
      expect(retrieved).toEqual(testData);
    });

    it('returns null for non-existent keys', () => {
      expect(secureStorage.getItem('non-existent')).toBeNull();
    });

    it('validates version and removes mismatched items', () => {
      const invalidVersionData = {
        data: { test: 'value' },
        metadata: { version: '0.9', timestamp: Date.now() }
      };
      localStorageMock.setItem('todo_app_invalid-version', JSON.stringify(invalidVersionData));

      const result = secureStorage.getItem('invalid-version');

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith('SecureStorage: Version mismatch, removing item');
    });

    it('validates checksum and removes corrupted items', () => {
      const testData = { test: 'original' };
      secureStorage.setItem('checksum-test', testData);

      // Corrupt the stored data
      const storedValue = localStorageMock.getItem('todo_app_checksum-test');
      const parsed = JSON.parse(storedValue!);
      parsed.data.test = 'corrupted';
      localStorageMock.setItem('todo_app_checksum-test', JSON.stringify(parsed));

      const result = secureStorage.getItem('checksum-test');

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith('SecureStorage: Checksum mismatch, data may be corrupted');
    });

    it('handles errors gracefully (JSON parse, malicious data)', () => {
      localStorageMock.setItem('todo_app_invalid-json', 'invalid json string');
      expect(secureStorage.getItem('invalid-json')).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('SecureStorage: Failed to retrieve item', expect.any(Error));
    });
  });

  describe('removeItem', () => {
    it('removes item with correct key prefix', () => {
      secureStorage.setItem('remove-test', { data: 'test' });
      secureStorage.removeItem('remove-test');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('todo_app_remove-test');
      expect(secureStorage.getItem('remove-test')).toBeNull();
    });
  });

  describe('clear', () => {
    it('removes only app-specific items', () => {
      secureStorage.setItem('app-item-1', { data: '1' });
      secureStorage.setItem('app-item-2', { data: '2' });
      localStorageMock.setItem('other-app-item', 'other');

      secureStorage.clear();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('todo_app_app-item-1');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('todo_app_app-item-2');
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('other-app-item');
    });
  });

  describe('getKeys', () => {
    it('returns only app-specific keys without prefix', () => {
      secureStorage.setItem('key1', { data: '1' });
      secureStorage.setItem('key2', { data: '2' });
      localStorageMock.setItem('other-key', 'other');

      const keys = secureStorage.getKeys();

      expect(keys).toEqual(expect.arrayContaining(['key1', 'key2']));
      expect(keys).not.toContain('other-key');
      expect(keys.length).toBe(2);
    });
  });

  describe('isAvailable', () => {
    it('detects localStorage availability and cleans up test key', () => {
      expect(secureStorage.isAvailable()).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('__test_storage__');
    });

    it('returns false when localStorage throws error', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      expect(secureStorage.isAvailable()).toBe(false);
    });
  });

  describe('integration', () => {
    it('handles complete data lifecycle and maintains integrity', () => {
      const originalData = { 
        id: 'test-card',
        title: 'Test Card',
        todos: [{ id: 'todo-1', task: 'Task 1', completed: false }],
        backgroundColor: 'bg-blue-500'
      };

      // Complete lifecycle test
      expect(secureStorage.setItem('lifecycle-test', originalData)).toBe(true);
      const retrieved = secureStorage.getItem('lifecycle-test');
      expect(retrieved).toEqual(originalData);
      expect(retrieved).not.toBe(originalData); // Different object reference
      expect(secureStorage.getKeys()).toContain('lifecycle-test');
      
      secureStorage.removeItem('lifecycle-test');
      expect(secureStorage.getItem('lifecycle-test')).toBeNull();
      expect(secureStorage.getKeys()).not.toContain('lifecycle-test');
    });
  });
});