import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviderById } from '@features/providers/providerSlice';
import { fetchProviderReviews } from '@features/reviews/reviewSlice';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { FiStar, FiMapPin, FiClock, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';
import { formatters } from '@utils/formatters';

const ProviderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProvider, loading } = useSelector((state) => state.providers);
  const { providerReviews } = useSelector((state) => state.reviews);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProviderById(id));
    dispatch(fetchProviderReviews({ providerId: id }));
  }, [dispatch, id]);

  if (loading || !currentProvider) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Provider Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800"></div>
            <div className="px-8 py-6">
              <div className="flex items-start justify-between -mt-16">
                <div className="flex items-end">
                  <Avatar
                    src={currentProvider.user?.profile_image}
                    name={currentProvider.business_name}
                    size="2xl"
                    className="border-4 border-white shadow-lg"
                  />
                  <div className="ml-6 pb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{currentProvider.business_name}</h1>
                    <p className="text-gray-600">{currentProvider.category?.name}</p>
                  </div>
                </div>
                {isAuthenticated && (
                  <div className="flex space-x-3 mt-16">
                    <Link to={`/chat?provider=${id}`}>
                      <Button variant="outline">
                        <FiMessageSquare className="mr-2" /> Message
                      </Button>
                    </Link>
                    <Link to={`/book/${id}`}>
                      <Button>Book Now</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-line">{currentProvider.description}</p>
              </div>

              {/* Services */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Services</h2>
                <div className="space-y-4">
                  {currentProvider.services?.map((service) => (
                    <div key={service.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                        <span className="text-xl font-bold text-primary-600">
                          {formatters.currency(service.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {providerReviews.length > 0 ? (
                  <div className="space-y-6">
                    {providerReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start">
                          <Avatar src={review.customer?.profile_image} name={review.customer?.full_name} />
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{review.customer?.full_name}</h4>
                              <span className="text-sm text-gray-500">
                                {formatters.relativeTime(review.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FiStar className="mr-3 text-yellow-500" />
                    <span>{formatters.rating(currentProvider.average_rating)} ({currentProvider.total_reviews} reviews)</span>
                  </div>
                  {currentProvider.location && (
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-3" />
                      <span>{currentProvider.location}</span>
                    </div>
                  )}
                  {currentProvider.phone_number && (
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="mr-3" />
                      <span>{currentProvider.phone_number}</span>
                    </div>
                  )}
                  {currentProvider.email && (
                    <div className="flex items-center text-gray-600">
                      <FiMail className="mr-3" />
                      <span>{currentProvider.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-2">Starting Price</h3>
                <p className="text-3xl font-bold text-primary-600">
                  {formatters.currency(currentProvider.starting_price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderDetail;
