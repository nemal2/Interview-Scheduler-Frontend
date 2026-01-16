import api from './api';

export const departmentAPI = {
  // Get all departments
  getAllDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  }
};

export default departmentAPI;