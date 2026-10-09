import apiClient from '../../../services/api/client';

export const marketplaceService = {
  getListings: async (search = '', cropType = '', district = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (cropType) params.append('cropType', cropType);
    if (district) params.append('district', district);
    
    const response = await apiClient.get(`/marketplace/listings?${params.toString()}`);
    return response.data;
  },
  
  getMyListings: async () => {
    const response = await apiClient.get('/marketplace/my-listings');
    return response.data;
  },
  
  createListing: async (listingData) => {
    const response = await apiClient.post('/marketplace/listings', listingData);
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  placeOrder: async (orderData) => {
    const response = await apiClient.post('/marketplace/orders', orderData);
    return response.data;
  }
};
