import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:5001/api';

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
  const response = await fetch(`${API_URL}/tracking/active`, {
    headers: getAuthHeader()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch active sessions');
  return data;
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/stats/dashboard`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};
