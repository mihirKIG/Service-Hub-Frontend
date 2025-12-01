import axiosClient from './axiosClient';

export const paymentApi = {
  // Get all payments
  getPayments: (params) => axiosClient.get('/payments/', { params }),

  // Get payment by ID
  getPaymentById: (id) => axiosClient.get(`/payments/${id}/`),

  // Create payment intent
  createPayment: (data) => axiosClient.post('/payments/create/', data),

  // Confirm payment
  confirmPayment: (id, data) => 
    axiosClient.post(`/payments/${id}/confirm/`, data),

  // Request refund
  requestRefund: (id, data) => 
    axiosClient.post(`/payments/${id}/refund/`, data),

  // Get payment methods
  getPaymentMethods: () => 
    axiosClient.get('/payments/methods/'),

  // Add payment method
  addPaymentMethod: (data) => 
    axiosClient.post('/payments/methods/', data),

  // Delete payment method
  deletePaymentMethod: (id) => 
    axiosClient.delete(`/payments/methods/${id}/`),

  // Set default payment method
  setDefaultPaymentMethod: (id) => 
    axiosClient.post(`/payments/methods/${id}/set-default/`),

  // Get payment history
  getPaymentHistory: (params) => 
    axiosClient.get('/payments/history/', { params }),

  // Download receipt
  downloadReceipt: (id) => 
    axiosClient.get(`/payments/${id}/receipt/`, {
      responseType: 'blob',
    }),

  // Get payment statistics
  getPaymentStats: () => 
    axiosClient.get('/payments/stats/'),
};
