import api from './api';

export const profileAPI = {
  // Get current user's profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update profile information
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Get all technologies
  getAllTechnologies: async () => {
    const response = await api.get('/technologies');
    return response.data;
  },

  // Get user's interviewer technologies
  getInterviewerTechnologies: async () => {
    const response = await api.get('/profile/interviewer-technologies');
    return response.data;
  },

  // Add interviewer technology
  addInterviewerTechnology: async (technologyId, yearsOfExperience) => {
    const response = await api.post('/profile/interviewer-technologies', {
      technologyId,
      yearsOfExperience
    });
    return response.data;
  },

  // Remove interviewer technology
  removeInterviewerTechnology: async (id) => {
    await api.delete(`/profile/interviewer-technologies/${id}`);
  },

  // Get all departments
  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  // Get all designations
  getDesignations: async () => {
    const response = await api.get('/designations');
    return response.data;
  },

  // Create new technology (if it doesn't exist)
  createTechnology: async (name, category = 'General') => {
    const response = await api.post('/technologies', { name, category });
    return response.data;
  }
};

export default profileAPI;