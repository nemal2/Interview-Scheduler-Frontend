import api from './api';

export const tierAPI = {
  // Get all tiers
  getAllTiers: async () => {
    const response = await api.get('/tiers');
    return response.data;
  },

  // Get tier by ID
  getTierById: async (id) => {
    const response = await api.get(`/tiers/${id}`);
    return response.data;
  },

  // Get tiers by department
  getTiersByDepartment: async (departmentId) => {
    const response = await api.get(`/tiers/department/${departmentId}`);
    return response.data;
  },

  // Create new tier
  createTier: async (tierData) => {
    const response = await api.post('/tiers', tierData);
    return response.data;
  },

  // Update tier
  updateTier: async (id, tierData) => {
    const response = await api.put(`/tiers/${id}`, tierData);
    return response.data;
  },

  // Delete (deactivate) tier
  deleteTier: async (id) => {
    await api.delete(`/tiers/${id}`);
  }
};

export default tierAPI;