import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/tenant`;

// Helper to get auth header
const getAuthHeader = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Persistent Caching Logic (localStorage)
const CACHE_PREFIX = 'tf_cache_';
const CACHE_DURATION = 300000; // 5 minutes (increased for better refresh experience)

export const clearCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};

export const getSyncCachedData = (key) => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    return null; // Expired
  } catch (e) {
    return null;
  }
};

const fetchDataWithCache = async (key, fetcher) => {
  const cachedData = getSyncCachedData(key);
  if (cachedData) return cachedData;

  const data = await fetcher();
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Cache write failed (storage full?):', e);
  }
  return data;
};

// Get all managers
export const getManagers = async () => {
  return fetchDataWithCache('managers', async () => {
    const response = await axios.get(`${API_URL}/managers`, {
      headers: getAuthHeader(),
    });
    return response.data;
  });
};

// Create a manager
export const createManager = async (managerData) => {
  const response = await axios.post(`${API_URL}/managers`, managerData, {
    headers: getAuthHeader(),
  });
  clearCache(); // Invalidate cache on mutations
  return response;
};

// Update a manager
export const updateManager = async (id, managerData) => {
  const response = await axios.put(`${API_URL}/managers/${id}`, managerData, {
    headers: getAuthHeader(),
  });
  clearCache();
  return response;
};

// Delete a manager
export const deleteManager = async (id) => {
  const response = await axios.delete(`${API_URL}/managers/${id}`, {
    headers: getAuthHeader(),
  });
  clearCache();
  return response;
};

// Get all employees
export const getEmployees = async () => {
  return fetchDataWithCache('employees', async () => {
    const response = await axios.get(`${API_URL}/employees`, {
      headers: getAuthHeader(),
    });
    return response.data;
  });
};

// Get an employee by ID
export const getEmployeeById = async (id) => {
  const response = await axios.get(`${API_URL}/employees/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Create an employee
export const createEmployee = async (employeeData) => {
  const response = await axios.post(`${API_URL}/employees`, employeeData, {
    headers: getAuthHeader(),
  });
  return response;
};

// Update an employee
export const updateEmployee = async (id, employeeData) => {
  const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, {
    headers: getAuthHeader(),
  });
  return response;
};

// Delete an employee
export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/employees/${id}`, {
    headers: getAuthHeader(),
  });
  return response;
};


// Get tenant settings
export const getSettings = async () => {
  return fetchDataWithCache('tenant_settings', async () => {
    const response = await axios.get(`${API_URL}/settings`, {
      headers: getAuthHeader(),
    });
    return response.data;
  });
};

// Get subscription details (Tenant only)
export const getSubscription = async () => {
  const response = await axios.get(`${API_URL}/subscription`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update General Info
export const updateGeneralInfo = async (generalData) => {
  const response = await axios.put(`${API_URL}/settings/general`, generalData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update subscription details (Tenant only)
export const updateSubscription = async (subscriptionData) => {
  const response = await axios.put(`${API_URL}/subscription`, subscriptionData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update Password
export const updatePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/settings/password`, passwordData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update Localization
export const updateLocalization = async (localizationData) => {
  const response = await axios.put(`${API_URL}/settings/localization`, localizationData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Update Account Preferences
export const updateAccountPreferences = async (accountData) => {
  const response = await axios.put(`${API_URL}/settings/account`, accountData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Request Data Export
export const requestDataExport = async () => {
  const response = await axios.get(`${API_URL}/settings/export`, {
    headers: getAuthHeader(),
    responseType: 'blob',
  });
  return response.data;
};

// Sign out all managers
export const signOutAllManagers = async () => {
  const response = await axios.post(`${API_URL}/settings/signout-managers`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get available plans (Tenant only)
export const getAvailablePlans = async () => {
  const response = await axios.get(`${API_URL}/available-plans`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Dashboard methods
export const getDashboardStats = async () => {
  return fetchDataWithCache('dashboard_stats', async () => {
    const response = await axios.get(`${API_URL}/dashboard-stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  });
};

export const getDashboardManagers = async (page = 1, limit = 5, search = '') => {
  const cacheKey = `dashboard_managers_${page}_${limit}_${search}`;
  return fetchDataWithCache(cacheKey, async () => {
    const response = await axios.get(`${API_URL}/dashboard-managers?page=${page}&limit=${limit}&search=${search}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  });
};

const tenantService = {
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,

  getSettings,
  updateGeneralInfo,
  updatePassword,
  updateLocalization,
  updateAccountPreferences,
  requestDataExport,
  signOutAllManagers,
  getSubscription,
  updateSubscription,
  getAvailablePlans,
  getDashboardStats,
  getDashboardManagers,
};

export default tenantService;
