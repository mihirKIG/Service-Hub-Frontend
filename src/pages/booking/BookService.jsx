import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useService } from '../../hooks/useServices';
import { fetchProviderById } from '@features/providers/providerSlice';
import { bookingApi } from '../../api/bookingApi';
import { paymentApi } from '../../api/paymentApi';
import Loading from '../../components/common/Loading';
import PaymentModal from '../../components/common/PaymentModal';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';

const BookService = () => {
  const { serviceId, providerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { service, loading: serviceLoading } = useService(serviceId);
  const { currentProvider } = useSelector((state) => state.providers);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Load provider if providerId is present
  useEffect(() => {
    if (providerId) {
      dispatch(fetchProviderById(providerId));
    }
  }, [providerId, dispatch]);

  const [formData, setFormData] = useState({
    service_title: '',
    service_description: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    duration_hours: '',
    service_address: '',
    city: '',
    postal_code: '',
    customer_notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // service_description is a required, non-blank field on the backend
    // (bookings/models.py) but this form never shows it as an editable
    // field - it's populated automatically here. If the source service/
    // provider has no description on file, this used to send an empty
    // string and the booking would always fail with a 400 on submit.
    if (service) {
      const title = service.title;
      setFormData((prev) => ({
        ...prev,
        service_title: title,
        service_description: service.short_description || service.description || title || 'Service booking request',
      }));
    } else if (currentProvider && !serviceId) {
      // If coming from provider page, use provider's business name
      const title = currentProvider.business_name || 'Service Booking';
      setFormData((prev) => ({
        ...prev,
        service_title: title,
        service_description: currentProvider.description || `Booking request for ${title}`,
      }));
    }
  }, [service, currentProvider, serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-calculate duration
    if (name === 'start_time' || name === 'end_time') {
      const start = name === 'start_time' ? value : formData.start_time;
      const end = name === 'end_time' ? value : formData.end_time;
      
      if (start && end) {
        const duration = calculateDuration(start, end);
        setFormData((prev) => ({ ...prev, duration_hours: duration }));
      }
    }
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return diff > 0 ? diff.toFixed(2) : '';
  };

  const calculateTotalAmount = () => {
    if (service) {
      if (service.pricing_type === 'hourly' && formData.duration_hours) {
        return parseFloat(service.hourly_rate) * parseFloat(formData.duration_hours);
      } else if (service.pricing_type === 'fixed') {
        return parseFloat(service.base_price);
      }
    }
    if (currentProvider) {
      if (currentProvider.hourly_rate && formData.duration_hours) {
        return parseFloat(currentProvider.hourly_rate) * parseFloat(formData.duration_hours);
      }
      if (currentProvider.starting_price) {
        return parseFloat(currentProvider.starting_price);
      }
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // service_title/service_description are required by the backend but
    // aren't editable inputs on this form - guard here too in case they
    // weren't populated yet (e.g. service/provider data still loading).
    if (!formData.service_title?.trim() || !formData.service_description?.trim()) {
      toast.error('Service details are still loading. Please wait a moment and try again.');
      return;
    }

    // Calculate total amount
    const amount = calculateTotalAmount();
    if (amount <= 0) {
      toast.error('Please fill in all required fields to calculate price');
      return;
    }

    setTotalAmount(amount);
    setShowPaymentModal(true);
  };

  const handlePayment = async (selectedPaymentMethod) => {
    setPaymentLoading(true);
    
    try {
      console.log('🔵 handlePayment called with method:', selectedPaymentMethod);
      console.log('🔵 formData:', formData);
      console.log('🔵 totalAmount (before):', totalAmount);
      // Resolve provider ID from multiple sources
      const resolvedProviderId = service?.provider?.id || currentProvider?.id || providerId;

      if (!resolvedProviderId) {
        toast.error('Provider information missing');
        setPaymentLoading(false);
        return;
      }

      // Ensure total amount is a valid positive number
      const amountNumber = parseFloat(totalAmount);
      if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        toast.error('Invalid payment amount. Please re-check booking details.');
        setPaymentLoading(false);
        return;
      }

      // Initiate SSLCommerz payment
      const paymentData = {
        booking_id: null, // Will be created after payment
        total_amount: amountNumber,
        customer_name: user?.full_name || user?.email,
        customer_email: user?.email,
        customer_phone: user?.phone || '01700000000',
        customer_address: formData.service_address || 'Dhaka, Bangladesh',
        payment_method: selectedPaymentMethod,
      };
      console.log('🔵 initiating payment with data:', paymentData);

      const response = await paymentApi.initiatePayment(paymentData);
      console.log('🔵 payment initiation response:', response?.data);

      if (response && response.data && response.data.success) {
        // Store booking data keyed by tran_id, not a single shared key -
        // localStorage is shared across every tab of this origin, so a
        // second booking started in another tab before this one's SSLCommerz
        // redirect completes would otherwise overwrite this one's pending
        // data, and the success page would come back with the WRONG (or
        // no) booking to create.
        try {
          localStorage.setItem(`pending_booking_${response.data.tran_id}`, JSON.stringify({
            ...formData,
            provider_id: parseInt(resolvedProviderId, 10),
            total_amount: amountNumber,
            tran_id: response.data.tran_id,
            payment_id: response.data.payment_id,
            payment_method: selectedPaymentMethod,
          }));
        } catch (storeErr) {
          console.error('Error storing pending booking:', storeErr);
        }

        // Redirect to SSLCommerz payment gateway if URL provided
        if (response.data.gateway_url) {
          window.location.href = response.data.gateway_url;
        } else {
          toast.error('Payment gateway URL not provided by server');
          setPaymentLoading(false);
        }
      } else {
        const msg = response?.data?.message || 'Failed to initiate payment';
        console.error('Payment initiation failed:', msg, response?.data);
        toast.error(msg);
        setPaymentLoading(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      const message = err?.response?.data?.message || err?.message || 'Failed to process payment';
      toast.error(message);
    } finally {
      // Ensure loading flag is cleared in all cases (if redirection didn't occur)
      if (typeof window !== 'undefined' && window.location && !window.location.href.includes('ssl')) {
        setPaymentLoading(false);
      }
    }
  };

  if (serviceLoading) {
    return <Loading />;
  }

  // Show booking form if we have either service or provider
  const canShowBookingForm = service || (currentProvider && providerId);

  if (!canShowBookingForm) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
        <button
          onClick={() => navigate('/services')}
          className="text-blue-600 hover:underline"
        >
          Browse All Services
        </button>
      </div>
    );
  }
  
  // Use service or provider data
  const displayData = service || currentProvider;
  const displayTitle = service?.title || currentProvider?.business_name || '';
  const displayImage = service?.image || currentProvider?.cover_image;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Service Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
      <div>
        {displayImage && (
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{displayTitle}</h1>
        <p className="text-gray-600 mb-4">
          {service?.description || currentProvider?.description}
        </p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <FiStar className="text-yellow-500 mr-1" />
            <span className="font-semibold">
              {service?.average_rating || currentProvider?.average_rating || 'N/A'}
            </span>
            <span className="text-gray-500 ml-1">
              ({service?.provider?.total_reviews || currentProvider?.total_reviews || 0} reviews)
            </span>
          </div>
        </div>

        <div className="space-y-2 text-gray-700">
          <div className="flex items-center">
            <FiUser className="mr-2" />
            <span>Provider: {service?.provider?.business_name || currentProvider?.business_name}</span>
          </div>
          {(service?.provider?.city || currentProvider?.location) && (
            <div className="flex items-center">
              <FiMapPin className="mr-2" />
              <span>{service?.provider?.city || currentProvider?.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <FiDollarSign className="mr-2" />
            <span className="font-bold text-xl">
              {service ? (
                <>
                  ৳{service.pricing_type === 'hourly' ? service.hourly_rate : service.base_price}
                  {service.pricing_type === 'hourly' && ' /hr'}
                </>
              ) : currentProvider ? (
                <>Starting from ৳{currentProvider.starting_price || 'Contact for price'}</>
              ) : ''}
            </span>
          </div>
          {service && (service.is_remote || service.is_onsite) && (
            <div className="flex items-center">
              <FiClock className="mr-2" />
              <span>
                {service.is_remote && 'Remote'} 
                {service.is_remote && service.is_onsite && ' / '}
                {service.is_onsite && 'On-site'}
              </span>
            </div>
          )}
        </div>
      </div>

              {/* Booking Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Book This Service</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {typeof error === 'object' ? JSON.stringify(error) : error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiCalendar className="inline mr-1" />
                      Booking Date
                    </label>
                    <input
                      type="date"
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleChange}
                      step="0.5"
                      min="0.5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Address
                    </label>
                    <input
                      type="text"
                      name="service_address"
                      value={formData.service_address}
                      onChange={handleChange}
                      required
                      placeholder="123 Main St, Apt 4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      name="customer_notes"
                      value={formData.customer_notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special requirements or notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price Estimate */}
                  {(() => {
                    const hourlyRate = service?.hourly_rate || currentProvider?.hourly_rate;
                    const basePrice = service?.base_price || currentProvider?.starting_price;
                    const pricingType = service?.pricing_type || (hourlyRate ? 'hourly' : 'fixed');

                    if (pricingType === 'hourly' && formData.duration_hours && hourlyRate) {
                      return (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Estimated Cost:</span>
                            <span className="text-2xl font-bold text-blue-600">
                              ৳{(parseFloat(hourlyRate) * parseFloat(formData.duration_hours)).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            ৳{hourlyRate}/hr × {formData.duration_hours} hours
                          </p>
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-sm text-gray-600">
                              Advance Payment (10%): <span className="font-semibold text-blue-700">৳{(parseFloat(hourlyRate) * parseFloat(formData.duration_hours) * 0.10).toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (pricingType === 'fixed' && basePrice) {
                      return (
                        <div className="bg-blue-50 p-4 rounded-md mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Total Cost:</span>
                            <span className="text-2xl font-bold text-blue-600">
                              ৳{parseFloat(basePrice).toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-sm text-gray-600">
                              Advance Payment (10%): <span className="font-semibold text-blue-700">৳{(parseFloat(basePrice) * 0.10).toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })()}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-md hover:from-pink-700 hover:to-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Service FAQs */}
          {service?.faqs?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {service?.faqs?.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Images */}
          {service?.images?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service?.images?.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image}
                      alt={img.caption || 'Service image'}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {img.caption && (
                      <p className="text-sm text-gray-600 mt-1">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Modal */}
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={totalAmount}
            serviceName={service?.title}
            onPayment={handlePayment}
            loading={paymentLoading}
          />
    </div>
  );
};

export default BookService;
