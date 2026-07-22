import axiosClient from './axiosClient';

/**
 * Provider API Service
 * Handles all provider-related API calls
 */

// ============================================
// SERVICE POSTS (Available Provider Positions)
// ============================================

/**
 * Get all active service posts
 * @param {Object} params - Query parameters (category, location)
 */
export const getServicePosts = async (params = {}) => {
  const response = await axiosClient.get('/service-posts/', { params });
  return response.data;
};

/**
 * Get single service post by ID
 * @param {number} id - Service post ID
 */
export const getServicePost = async (id) => {
  const response = await axiosClient.get(`/service-posts/${id}/`);
  return response.data;
};

// ============================================
// PROVIDER APPLICATIONS
// ============================================

/**
 * Submit provider application
 * @param {Object} applicationData - Application form data
 */
export const submitProviderApplication = async (applicationData) => {
  const response = await axiosClient.post('/provider-applications/', applicationData);
  return response.data;
};

/**
 * Get my provider applications
 */
export const getMyApplications = async () => {
  const response = await axiosClient.get('/provider-applications/my-applications/');
  return response.data;
};

/**
 * Get application by ID
 * @param {number} id - Application ID
 */
export const getApplication = async (id) => {
  const response = await axiosClient.get(`/provider-applications/${id}/`);
  return response.data;
};

// ============================================
// PROVIDER DASHBOARD - STATS
// ============================================

/**
 * Get provider dashboard statistics
 */
export const getProviderDashboardStats = async () => {
  const response = await axiosClient.get('/provider/dashboard/stats/');
  return response.data;
};

/**
 * Get provider earnings graph data
 * @param {string} period - 'week', 'month', or 'year'
 */
export const getProviderEarningsGraph = async (period = 'week') => {
  const response = await axiosClient.get('/provider/earnings/graph/', {
    params: { period }
  });
  return response.data;
};

// ============================================
// PROVIDER SERVICES MANAGEMENT
// ============================================

/**
 * Get all my services as a provider
 * @param {Object} params - Query parameters (isActive)
 */
export const getMyServices = async (params = {}) => {
  const response = await axiosClient.get('/provider/services/', { params });
  return response.data;
};

/**
 * Get single service by ID
 * @param {number} id - Service ID
 */
export const getService = async (id) => {
  const response = await axiosClient.get(`/provider/services/${id}/`);
  return response.data;
};

/**
 * Create new service
 * @param {Object} serviceData - Service data
 */
export const createService = async (serviceData) => {
  const response = await axiosClient.post('/provider/services/create/', serviceData);
  return response.data;
};

/**
 * Update service
 * @param {number} id - Service ID
 * @param {Object} serviceData - Updated service data
 */
export const updateService = async (id, serviceData) => {
  const response = await axiosClient.put(`/provider/services/${id}/`, serviceData);
  return response.data;
};

/**
 * Delete service
 * @param {number} id - Service ID
 */
export const deleteService = async (id) => {
  const response = await axiosClient.delete(`/provider/services/${id}/delete/`);
  return response.data;
};

/**
 * Toggle service active status
 * @param {number} id - Service ID
 */
export const toggleServiceStatus = async (id) => {
  const response = await axiosClient.patch(`/provider/services/${id}/toggle-status/`);
  return response.data;
};

// ============================================
// PROVIDER ORDER MANAGEMENT
// ============================================

/**
 * Get provider orders
 * @param {Object} params - Query parameters (status, page, limit)
 */
export const getProviderOrders = async (params = {}) => {
  const response = await axiosClient.get('/provider/orders/', { params });
  return response.data;
};

/**
 * Get single order by ID
 * @param {number} id - Order ID
 */
export const getProviderOrder = async (id) => {
  const response = await axiosClient.get(`/provider/orders/${id}/`);
  return response.data;
};

/**
 * Accept order
 * @param {number} id - Order ID
 */
export const acceptOrder = async (id) => {
  const response = await axiosClient.post(`/provider/orders/${id}/accept/`);
  return response.data;
};

/**
 * Reject order
 * @param {number} id - Order ID
 * @param {string} reason - Rejection reason
 */
export const rejectOrder = async (id, reason) => {
  const response = await axiosClient.post(`/provider/orders/${id}/reject/`, { reason });
  return response.data;
};

/**
 * Update order status
 * @param {number} id - Order ID
 * @param {string} status - New status ('on_the_way', 'in_progress', 'completed')
 */
export const updateOrderStatus = async (id, status) => {
  const response = await axiosClient.patch(`/provider/orders/${id}/status/`, { status });
  return response.data;
};

/**
 * Upload work proof
 * @param {number} id - Order ID
 * @param {Object} data - Work proof data (images, notes)
 */
export const uploadWorkProof = async (id, data) => {
  const response = await axiosClient.post(`/provider/orders/${id}/work-proof/`, data);
  return response.data;
};

/**
 * Cancel order
 * @param {number} id - Order ID
 * @param {string} reason - Cancellation reason
 */
export const cancelOrder = async (id, reason) => {
  const response = await axiosClient.post(`/provider/orders/${id}/cancel/`, { reason });
  return response.data;
};

// ============================================
// PROVIDER EARNINGS
// ============================================

/**
 * Get earnings history
 * @param {Object} params - Query parameters (startDate, endDate, status)
 */
export const getEarningsHistory = async (params = {}) => {
  const response = await axiosClient.get('/provider/earnings/', { params });
  return response.data;
};

/**
 * Get earnings summary
 */
export const getEarningsSummary = async () => {
  const response = await axiosClient.get('/provider/earnings/summary/');
  return response.data;
};

// ============================================
// PROVIDER PROFILE
// ============================================

/**
 * Get provider profile
 */
export const getProviderProfile = async () => {
  const response = await axiosClient.get('/provider/profile/');
  return response.data;
};

/**
 * Update provider profile
 * @param {Object} profileData - Updated profile data
 */
export const updateProviderProfile = async (profileData) => {
  const response = await axiosClient.put('/provider/profile/update/', profileData);
  return response.data;
};

// ============================================
// FILE UPLOAD
// ============================================

/**
 * Upload file (documents, images)
 * @param {File} file - File to upload
 * @param {string} type - File type ('document', 'image', 'profile')
 */
export const uploadFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await axiosClient.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Upload multiple files
 * @param {FileList} files - Files to upload
 * @param {string} type - File type
 */
export const uploadMultipleFiles = async (files, type = 'image') => {
  const uploadPromises = Array.from(files).map(file => uploadFile(file, type));
  return Promise.all(uploadPromises);
};

// ============================================
// ROLE STATUS CHECK
// ============================================

/**
 * Check user role status
 */
export const checkRoleStatus = async () => {
  const response = await axiosClient.get('/users/role-status/');
  return response.data;
};

export default {
  // Service Posts
  getServicePosts,
  getServicePost,
  
  // Applications
  submitProviderApplication,
  getMyApplications,
  getApplication,
  
  // Dashboard
  getProviderDashboardStats,
  getProviderEarningsGraph,
  
  // Services
  getMyServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  
  // Orders
  getProviderOrders,
  getProviderOrder,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  uploadWorkProof,
  cancelOrder,
  
  // Earnings
  getEarningsHistory,
  getEarningsSummary,
  
  // Profile
  getProviderProfile,
  updateProviderProfile,
  
  // File Upload
  uploadFile,
  uploadMultipleFiles,
  
  // Role Status
  checkRoleStatus,
};
