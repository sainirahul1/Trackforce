import apiClient from './apiClient';
import { fetchDataWithCache, clearCache } from '../utils/cacheHelper';

const API_URL = '/reatchall/employee/visits';

export const getVisits = async (force = false) => {
  return fetchDataWithCache('visits', async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  }, force);
};

export const getVisitById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data;
};

export const createVisit = async (visitData) => {
  const response = await apiClient.post(API_URL, visitData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const updateVisit = async (id, visitData) => {
  const response = await apiClient.patch(`${API_URL}/${id}`, visitData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};
