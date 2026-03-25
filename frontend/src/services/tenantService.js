import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tenant';

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all managers
export const getManagers = async () => {
  const response = await axios.get(`${API_URL}/managers`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Create a manager
export const createManager = async (managerData) => {
  const response = await axios.post(`${API_URL}/managers`, managerData, {
    headers: getAuthHeader(),
  });
  return response;
};

// Update a manager
export const updateManager = async (id, managerData) => {
  const response = await axios.put(`${API_URL}/managers/${id}`, managerData, {
    headers: getAuthHeader(),
  });
  return response;
};

// Delete a manager
export const deleteManager = async (id) => {
  const response = await axios.delete(`${API_URL}/managers/${id}`, {
    headers: getAuthHeader(),
  });
  return response;
};

// Get all employees
export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const tenantService = {
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getEmployees,
};

export default tenantService;
