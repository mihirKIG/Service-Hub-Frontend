import axiosClient from './axiosClient';

export const authApi = {
  // Register new user
  register: (data) => axiosClient.post('http://127.0.0.1:8000/api/users/register/', data),

  // Login user
  login: (credentials) => axiosClient.post('http://127.0.0.1:8000/api/users/login/', credentials),

  // Logout user
  logout: () => axiosClient.post('http://127.0.0.1:8000/api/users/logout/'),

  // Refresh token
  refreshToken: (refreshToken) => 
    axiosClient.post('http://127.0.0.1:8000/api/users/token/refresh/', { refresh: refreshToken }),

  // Request password reset
  forgotPassword: (email) => 
    axiosClient.post('http://127.0.0.1:8000/api/users/password-reset/', { email }),

  // Reset password with token
  resetPassword: (data) => 
    axiosClient.post('http://127.0.0.1:8000/api/users/password-reset/confirm/', data),

  // Verify email
  verifyEmail: (token) => 
    axiosClient.post('http://127.0.0.1:8000/api/users/verify-email/', { token }),

  // Resend verification email
  resendVerification: (email) => 
    axiosClient.post('http://127.0.0.1:8000/api/users/resend-verification/', { email }),
};
