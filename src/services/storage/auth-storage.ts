import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '../../types/auth';

const ACCESS_TOKEN_KEY = 'ifsp_access_token';
const REFRESH_TOKEN_KEY = 'ifsp_refresh_token';
const USER_KEY = 'ifsp_user_data';

// Fallback in-memory storage for environments where SecureStore/localStorage are unavailable
const memoryStorage = new Map<string, string>();

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage.set(key, value);
    }
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStorage.get(key) ?? null;
  }

  return await SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export const authStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    await setItem(ACCESS_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    await setItem(REFRESH_TOKEN_KEY, token);
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await getItem(USER_KEY);
      if (!data) return null;
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    await setItem(USER_KEY, JSON.stringify(user));
  },

  async saveSession(params: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  }): Promise<void> {
    await this.setAccessToken(params.accessToken);
    if (params.refreshToken) {
      await this.setRefreshToken(params.refreshToken);
    }
    await this.setUser(params.user);
  },

  async clearSession(): Promise<void> {
    await Promise.all([
      deleteItem(ACCESS_TOKEN_KEY),
      deleteItem(REFRESH_TOKEN_KEY),
      deleteItem(USER_KEY),
    ]);
  },
};
