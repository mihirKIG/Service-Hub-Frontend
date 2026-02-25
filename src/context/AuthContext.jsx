import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as authService from '@api/otpService';
import { signInWithGoogle } from '@config/firebase';
import { setUser as setReduxUser, clearAuth } from '@features/auth/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Sync with Redux
        dispatch(setReduxUser(parsedUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
        dispatch(clearAuth());
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      dispatch(clearAuth());
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
        // Sync with Redux
        dispatch(setReduxUser(response.user));
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
        // Sync with Redux
        dispatch(setReduxUser(response.user));
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      // Sync with Redux
      dispatch(clearAuth());
      setUser(null);
      setIsAuthenticated(false);
      navigate('/'); // Redirect to home page after logout
    }
  };

  // Admin Login with phone and password
  const adminLogin = async (phone, password) => {
    try {
      console.log('🔵 Admin Login - Phone:', phone);
      const response = await authService.adminLogin(phone, password);
      
      // Set user data
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        // Sync with Redux
        dispatch(setReduxUser(response.user));
      }
      
      console.log('✅ Admin Login Success');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Admin Login Failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Invalid admin credentials' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    sidebarOpen,
    setSidebarOpen,
    sendOTP,
    verifyOTP,
    googleLogin,
    adminLogin,
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
