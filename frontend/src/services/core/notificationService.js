const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const BASE_URL = `${getBaseUrl()}/notifications`;

const getHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const notificationService = {
  // Fetch all notifications for logged-in user
  getAll: async () => {
    const res = await fetch(BASE_URL, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  // Mark a single notification as read
  markAsRead: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return res.json();
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const res = await fetch(`${BASE_URL}/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return res.json();
  },

  // Delete a single notification
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete notification');
    return res.json();
  },
};

export default notificationService;
