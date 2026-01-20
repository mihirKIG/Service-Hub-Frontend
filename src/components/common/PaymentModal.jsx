import React, { useState } from 'react';
import { FiX, FiCreditCard, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import Button from './Button';
import Loading from './Loading';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  serviceName,
  onPayment,
  loading = false 
}) => {
  if (!isOpen) return null;

  const advanceAmount = (amount * 0.10).toFixed(2);
  const remainingAmount = (amount * 0.90).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Advance Payment Required
                </h3>
                <p className="text-sm text-gray-500">Secure booking with 10% payment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Service</p>
            <p className="font-semibold text-gray-900">{serviceName}</p>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Total Service Amount</span>
              <span className="font-semibold text-gray-900">৳{parseFloat(amount).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3">
              <span className="text-green-700 font-medium">Pay Now (10% Advance)</span>
              <span className="text-2xl font-bold text-green-700">৳{advanceAmount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-gray-600">Pay After Service (90%)</span>
              <span className="font-semibold text-gray-700">৳{remainingAmount}</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why advance payment?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Secures your booking instantly</li>
                  <li>Provider confirms availability</li>
                  <li>Pay remaining 90% after service completion</li>
                  <li>100% refundable if provider cancels</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={onPayment}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loading size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  <FiDollarSign className="w-5 h-5" />
                  Pay ৳{advanceAmount}
                </>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-center text-gray-500 mt-4">
            🔒 Secured by SSLCommerz • Your payment is 100% secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
