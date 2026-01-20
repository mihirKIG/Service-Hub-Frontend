import axiosClient from './axiosClient';

export const paymentApi = {
  // Get all payments
  getPayments: (params) => axiosClient.get('/payments/', { params }),

  // Get payment by ID
  getPaymentById: (id) => axiosClient.get(`/payments/${id}/`),

  // Create payment
  createPayment: (data) => axiosClient.post('/payments/create/', data),

  // Process refund
  processRefund: (id, data) => axiosClient.post(`/payments/${id}/refund/`, data),

  // Get payment statistics
  getStats: () => axiosClient.get('/payments/stats/'),

  // Payment methods
  getPaymentMethods: () => axiosClient.get('/payments/methods/'),
  
  addPaymentMethod: (data) => axiosClient.post('/payments/methods/', data),
  
  updatePaymentMethod: (id, data) => 
    axiosClient.put(`/payments/methods/${id}/`, data),
  
  deletePaymentMethod: (id) => 
    axiosClient.delete(`/payments/methods/${id}/`),
  
  setDefaultPaymentMethod: (id) => 
    axiosClient.post(`/payments/methods/${id}/set-default/`),

  // SSLCommerz Integration
  initiatePayment: (data) => 
    axiosClient.post('/payments/initiate/', data),
  
  validatePayment: (data) => 
    axiosClient.post('/payments/validate/', data),
  
  getMyPayments: () => 
    axiosClient.get('/payments/my-payments/'),
};
