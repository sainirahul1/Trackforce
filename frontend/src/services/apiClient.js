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

// ─── Base URL Configuration ──────────────────────────────────────────────────
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/api\/?$/, ''); // Strip /api suffix — we use /reatchall/* now
  url = url.replace(/\/$/, '');       // Remove trailing slash
  return url;
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
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Inject portal context header for backend validation
    const portal = sessionStorage.getItem('portal') || localStorage.getItem('portal');
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

    if (status === 401) {
      // Token expired or invalid — force logout
      console.error('[API CLIENT] 401 Unauthorized — session expired or invalid token.');
      
      // Clear all session data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('portal');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('portal');

      // Redirect to the unified login page
      window.location.href = `/login`;
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
