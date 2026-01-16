import api from './api';

export const designationAPI = {
  // Get all designations
  getAllDesignations: async () => {
    const response = await api.get('/designations');
    return response.data;
  },

  // Get designation by ID
  getDesignationById: async (id) => {
    const response = await api.get(`/designations/${id}`);
    return response.data;
  },

  // Get designations by department
  getDesignationsByDepartment: async (departmentId) => {
    const response = await api.get(`/designations/department/${departmentId}`);
    return response.data;
  },

  // Create new designation
  createDesignation: async (designationData) => {
    const response = await api.post('/designations', designationData);
    return response.data;
  },

  // Update designation
  updateDesignation: async (id, designationData) => {
    const response = await api.put(`/designations/${id}`, designationData);
    return response.data;
  },

  // Delete (deactivate) designation
  deleteDesignation: async (id) => {
    await api.delete(`/designations/${id}`);
  }
};

export default designationAPI;