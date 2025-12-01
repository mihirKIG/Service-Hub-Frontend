import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, fetchUnreadCount } from '@features/notifications/notificationSlice';

const useNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const refetch = () => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  };

  return {
    notifications,
    unreadCount,
    loading,
    refetch,
  };
};

export default useNotifications;
