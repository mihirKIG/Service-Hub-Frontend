import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useService } from '../../hooks/useServices';
import { useProviderReviews } from '../../hooks/useReviews';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Loading from '../../components/common/Loading';
import { FiStar, FiMapPin, FiClock, FiDollarSign, FiUser, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, sidebarOpen } = useAuth();
  const { service, loading: serviceLoading } = useService(serviceId);
  const { reviews, stats } = useProviderReviews(service?.provider?.id);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleBookNow = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/services/${serviceId}` } });
    } else {
      navigate(`/book-service/${serviceId}`);
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

  if (!service) {
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

  const images = service.images || [];
  const allImages = service.image ? [service.image, ...images.map(img => img.image)] : images.map(img => img.image);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><a href="/" className="hover:text-blue-600">Home</a></li>
              <li>/</li>
              <li><a href="/services" className="hover:text-blue-600">Services</a></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{service.title}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                {allImages.length > 0 ? (
                  <>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={allImages[selectedImage]}
                        alt={service.title}
                        className="w-full h-96 object-cover"
                      />
                    </div>
                    {allImages.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                              selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                            }`}
                          >
                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-96 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-6xl">🔧</span>
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b">
                  <div className="flex items-center">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="font-semibold">{service.average_rating || 'N/A'}</span>
                    <span className="text-gray-500 ml-1">
                      ({service.provider?.total_reviews || 0} reviews)
                    </span>
                  </div>
                  
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {service.category_name}
                  </span>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <div className="prose max-w-none mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
                </div>

                {/* Service Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Service Features</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {service.pricing_type === 'hourly' ? 'Hourly' : service.pricing_type === 'fixed' ? 'Fixed Price' : 'Package'} Pricing
                      </span>
                    </div>
                    {service.is_remote && (
                      <div className="flex items-start">
                        <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">Remote Service Available</span>
                      </div>
                    )}
                    {service.is_onsite && (
                      <div className="flex items-start">
                        <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">On-site Service Available</span>
                      </div>
                    )}
                    {service.duration_minutes && (
                      <div className="flex items-start">
                        <FiCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">
                          Duration: {service.duration_minutes} minutes
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* FAQs */}
                {service.faqs && service.faqs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {service.faqs.map((faq) => (
                        <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0">
                          <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Provider Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">About the Provider</h3>
                <div className="flex items-start gap-4">
                  {service.provider?.profile_picture && (
                    <img
                      src={service.provider.profile_picture}
                      alt={service.provider.business_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{service.provider?.business_name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 mr-1" />
                        <span>{service.provider?.rating || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="mr-1" />
                        <span>{service.provider?.city}, {service.provider?.state}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{service.provider?.bio}</p>
                    <button
                      onClick={() => navigate(`/providers/${service.provider?.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Full Profile →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${service.pricing_type === 'hourly' ? service.hourly_rate : service.base_price}
                    </span>
                    {service.pricing_type === 'hourly' && (
                      <span className="text-gray-600 ml-2">/hour</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {service.pricing_type === 'fixed' && 'Fixed price'}
                    {service.pricing_type === 'package' && 'Package price'}
                    {service.pricing_type === 'hourly' && `Minimum booking: ${service.min_booking_hours || 1} hour(s)`}
                  </p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center text-gray-700">
                    <FiClock className="mr-2 text-gray-400" />
                    <span>
                      {service.is_remote && 'Remote'} 
                      {service.is_remote && service.is_onsite && ' / '}
                      {service.is_onsite && 'On-site'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiUser className="mr-2 text-gray-400" />
                    <span>{service.provider?.business_name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiMapPin className="mr-2 text-gray-400" />
                    <span>{service.provider?.city}, {service.provider?.state}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiCalendar className="mr-2 text-gray-400" />
                    <span>{service.bookings_count || 0} bookings completed</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition font-semibold mb-3"
                >
                  Book Now
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition font-medium"
                >
                  Browse More Services
                </button>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{service.views_count || 0}</div>
                      <div className="text-xs text-gray-600">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{service.bookings_count || 0}</div>
                      <div className="text-xs text-gray-600">Bookings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {reviews && reviews.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              
              {stats && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{stats.average_rating}</div>
                      <div className="flex items-center justify-center my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`${
                              star <= Math.round(stats.average_rating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{stats.total_reviews} reviews</div>
                    </div>
                    
                    <div className="flex-1">
                      {Object.entries(stats.rating_distribution || {}).reverse().map(([rating, count]) => (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(count / stats.total_reviews) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{review.customer?.full_name}</div>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`text-sm ${
                                star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetails;
