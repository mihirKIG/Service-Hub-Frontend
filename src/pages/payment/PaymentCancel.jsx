import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear pending booking data
    localStorage.removeItem('pending_booking');
    toast.info('Payment cancelled');
  }, []);

  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
            <FiAlertCircle className="w-12 h-12 text-yellow-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            You have cancelled the payment process. No charges were made to your account.
          </p>

          {tranId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Transaction ID: <span className="font-mono font-semibold">{tranId}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate(-2)}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 font-semibold"
            >
              Return to Booking
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold"
            >
              Go to Dashboard
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Need help? <a href="/support" className="text-pink-600 hover:text-pink-700 font-semibold">Contact Support</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentCancel;
