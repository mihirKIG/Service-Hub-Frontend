import { useState, useEffect } from 'react';
import { servicesApi } from '../api/servicesApi';

export const useServices = (filters = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [JSON.stringify(filters)]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getServices(filters);
      setServices(response.data.results);
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

  return { services, loading, error, pagination, refetch: fetchServices };
};

export const useService = (id) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getServiceById(id);
      setService(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { service, loading, error, refetch: fetchService };
};

export const useFeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getFeaturedServices();
      setServices(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, refetch: fetchFeaturedServices };
};

export const usePopularServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularServices();
  }, []);

  const fetchPopularServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getPopularServices();
      setServices(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, refetch: fetchPopularServices };
};

export const useMyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getMyServices();
      setServices(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (data) => {
    try {
      const response = await servicesApi.createService(data);
      await fetchMyServices();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const updateService = async (id, data) => {
    try {
      const response = await servicesApi.updateService(id, data);
      await fetchMyServices();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const deleteService = async (id) => {
    try {
      await servicesApi.deleteService(id);
      await fetchMyServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return {
    services,
    loading,
    error,
    refetch: fetchMyServices,
    createService,
    updateService,
    deleteService,
  };
};
