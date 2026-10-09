import apiClient from '../../../services/api/client';

export const farmsService = {
  getFarms: async () => {
    const response = await apiClient.get('/farms');
    return response.data;
  },
  
  getFarm: async (id) => {
    const response = await apiClient.get(`/farms/${id}`);
    return response.data;
  },
  
  createFarm: async (farmData) => {
    const response = await apiClient.post('/farms', farmData);
    return response.data;
  },
  
  updateFarm: async (id, farmData) => {
    const response = await apiClient.put(`/farms/${id}`, farmData);
    return response.data;
  },
  
  deleteFarm: async (id) => {
    const response = await apiClient.delete(`/farms/${id}`);
    return response.data;
  },
};
