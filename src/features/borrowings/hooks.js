import { useState, useCallback } from 'react';
import { apiClient } from '../../lib/apiClient';

export function useBorrowingsDashboard() {
  const [data, setData] = useState({
    metrics: { returned: 0, active: 0, uniqueBorrowers: 0 },
    transactions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.get('/borrowings/dashboard');
      // If result contains metrics as an array, extract the first record safely
      const metricsRow = Array.isArray(result.metrics) ? result.metrics[0] : result.metrics;
      
      setData({
        metrics: metricsRow || { returned: 0, active: 0, uniqueBorrowers: 0 },
        transactions: result.transactions || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refresh: fetchDashboard };
}

export function useCreateBorrowing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTransaction = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.post('/borrowings', formData);
      return { success: true, transactionId: result.transactionId };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}
