import axiosClient from './axiosClient';

export const servicesApi = {
  // Get all services with filters
  getServices: (params) => axiosClient.get('/services/', { params }),

  // Get service by ID
  getServiceById: (id) => axiosClient.get(`/services/${id}/`),

  // Create new service (provider only)
  createService: (data) => axiosClient.post('/services/', data),

  // Update service (owner only)
  updateService: (id, data) => axiosClient.put(`/services/${id}/`, data),

  // Partial update service
  patchService: (id, data) => axiosClient.patch(`/services/${id}/`, data),

  // Delete service (owner only)
  deleteService: (id) => axiosClient.delete(`/services/${id}/`),

  // Get featured services (top 10 by bookings and views)
  getFeaturedServices: () => axiosClient.get('/services/featured/'),

  // Get popular services (top 10 by views)
  getPopularServices: () => axiosClient.get('/services/popular/'),

  // Get my services (provider's services)
  getMyServices: () => axiosClient.get('/services/my_services/'),

  // Add service image
  addServiceImage: (id, formData) => 
    axiosClient.post(`/services/${id}/add_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Add service FAQ
  addServiceFaq: (id, data) => 
    axiosClient.post(`/services/${id}/add_faq/`, data),

  // Remove service image
  removeServiceImage: (id, imageId) => 
    axiosClient.delete(`/services/${id}/remove_image/`, { data: { image_id: imageId } }),

  // Remove service FAQ
  removeServiceFaq: (id, faqId) => 
    axiosClient.delete(`/services/${id}/remove_faq/`, { data: { faq_id: faqId } }),
};
