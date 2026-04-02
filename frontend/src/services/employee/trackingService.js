import { getAuthHeader } from '../core/authService';
import { fetchDataWithCache } from '../../utils/cacheHelper';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = BASE_URL;

export const startTracking = async () => {
  const response = await fetch(`${API_URL}/tracking/start`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to start tracking');
  return data;
};

export const stopTracking = async () => {
  const response = await fetch(`${API_URL}/tracking/stop`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to stop tracking');
  return data;
};

export const getActiveTrackingSessions = async () => {
  return fetchDataWithCache('active_tracking_sessions', async () => {
    const response = await fetch(`${API_URL}/tracking/active`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch active sessions');
    return data;
  });
};

export const getDashboardStats = async () => {
  return fetchDataWithCache('tenant_dashboard_stats', async () => {
    const response = await fetch(`${API_URL}/tenant/dashboard-stats`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  });
};
