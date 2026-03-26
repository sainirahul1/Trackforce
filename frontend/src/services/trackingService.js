import { getAuthHeader } from './authService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = BASE_URL;

export const startTracking = async () => {
  const response = await fetch(`${API_URL}/tracking/start`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to start tracking');
  return response.json();
};

export const stopTracking = async () => {
  const response = await fetch(`${API_URL}/tracking/stop`, {
    method: 'POST',
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to stop tracking');
  return response.json();
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/stats/dashboard`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};
