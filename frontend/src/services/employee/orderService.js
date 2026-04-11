import apiClient from '../apiClient';
import { fetchDataWithCache, clearCache } from '../../utils/cacheHelper';

const API_URL = '/reatchall/employee/orders';

export const getOrders = async () => {
  return fetchDataWithCache('employee_orders', async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  });
};

export const getOrderStats = async () => {
  return fetchDataWithCache('employee_order_stats', async () => {
    const response = await apiClient.get(`${API_URL}/stats`);
    return response.data;
  });
};

export const createOrderAPI = async (orderData) => {
  const response = await apiClient.post(API_URL, orderData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};

export const updateOrderAPI = async (id, orderData) => {
  const response = await apiClient.put(`${API_URL}/${id}`, orderData);
  clearCache(); // Invalidate cache on mutations
  return response.data;
};
