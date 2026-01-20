import { useState, useEffect } from 'react';
import { reviewApi } from '../api/reviewApi';

export const useReviews = (filters = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [JSON.stringify(filters)]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewApi.getReviews(filters);
      setReviews(response.data.results);
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

  return { reviews, loading, error, pagination, refetch: fetchReviews };
};

export const useProviderReviews = (providerId, filters = {}) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providerId) {
      fetchReviews();
      fetchStats();
    }
  }, [providerId, JSON.stringify(filters)]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewApi.getProviderReviews(providerId, filters);
      setReviews(response.data.results);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewApi.getProviderStats(providerId);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch review stats:', err);
    }
  };

  return { reviews, stats, loading, error, refetch: fetchReviews };
};

export const useMyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewApi.getMyReviews();
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (data) => {
    try {
      const response = await reviewApi.createReview(data);
      await fetchMyReviews();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const updateReview = async (id, data) => {
    try {
      const response = await reviewApi.updateReview(id, data);
      await fetchMyReviews();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const deleteReview = async (id) => {
    try {
      await reviewApi.deleteReview(id);
      await fetchMyReviews();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return {
    reviews,
    loading,
    error,
    refetch: fetchMyReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};
