import axiosClient from './axiosClient';

export const notificationApi = {
  // Get all notifications
  getNotifications: (params) => axiosClient.get('/notifications/', { params }),

  // Get notification by ID
  getNotificationById: (id) => axiosClient.get(`/notifications/${id}/`),

  // Mark notification as read
  markAsRead: (id) => axiosClient.post(`/notifications/${id}/mark-read/`),

  // Mark all notifications as read
  markAllAsRead: () => axiosClient.post('/notifications/mark-all-read/'),

  // Delete notification
  deleteNotification: (id) => axiosClient.delete(`/notifications/${id}/`),

  // Delete all notifications
  deleteAll: () => axiosClient.delete('/notifications/delete-all/'),

  // Get unread count
  getUnreadCount: () => axiosClient.get('/notifications/unread-count/'),

  // Get notification settings
  getSettings: () => axiosClient.get('/notifications/settings/'),

  // Update notification settings
  updateSettings: (settings) => 
    axiosClient.put('/notifications/settings/', settings),

  // Subscribe to push notifications
  subscribePush: (subscription) => 
    axiosClient.post('/notifications/push-subscribe/', subscription),

  // Unsubscribe from push notifications
  unsubscribePush: () => 
    axiosClient.post('/notifications/push-unsubscribe/'),

  // Test notification
  testNotification: () => 
    axiosClient.post('/notifications/test/'),
};
