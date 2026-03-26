// publicService.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_URL}/public`;

/**
 * Fetch global public settings without authentication
 * Uses cache or safe defaults if fetch fails.
 */
export const getPublicSettings = async () => {
  try {
    const res = await fetch(`${API_URL}/settings`);
    if (!res.ok) {
      throw new Error('Failed to fetch public settings');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in getPublicSettings:', error);
    // Return safe defaults
    return { maintenanceMode: false, platformName: 'TrackForce SaaS' };
  }
};
