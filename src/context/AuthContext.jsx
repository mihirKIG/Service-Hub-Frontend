import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '@api/otpService';
import { signInWithGoogle } from '@config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOTP = async (phoneNumber) => {
    try {
      console.log('🔵 Sending OTP to:', phoneNumber);
      const response = await authService.sendOTP(phoneNumber);
      console.log('✅ OTP Response:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ OTP Error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };

  // Verify OTP
  const verifyOTP = async (phoneNumber, otp) => {
    try {
      const response = await authService.verifyOTP(phoneNumber, otp);
      
      // Set user data
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Google Login with Firebase
  const googleLogin = async () => {
    try {
      console.log('🔵 Starting Firebase Google Sign-In...');
      
      // Sign in with Firebase
      const firebaseResult = await signInWithGoogle();
      
      if (!firebaseResult.success) {
        // Return user-friendly error message
        const errorMsg = firebaseResult.code === 'auth/popup-closed-by-user' 
          ? 'Sign-in cancelled. Please try again when ready.' 
          : firebaseResult.error;
        return { success: false, error: errorMsg };
      }
      
      console.log('✅ Firebase Sign-In Success');
      console.log('🔵 Sending user data to backend...');
      
      // Send Firebase user data to backend
      const response = await authService.googleLogin(firebaseResult.token, firebaseResult.user);
      
      // Set user data
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      console.log('✅ Google Login Complete');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Google Login Failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    sendOTP,
    verifyOTP,
    googleLogin,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
