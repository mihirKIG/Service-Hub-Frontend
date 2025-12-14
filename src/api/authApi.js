import axiosClient from './axiosClient';

export const authApi = {
  // Send OTP to phone number
  sendOTP: (phoneNumber) => 
    axiosClient.post('/users/send-otp/', { phone: phoneNumber }),

  // Verify OTP and login/register
  verifyOTP: (phoneNumber, otp, profileData = {}) => 
    axiosClient.post('/users/verify-otp/', { 
      phone: phoneNumber, 
      otp: otp,
      ...profileData  // Optional: first_name, last_name, email
    }),

  // Logout user
  logout: (refreshToken) => 
    axiosClient.post('/users/logout/', { refresh: refreshToken }),

  // Refresh access token
  refreshToken: (refreshToken) => 
    axiosClient.post('/users/token/refresh/', { refresh: refreshToken }),

  // Get user profile
  getProfile: () => 
    axiosClient.get('/users/profile/'),

  // Update user profile
  updateProfile: (data) => 
    axiosClient.patch('/users/profile/', data),

  // Google login with Firebase
  googleLogin: (token) => 
    axiosClient.post('/users/google/', { token }),
};
