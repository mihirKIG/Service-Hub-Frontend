import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { servicesApi } from '@api/servicesApi';
import { providerApi } from '@api/providerApi';
import ServiceCard from '@components/cards/ServiceCard';
import Loading from '@components/common/Loading';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Sidebar from '@components/layout/Sidebar';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';

// Category mapping for URL slugs
const CATEGORY_MAP = {
  'ac-repair': 'AC Repair',
  'appliance': 'Appliance Repair',
  'cleaning': 'Cleaning',
  'beauty': 'Beauty & Wellness',
  'plumbing': 'Plumbing',
  'electrical': 'Electrical',
  'carpentry': 'Carpentry',
  'painting': 'Painting',
  'pest-control': 'Pest Control',
};

const AllServices = () => {
  const { category: categorySlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, sidebarOpen } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pricingType, setPricingType] = useState('');
  const [serviceStatus, setServiceStatus] = useState('active');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set category from URL slug
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const categoryName = CATEGORY_MAP[categorySlug];
      const category = categories.find(cat => cat.name === categoryName);
      if (category) {
        setSelectedCategory(category.id.toString());
      }
    } else if (!categorySlug) {
      // If no category in URL, clear the selected category
      setSelectedCategory('');
    }
  }, [categorySlug, categories]);

  // Fetch services when filters change
  useEffect(() => {
    fetchServices();
  }, [searchQuery, selectedCategory, pricingType, serviceStatus, minPrice, maxPrice, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await providerApi.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (pricingType) params.pricing_type = pricingType;
      if (serviceStatus) params.status = serviceStatus;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (sortBy) params.ordering = sortBy;

      const response = await servicesApi.getServices(params);
      setServices(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error.message || 'Failed to load services');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPricingType('');
    setServiceStatus('active');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('-created_at');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        
        <main className={`flex-1 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {categorySlug ? CATEGORY_MAP[categorySlug] || 'All Services' : 'All Services'}
            </h1>
            <p className="text-lg text-pink-100">
              {categorySlug 
                ? `Browse ${CATEGORY_MAP[categorySlug]} services` 
                : 'Browse through our comprehensive list of services'
              }
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white shadow-md -mt-8 mx-4 sm:mx-6 lg:mx-8 rounded-lg sticky top-4 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services by title, description, or provider..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Category */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    // Navigate to /services when "All Categories" is selected
                    if (!value && categorySlug) {
                      navigate('/services');
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                {/* Pricing Type */}
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                >
                  <option value="">All Pricing</option>
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed</option>
                  <option value="package">Package</option>
                </select>

                {/* Min Price */}
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                />

                {/* Max Price */}
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                />

                {/* Status */}
                <select
                  value={serviceStatus}
                  onChange={(e) => setServiceStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                >
                  <option value="-created_at">Newest First</option>
                  <option value="created_at">Oldest First</option>
                  <option value="base_price">Price: Low to High</option>
                  <option value="-base_price">Price: High to Low</option>
                  <option value="-views_count">Most Viewed</option>
                  <option value="-bookings_count">Most Booked</option>
                  <option value="title">Name: A-Z</option>
                  <option value="-title">Name: Z-A</option>
                </select>

                {/* Clear Filters */}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loading size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error Loading Services
              </h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <button
                onClick={() => fetchServices()}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{services.length}</span> services found
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    {...service}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setPricingType('');
                  setServiceStatus('active');
                  setMinPrice('');
                  setMaxPrice('');
                  setSortBy('-created_at');
                }}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllServices;
