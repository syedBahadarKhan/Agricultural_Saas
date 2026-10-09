import { useState, useEffect, useCallback } from 'react';
import { diseasesService } from '../services/diseases.api';

export const useDiseases = (initialSearch = '', initialCrop = '') => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(initialSearch);
  const [crop, setCrop] = useState(initialCrop);

  const fetchDiseases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await diseasesService.getDiseases(search, crop);
      if (response.success) {
        setDiseases(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch diseases');
    } finally {
      setLoading(false);
    }
  }, [search, crop]);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  return { diseases, loading, error, search, setSearch, crop, setCrop, refetch: fetchDiseases };
};
