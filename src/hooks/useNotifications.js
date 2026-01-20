import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';

export const useNotifications = (filters = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [JSON.stringify(filters)]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationApi.getNotifications(filters);
      setNotifications(response.data.results);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      await fetchNotifications();
      await fetchUnreadCount();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      await fetchNotifications();
      await fetchUnreadCount();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      await fetchNotifications();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationApi.getPreferences();
      setPreferences(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (data) => {
    try {
      const response = await notificationApi.updatePreferences(data);
      setPreferences(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return { preferences, loading, error, updatePreferences, refetch: fetchPreferences };
};

export default useNotifications;
