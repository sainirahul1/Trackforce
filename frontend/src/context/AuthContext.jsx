import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/core/authService';
import { logActivity } from '../services/employee/activityService';

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
          sessionStorage.setItem('portal', data.portal || data.role);
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
        // PERF: Maintain the existing token when updating user metadata
        const isImpersonating = !!sessionStorage.getItem('token');
        const storage = isImpersonating ? sessionStorage : localStorage;

        const storedUserRaw = storage.getItem('user');
        const currentUser = JSON.parse(storedUserRaw || '{}');
        const token = currentUser.token || storage.getItem('token');

        const updatedUser = {
          ...currentUser,
          ...freshUser,
          token,
          // Ensure these are explicitly updated for immediate shell hydration
          name: freshUser.name || currentUser.name,
          profile: {
            ...currentUser.profile,
            ...freshUser.profile
          }
        };
        setUser(updatedUser);
        storage.setItem('user', JSON.stringify(updatedUser));
      }
      return freshUser;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return null;
    }
  }, []);

  // Sync storage and PRELOAD AVATAR when state changes
  useEffect(() => {
    if (user) {
      const isImpersonating = !!sessionStorage.getItem('token');
      const storage = isImpersonating ? sessionStorage : localStorage;
      storage.setItem('user', JSON.stringify(user));

      // 0s-Load Optimization: Background Preheat for Avatar
      const avatarPath = user.profile?.profileImage || user.avatar;
      if (avatarPath && !avatarPath.startsWith('data:')) {
        const imageUrl = (() => {
          let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
          const base = url.replace(/\/api\/?$/, '');
          return `${base}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
        })();
        const img = new Image();
        img.src = imageUrl;
      }
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const isImpersonating = !!sessionStorage.getItem('token');
      const storage = isImpersonating ? sessionStorage : localStorage;
      const token = storage.getItem('token');
      const storedUser = storage.getItem('user');

      if (token && storedUser) {
        // [PORTAL ISOLATION] Validate BOTH role AND portal vs expected URL portal
        const parsedUser = JSON.parse(storedUser);
        const currentPath = window.location.pathname;
        const urlPortalMatch = currentPath.match(/^\/(employee|manager|tenant|superadmin)/i);
        const urlPortal = urlPortalMatch ? urlPortalMatch[1].toLowerCase() : null;
        
        // Check role matches URL portal
        if (urlPortal && parsedUser.role !== urlPortal) {
          console.warn(`[SECURITY] Invalid portal context! Stored Role '${parsedUser.role}' is not matching URL portal '${urlPortal}'. Purging tokens.`);
          authService.logout();
          setIsLoading(false);
          return;
        }

        // Check stored portal matches URL portal
        const storedPortal = storage.getItem('portal');
        if (urlPortal && storedPortal && storedPortal.toLowerCase() !== urlPortal) {
          console.warn(`[SECURITY] Portal mismatch! Stored portal '${storedPortal}' does not match URL portal '${urlPortal}'. Forcing re-authentication.`);
          authService.logout();
          setIsLoading(false);
          return;
        }

        // PERF: Optimistic UI – allow the shell to render with local data
        setIsLoading(false);
        // Sync in background silently
        refreshUser();
      } else if (token) {
        // Fallback if user object missing – must wait for refresh
        const freshUser = await refreshUser();
        
        const currentPath = window.location.pathname;
        const urlPortalMatch = currentPath.match(/^\/(employee|manager|tenant|superadmin)/i);
        const urlPortal = urlPortalMatch ? urlPortalMatch[1].toLowerCase() : null;

        if (freshUser && urlPortal && freshUser.role !== urlPortal) {
          authService.logout();
          setUser(null);
        }

        setIsLoading(false);
      } else {
        // No auth context
        setIsLoading(false);
      }

      // Clean up impersonation URL if present, but only AFTER initialization
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
    };

    initAuth();
  }, [refreshUser]);

  const login = async (userData) => {
    setUser(userData);
    if (userData?.role === 'manager') {
      try {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        logActivity('login', `Logged into the Manager Portal on ${formattedDate} at ${formattedTime}`);
      } catch (e) {
        console.error('Failed to log login activity:', e);
      }
    }
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
