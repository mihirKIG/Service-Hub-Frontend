// Application constants

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8001';

// App Information
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ServiceHub';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// User Types
export const USER_TYPES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING: 'booking',
  PAYMENT: 'payment',
  MESSAGE: 'message',
  REVIEW: 'review',
  SYSTEM: 'system',
};

// Service Categories
export const SERVICE_CATEGORIES = [
  { id: 1, name: 'Home Services', slug: 'home-services' },
  { id: 2, name: 'Beauty & Wellness', slug: 'beauty-wellness' },
  { id: 3, name: 'Education & Training', slug: 'education-training' },
  { id: 4, name: 'Events & Entertainment', slug: 'events-entertainment' },
  { id: 5, name: 'Health & Fitness', slug: 'health-fitness' },
  { id: 6, name: 'Professional Services', slug: 'professional-services' },
  { id: 7, name: 'Technology', slug: 'technology' },
  { id: 8, name: 'Transportation', slug: 'transportation' },
];

// Rating Values
export const RATING_VALUES = [1, 2, 3, 4, 5];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5; // MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy hh:mm a';
export const TIME_FORMAT = 'hh:mm a';

// Validation Rules
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

// Social Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/servicehub',
  TWITTER: 'https://twitter.com/servicehub',
  INSTAGRAM: 'https://instagram.com/servicehub',
  LINKEDIN: 'https://linkedin.com/company/servicehub',
};

// Contact Information
export const CONTACT_EMAIL = 'support@servicehub.com';
export const CONTACT_PHONE = '+1 (555) 123-4567';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  MY_BOOKINGS: '/bookings',
  PROVIDERS: '/providers',
  PROVIDER_DETAIL: '/providers/:id',
  BOOK_SERVICE: '/book/:providerId',
  PAYMENT: '/payment',
  PAYMENT_HISTORY: '/payment/history',
  CHAT: '/chat',
  CHAT_ROOM: '/chat/:roomId',
  NOTIFICATIONS: '/notifications',
  REVIEWS: '/reviews',
  PROVIDER_DASHBOARD: '/provider/dashboard',
  PROVIDER_SERVICES: '/provider/services',
  PROVIDER_AVAILABILITY: '/provider/availability',
  PROVIDER_PORTFOLIO: '/provider/portfolio',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Toast Configuration
export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};
