import { useState, useEffect, useCallback } from 'react';
import { cropsService } from '../services/crops.api';

export const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cropsService.getCrops();
      if (response.success) {
        setCrops(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const addCrop = async (cropData) => {
    try {
      const response = await cropsService.createCrop(cropData);
      if (response.success) {
        setCrops((prev) => [...prev, response.data]);
        return response.data;
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to add crop');
    }
  };

  return { crops, loading, error, fetchCrops, addCrop };
};
