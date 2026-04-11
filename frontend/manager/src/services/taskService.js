import apiClient from './apiClient';
import { fetchDataWithCache, setCachedData, clearCache } from '../utils/cacheHelper';

const API_URL = '/reatchall/employee/tasks';

export const getTasks = async (force = false) => {
  // Use cache key 'tasks'
  return fetchDataWithCache('tasks', async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  }, force);
};

export const getTaskById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await apiClient.post(API_URL, taskData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await apiClient.patch(`${API_URL}/${id}`, taskData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`${API_URL}/${id}`);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};
