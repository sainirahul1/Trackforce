import apiClient from './apiClient';

const API_URL = '/reatchall/superadmin';

const superadminService = {
  // Companies / Tenants
  getCompanies: async () => {
    const response = await apiClient.get(`${API_URL}/companies`);
    return response.data;
  },
  provisionTenant: async (tenantData) => {
    const response = await apiClient.post(`${API_URL}/companies`, tenantData);
    return response.data;
  },
  updateCompanyStatus: async (id, status) => {
    const response = await apiClient.patch(`${API_URL}/companies/${id}/status`, { status });
    return response.data;
  },
  updateCompany: async (id, companyData) => {
    const response = await apiClient.put(`${API_URL}/companies/${id}`, companyData);
    return response.data;
  },
  toggleCompanySuspension: async (id) => {
    const response = await apiClient.patch(`${API_URL}/companies/${id}/suspend`);
    return response.data;
  },
  deleteCompany: async (id) => {
    const response = await apiClient.delete(`${API_URL}/companies/${id}`);
    return response.data;
  },

  // Tenant Users Management
  getTenantUsers: async (tenantId) => {
    const response = await apiClient.get(`${API_URL}/companies/${tenantId}/users`);
    return response.data;
  },
  createTenantUser: async (tenantId, userData) => {
    const response = await apiClient.post(`${API_URL}/companies/${tenantId}/users`, userData);
    return response.data;
  },
  updateTenantUser: async (tenantId, userId, userData) => {
    const response = await apiClient.put(`${API_URL}/companies/${tenantId}/users/${userId}`, userData);
    return response.data;
  },
  deleteTenantUser: async (tenantId, userId) => {
    const response = await apiClient.delete(`${API_URL}/companies/${tenantId}/users/${userId}`);
    return response.data;
  },
  impersonateTenant: async (tenantId) => {
    const response = await apiClient.post(`${API_URL}/companies/${tenantId}/impersonate`);
    return response.data;
  },
  
  // Global User Management
  getGlobalUsersByRole: async (role) => {
    const response = await apiClient.get(`${API_URL}/manage/users/${role}`);
    return response.data;
  },
  impersonateGlobalUser: async (userId) => {
    const response = await apiClient.post(`${API_URL}/manage/users/${userId}/impersonate`);
    return response.data;
  },

  // Subscriptions
  getSubscriptions: async () => {
    const response = await apiClient.get(`${API_URL}/subscriptions`);
    return response.data;
  },
  createSubscription: async (subData) => {
    const response = await apiClient.post(`${API_URL}/subscriptions`, subData);
    return response.data;
  },
  updateSubscription: async (id, subData) => {
    const response = await apiClient.put(`${API_URL}/subscriptions/${id}`, subData);
    return response.data;
  },
  deleteSubscription: async (id) => {
    const response = await apiClient.delete(`${API_URL}/subscriptions/${id}`);
    return response.data;
  },

  // Analytics
  getAnalyticsStats: async () => {
    const response = await apiClient.get(`${API_URL}/analytics/stats`);
    return response.data;
  },
  getGrowthData: async () => {
    const response = await apiClient.get(`${API_URL}/analytics/growth`);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await apiClient.get(`${API_URL}/notifications`);
    return response.data;
  },
  broadcastNotification: async (notifData) => {
    const response = await apiClient.post(`${API_URL}/notifications/broadcast`, notifData);
    return response.data;
  },

  // System Settings
  getSettings: async () => {
    const response = await apiClient.get(`${API_URL}/settings`);
    return response.data;
  },
  updateSettings: async (settingsData) => {
    const response = await apiClient.put(`${API_URL}/settings`, settingsData);
    return response.data;
  },
  getDatabaseAnalytics: async () => {
    const response = await apiClient.get(`${API_URL}/settings/analytics`);
    return response.data;
  },
  getDuplicates: async (field = 'email', customPath = '') => {
    const response = await apiClient.get(`${API_URL}/settings/duplicates`, {
      params: { field, ...(customPath ? { customPath } : {}) }
    });
    return response.data;
  },
  cleanupDuplicates: async (recordIds, collectionName = 'Users') => {
    const response = await apiClient.post(`${API_URL}/settings/cleanup`, { recordIds, collectionName });
    return response.data;
  }
};

export default superadminService;
