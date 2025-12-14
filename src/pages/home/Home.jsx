import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { ROUTES } from '@utils/constants';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Dhaka');

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `${ROUTES.PROVIDERS}?search=${searchQuery}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200")' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
            Your Personal Assistant
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center">
            One-stop solution for your services. Order any service, anytime.
          </p>
          
          {/* Search Bar with Location */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Location Selector */}
              <div className="flex items-center px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200">
                <FiMapPin className="text-pink-600 mr-2 text-xl" />
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-gray-900 font-medium focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                </select>
              </div>
              
              {/* Search Input */}
              <div className="flex-1 flex items-center px-4">
                <input
                  type="text"
                  placeholder="Find your service here e.g. AC, Car, Facial ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-4 text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              
              {/* Search Button */}
              <button type="submit" className="bg-pink-600 hover:bg-pink-700 px-8 py-4 transition-colors">
                <FiSearch className="text-white text-xl" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section with Icons */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            <Link to="/services/ac-repair" className="flex flex-col items-center min-w-[120px] group">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <span className="text-3xl">❄️</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">AC Repair Services</span>
            </Link>
            
            <Link to="/services/appliance" className="flex flex-col items-center min-w-[120px] group">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <span className="text-3xl">🔧</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Appliance Repair</span>
            </Link>
            
            <Link to="/services/cleaning" className="flex flex-col items-center min-w-[120px] group">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                <span className="text-3xl">🧹</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Cleaning Solution</span>
            </Link>
            
            <Link to="/services/beauty" className="flex flex-col items-center min-w-[120px] group">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-100 transition-colors">
                <span className="text-3xl">💄</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Beauty & Wellness</span>
            </Link>
            
            <Link to="/services/shifting" className="flex flex-col items-center min-w-[120px] group">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                <span className="text-3xl">🚚</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Shifting</span>
            </Link>
            
            <Link to="/services/health" className="flex flex-col items-center min-w-[120px] group">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                <span className="text-3xl">🏥</span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Health & Care</span>
            </Link>
          </div>
        </div>
      </section>

      {/* EMI Banner */}
      <section className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">EMI Available</h3>
              <p className="text-white">Buy now, pay later in installments</p>
              <p className="text-sm text-white mt-1">For any order over 1000 BDT</p>
            </div>
            <button className="bg-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-shadow">
              Know about servicehub 💡
            </button>
            <div className="text-6xl font-bold text-white opacity-20">0%</div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ServiceHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-gray-600">
                Get instant booking and quick service delivery
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
              <p className="text-gray-600">
                All service providers are verified and rated
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Multiple payment options with EMI facility
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
