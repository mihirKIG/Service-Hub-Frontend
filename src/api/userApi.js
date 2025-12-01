import axiosClient from './axiosClient';

export const userApi = {
  // Get current user profile
  getProfile: () => axiosClient.get('/users/profile/'),

  // Update user profile
  updateProfile: (data) => axiosClient.put('/users/profile/', data),

  // Partial update user profile
  patchProfile: (data) => axiosClient.patch('/users/profile/', data),

  // Upload profile image
  uploadProfileImage: (formData) => 
    axiosClient.post('/users/profile/upload-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Change password
  changePassword: (data) => 
    axiosClient.post('/users/change-password/', data),

  // Update notification preferences
  updateNotificationPreferences: (preferences) => 
    axiosClient.put('/users/notification-preferences/', preferences),

  // Get user statistics
  getUserStats: () => axiosClient.get('/users/stats/'),

  // Delete account
  deleteAccount: (password) => 
    axiosClient.delete('/users/profile/', { data: { password } }),
};
