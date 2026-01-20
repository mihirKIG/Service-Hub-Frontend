import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Sidebar from '@components/layout/Sidebar';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@utils/constants';

const Home = () => {
  const { isAuthenticated, sidebarOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Dhaka');

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `${ROUTES.PROVIDERS}?search=${searchQuery}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        
        <div className={`flex-1 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'ml-64' : 'ml-0'}`}>
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

      {/* Categories Section - Professional Cards */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-600">Choose from our wide range of professional services</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Link to="/services/ac-repair" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-blue-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">❄️</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">AC Repair</h3>
                <p className="text-xs text-gray-500">Services</p>
              </div>
            </Link>
            
            <Link to="/services/appliance" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-green-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">🔧</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">Appliance</h3>
                <p className="text-xs text-gray-500">Repair</p>
              </div>
            </Link>
            
            <Link to="/services/cleaning" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-purple-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">🧹</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">Cleaning</h3>
                <p className="text-xs text-gray-500">Solution</p>
              </div>
            </Link>
            
            <Link to="/services/beauty" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-pink-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">💄</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">Beauty &</h3>
                <p className="text-xs text-gray-500">Wellness</p>
              </div>
            </Link>
            
            <Link to="/services/shifting" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-orange-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">🚚</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">Shifting</h3>
                <p className="text-xs text-gray-500">Services</p>
              </div>
            </Link>
            
            <Link to="/services/health" className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-red-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">🏥</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">Health &</h3>
                <p className="text-xs text-gray-500">Care</p>
              </div>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
