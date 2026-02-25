import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviderById } from '@features/providers/providerSlice';
import { fetchProviderReviews } from '@features/reviews/reviewSlice';
import { reviewApi } from '@api/reviewApi';
import { bookingApi } from '@api/bookingApi';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Sidebar from '@components/layout/Sidebar';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { FiStar, FiMapPin, FiClock, FiPhone, FiMail, FiMessageSquare, FiAward, FiCheckCircle, FiCalendar, FiUsers, FiX, FiEdit3 } from 'react-icons/fi';
import { formatters } from '@utils/formatters';
import toast from 'react-hot-toast';

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProvider, loading } = useSelector((state) => state.providers);
  const { providerReviews } = useSelector((state) => state.reviews);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Review form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Handle Book Now click
  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book this provider', {
        duration: 3000,
        icon: '🔒',
      });
      navigate('/login', { state: { from: `/providers/${id}` } });
      return;
    }
    navigate(`/book/${id}`);
  };

  useEffect(() => {
    dispatch(fetchProviderById(id));
    dispatch(fetchProviderReviews({ providerId: id }));
  }, [dispatch, id]);

  // Fetch completed bookings when modal opens
  const fetchCompletedBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await bookingApi.getBookings({ 
        status: 'completed',
        provider: id 
      });
      const bookings = response.data.results || response.data || [];
      
      // Filter out bookings that already have reviews
      const reviewedBookingIds = providerReviews.map(r => r.booking?.id || r.booking_id).filter(Boolean);
      const unreviewedBookings = bookings.filter(b => !reviewedBookingIds.includes(b.id));
      
      setCompletedBookings(unreviewedBookings);
      
      if (unreviewedBookings.length > 0) {
        setSelectedBooking(unreviewedBookings[0].id);
      } else {
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Could not load your bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
    fetchCompletedBookings();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedBooking) {
      toast.error('Please select a booking to review');
      return;
    }
    
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        booking_id: parseInt(selectedBooking, 10),
        rating: parseInt(rating, 10),
        comment: comment.trim(),
      };
      
      // Add optional title if provided
      if (title.trim()) {
        reviewData.title = title.trim();
      }
      
      console.log('Submitting review:', reviewData);
      
      const response = await reviewApi.createReview(reviewData);
      console.log('Review response:', response);
      
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setRating(0);
      setComment('');
      setTitle('');
      setSelectedBooking(null);
      
      // Refresh reviews
      dispatch(fetchProviderReviews({ providerId: id }));
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.response?.data?.detail
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Failed to submit review. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentProvider) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Sidebar />
      
      <main className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Provider Header - Enhanced */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition-all duration-300">
            {/* Hero Banner with Pattern */}
            <div className="h-64 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/2 w-36 h-36 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
              </div>
              
              {/* Stats Overlay */}
              <div className="absolute top-6 right-6 flex gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 text-white border border-white/30">
                  <div className="flex items-center gap-2">
                    <FiAward className="text-xl" />
                    <div>
                      <p className="text-2xl font-bold">{currentProvider.total_reviews || 0}</p>
                      <p className="text-xs opacity-90">Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 text-white border border-white/30">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-xl" />
                    <div>
                      <p className="text-2xl font-bold">{formatters.rating(currentProvider.average_rating)}</p>
                      <p className="text-xs opacity-90">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Provider Info */}
            <div className="px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between -mt-20 md:-mt-16">
                <div className="flex flex-col md:flex-row items-center md:items-end mb-6 md:mb-0">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <Avatar
                      src={currentProvider.user?.profile_image}
                      name={currentProvider.business_name}
                      size="2xl"
                      className="relative border-4 border-white shadow-2xl"
                    />
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  <div className="ml-0 md:ml-6 mt-4 md:mt-0 pb-2 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {currentProvider.business_name}
                      </h1>
                      <FiCheckCircle className="text-blue-500 text-2xl" title="Verified Provider" />
                    </div>
                    <p className="text-gray-600 mt-1 flex items-center gap-2 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                        {currentProvider.category?.name}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-8 md:mt-16 justify-center md:justify-start">
                  {isAuthenticated && (
                    <Link to={`/chat?provider=${id}`}>
                      <button className="group px-6 py-3 bg-white border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2">
                        <FiMessageSquare className="group-hover:rotate-12 transition-transform duration-300" />
                        Message
                      </button>
                    </Link>
                  )}
                  <button 
                    onClick={handleBookNow}
                    className="group px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-2"
                  >
                    <FiCalendar className="group-hover:rotate-12 transition-transform duration-300" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About - Enhanced */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-white text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">About</h2>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentProvider.description}</p>
                </div>
              </div>

              {/* Services - Enhanced */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="text-white text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Services</h2>
                </div>
                <div className="space-y-4">
                  {currentProvider.services?.map((service, index) => (
                    <div 
                      key={service.id} 
                      className="group bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-100 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-700 transition-colors">{service.name}</h3>
                          </div>
                          <p className="text-gray-600 text-sm ml-10">{service.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {formatters.currency(service.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews - Enhanced */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <FiStar className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Reviews</h2>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={handleOpenReviewModal}
                      className="group px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <FiEdit3 className="group-hover:rotate-12 transition-transform duration-300" />
                      Write Review
                    </button>
                  )}
                </div>
                {providerReviews.length > 0 ? (
                  <div className="space-y-6">
                    {providerReviews.map((review) => (
                      <div key={review.id} className="bg-gradient-to-br from-gray-50 to-yellow-50/30 rounded-xl p-6 border-2 border-gray-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                            <Avatar 
                              src={review.customer?.profile_image} 
                              name={review.customer?.full_name}
                              className="relative"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-lg text-gray-900">{review.customer?.full_name}</h4>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {formatters.relativeTime(review.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-semibold text-gray-700">
                                {review.rating}.0
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                              "{review.comment}"
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-yellow-50/30 rounded-xl border-2 border-dashed border-gray-200">
                    <FiStar className="mx-auto text-5xl text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-1">Be the first to review this provider!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Enhanced */}
            <div className="space-y-6">
              {/* Quick Info - Enhanced */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 sticky top-8">
                <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Quick Info</h3>
                <div className="space-y-4">
                  <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 hover:border-yellow-300 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FiStar className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Rating</p>
                      <p className="font-bold text-gray-900">{formatters.rating(currentProvider.average_rating)} ({currentProvider.total_reviews} reviews)</p>
                    </div>
                  </div>
                  
                  {currentProvider.location && (
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-300 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FiMapPin className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="font-semibold text-gray-900 text-sm">{currentProvider.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentProvider.phone_number && (
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:border-green-300 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FiPhone className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="font-semibold text-gray-900 text-sm">{currentProvider.phone_number}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentProvider.email && (
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-300 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FiMail className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="font-semibold text-gray-900 text-sm break-all">{currentProvider.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing - Enhanced */}
              <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2 opacity-90">Starting Price</h3>
                  <p className="text-5xl font-bold mb-2">
                    {formatters.currency(currentProvider.starting_price)}
                  </p>
                  <p className="text-sm opacity-75">Per service</p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <p className="text-xs opacity-75 mb-2">💡 Actual pricing may vary based on service requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Write a Review</h2>
                  <p className="text-sm opacity-90">Share your experience with {currentProvider.business_name}</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitReview} className="p-8">
              {/* Booking Selection */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Select Booking *
                </label>
                {loadingBookings ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  </div>
                ) : completedBookings.length > 0 ? (
                  <select
                    value={selectedBooking || ''}
                    onChange={(e) => setSelectedBooking(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all duration-300"
                    required
                  >
                    <option value="">Select a completed booking</option>
                    {completedBookings.map((booking) => (
                      <option key={booking.id} value={booking.id}>
                        Booking #{booking.id} - {booking.service?.name || 'Service'} ({new Date(booking.created_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-yellow-800 font-medium">No bookings available to review.</p>
                    <p className="text-yellow-600 text-sm mt-1">
                      Either you don't have completed bookings, or you've already reviewed all of them.
                    </p>
                  </div>
                )}
              </div>

              {/* Title (Optional) */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience in one line..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all duration-300"
                  maxLength={100}
                />
              </div>

              {/* Rating Section */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Rating *
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform duration-200 hover:scale-125"
                    >
                      <FiStar
                        className={`w-12 h-12 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-4 text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      {rating}.0
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Section */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="6"
                  placeholder="Share details of your experience with this provider..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all duration-300 resize-none"
                  required
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 10 characters ({comment.length}/500)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setRating(0);
                    setComment('');
                    setTitle('');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedBooking || !rating || comment.length < 10 || completedBookings.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetail;
