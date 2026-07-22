import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '@api/paymentApi';
import { bookingApi } from '@api/bookingApi';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Loading from '@components/common/Loading';
import { FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

// The real Booking API (BookingSerializer) returns service_title,
// booking_date, start_time, advance_payment - not the service_name /
// service_date / service_time / advance_paid names this page renders.
// Map real bookings into the shape the page below expects so the
// confirmation card actually shows real data instead of blanks/NaN.
const toBookingView = (realBooking) => {
  const totalAmount = parseFloat(realBooking.total_amount) || 0;
  const advancePaid = realBooking.advance_payment != null
    ? parseFloat(realBooking.advance_payment)
    : totalAmount * 0.10;
  return {
    id: realBooking.id,
    service_name: realBooking.service_title,
    service_date: realBooking.booking_date,
    service_time: realBooking.start_time,
    total_amount: totalAmount,
    advance_paid: advancePaid.toFixed(2),
    remaining_amount: (totalAmount - advancePaid).toFixed(2),
  };
};

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [failedTranId, setFailedTranId] = useState(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's dev-only double-invoke (and any
    // accidental remount): this effect reads pending_booking from
    // localStorage and clears it after creating the booking, so running it
    // twice makes the second pass see an already-cleared value and report a
    // false "booking data incomplete" error even though the first pass
    // succeeded.
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const validatePayment = async () => {
      const tranId = searchParams.get('tran_id');
      const valId = searchParams.get('val_id') || searchParams.get('value_a');

      if (!tranId) {
        toast.error('Invalid payment transaction');
        navigate('/dashboard');
        return;
      }

      try {
        // Get pending booking data from localStorage
        const pendingBooking = JSON.parse(localStorage.getItem('pending_booking') || '{}');

        // Try to validate with backend
        try {
          const validationResponse = await paymentApi.validatePayment({
            tran_id: tranId,
            val_id: valId,
          });

          if (validationResponse.data.success) {
            setPayment(validationResponse.data.payment);

            // pending_booking is consumed (cleared) once a booking is
            // successfully created for this transaction. If this page loads
            // again for the same tran_id - a refresh, a duplicate tab, using
            // the browser back/forward buttons - localStorage will already
            // be empty. That does NOT mean the booking failed: check whether
            // this payment already got linked to a real booking
            // (bookings/serializers.py links Payment.booking on create) and
            // show that instead of a false "missing data" error.
            if (!pendingBooking.provider_id) {
              const existingBookingId = validationResponse.data.payment?.booking;
              if (existingBookingId) {
                try {
                  const existing = await bookingApi.getBookingById(existingBookingId);
                  setBooking(toBookingView(existing.data));
                  setSuccess(true);
                  toast.success('Payment successful! Booking confirmed.');
                  return;
                } catch (fetchError) {
                  console.error('Failed to fetch existing booking:', fetchError);
                }
              }

              console.error('Missing provider_id in pending booking data and no existing booking found for this transaction');
              setSuccess(false);
              setFailedTranId(tranId);
              toast.error(
                `Payment confirmed but we couldn't find your booking details. Contact support with transaction ID: ${tranId}`,
                { duration: 8000 }
              );
              return;
            }

            // Create booking after successful payment - retry up to 2 times
            let bookingCreated = false;
            for (let attempt = 1; attempt <= 2; attempt++) {
              try {
                const bookingResponse = await bookingApi.createBooking({
                  ...pendingBooking,
                  payment_transaction_id: tranId,
                  payment_status: 'advance_paid',
                });

                setBooking(toBookingView(bookingResponse.data));
                setSuccess(true);
                bookingCreated = true;
                toast.success('Payment successful! Booking confirmed.');
                break;
              } catch (bookingError) {
                console.error(`Booking creation attempt ${attempt} failed:`, bookingError);
                if (attempt < 2) {
                  // Wait 1 second before retry
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            }

            if (bookingCreated) {
              localStorage.removeItem('pending_booking');
            } else {
              // Keep pending_booking so a page refresh can retry instead of
              // losing the booking details entirely.
              setSuccess(false);
              setFailedTranId(tranId);
              toast.error('Payment confirmed! Contact support to confirm your booking.', { duration: 8000 });
            }
          } else {
            setSuccess(false);
            toast.error('Payment validation failed');
          }
        } catch (error) {
          // Payment validation itself failed (network/CORS/5xx) - we do NOT
          // know if the booking/payment actually went through, so we must
          // not claim success. Fabricating a fake "DEMO-..." booking here
          // previously made the customer see "Payment Successful" while no
          // Booking row (and therefore no provider notification) was ever
          // created - the leading cause of "provider never gets notified".
          console.error('Payment validation error:', error);
          setSuccess(false);
          setFailedTranId(tranId);
          toast.error(
            `We couldn't confirm your payment. If money was deducted, contact support with transaction ID: ${tranId}`,
            { duration: 8000 }
          );
        }
      } catch (error) {
        console.error('General error:', error);
        setSuccess(false);
        toast.error('An error occurred. Please contact support.');
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
                      <span className="font-medium">{booking.service_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">{booking.service_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{booking.service_time}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg">৳{parseFloat(booking.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Paid (10%):</span>
                      <span className="font-bold text-green-600">৳{booking.advance_paid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-600">Remaining (90%):</span>
                      <span className="font-medium text-orange-600">৳{booking.remaining_amount}</span>
                    </div>
                  </div>
                </div>
              )}

              {payment && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheckCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Payment Details</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-xs text-gray-900">{payment.tran_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-semibold text-green-700">
                        ৳{parseFloat(payment.advance_amount || payment.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-left text-yellow-800">
                    <p className="font-medium mb-1">আপনার পরবর্তী করণীয়:</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700">
                      <li>Provider শীঘ্রই আপনার সাথে যোগাযোগ করবে</li>
                      <li>বাকি ৯০% সার্ভিস শেষে পরিশোধ করতে হবে</li>
                      <li>কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/user/bookings')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 font-medium"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Go to Home
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>কি করতে পারেন:</strong>
                  <br />
                  • আবার চেষ্টা করুন
                  <br />
                  • কোনো টাকা কেটে গেলে support এ যোগাযোগ করুন
                  <br />
                  • ২৪ ঘণ্টায় টাকা ফেরত পাবেন
                </p>
                {failedTranId && (
                  <p className="text-xs text-blue-700 mt-3 font-mono">
                    Transaction ID: {failedTranId}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
