import apiClient from './apiClient';
import { fetchDataWithCache } from '../utils/cacheHelper';

const API_URL = '/api/manager/team-performance';

/**
 * Team Performance Service
 * Fetches aggregated performance metrics for the manager's team.
 */
export const getTeamPerformance = async (force = false) => {
  return fetchDataWithCache('team_performance', async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  }, force);
};

export default {
  getTeamPerformance
};
