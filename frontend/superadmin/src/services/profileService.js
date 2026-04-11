import apiClient from './apiClient';
import { fetchDataWithCache, clearCache } from '../utils/cacheHelper';

const API_URL = '/reatchall/employee/profile';

export const getMyProfile = async () => {
  return fetchDataWithCache('employee_profile', async () => {
    const response = await apiClient.get(`${API_URL}/me`);
    return response.data;
  });
};

// Fetch ONLY the avatar — lightweight, independently cacheable.
// Called in the background; result is persisted to localStorage.
export const getMyAvatar = async () => {
  const response = await apiClient.get(`${API_URL}/avatar`);
  return response.data.avatar || '';
};

export const updateMyProfile = async (updates) => {
  const response = await apiClient.put(`${API_URL}/me`, updates);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const changePassword = async (passwords) => {
  const response = await apiClient.put(`${API_URL}/password`, passwords);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};
