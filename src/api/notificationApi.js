import axiosClient from './axiosClient';

export const notificationApi = {
  // Get all notifications
  getNotifications: (params) => axiosClient.get('/notifications/', { params }),

  // Get notification by ID
  getNotificationById: (id) => axiosClient.get(`/notifications/${id}/`),

  // Get unread count
  getUnreadCount: () => axiosClient.get('/notifications/unread-count/'),

  // Mark notification as read
  markAsRead: (id) => axiosClient.post(`/notifications/${id}/mark-read/`),

  // Mark all as read
  markAllAsRead: () => axiosClient.post('/notifications/mark-all-read/'),

  // Delete notification
  deleteNotification: (id) => axiosClient.delete(`/notifications/${id}/delete/`),

  // Clear all notifications
  clearAll: () => axiosClient.delete('/notifications/clear-all/'),

  // Get notification preferences
  getPreferences: () => axiosClient.get('/notifications/preferences/'),

  // Update notification preferences
  updatePreferences: (data) => axiosClient.put('/notifications/preferences/', data),
};
