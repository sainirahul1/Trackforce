import { getAuthHeader } from './authService';
import { fetchDataWithCache, clearCache } from '../../utils/cacheHelper';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, ''); // Remove trailing slash
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_URL = `${getBaseUrl()}/issues`;

export const createIssue = async (issueData) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(issueData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create issue');
  clearCache(); // Invalidate cache on mutations
  return data;
};

export const getIssues = async () => {
  return fetchDataWithCache('issues', async () => {
    const response = await fetch(`${API_URL}`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch issues');
    return data;
  });
};

export const getIssueById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch issue details');
  return data;
};

export const updateIssue = async (id, updateData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update issue');
  clearCache(); // Invalidate cache on mutations
  return data;
};

export const deleteIssue = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete issue');
  clearCache(); // Invalidate cache on mutations
  return data;
};
