import { useState } from 'react';
import { paymentsService } from '../services/payments.api';

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      // Step 1: Create intent
      const intentResponse = await paymentsService.createPaymentIntent(orderId);
      
      if (intentResponse.success) {
        // Step 2: In a real app, you would pass intentResponse.clientSecret to Stripe Elements here.
        // For our MVP, we simulate immediate successful confirmation.
        const confirmResponse = await paymentsService.confirmPayment(orderId, intentResponse.clientSecret);
        return confirmResponse;
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
};
