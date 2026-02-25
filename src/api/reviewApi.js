import axiosClient from './axiosClient';

export const reviewApi = {
  // Get all reviews
  getReviews: (params) => axiosClient.get('/reviews/', { params }),

  // Get review by ID
  getReviewById: (id) => axiosClient.get(`/reviews/${id}/`),

  // Get provider reviews
  getProviderReviews: (providerId, params) => 
    axiosClient.get(`/reviews/provider/${providerId}/`, { params }),

  // Get provider review stats
  getProviderStats: (providerId) => 
    axiosClient.get(`/reviews/provider/${providerId}/stats/`),

  // Create review
  createReview: (data) => axiosClient.post('/reviews/create/', data),

  // Update review
  updateReview: (id, data) => axiosClient.put(`/reviews/${id}/update/`, data),

  // Delete review
  deleteReview: (id) => axiosClient.delete(`/reviews/${id}/delete/`),

  // Mark review as helpful
  markHelpful: (id) => axiosClient.post(`/reviews/${id}/helpful/`),

  // Add review response (provider only)
  addResponse: (reviewId, data) => 
    axiosClient.post(`/reviews/${reviewId}/response/`, data),

  // Get my reviews
  getMyReviews: () => axiosClient.get('/reviews/my-reviews/'),

  // Add review image
  addImage: (reviewId, formData) => 
    axiosClient.post(`/reviews/${reviewId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Delete review image
  deleteImage: (reviewId, imageId) => 
    axiosClient.delete(`/reviews/${reviewId}/images/${imageId}/`),
};
