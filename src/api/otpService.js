import axiosClient from './axiosClient';

/**
 * OTP Authentication Service
 * Handles phone-based OTP authentication and Google login
 */

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise} - API response
 */
export const sendOTP = async (phoneNumber) => {
  try {
    const response = await axiosClient.post('/users/send-otp/', {
      phone: phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.error('Send OTP Error:', error);
    if (error.response?.data) {
      const errorData = error.response.data;
      const message = errorData.message || errorData.error || errorData.detail || 'Failed to send OTP';
      throw { message };
    } else if (error.request) {
      throw { message: 'Cannot connect to server. Please check if backend is running on http://127.0.0.1:8000' };
    } else {
      throw { message: error.message || 'Failed to send OTP' };
    }
  }
};

/**
 * Verify OTP
 * @param {string} phoneNumber - User's phone number
 * @param {string} otp - OTP code received
 * @param {Object} profileData - Optional profile data (first_name, last_name, email)
 * @returns {Promise} - API response with JWT tokens
 */
export const verifyOTP = async (phoneNumber, otp, profileData = {}) => {
  try {
    console.log('🔵 Verifying OTP:', { phone: phoneNumber, otp: otp, profileData });
    
    const response = await axiosClient.post('/users/verify-otp/', {
      phone: phoneNumber,
      otp: otp,
      ...profileData,
    });
    
    console.log('✅ Verify OTP Response:', response.data);
    
    // The backend returns tokens nested in 'tokens' object
    const { tokens, user } = response.data;
    
    // Store tokens in localStorage
    if (tokens?.access) {
      localStorage.setItem('access_token', tokens.access);
    }
    if (tokens?.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    console.error('❌ Error Response:', error.response?.data);
    console.error('❌ Error Status:', error.response?.status);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      // Handle OTP field error
      if (errorData.otp) {
        const otpError = Array.isArray(errorData.otp) ? errorData.otp[0] : errorData.otp;
        console.error('❌ OTP Field Error:', otpError);
        throw { message: otpError };
      }
      const message = errorData.message || errorData.error || errorData.detail || 'Invalid or expired OTP';
      console.error('❌ Final Error Message:', message);
      throw { message };
    } else if (error.request) {
      throw { message: 'Cannot connect to server. Please check if backend is running.' };
    } else {
      throw { message: error.message || 'Invalid OTP' };
    }
  }
};

/**
 * Google Sign-In with Firebase
 * @param {string} idToken - Firebase ID token
 * @returns {Promise} - API response with JWT tokens
 */
export const googleLogin = async (idToken, firebaseUser) => {
  try {
    console.log('🔵 Sending user data to backend...');
    console.log('🔵 Backend URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api');
    console.log('🔵 Firebase User:', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });
    
    // Backend expects uid, email, displayName, photoURL (camelCase as per GoogleAuthSerializer)
    const response = await axiosClient.post('/users/google/', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
    });
    
    console.log('✅ Google Login Response:', response.data);
    
    // The backend returns tokens nested in 'tokens' object
    const { tokens, user } = response.data;
    
    // Store tokens in localStorage
    if (tokens?.access) {
      localStorage.setItem('access_token', tokens.access);
    }
    if (tokens?.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Google Login Error:', error);
    console.error('❌ Error Code:', error.code);
    console.error('❌ Error Response:', error.response?.data);
    console.error('❌ Error Status:', error.response?.status);
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw { message: '⏱️ Request timeout. Backend server is not responding. Please start your Django backend server.' };
    }
    
    // Handle network error
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw { message: '🔌 Cannot connect to backend. Please ensure Django server is running at http://127.0.0.1:8000' };
    }
    
    if (error.response?.data) {
      const errorData = error.response.data;
      const message = errorData.message || errorData.error || errorData.detail || 'Google login failed';
      throw { message };
    } else if (error.request) {
      throw { message: '❌ Backend not responding. Start Django server: python manage.py runserver' };
    } else {
      throw { message: error.message || 'Google login failed' };
    }
  }
};

/**
 * Logout user
 * Calls backend logout endpoint and clears authentication data
 */
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await axiosClient.post('/users/logout/', {
        refresh: refreshToken,
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with local cleanup even if API call fails
  } finally {
    // Clear all authentication data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
