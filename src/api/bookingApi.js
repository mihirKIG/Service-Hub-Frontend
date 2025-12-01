import axiosClient from './axiosClient';

export const bookingApi = {
  // Get all bookings for current user
  getBookings: (params) => axiosClient.get('/bookings/', { params }),

  // Get booking by ID
  getBookingById: (id) => axiosClient.get(`/bookings/${id}/`),

  // Create new booking
  createBooking: (data) => axiosClient.post('/bookings/create/', data),

  // Update booking
  updateBooking: (id, data) => axiosClient.put(`/bookings/${id}/update/`, data),

  // Cancel booking
  cancelBooking: (id, reason) => 
    axiosClient.post(`/bookings/${id}/cancel/`, { reason }),

  // Confirm booking (provider)
  confirmBooking: (id) => 
    axiosClient.post(`/bookings/${id}/confirm/`),

  // Mark booking as in progress
  startBooking: (id) => 
    axiosClient.post(`/bookings/${id}/start/`),

  // Complete booking
  completeBooking: (id) => 
    axiosClient.post(`/bookings/${id}/complete/`),

  // Upload booking attachment
  uploadAttachment: (id, formData) => 
    axiosClient.post(`/bookings/${id}/attachments/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get booking attachments
  getAttachments: (id) => 
    axiosClient.get(`/bookings/${id}/attachments/`),

  // Check availability for booking
  checkAvailability: (providerId, data) => 
    axiosClient.post(`/bookings/check-availability/`, {
      provider_id: providerId,
      ...data,
    }),

  // Get upcoming bookings
  getUpcomingBookings: () => 
    axiosClient.get('/bookings/upcoming/'),

  // Get past bookings
  getPastBookings: (params) => 
    axiosClient.get('/bookings/past/', { params }),

  // Reschedule booking
  rescheduleBooking: (id, data) => 
    axiosClient.post(`/bookings/${id}/reschedule/`, data),
};
