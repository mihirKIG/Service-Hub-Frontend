import { useState, useEffect } from 'react';
import { paymentApi } from '../api/paymentApi';

export const usePayments = (filters = {}) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [JSON.stringify(filters)]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.getPayments(filters);
      setPayments(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { payments, loading, error, pagination, refetch: fetchPayments };
};

export const usePayment = (id) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.getPaymentById(id);
      setPayment(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { payment, loading, error, refetch: fetchPayment };
};

export const usePaymentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
};

export const usePaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.getPaymentMethods();
      setMethods(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMethod = async (data) => {
    try {
      const response = await paymentApi.addPaymentMethod(data);
      await fetchMethods();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const deleteMethod = async (id) => {
    try {
      await paymentApi.deletePaymentMethod(id);
      await fetchMethods();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const setDefault = async (id) => {
    try {
      await paymentApi.setDefaultPaymentMethod(id);
      await fetchMethods();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return {
    methods,
    loading,
    error,
    refetch: fetchMethods,
    addMethod,
    deleteMethod,
    setDefault,
  };
};
