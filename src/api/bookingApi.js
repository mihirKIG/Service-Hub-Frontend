import axiosClient from './axiosClient';

export const bookingApi = {
  // Get all bookings for current user
  getBookings: (params) => axiosClient.get('/bookings/', { params }),

  // Get booking by ID
  getBookingById: (id) => axiosClient.get(`/bookings/${id}/`),

  // Create new booking
  createBooking: (data) => axiosClient.post('/bookings/create/', data),

  // Update booking (PATCH for partial update)
  updateBooking: (id, data) => axiosClient.patch(`/bookings/${id}/update/`, data),

  // Cancel booking
  cancelBooking: (id, data) => 
    axiosClient.post(`/bookings/${id}/cancel/`, data),

  // Get upcoming bookings (next 5 upcoming)
  getUpcomingBookings: () => 
    axiosClient.get('/bookings/upcoming/'),

  // Get booking statistics
  getBookingStats: () => 
    axiosClient.get('/bookings/stats/'),

  // Booking attachments
  getAttachments: (bookingId) => 
    axiosClient.get(`/bookings/${bookingId}/attachments/`),

  createAttachment: (bookingId, formData) => 
    axiosClient.post(`/bookings/${bookingId}/attachments/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAttachment: (bookingId, attachmentId) => 
    axiosClient.get(`/bookings/${bookingId}/attachments/${attachmentId}/`),

  deleteAttachment: (bookingId, attachmentId) => 
    axiosClient.delete(`/bookings/${bookingId}/attachments/${attachmentId}/`),
};
