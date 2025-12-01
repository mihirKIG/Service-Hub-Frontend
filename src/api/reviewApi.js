import axiosClient from './axiosClient';

export const reviewApi = {
  // Get all reviews
  getReviews: (params) => axiosClient.get('/reviews/', { params }),

  // Get review by ID
  getReviewById: (id) => axiosClient.get(`/reviews/${id}/`),

  // Create review
  createReview: (data) => axiosClient.post('/reviews/create/', data),

  // Update review
  updateReview: (id, data) => axiosClient.put(`/reviews/${id}/`, data),

  // Delete review
  deleteReview: (id) => axiosClient.delete(`/reviews/${id}/`),

  // Get reviews for a provider
  getProviderReviews: (providerId, params) => 
    axiosClient.get(`/reviews/provider/${providerId}/`, { params }),

  // Get reviews by user
  getUserReviews: (params) => 
    axiosClient.get('/reviews/my-reviews/', { params }),

  // Upload review images
  uploadReviewImages: (reviewId, formData) => 
    axiosClient.post(`/reviews/${reviewId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Mark review as helpful
  markHelpful: (id) => 
    axiosClient.post(`/reviews/${id}/helpful/`),

  // Provider response to review
  respondToReview: (id, response) => 
    axiosClient.post(`/reviews/${id}/respond/`, { response }),

  // Report review
  reportReview: (id, reason) => 
    axiosClient.post(`/reviews/${id}/report/`, { reason }),

  // Get pending reviews (reviews user needs to write)
  getPendingReviews: () => 
    axiosClient.get('/reviews/pending/'),
};
