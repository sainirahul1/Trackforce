import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/core/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // 1. Try to bootstrap impersonation FIRST
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('impersonate');
      if (raw) {
        const data = JSON.parse(decodeURIComponent(raw));
        if (data?.token) {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('role', data.role);
          sessionStorage.setItem('user', JSON.stringify(data));
          
          return data;
        }
      }
    } catch (e) {
      console.error('Impersonation bootstrap failed:', e);
    }

    // 2. Default fallback
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse user from storage', e);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authService.getMe();
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      }
      return freshUser;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return null;
    }
  }, []);

  // Sync storage when state changes
  useEffect(() => {
    if (user) {
      const isImpersonating = !!sessionStorage.getItem('token');
      const storage = isImpersonating ? sessionStorage : localStorage;
      storage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      // Clean up impersonation URL if present
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('impersonate')) {
          params.delete('impersonate');
          const cleanUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
          window.history.replaceState({}, '', cleanUrl);
        }
      } catch (e) {
        console.error('URL cleanup failed:', e);
      }

      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
