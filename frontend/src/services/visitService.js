import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:5001/api/visits';

export const getVisits = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch visits');
  return response.json();
};

export const getVisitById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });
  if (!response.ok) throw new Error('Failed to fetch visit details');
  return response.json();
};

export const createVisit = async (visitData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(visitData)
  });
  if (!response.ok) throw new Error('Failed to create visit');
  return response.json();
};

export const updateVisit = async (id, visitData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(visitData)
  });
  if (!response.ok) throw new Error('Failed to update visit');
  return response.json();
};
