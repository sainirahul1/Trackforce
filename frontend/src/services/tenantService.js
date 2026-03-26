import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_URL}/tenant`;

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

// Create an employee
export const createEmployee = async (employeeData) => {
  const response = await axios.post(`${API_URL}/employees`, employeeData, {
    headers: getAuthHeader(),
  });
  return response;
};

// Update an employee
export const updateEmployee = async (id, employeeData) => {
  const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, {
    headers: getAuthHeader(),
  });
  return response;
};

// Delete an employee
export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/employees/${id}`, {
    headers: getAuthHeader(),
  });
  return response;
};



const tenantService = {
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,

};

export default tenantService;
