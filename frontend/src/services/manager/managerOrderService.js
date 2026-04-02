import { getAuthHeader } from '../core/authService';
import { fetchDataWithCache, setCachedData, clearCache } from '../../utils/cacheHelper';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/manager/inventory-orders`;

export const getManagerStats = async () => {
  return fetchDataWithCache('manager_stats', async () => {
    const response = await fetch(`${API_URL}/stats`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  });
};

export const getRevenueChartData = async () => {
  return fetchDataWithCache('revenue_chart', async () => {
    const response = await fetch(`${API_URL}/revenue-chart`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch chart data');
    return response.json();
  });
};

export const getRecentOrders = async (search = '', page = 1, limit = 5) => {
  const cacheKey = `recent_orders_${search}_${page}_${limit}`;
  return fetchDataWithCache(cacheKey, async () => {
    const response = await fetch(`${API_URL}/recent?search=${search}&page=${page}&limit=${limit}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch recent orders');
    return response.json();
  });
};

export const getInventory = async () => {
  return fetchDataWithCache('inventory', async () => {
    const response = await fetch(`${API_URL}/inventory`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  });
};
