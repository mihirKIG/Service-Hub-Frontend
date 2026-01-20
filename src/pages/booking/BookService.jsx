import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useService } from '../../hooks/useServices';
import { fetchProviderById } from '@features/providers/providerSlice';
import { bookingApi } from '../../api/bookingApi';
import { paymentApi } from '../../api/paymentApi';
import { useAuth } from '@context/AuthContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Loading from '../../components/common/Loading';
import PaymentModal from '../../components/common/PaymentModal';
import toast from 'react-hot-toast';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';

const BookService = () => {
  const { serviceId, providerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen } = useAuth();
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
    if (service) {
      setFormData((prev) => ({
        ...prev,
        service_title: service.title,
        service_description: service.short_description || service.description,
      }));
    } else if (currentProvider && !serviceId) {
      // If coming from provider page, use provider's business name
      setFormData((prev) => ({
        ...prev,
        service_title: currentProvider.business_name,
        service_description: currentProvider.description,
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
    if (!service) return 0;
    
    if (service.pricing_type === 'hourly' && formData.duration_hours) {
      return parseFloat(service.hourly_rate) * parseFloat(formData.duration_hours);
    } else if (service.pricing_type === 'fixed') {
      return parseFloat(service.base_price);
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Calculate total amount
    const amount = calculateTotalAmount();
    if (amount <= 0) {
      toast.error('Please fill in all required fields to calculate price');
      return;
    }

    setTotalAmount(amount);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    
    try {
      // Initiate SSLCommerz payment
      const paymentData = {
        booking_id: null, // Will be created after payment
        total_amount: totalAmount,
        customer_name: user?.full_name || user?.email,
        customer_email: user?.email,
        customer_phone: user?.phone || '01700000000',
        customer_address: formData.service_address || 'Dhaka, Bangladesh',
      };

      const response = await paymentApi.initiatePayment(paymentData);

      if (response.data.success) {
        // Store booking data in localStorage to retrieve after payment
        localStorage.setItem('pending_booking', JSON.stringify({
          ...formData,
          provider_id: service.provider.id,
          total_amount: totalAmount,
          tran_id: response.data.tran_id,
          payment_id: response.data.payment_id,
        }));

        // Redirect to SSLCommerz payment gateway
        window.location.href = response.data.gateway_url;
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          <div className={`flex-1 flex justify-center items-center h-96 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <Loading />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show booking form if we have either service or provider
  const canShowBookingForm = service || (currentProvider && providerId);

  if (!canShowBookingForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          <div className={`flex-1 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
                <button
                  onClick={() => navigate('/services')}
                  className="text-blue-600 hover:underline"
                >
                  Browse All Services
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Use service or provider data
  const displayData = service || currentProvider;
  const displayTitle = service?.title || currentProvider?.business_name || '';
  const displayImage = service?.image || currentProvider?.cover_image;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        
        <div className={`flex-1 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 py-8">
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
                  {service && (
                    <>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2" />
                        <span className="font-bold text-xl">
                          ${service.pricing_type === 'hourly' ? service.hourly_rate : service.base_price}
                          {service.pricing_type === 'hourly' && ' /hr'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        <span>
                          {service.is_remote && 'Remote'} 
                          {service.is_remote && service.is_onsite && ' / '}
                          {service.is_onsite && 'On-site'}
                        </span>
                      </div>
                    </>
                  )}
                  {currentProvider && !service && (
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2" />
                      <span className="font-bold text-xl">
                        Starting from ${currentProvider.starting_price || 'Contact for price'}
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
                  {formData.duration_hours && service.pricing_type === 'hourly' && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Estimated Cost:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${(parseFloat(service.hourly_rate) * parseFloat(formData.duration_hours)).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        ৳{service.hourly_rate}/hr × {formData.duration_hours} hours
                      </p>
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-sm text-gray-600">
                          Advance Payment (10%): <span className="font-semibold text-blue-700">৳{(parseFloat(service.hourly_rate) * parseFloat(formData.duration_hours) * 0.10).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {service.pricing_type === 'fixed' && (
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Cost:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ৳{parseFloat(service.base_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-sm text-gray-600">
                          Advance Payment (10%): <span className="font-semibold text-blue-700">৳{(parseFloat(service.base_price) * 0.10).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  )}

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
          {service.faqs && service.faqs.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {service.faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Images */}
          {service.images && service.images.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.images.map((img) => (
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
            </div>

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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookService;
