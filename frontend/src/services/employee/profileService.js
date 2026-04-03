import { getAuthHeader } from '../core/authService';
import { fetchDataWithCache, clearCache } from '../../utils/cacheHelper';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/employee/profile`;

export const getMyProfile = async () => {
  return fetchDataWithCache('employee_profile', async () => {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  });
};

// Fetch ONLY the avatar — lightweight, independently cacheable.
// Called in the background; result is persisted to localStorage.
export const getMyAvatar = async () => {
  const response = await fetch(`${API_URL}/avatar`, {
    headers: { ...getAuthHeader() },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch avatar');
  return data.avatar || '';
};

export const updateMyProfile = async (updates) => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  clearCache(); // Invalidate cache on mutations
  return data;
};

export const changePassword = async (passwords) => {
  const response = await fetch(`${API_URL}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(passwords),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update password');
  clearCache(); // Invalidate cache on mutations
  return data;
};
