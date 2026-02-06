// src/services/hrAvailabilityAPI.js
import api from './api';

export const hrAvailabilityAPI = {
  // Get all interviewer availability with optional filters
  getAllAvailability: async (filters = null) => {
    try {
      if (filters) {
        console.log('Sending filters to backend:', filters);
        const response = await api.post('/hr/availability/filter', filters);
        console.log('Received response:', response.data);
        return response.data;
      }
      const response = await api.get('/hr/availability');
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  // Create interview request (books the slot)
  createInterviewRequest: async (requestData) => {
    try {
      console.log('Creating interview request:', requestData);
      const response = await api.post('/interview-requests', requestData);
      console.log('Interview request created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating interview request:', error);
      throw error;
    }
  },

  // Get HR's own interview requests
  getHRRequests: async () => {
    try {
      const response = await api.get('/interview-requests/hr-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching HR requests:', error);
      throw error;
    }
  },

  // Cancel an interview request (frees up the slot)
  cancelInterviewRequest: async (requestId) => {
    try {
      await api.delete(`/interview-requests/${requestId}/cancel`);
    } catch (error) {
      console.error('Error canceling interview request:', error);
      throw error;
    }
  }
};

export default hrAvailabilityAPI;