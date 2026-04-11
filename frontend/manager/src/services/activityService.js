import apiClient from './apiClient';
import { fetchDataWithCache, setCachedData, clearCache } from '../utils/cacheHelper';

const EMPLOYEE_ACTIVITY_URL = '/reatchall/employee/activity';
const MANAGER_ACTIVITY_URL = '/reatchall/manager/activity';

// Get all field executives for the sidebar
export const getExecutives = async () => {
  return fetchDataWithCache('executives', async () => {
    const response = await apiClient.get(`${EMPLOYEE_ACTIVITY_URL}/executives`);
    return response.data;
  });
};

// Get activity logs for a specific user ID
export const getLogsByUser = async (userId) => {
  const response = await apiClient.get(`${EMPLOYEE_ACTIVITY_URL}/user/${userId}`);
  return response.data;
};

export const getActivities = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Managers use a dedicated collection, Employees use the general one
  const path = user.role === 'manager' ? MANAGER_ACTIVITY_URL : EMPLOYEE_ACTIVITY_URL;
  
  const response = await apiClient.get(path);
  return response.data;
};

export const logActivity = async (type, details) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Managers log to a dedicated collection
  const path = user.role === 'manager' ? MANAGER_ACTIVITY_URL : EMPLOYEE_ACTIVITY_URL;

  const response = await apiClient.post(path, { type, details });
  return response.data;
};
