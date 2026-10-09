import apiClient from '../../../services/api/client';

export const analyticsService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },
};
