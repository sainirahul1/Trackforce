import { getAuthHeader } from './authService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_URL}/activity`;

export const getActivities = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch activity logs');
  return response.json();
};

export const logActivity = async (type, details) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type, details })
  });
  if (!response.ok) throw new Error('Failed to log activity');
  return response.json();
};
