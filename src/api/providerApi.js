import axiosClient from './axiosClient';

export const providerApi = {
  // Get all providers with filters
  getProviders: (params) => axiosClient.get('/providers/', { params }),

  // Get provider by ID
  getProviderById: (id) => axiosClient.get(`/providers/${id}/`),

  // Create provider profile
  createProvider: (data) => axiosClient.post('/providers/create/', data),

  // Update provider profile
  updateProvider: (id, data) => axiosClient.put(`/providers/${id}/`, data),

  // Get provider services
  getProviderServices: (providerId) => 
    axiosClient.get(`/providers/${providerId}/services/`),

  // Add service
  addService: (providerId, data) => 
    axiosClient.post(`/providers/${providerId}/services/`, data),

  // Update service
  updateService: (providerId, serviceId, data) => 
    axiosClient.put(`/providers/${providerId}/services/${serviceId}/`, data),

  // Delete service
  deleteService: (providerId, serviceId) => 
    axiosClient.delete(`/providers/${providerId}/services/${serviceId}/`),

  // Get service categories
  getCategories: () => axiosClient.get('/providers/categories/'),

  // Get provider availability
  getAvailability: (providerId) => 
    axiosClient.get(`/providers/${providerId}/availability/`),

  // Update availability
  updateAvailability: (providerId, data) => 
    axiosClient.post(`/providers/${providerId}/availability/`, data),

  // Get provider portfolio
  getPortfolio: (providerId) => 
    axiosClient.get(`/providers/${providerId}/portfolio/`),

  // Add portfolio item
  addPortfolioItem: (providerId, formData) => 
    axiosClient.post(`/providers/${providerId}/portfolio/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Delete portfolio item
  deletePortfolioItem: (providerId, itemId) => 
    axiosClient.delete(`/providers/${providerId}/portfolio/${itemId}/`),

  // Search providers by location
  searchByLocation: (params) => 
    axiosClient.get('/providers/search-by-location/', { params }),

  // Get provider reviews
  getProviderReviews: (providerId, params) => 
    axiosClient.get(`/providers/${providerId}/reviews/`, { params }),

  // Get provider statistics
  getProviderStats: (providerId) => 
    axiosClient.get(`/providers/${providerId}/stats/`),
};
