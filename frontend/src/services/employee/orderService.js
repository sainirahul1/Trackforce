import { getAuthHeader } from '../core/authService';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/orders`;

export const getOrders = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const getOrderStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch order stats');
  return response.json();
};

export const createOrderAPI = async (orderData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
};

export const updateOrderAPI = async (id, orderData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) throw new Error('Failed to update order');
  return response.json();
};
