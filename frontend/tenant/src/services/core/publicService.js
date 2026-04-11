// publicService.js
import apiClient from '../apiClient';

const API_URL = '/reatchall/public';

/**
 * Fetch global public settings without authentication
 * Uses cache or safe defaults if fetch fails.
 */
export const getPublicSettings = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error in getPublicSettings:', error);
    // Return safe defaults
    return { maintenanceMode: false, platformName: 'TrackForce SaaS' };
  }
};
