import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:5001/api/orders';

export const getOrders = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
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
