const API_URL = 'http://localhost:5001/api/auth';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

export const getMe = async () => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  
  // Update local storage with fresh status
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data }));
  
  return data;
};

export const updateProfile = async (userData) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

export const uploadProfileImage = async (formData) => {
  const response = await fetch(`${API_URL}/profile-image`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to upload profile image');
  return data;
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const updatePassword = async (passwordData) => {
  const response = await fetch(`${API_URL}/update-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update password');
  return data;
};
