import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/superadmin`;

const getAuthHeader = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const superadminService = {
  // Companies / Tenants
  getCompanies: async () => {
    const response = await axios.get(`${API_URL}/companies`, { headers: getAuthHeader() });
    return response.data;
  },
  provisionTenant: async (tenantData) => {
    const response = await axios.post(`${API_URL}/companies`, tenantData, { headers: getAuthHeader() });
    return response.data;
  },
  updateCompanyStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/companies/${id}/status`, { status }, { headers: getAuthHeader() });
    return response.data;
  },
  updateCompany: async (id, companyData) => {
    const response = await axios.put(`${API_URL}/companies/${id}`, companyData, { headers: getAuthHeader() });
    return response.data;
  },
  toggleCompanySuspension: async (id) => {
    const response = await axios.patch(`${API_URL}/companies/${id}/suspend`, {}, { headers: getAuthHeader() });
    return response.data;
  },
  deleteCompany: async (id) => {
    const response = await axios.delete(`${API_URL}/companies/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Tenant Users Management
  getTenantUsers: async (tenantId) => {
    const response = await axios.get(`${API_URL}/companies/${tenantId}/users`, { headers: getAuthHeader() });
    return response.data;
  },
  createTenantUser: async (tenantId, userData) => {
    const response = await axios.post(`${API_URL}/companies/${tenantId}/users`, userData, { headers: getAuthHeader() });
    return response.data;
  },
  updateTenantUser: async (tenantId, userId, userData) => {
    const response = await axios.put(`${API_URL}/companies/${tenantId}/users/${userId}`, userData, { headers: getAuthHeader() });
    return response.data;
  },
  deleteTenantUser: async (tenantId, userId) => {
    const response = await axios.delete(`${API_URL}/companies/${tenantId}/users/${userId}`, { headers: getAuthHeader() });
    return response.data;
  },
  impersonateTenant: async (tenantId) => {
    const response = await axios.post(`${API_URL}/companies/${tenantId}/impersonate`, {}, { headers: getAuthHeader() });
    return response.data;
  },
  
  // Global User Management
  getGlobalUsersByRole: async (role) => {
    const response = await axios.get(`${API_URL}/manage/users/${role}`, { headers: getAuthHeader() });
    return response.data;
  },
  impersonateGlobalUser: async (userId) => {
    const response = await axios.post(`${API_URL}/manage/users/${userId}/impersonate`, {}, { headers: getAuthHeader() });
    return response.data;
  },

  // Subscriptions
  getSubscriptions: async () => {
    const response = await axios.get(`${API_URL}/subscriptions`, { headers: getAuthHeader() });
    return response.data;
  },
  createSubscription: async (subData) => {
    const response = await axios.post(`${API_URL}/subscriptions`, subData, { headers: getAuthHeader() });
    return response.data;
  },
  updateSubscription: async (id, subData) => {
    const response = await axios.put(`${API_URL}/subscriptions/${id}`, subData, { headers: getAuthHeader() });
    return response.data;
  },
  deleteSubscription: async (id) => {
    const response = await axios.delete(`${API_URL}/subscriptions/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Analytics
  getAnalyticsStats: async () => {
    const response = await axios.get(`${API_URL}/analytics/stats`, { headers: getAuthHeader() });
    return response.data;
  },
  getGrowthData: async () => {
    const response = await axios.get(`${API_URL}/analytics/growth`, { headers: getAuthHeader() });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await axios.get(`${API_URL}/notifications`, { headers: getAuthHeader() });
    return response.data;
  },
  broadcastNotification: async (notifData) => {
    const response = await axios.post(`${API_URL}/notifications/broadcast`, notifData, { headers: getAuthHeader() });
    return response.data;
  },

  // System Settings
  getSettings: async () => {
    const response = await axios.get(`${API_URL}/settings`, { headers: getAuthHeader() });
    return response.data;
  },
  updateSettings: async (settingsData) => {
    const response = await axios.put(`${API_URL}/settings`, settingsData, { headers: getAuthHeader() });
    return response.data;
  },
  getDatabaseAnalytics: async () => {
    const response = await axios.get(`${API_URL}/settings/analytics`, { headers: getAuthHeader() });
    return response.data;
  },
  getDuplicates: async (field = 'email', customPath = '') => {
    const url = `${API_URL}/settings/duplicates?field=${field}${customPath ? `&customPath=${customPath}` : ''}`;
    const response = await axios.get(url, { headers: getAuthHeader() });
    return response.data;
  },
  cleanupDuplicates: async (recordIds, collectionName = 'Users') => {
    const response = await axios.post(`${API_URL}/settings/cleanup`, { recordIds, collectionName }, { headers: getAuthHeader() });
    return response.data;
  }
};

export default superadminService;
