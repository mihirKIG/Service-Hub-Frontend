/**
 * Auth Utilities - Easy access to authentication functions
 * Import this file anywhere you need auth functionality
 */

export { useAuth, AuthProvider } from './context/AuthContext';
export { sendOTP, verifyOTP, googleLogin, logout, isAuthenticated, getCurrentUser } from './api/otpService';

// Quick usage examples:

// 1. In a component:
// import { useAuth } from '@utils/auth';
// const { user, isAuthenticated, logout } = useAuth();

// 2. Outside components (e.g., utility functions):
// import { isAuthenticated, getCurrentUser } from '@utils/auth';
// if (isAuthenticated()) { ... }
