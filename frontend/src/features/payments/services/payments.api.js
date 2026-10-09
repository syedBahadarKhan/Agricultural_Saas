import apiClient from '../../../services/api/client';

export const paymentsService = {
  createPaymentIntent: async (orderId) => {
    const response = await apiClient.post('/payments/create-intent', { orderId });
    return response.data;
  },
  
  confirmPayment: async (orderId, paymentIntentId) => {
    const response = await apiClient.post('/payments/confirm', { orderId, paymentIntentId });
    return response.data;
  }
};
