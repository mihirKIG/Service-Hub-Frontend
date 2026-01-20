import { useState, useEffect } from 'react';
import { providerApi } from '../api/providerApi';

export const useProviders = (filters = {}) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, [JSON.stringify(filters)]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerApi.getProviders(filters);
      setProviders(response.data.results);
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

  return { providers, loading, error, pagination, refetch: fetchProviders };
};

export const useProvider = (id) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProvider();
    }
  }, [id]);

  const fetchProvider = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerApi.getProviderById(id);
      setProvider(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { provider, loading, error, refetch: fetchProvider };
};

export const useMyProvider = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyProvider();
  }, []);

  const fetchMyProvider = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerApi.getMyProfile();
      setProvider(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProvider = async (data) => {
    try {
      const response = await providerApi.updateProvider(data);
      setProvider(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return { provider, loading, error, refetch: fetchMyProvider, updateProvider };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
};
