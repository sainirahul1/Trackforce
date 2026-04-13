import apiClient from '../apiClient';
import storage from '../../utils/storage';

const API_URL = '/reatchall/tenant/notifications';

const notificationService = {
  // Fetch all notifications for logged-in user
  getAll: async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  },

  // Mark a single notification as read
  markAsRead: async (id) => {
    const response = await apiClient.put(`${API_URL}/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await apiClient.put(`${API_URL}/read-all`);
    return response.data;
  },

  // Delete a single notification
  delete: async (id) => {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default notificationService;
