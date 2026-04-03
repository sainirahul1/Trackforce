import { fetchDataWithCache, setCachedData, clearCache } from '../../utils/cacheHelper';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/activity`;
const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Get all field executives for the sidebar
export const getExecutives = async () => {
  return fetchDataWithCache('executives', async () => {
    const response = await fetch(`${API_URL}/executives`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch executives');
    return response.json();
  });
};

// Get activity logs for a specific user ID
export const getLogsByUser = async (userId) => {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch user logs');
  return response.json();
};

export const getActivities = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Managers use a dedicated collection, Employees use the general one
  const path = user.role === 'manager' ? `${BASE_URL}/manager/activity` : API_URL;
  
  const response = await fetch(path, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch activity logs');
  return response.json();
};

export const logActivity = async (type, details) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Managers log to a dedicated collection
  const path = user.role === 'manager' ? `${BASE_URL}/manager/activity` : API_URL;

  const response = await fetch(path, {
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
