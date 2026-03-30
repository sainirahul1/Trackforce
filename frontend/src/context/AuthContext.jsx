import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/core/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authService.getMe();
      if (freshUser) {
        // PERF: Maintain the existing token when updating user metadata
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const token = currentUser.token || localStorage.getItem('token');
        
        const updatedUser = { ...freshUser, token };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return freshUser;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return null;
    }
  }, []);

  // Sync localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // PERF: Optimistic UI – allow the shell to render with local data
        setIsLoading(false);
        // Sync in background silently
        refreshUser();
      } else if (token) {
        // Fallback if user object missing – must wait for refresh
        await refreshUser();
        setIsLoading(false);
      } else {
        // No auth context
        setIsLoading(false);
      }
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
