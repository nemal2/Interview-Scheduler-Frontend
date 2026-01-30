// src/services/interviewRequestAPI.js
import api from './api';

export const interviewRequestAPI = {
  // Get my interview requests (for interviewers)
  getMyRequests: async () => {
    const response = await api.get('/interview-requests/my-requests');
    return response.data;
  },

  // Get pending requests
  getPendingRequests: async () => {
    const response = await api.get('/interview-requests/pending');
    return response.data;
  },

  // Respond to interview request
  respondToRequest: async (requestId, responseData) => {
    const response = await api.post(`/interview-requests/${requestId}/respond`, responseData);
    return response.data;
  },

  // Get request stats
  getRequestStats: async () => {
    const response = await api.get('/interview-requests/stats');
    return response.data;
  }
};

export default interviewRequestAPI;