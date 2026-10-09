import apiClient from '../../../services/api/client';

export const adminService = {
  getPendingApplications: async () => {
    const response = await apiClient.get('/admin/applications/pending');
    return response.data;
  },

  updateApplicationStatus: async (id, payload) => {
    const response = await apiClient.put(`/admin/applications/${id}/status`, payload);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  }
};
