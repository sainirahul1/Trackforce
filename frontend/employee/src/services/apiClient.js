/**
 * Centralized Axios API Client — Portal-Aware
 * 
 * Features:
 * - Automatic JWT token injection via request interceptor
 * - Automatic X-Portal header injection for portal isolation
 * - 401 response → auto-logout + redirect to portal login
 * - 403 response → log security event
 * - Centralized base URL configuration
 * 
 * Usage:
 *   import apiClient from './apiClient';
 *   const data = await apiClient.get('/reatchall/employee/visits');
 */

import axios from 'axios';
import storage from '../utils/storage';

// ─── Base URL Configuration ──────────────────────────────────────────────────
const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  return url.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Inject Auth Token + Portal Header ──────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Get token from session (impersonation) or local storage
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Inject portal context header for backend validation
    const portal = storage.getPortal();
    if (portal) {
      config.headers['X-Portal'] = portal;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Auth Errors ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401 && !error.config.url.includes('/login')) {
      // Token expired or invalid — force logout
      console.error('[API CLIENT] 401 Unauthorized — session expired or invalid token.');
      
      // Clear all session data
      storage.clear();

      // Determine which portal to redirect to
      const currentPath = window.location.pathname;
      const portalMatch = currentPath.match(/^\/(employee|manager|tenant|superadmin)/i);
      const portalPath = portalMatch ? portalMatch[1].toLowerCase() : 'employee'; // Fallback to employee or common
      
      // Redirect to the appropriate portal login page
      window.location.href = `/${portalPath}/login`;
    }

    if (status === 403) {
      // Portal or role mismatch
      if (code === 'PORTAL_MISMATCH' || code === 'ROLE_UNAUTHORIZED') {
        console.error(`[SECURITY] Access denied: ${error.response?.data?.message}`);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Helper: Get Base URL (for non-Axios consumers like Socket.io) ───────────
export const getApiBaseUrl = getBaseUrl;

export default apiClient;

