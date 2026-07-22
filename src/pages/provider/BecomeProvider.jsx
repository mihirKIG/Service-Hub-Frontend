import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServicePosts, selectServicePosts } from '@features/providers/providerManagementSlice';
import { FiBriefcase, FiMapPin, FiClock, FiAward, FiCheckCircle, FiX } from 'react-icons/fi';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import ProviderApplicationForm from '@components/provider/ProviderApplicationForm';
import { ROUTES } from '@utils/constants';

const BecomeProvider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const servicePosts = useSelector(selectServicePosts);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadServicePosts();
  }, []);

  const loadServicePosts = async () => {
    try {
      setError(null);
      console.log('Fetching service posts from backend...');
      const result = await dispatch(fetchServicePosts()).unwrap();
      console.log('Service posts API response:', result);
      console.log('Is array?', Array.isArray(result));
      console.log('Type:', typeof result);
      
      const postsData = Array.isArray(result) ? result : result?.data || result?.results || [];
      console.log('Extracted posts data:', postsData);
      
      if (postsData.length === 0) {
        console.warn('No service posts found in backend');
      }
    } catch (error) {
      console.error('Failed to load service posts:', error);
      
      // Check if it's a network error
      const isNetworkError = error?.message?.includes('Network Error') || 
                            error?.message?.includes('ERR_CONNECTION_REFUSED') ||
                            !error?.response;
      
      if (isNetworkError) {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
        setError(`Cannot connect to backend server. Please make sure it's reachable at ${apiUrl}`);
      } else if (error?.response?.status === 404) {
        setError('Service posts endpoint not found. Please check backend URL configuration.');
      } else {
        setError(error?.message || 'Failed to load service posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (post) => {
    setSelectedPost(post);
    setShowApplicationForm(true);
  };

  const handleCloseForm = () => {
    setShowApplicationForm(false);
    setSelectedPost(null);
  };

  const handleApplicationSuccess = () => {
    setSuccessMessage('Application submitted successfully! We will review your application and get back to you soon.');
    setShowApplicationForm(false);
    setSelectedPost(null);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Ensure servicePosts is always an array
  const postsArray = Array.isArray(servicePosts) ? servicePosts : [];

  // Get unique categories
  const categories = ['all', ...new Set(postsArray.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all' 
    ? postsArray 
    : postsArray.filter(post => post.category === selectedCategory);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Service Provider
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our platform and start earning by offering your professional services. 
            Choose from available positions and apply today!
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Flexible Work</h3>
            <p className="text-gray-600 text-sm">
              Work on your own schedule and choose your clients
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Guaranteed Payments</h3>
            <p className="text-gray-600 text-sm">
              Secure and timely payments for all completed services
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Build Your Brand</h3>
            <p className="text-gray-600 text-sm">
              Grow your reputation with reviews and ratings
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Positions</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Service Posts Grid */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="mt-1 text-sm text-green-700">{successMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex text-green-400 hover:text-green-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Service Posts</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button 
                  onClick={loadServicePosts}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <ServicePostCard 
                key={post.id} 
                post={post} 
                onApply={() => handleApply(post)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">
              {error ? 'Could not load service posts' : 'No positions available in this category'}
            </p>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedPost && (
        <ProviderApplicationForm
          servicePost={selectedPost}
          onClose={handleCloseForm}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

// Service Post Card Component
const ServicePostCard = ({ post, onApply }) => {
  // Handle both camelCase and snake_case from backend
  const isActive = post.isActive ?? post.is_active ?? true;
  const positionsAvailable = post.positionsAvailable ?? post.positions_available ?? 0;
  const experienceRequirements = post.experienceRequirements ?? post.experience_requirements;
  const requiredSkills = post.requiredSkills ?? post.required_skills;
  const serviceArea = post.serviceArea ?? post.service_area;

  // Debug log
  console.log('Post data:', { 
    id: post.id, 
    title: post.title,
    isActive, 
    positionsAvailable,
    originalPost: post 
  });

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {post.category}
          </span>
          {positionsAvailable > 0 && (
            <span className="text-xs text-green-600 font-medium">
              {positionsAvailable} positions
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {post.location && (
            <div className="flex items-center text-sm text-gray-500">
              <FiMapPin className="w-4 h-4 mr-2" />
              <span>{post.location}</span>
            </div>
          )}
          
          {experienceRequirements && (
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="w-4 h-4 mr-2" />
              <span>{experienceRequirements}</span>
            </div>
          )}
        </div>

        {/* Skills Required */}
        {requiredSkills && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Required Skills:</p>
            <p className="text-xs text-gray-600 line-clamp-2">{requiredSkills}</p>
          </div>
        )}

        {/* Qualifications */}
        {post.qualifications && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Qualifications:</p>
            <p className="text-xs text-gray-600 line-clamp-2">{post.qualifications}</p>
          </div>
        )}

        {/* Apply Button */}
        <Button 
          onClick={onApply}
          className="w-full"
          disabled={!isActive || positionsAvailable === 0}
        >
          {isActive && positionsAvailable > 0 ? 'Apply Now' : 'Not Available'}
        </Button>
      </div>
    </div>
  );
};

export default BecomeProvider;
