import { getAuthHeader } from './authService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_URL}/manager/inventory-orders`;

export const getManagerStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

export const getRevenueChartData = async () => {
  const response = await fetch(`${API_URL}/revenue-chart`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch chart data');
  return response.json();
};

export const getRecentOrders = async (search = '', page = 1, limit = 5) => {
  const response = await fetch(`${API_URL}/recent?search=${search}&page=${page}&limit=${limit}`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch recent orders');
  return response.json();
};

export const getInventory = async () => {
  const response = await fetch(`${API_URL}/inventory`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch inventory');
  return response.json();
};
