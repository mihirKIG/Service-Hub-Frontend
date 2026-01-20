import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../../../api/paymentApi';
import { bookingApi } from '../../../api/bookingApi';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import Loading from '../../../components/common/Loading';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const validatePayment = async () => {
      const tranId = searchParams.get('tran_id');
      const valId = searchParams.get('val_id') || searchParams.get('value_a');

      if (!tranId) {
        toast.error('Invalid payment transaction');
        navigate('/dashboard');
        return;
      }

      try {
        // Get pending booking data
        const pendingBooking = JSON.parse(localStorage.getItem('pending_booking') || '{}');

        // Validate payment with backend
        const validationResponse = await paymentApi.validatePayment({
          tran_id: tranId,
          val_id: valId,
          booking_id: null, // Will be created after validation
        });

        if (validationResponse.data.success) {
          // Create booking after successful payment
          const bookingResponse = await bookingApi.createBooking({
            ...pendingBooking,
            payment_transaction_id: tranId,
            payment_status: 'advance_paid',
          });

          setBooking(bookingResponse.data);
          setSuccess(true);
          
          // Clear pending booking
          localStorage.removeItem('pending_booking');
          
          toast.success('Payment successful! Booking confirmed.');
        } else {
          setSuccess(false);
          toast.error('Payment validation failed');
        }
      } catch (error) {
        console.error('Payment validation error:', error);
        setSuccess(false);
        toast.error('Failed to validate payment');
      } finally {
        setLoading(false);
      }
    };

    validatePayment();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-96">
          <Loading />
          <p className="mt-4 text-gray-600">Validating your payment...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <FiCheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful! 🎉
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                Your booking has been confirmed. You've paid 10% advance payment.
              </p>

              {booking && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{booking.service_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">{booking.booking_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{booking.start_time} - {booking.end_time}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg">৳{booking.total_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Paid (10%):</span>
                      <span className="font-bold text-green-600">৳{booking.advance_payment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining (90%):</span>
                      <span className="font-medium">৳{(booking.total_amount - booking.advance_payment).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 font-semibold"
                >
                  View My Bookings
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <FiAlertCircle className="w-12 h-12 text-red-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Validation Failed
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                We couldn't validate your payment. Please contact support if money was deducted.
              </p>

              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 font-semibold"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
