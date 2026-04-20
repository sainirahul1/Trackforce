import apiClient from './apiClient';

/**
 * Fetch all follow-ups assigned to the current employee.
 */
export const getFollowUps = async () => {
  const response = await apiClient.get('/reatchall/employee/follow-ups');
  return response.data;
};

/**
 * Add a new history entry to a follow-up.
 * @param {string} id - Follow-up ID
 * @param {Object} data - { action, note, outcome, scheduledDate }
 */
export const addFollowUpHistory = async (id, data) => {
  const response = await apiClient.post(`/reatchall/employee/follow-ups/${id}/history`, data);
  return response.data;
};
