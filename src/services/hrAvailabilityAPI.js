// src/services/hrAvailabilityAPI.js
import api from './api';

export const hrAvailabilityAPI = {
  // Get all interviewer availability with optional filters
  getAllAvailability: async (filters = null) => {
    if (filters) {
      const response = await api.post('/hr/availability/filter', filters);
      return response.data;
    }
    const response = await api.get('/hr/availability');
    return response.data;
  },

  // Create interview request
  createInterviewRequest: async (requestData) => {
    const response = await api.post('/interview-requests', requestData);
    return response.data;
  }
};

export default hrAvailabilityAPI;