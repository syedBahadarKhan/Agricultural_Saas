import { useState, useEffect, useCallback } from 'react';
import { farmsService } from '../services/farms.api';

export const useFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await farmsService.getFarms();
      if (response.success) {
        setFarms(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch farms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const addFarm = async (farmData) => {
    try {
      const response = await farmsService.createFarm(farmData);
      if (response.success) {
        setFarms((prev) => [...prev, response.data]);
        return response.data;
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to add farm');
    }
  };

  return { farms, loading, error, fetchFarms, addFarm };
};
