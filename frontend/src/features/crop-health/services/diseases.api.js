import apiClient from '../../../services/api/client';

export const diseasesService = {
  getDiseases: async (search = '', crop = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (crop) params.append('crop', crop);
    
    const response = await apiClient.get(`/diseases?${params.toString()}`);
    return response.data;
  },
  
  getDisease: async (id) => {
    const response = await apiClient.get(`/diseases/${id}`);
    return response.data;
  },
  
  // For contributors/experts to add diseases
  createDisease: async (diseaseData) => {
    const response = await apiClient.post('/diseases', diseaseData);
    return response.data;
  },
};
