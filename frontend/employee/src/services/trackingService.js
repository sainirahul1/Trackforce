import apiClient from './apiClient';
import storage from '../utils/storage';
import { fetchDataWithCache } from '../utils/cacheHelper';

const API_URL = '/reatchall/employee';

export const startTracking = async () => {
  const response = await apiClient.post(`${API_URL}/tracking/start`);
  return response.data;
};

export const stopTracking = async () => {
  const response = await apiClient.post(`${API_URL}/tracking/stop`);
  return response.data;
};

export const getActiveTrackingSessions = async () => {
  return fetchDataWithCache('active_tracking_sessions', async () => {
    const response = await apiClient.get(`${API_URL}/tracking/active`);
    return response.data;
  }, true);
};

export const getDashboardStats = async (force = false) => {
  return fetchDataWithCache('tenant_dashboard_stats', async () => {
    const response = await apiClient.get(`${API_URL}/stats/dashboard`);
    return response.data;
  }, force);
};

export const getTrackingStatus = async () => {
  const response = await apiClient.get(`${API_URL}/tracking/status`);
  return response.data;
};

export const getTargetHistory = async (force = false) => {
  return fetchDataWithCache('target_history', async () => {
    const response = await apiClient.get(`${API_URL}/targets/history`);
    return response.data;
  }, force);
};
