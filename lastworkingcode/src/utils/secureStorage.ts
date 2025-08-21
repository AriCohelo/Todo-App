// Secure localStorage wrapper for future data persistence
// This provides a foundation for secure data storage when needed

const STORAGE_KEY_PREFIX = 'todo_app_';
const STORAGE_VERSION = '1.0';

interface StorageMetadata {
  version: string;
  timestamp: number;
  checksum?: string;
}

interface SecureStorageItem<T> {
  data: T;
  metadata: StorageMetadata;
}

// Simple checksum for data integrity
const calculateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

// Validate data before storage/retrieval
const validateData = (data: any): boolean => {
  if (data === null || data === undefined) return false;
  
  // Check for malicious properties
  const serialized = JSON.stringify(data);
  const dangerousPatterns = [
    /__proto__/,
    /constructor/,
    /prototype/,
    /function/i,
    /javascript:/i,
    /<script/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(serialized));
};

export const secureStorage = {
  // Set item with security validation
  setItem: <T>(key: string, value: T): boolean => {
    try {
      if (!validateData(value)) {
        console.warn('SecureStorage: Invalid data rejected');
        return false;
      }

      const serializedData = JSON.stringify(value);
      const storageItem: SecureStorageItem<T> = {
        data: value,
        metadata: {
          version: STORAGE_VERSION,
          timestamp: Date.now(),
          checksum: calculateChecksum(serializedData)
        }
      };

      const fullKey = STORAGE_KEY_PREFIX + key;
      localStorage.setItem(fullKey, JSON.stringify(storageItem));
      return true;
    } catch (error) {
      console.error('SecureStorage: Failed to store item', error);
      return false;
    }
  },

  // Get item with integrity checking
  getItem: <T>(key: string): T | null => {
    try {
      const fullKey = STORAGE_KEY_PREFIX + key;
      const storedValue = localStorage.getItem(fullKey);
      
      if (!storedValue) return null;

      const storageItem: SecureStorageItem<T> = JSON.parse(storedValue);
      
      // Validate metadata
      if (!storageItem.metadata || storageItem.metadata.version !== STORAGE_VERSION) {
        console.warn('SecureStorage: Version mismatch, removing item');
        secureStorage.removeItem(key);
        return null;
      }

      // Validate checksum if present
      if (storageItem.metadata.checksum) {
        const dataChecksum = calculateChecksum(JSON.stringify(storageItem.data));
        if (dataChecksum !== storageItem.metadata.checksum) {
          console.warn('SecureStorage: Checksum mismatch, data may be corrupted');
          secureStorage.removeItem(key);
          return null;
        }
      }

      // Validate data integrity
      if (!validateData(storageItem.data)) {
        console.warn('SecureStorage: Data validation failed');
        secureStorage.removeItem(key);
        return null;
      }

      return storageItem.data;
    } catch (error) {
      console.error('SecureStorage: Failed to retrieve item', error);
      return null;
    }
  },

  // Remove item
  removeItem: (key: string): void => {
    const fullKey = STORAGE_KEY_PREFIX + key;
    localStorage.removeItem(fullKey);
  },

  // Clear all app data
  clear: (): void => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  // Get all keys for this app
  getKeys: (): string[] => {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .map(key => key.replace(STORAGE_KEY_PREFIX, ''));
  },

  // Check if localStorage is available
  isAvailable: (): boolean => {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};