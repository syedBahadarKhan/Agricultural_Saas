import { useState, useEffect, useCallback } from 'react';
import { marketplaceService } from '../services/marketplace.api';

export const useMarketplace = (initialSearch = '', initialCropType = '', initialDistrict = '') => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState(initialSearch);
  const [cropType, setCropType] = useState(initialCropType);
  const [district, setDistrict] = useState(initialDistrict);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await marketplaceService.getListings(search, cropType, district);
      if (response.success) {
        setListings(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [search, cropType, district]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const placeOrder = async (orderData) => {
    try {
      const response = await marketplaceService.placeOrder(orderData);
      return response;
    } catch (err) {
      throw new Error(err.message || 'Failed to place order');
    }
  };

  return { listings, loading, error, search, setSearch, cropType, setCropType, district, setDistrict, refetch: fetchListings, placeOrder };
};
