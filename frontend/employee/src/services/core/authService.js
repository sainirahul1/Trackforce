import apiClient from '../apiClient';

const API_URL = '/reatchall/auth';

export const login = async (email, password, portal) => {
  const response = await apiClient.post(`${API_URL}/login`, {
    email,
    password,
    portal, // MUST pass portal to enforce strict backend validation
  });

  const data = response.data;

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    if (data.portal) localStorage.setItem('portal', data.portal); // Save resolved portal
    else if (portal) localStorage.setItem('portal', portal); // Fallback to input portal
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

export const logout = () => {
  // Clear impersonation session if it exists
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('portal');

  // Also clear persistent session
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  localStorage.removeItem('portal');
};

export const register = async (userData) => {
  const response = await apiClient.post(`${API_URL}/register`, userData);
  const data = response.data;

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('portal', data.role); // Portal = role on registration
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

export const getMe = async () => {
  const response = await apiClient.get(`${API_URL}/me`);
  const data = response.data;

  // Update the correct storage with fresh user data
  const isImpersonating = !!sessionStorage.getItem('token');
  const storage = isImpersonating ? sessionStorage : localStorage;

  const storedUser = JSON.parse(storage.getItem('user') || '{}');
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
