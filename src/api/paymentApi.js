import axiosClient from './axiosClient';

export const paymentApi = {
  // Initiate SSLCommerz Payment
  initiatePayment: (data) => {
    return axiosClient.post('/payments/initiate/', data);
  },

  // Validate payment after callback
  validatePayment: (data) => {
    return axiosClient.post('/payments/validate/', data);
  },

  // Get payment by transaction ID
  getPaymentByTranId: (tranId) => {
    return axiosClient.get(`/payments/by-tran/${tranId}/`);
  },

  // Get all payments for current user
  getMyPayments: () => {
    return axiosClient.get('/payments/my-payments/');
  },

  // Get payment details by ID
  getPaymentById: (id) => {
    return axiosClient.get(`/payments/${id}/`);
  },

  // Get payment statistics
  getPaymentStats: () => {
    return axiosClient.get('/payments/stats/');
  },

  // Request refund
  requestRefund: (id, data) => {
    return axiosClient.post(`/payments/${id}/refund/`, data);
  },
};

export default paymentApi;
