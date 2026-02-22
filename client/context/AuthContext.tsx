'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Toast from '@/components/Toast';
import { type AuthUser, authService } from '@/services/authService';

interface AuthContextProps {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();
    if (storedToken && storedUser) {
      authService
        .getMe(storedToken)
        .then((userData) => {
          setUser(userData);
          setToken(storedToken);
          localStorage.setItem('access_token', storedToken);
          localStorage.setItem('user', JSON.stringify(userData));
          document.cookie = `access_token=${storedToken}; path=/; max-age=86400`;
        })
        .catch(() => {
          if (storedUser) {
            setUser(storedUser);
            setToken(storedToken);
          } else {
            setUser(null);
            setToken(null);
            authService.logout();
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { access_token, user: userData } = await authService.login(email, password);
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      document.cookie = `access_token=${access_token}; path=/; max-age=86400`;
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setIsLoading(true);
    try {
      const { access_token, user: userData } = await authService.register(data);
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      document.cookie = `access_token=${access_token}; path=/; max-age=86400`;
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    document.cookie = 'access_token=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
      {showToast && (
        <Toast
          message={`👋 ¡Bienvenido, ${user?.firstName || user?.email || ''}! Recuerda completar tu perfil.`}
          link="/perfil"
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};