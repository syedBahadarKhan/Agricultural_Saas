import { useState } from 'react';
import { logisticsService } from '../services/logistics.api';

export const useLogistics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getShipmentByOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await logisticsService.getShipmentDetails(orderId);
      return response.data;
    } catch (err) {
      // It's normal for a shipment not to exist yet if it's pending
      return null; 
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (shipmentData) => {
    try {
      setLoading(true);
      const response = await logisticsService.createShipment(shipmentData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getShipmentByOrder, createShipment, loading, error };
};
