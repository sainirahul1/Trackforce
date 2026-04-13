import apiClient from '../apiClient';
import storage from '../../utils/storage';

const API_URL = '/reatchall/auth';

export const login = async (email, password, portal) => {
  const response = await apiClient.post(`${API_URL}/login`, {
    email,
    password,
    portal
  });

  const data = response.data;

  if (data.token) {
    storage.setItem('token', data.token);
    storage.setItem('role', data.role);
    if (data.portal) storage.setItem('portal', data.portal); // Save resolved portal
    else if (portal) storage.setItem('portal', portal); // Fallback to input portal
    storage.setItem('user', JSON.stringify(data));
  }

  return data;
};

export const logout = () => {
  storage.clear();
};

export const register = async (userData) => {
  const response = await apiClient.post(`${API_URL}/register`, userData);
  const data = response.data;

  if (data.token) {
    storage.setItem('token', data.token);
    storage.setItem('role', data.role);
    storage.setItem('portal', data.role); // Portal = role on registration
    storage.setItem('user', JSON.stringify(data));
  }

  return data;
};

export const getMe = async () => {
  const response = await apiClient.get(`${API_URL}/me`);
  const data = response.data;

  // Update the correct storage with fresh user data
  const storedUser = storage.getUser() || {};
  storage.setItem('user', JSON.stringify({ ...storedUser, ...data }));

  return data;
};

export const updateProfile = async (userData) => {
  const response = await apiClient.put(`${API_URL}/profile`, userData);
  return response.data;
};

export const uploadProfileImage = async (formData) => {
  const response = await apiClient.put(`${API_URL}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAuthHeader = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const updatePassword = async (passwordData) => {
  const response = await apiClient.put(`${API_URL}/update-password`, passwordData);
  return response.data;
};

export const updateSuperadminCredentials = async (credentialsData) => {
  const response = await apiClient.put('/reatchall/superadmin/update-credentials', credentialsData);
  return response.data;
};


