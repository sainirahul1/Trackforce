import { getAuthHeader } from '../core/authService';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/employee/tasks`;

export const getTasks = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch tasks');
  }
  return response.json();
};

export const getTaskById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch task details');
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task');
  }
  return response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete task');
  }
  return response.json();
};
