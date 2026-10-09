import apiClient from '../../../services/api/client';

export const rfqService = {
  getRfqs: async () => {
    const response = await apiClient.get('/rfq');
    return response.data;
  },
  
  createRfq: async (rfqData) => {
    const response = await apiClient.post('/rfq', rfqData);
    return response.data;
  },

  submitBid: async (rfqId, bidData) => {
    const response = await apiClient.post(`/rfq/${rfqId}/bids`, bidData);
    return response.data;
  },

  acceptBid: async (bidId) => {
    const response = await apiClient.post(`/rfq/bids/${bidId}/accept`);
    return response.data;
  }
};
