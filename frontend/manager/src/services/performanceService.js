import apiClient from './apiClient';
import { fetchDataWithCache } from '../utils/cacheHelper';

const REVENUE_URL = '/reatchall/manager/inventory-orders';
const PERFORMANCE_URL = '/reatchall/manager/team-performance';

/**
 * Performance Service
 * Fetches dynamic stats for the Manager Intelligence Suite
 */
export const getDashboardRevenueStats = async (force = false) => {
  return fetchDataWithCache('revenue_stats', async () => {
    const response = await apiClient.get(`${REVENUE_URL}/stats`);
    return response.data || {};
  }, force);
};

export const getRevenueChartData = async (force = false) => {
  return fetchDataWithCache('revenue_chart', async () => {
    const response = await apiClient.get(`${REVENUE_URL}/revenue-chart`);
    return response.data || { labels: [], data: [] };
  }, force);
};

export const getTeamPerformanceStats = async (force = false) => {
  return fetchDataWithCache('team_performance', async () => {
    const response = await apiClient.get(PERFORMANCE_URL);
    return response.data || {};
  }, force);
};

const performanceService = {
  getDashboardRevenueStats,
  getRevenueChartData,
  getTeamPerformanceStats
};

export default performanceService;
