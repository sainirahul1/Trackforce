/**
 * Impersonation-Aware Storage Utility
 * 
 * In this application, impersonation data is stored in sessionStorage
 * to keep it isolated from the original session in localStorage.
 * This utility ensures the app always checks sessionStorage FIRST.
 */

const storage = {
  /**
   * Get an item from storage, preferring sessionStorage (impersonation)
   */
  getItem: (key) => {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  },

  /**
   * Set an item in the active storage
   */
  setItem: (key, value) => {
    const isImpersonating = !!sessionStorage.getItem('token');
    const target = isImpersonating ? sessionStorage : localStorage;
    target.setItem(key, value);
  },

  /**
   * Remove an item from both storages
   */
  removeItem: (key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },

  /**
   * Clear both storages
   */
  clear: () => {
    sessionStorage.clear();
    localStorage.clear();
  },

  /**
   * Get parsed user object
   */
  getUser: () => {
    const userRaw = storage.getItem('user');
    try {
      return userRaw ? JSON.parse(userRaw) : null;
    } catch (e) {
      console.error('[STORAGE] Failed to parse user data', e);
      return null;
    }
  },

  /**
   * Get auth token
   */
  getToken: () => storage.getItem('token'),

  /**
   * Get current role
   */
  getRole: () => storage.getItem('role'),
    
  /**
   * Get active portal context
   */
  getPortal: () => storage.getItem('portal')
};

export default storage;
