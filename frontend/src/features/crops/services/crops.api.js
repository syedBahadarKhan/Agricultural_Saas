import apiClient from '../../../services/api/client';

export const cropsService = {
  getCrops: async () => {
    const response = await apiClient.get('/crops');
    return response.data;
  },
  
  getCrop: async (id) => {
    const response = await apiClient.get(`/crops/${id}`);
    return response.data;
  },
  
  createCrop: async (cropData) => {
    const response = await apiClient.post('/crops', cropData);
    return response.data;
  },
  
  updateCrop: async (id, cropData) => {
    const response = await apiClient.put(`/crops/${id}`, cropData);
    return response.data;
  },
  
  deleteCrop: async (id) => {
    const response = await apiClient.delete(`/crops/${id}`);
    return response.data;
  },
};
