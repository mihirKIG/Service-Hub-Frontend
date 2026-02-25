import axiosClient from './axiosClient';

export const providerApi = {
  // Get all providers with filters
  getProviders: (params) => axiosClient.get('/providers/', { params }),

  // Get provider by ID
  getProviderById: (id) => axiosClient.get(`/providers/${id}/`),

  // Get my provider profile
  getMyProfile: () => axiosClient.get('/providers/me/'),

  // Create provider profile
  createProvider: (data) => axiosClient.post('/providers/create/', data),

  // Update provider profile
  updateProvider: (data) => axiosClient.put('/providers/me/update/', data),

  // Partial update provider profile
  patchProvider: (data) => axiosClient.patch('/providers/me/update/', data),

  // Service categories
  getCategories: () => axiosClient.get('/providers/categories/'),
  getCategoryById: (id) => axiosClient.get(`/providers/categories/${id}/`),

  // Provider availability
  getAvailability: () => axiosClient.get('/providers/availability/'),
  createAvailability: (data) => axiosClient.post('/providers/availability/', data),
  updateAvailability: (id, data) => axiosClient.put(`/providers/availability/${id}/`, data),
  deleteAvailability: (id) => axiosClient.delete(`/providers/availability/${id}/`),

  // Provider portfolio
  getPortfolio: () => axiosClient.get('/providers/portfolio/'),
  addPortfolioItem: (formData) => 
    axiosClient.post('/providers/portfolio/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updatePortfolioItem: (id, formData) => 
    axiosClient.put(`/providers/portfolio/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePortfolioItem: (id) => 
    axiosClient.delete(`/providers/portfolio/${id}/`),
};
