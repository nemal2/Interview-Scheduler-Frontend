import api from './api';

export const technologyAPI = {
  // Get all technologies
  getAllTechnologies: async () => {
    const response = await api.get('/technologies');
    return response.data;
  },

  // Get technology by ID
  getTechnologyById: async (id) => {
    const response = await api.get(`/technologies/${id}`);
    return response.data;
  },

  // Get technologies by category
  getTechnologiesByCategory: async (category) => {
    const response = await api.get(`/technologies/category/${category}`);
    return response.data;
  },

  // Get all unique categories
  getAllCategories: async () => {
    const response = await api.get('/technologies/categories');
    return response.data;
  },

  // Create new technology
  createTechnology: async (technologyData) => {
    const response = await api.post('/technologies', technologyData);
    return response.data;
  },

  // Update technology
  updateTechnology: async (id, technologyData) => {
    const response = await api.put(`/technologies/${id}`, technologyData);
    return response.data;
  },

  // Delete (deactivate) technology
  deleteTechnology: async (id) => {
    await api.delete(`/technologies/${id}`);
  }
};

export default technologyAPI;