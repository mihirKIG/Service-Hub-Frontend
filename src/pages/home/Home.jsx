import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/common/Button';
import { ROUTES, SERVICE_CATEGORIES } from '@utils/constants';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to providers page with search query
    window.location.href = `${ROUTES.PROVIDERS}?search=${searchQuery}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Trusted Service Providers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Connect with professionals for all your service needs
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 flex items-center px-4">
                  <FiSearch className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-4 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <Button type="submit" className="rounded-none px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`${ROUTES.PROVIDERS}?category=${category.slug}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ServiceHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Trusted Providers</h3>
              <p className="text-gray-600">
                Browse verified service providers with ratings and reviews
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">
                Chat directly with providers to discuss your needs
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book and pay for services securely online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers</p>
          <div className="flex justify-center space-x-4">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" variant="secondary">
                Sign Up Now <FiArrowRight className="ml-2 inline" />
              </Button>
            </Link>
            <Link to={ROUTES.PROVIDERS}>
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
