import apiClient from './apiClient';

/**
 * Fetch all follow-ups for the current tenant.
 */
export const getFollowUps = async () => {
  const response = await apiClient.get('/reatchall/manager/follow-ups');
  return response.data;
};

/**
 * Fetch a single follow-up by ID with its full history.
 */
export const getFollowUpById = async (id) => {
  const response = await apiClient.get(`/reatchall/manager/follow-ups/${id}`);
  return response.data;
};

/**
 * Add a new history entry to a follow-up.
 * @param {string} id - Follow-up ID
 * @param {Object} data - { action, note, outcome, scheduledDate }
 */
export const addFollowUpHistory = async (id, data) => {
  const response = await apiClient.post(`/reatchall/manager/follow-ups/${id}/history`, data);
  return response.data;
};

/**
 * Update follow-up details like status, priority, or assignment.
 * @param {string} id - Follow-up ID
 * @param {Object} data - { status, priority, nextFollowUpDate, assignedTo, assignedToName }
 */
export const updateFollowUp = async (id, data) => {
  const response = await apiClient.put(`/reatchall/manager/follow-ups/${id}`, data);
  return response.data;
};
