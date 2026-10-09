import { useState, useEffect, useCallback } from 'react';
import { rfqService } from '../services/rfq.api';

export const useRfq = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRfqs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rfqService.getRfqs();
      if (response.success) {
        setRfqs(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch RFQs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  const submitBid = async (rfqId, bidData) => {
    try {
      await rfqService.submitBid(rfqId, bidData);
      fetchRfqs(); // Refresh list to show updated bids
    } catch (err) {
      throw new Error(err.message || 'Failed to submit bid');
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await rfqService.acceptBid(bidId);
      fetchRfqs();
    } catch (err) {
      throw new Error(err.message || 'Failed to accept bid');
    }
  };

  return { rfqs, loading, error, refetch: fetchRfqs, submitBid, acceptBid };
};
