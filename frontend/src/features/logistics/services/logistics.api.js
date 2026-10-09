import apiClient from '../../../services/api/client';

export const logisticsService = {
  getShipmentDetails: async (orderId) => {
    const response = await apiClient.get(`/logistics/${orderId}`);
    return response.data;
  },
  
  createShipment: async (shipmentData) => {
    const response = await apiClient.post('/logistics', shipmentData);
    return response.data;
  },

  updateStatus: async (shipmentId, status) => {
    const response = await apiClient.put(`/logistics/${shipmentId}/status`, { status });
    return response.data;
  }
};
