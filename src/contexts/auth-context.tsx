import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authStorage } from '../services/storage/auth-storage';
import { authService } from '../services/api/auth.service';
import { setOnUnauthorizedCallback } from '../services/api/client';
import { authKeys } from '../services/query/auth-keys';
import {
  AuthContextData,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth';

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const signOut = useCallback(async () => {
    try {
      await authStorage.clearSession();
    } finally {
      setUser(null);
      setToken(null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    }
  }, [queryClient]);

  const restoreSession = useCallback(async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        authStorage.getAccessToken(),
        authStorage.getUser(),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        // Optionally validate token and refresh user profile in background
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          await authStorage.setUser(freshUser);
        } catch {
          // Keep cached user if offline or network error; 401 interceptor handles invalid token
        }
      } else {
        await authStorage.clearSession();
        setToken(null);
        setUser(null);
      }
    } catch {
      await authStorage.clearSession();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
    setOnUnauthorizedCallback(() => {
      signOut();
    });

    return () => {
      setOnUnauthorizedCallback(null);
    };
  }, [restoreSession, signOut]);

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      const data = await authService.login(credentials);
      await authStorage.saveSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      setToken(data.accessToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.session(), data);
    },
    [queryClient],
  );

  const signUp = useCallback(
    async ({ confirmSenha: _, ...rest }: RegisterCredentials) => {
      const data = await authService.register(rest);
      await authStorage.saveSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      setToken(data.accessToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.session(), data);
    },
    [queryClient],
  );

  const refreshSession = useCallback(async () => {
    await restoreSession();
  }, [restoreSession]);

  const updateUser = useCallback(async (updatedUser: User) => {
    await authStorage.setUser(updatedUser);
    setUser(updatedUser);
  }, []);

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      signIn,
      signUp,
      signOut,
      refreshSession,
      updateUser,
    }),
    [user, token, isLoading, signIn, signUp, signOut, refreshSession, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
