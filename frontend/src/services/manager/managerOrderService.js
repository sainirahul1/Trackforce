import apiClient from '../apiClient';
import { fetchDataWithCache, setCachedData, clearCache } from '../../utils/cacheHelper';

const API_URL = '/reatchall/manager/inventory-orders';

export const getManagerStats = async () => {
  return fetchDataWithCache('manager_stats', async () => {
    const response = await apiClient.get(`${API_URL}/stats`);
    return response.data;
  });
};

export const getRevenueChartData = async () => {
  return fetchDataWithCache('revenue_chart', async () => {
    const response = await apiClient.get(`${API_URL}/revenue-chart`);
    return response.data;
  });
};

export const getRecentOrders = async (search = '', page = 1, limit = 5) => {
  const cacheKey = `recent_orders_${search}_${page}_${limit}`;
  return fetchDataWithCache(cacheKey, async () => {
    const response = await apiClient.get(`${API_URL}/recent`, {
      params: { search, page, limit }
    });
    return response.data;
  });
};

export const getInventory = async () => {
  return fetchDataWithCache('inventory', async () => {
    const response = await apiClient.get(`${API_URL}/inventory`);
    return response.data;
  });
};
