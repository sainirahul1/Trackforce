import apiClient from '../apiClient';
import { fetchDataWithCache, clearCache } from '../../utils/cacheHelper';

const API_URL = '/reatchall/issues';

export const createIssue = async (issueData) => {
  const response = await apiClient.post(API_URL, issueData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const getIssues = async () => {
  return fetchDataWithCache('issues', async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  });
};

export const getIssueById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateIssue = async (id, updateData) => {
  const response = await apiClient.put(`${API_URL}/${id}`, updateData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const deleteIssue = async (id) => {
  const response = await apiClient.delete(`${API_URL}/${id}`);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};
