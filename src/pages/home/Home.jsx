import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiArrowRight, FiStar, FiShield, FiZap, FiCheck, FiUsers, FiAward, FiClock, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Sidebar from '@components/layout/Sidebar';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@utils/constants';

const Home = () => {
  const { isAuthenticated, sidebarOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Service background images
  const backgroundImages = [
    {
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80',
      title: 'Home Cleaning Services'
    },
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80',
      title: 'AC Repair & Maintenance'
    },
    {
      url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
      title: 'Beauty & Salon Services'
    },
    {
      url: 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=1920&q=80',
      title: 'Appliance Repair'
    },
    {
      url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80',
      title: 'Professional Services'
    }
  ];

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
          {/* Hero Section - Service Background Images */}
          <section className="relative min-h-[600px] overflow-hidden">
            {/* Background Image Slider */}
            <div className="absolute inset-0">
              {backgroundImages.map((bg, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                    index === currentBgIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backgroundImage: `url(${bg.url})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-purple-900/85 to-pink-900/80"></div>
                </div>
              ))}
            </div>

            {/* Service Icons Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBgIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentBgIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center text-white">
                {/* Trust Badge */}
                <div className="inline-flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/40 shadow-lg">
                  <FiShield className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="text-sm font-semibold">Trusted Service Marketplace • 50,000+ Satisfied Customers</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                  Professional Services
                  <span className="block bg-gradient-to-r from-yellow-200 via-white to-blue-100 bg-clip-text text-transparent mt-2">
                    At Your Doorstep
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-4xl mx-auto font-medium">
                  Connect with verified service professionals for home repairs, beauty services, cleaning, and more.
                </p>
                <p className="text-lg mb-12 text-white/80 max-w-3xl mx-auto">
                  Safe • Reliable • Affordable • Available 24/7
                </p>
                
                {/* Enhanced Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-2xl p-2">
                    <div className="flex flex-col md:flex-row gap-2">
                      {/* Location Selector */}
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-blue-500 transition-colors">
                        <FiMapPin className="text-blue-600 mr-3 text-xl flex-shrink-0" />
                        <select 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="text-gray-900 font-medium focus:outline-none bg-transparent cursor-pointer flex-1"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barishal">Barishal</option>
                        </select>
                      </div>
                      
                      {/* Search Input */}
                      <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-blue-500 transition-colors">
                        <FiSearch className="text-gray-400 mr-3 text-xl flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Search for AC repair, cleaning, beauty services..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 py-3 text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                        />
                      </div>
                      
                      {/* Search Button */}
                      <button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <span>Search</span>
                        <FiArrowRight className="text-xl" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Professional Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                    <div className="text-4xl font-extrabold mb-1">500+</div>
                    <div className="text-sm text-white/90 font-medium">Service Providers</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                    <div className="text-4xl font-extrabold mb-1">10K+</div>
                    <div className="text-sm text-white/90 font-medium">Completed Jobs</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                    <div className="text-4xl font-extrabold mb-1">4.8★</div>
                    <div className="text-sm text-white/90 font-medium">Avg Rating</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                    <div className="text-4xl font-extrabold mb-1">24/7</div>
                    <div className="text-sm text-white/90 font-medium">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

      {/* Categories Section - Modern Cards with Hover Effects */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Service Categories</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
              Explore Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional service providers across multiple categories - quality you can trust
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            <Link to="/services/ac-repair" className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-3 hover:scale-105">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-blue-300/50">
                  <span className="text-6xl filter drop-shadow-lg">❄️</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">AC Repair</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">Installation & Service</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-blue-600 mx-auto" />
                </div>
              </div>
            </Link>
            
            <Link to="/services/appliance" className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border-2 border-transparent hover:border-green-200 transform hover:-translate-y-3 hover:scale-105">
                <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-green-300/50">
                  <span className="text-6xl filter drop-shadow-lg">🔧</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-600 transition-colors">Appliance</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">Repair & Maintenance</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-green-600 mx-auto" />
                </div>
              </div>
            </Link>
            
            <Link to="/services/cleaning" className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-3 hover:scale-105">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-400 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-purple-300/50">
                  <span className="text-6xl filter drop-shadow-lg">🧹</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-600 transition-colors">Cleaning</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">Home & Office</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-purple-600 mx-auto" />
                </div>
              </div>
            </Link>
            
            <Link to="/services/beauty" className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border-2 border-transparent hover:border-pink-200 transform hover:-translate-y-3 hover:scale-105">
                <div className="w-28 h-28 bg-gradient-to-br from-pink-500 to-rose-400 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-pink-300/50">
                  <span className="text-6xl filter drop-shadow-lg">💄</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-pink-600 transition-colors">Beauty</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">Salon & Wellness</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-pink-600 mx-auto" />
                </div>
              </div>
            </Link>
            
            <Link to="/services/shifting" className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border-2 border-transparent hover:border-orange-200 transform hover:-translate-y-3 hover:scale-105">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-orange-300/50">
                  <span className="text-6xl filter drop-shadow-lg">🚚</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-orange-600 transition-colors">Shifting</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">Moving Services</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-orange-600 mx-auto" />
                </div>
              </div>
            </Link>
            
            <Link to="/services/health" className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center text-center border-2 border-transparent hover:border-red-200 transform hover:-translate-y-3 hover:scale-105">
                <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-pink-400 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-red-300/50">
                  <span className="text-6xl filter drop-shadow-lg">🏥</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-red-600 transition-colors">Healthcare</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">Medical Services</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight className="text-red-600 mx-auto" />
                </div>
              </div>
            </Link>
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>View All Services</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Professional */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Book professional services in three easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-400 group-hover:scale-110 transition-transform shadow-2xl">
                <FiSearch className="text-5xl text-blue-400" />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold mb-3">1. Search Service</h3>
                <p className="text-white/80 text-lg">
                  Browse through our extensive list of verified service providers in your area
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-400 group-hover:scale-110 transition-transform shadow-2xl">
                <FiCheckCircle className="text-5xl text-green-400" />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold mb-3">2. Book & Pay</h3>
                <p className="text-white/80 text-lg">
                  Select your preferred time slot and make secure payment with multiple options
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-purple-400 group-hover:scale-110 transition-transform shadow-2xl">
                <FiAward className="text-5xl text-purple-400" />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold mb-3">3. Get Service</h3>
                <p className="text-white/80 text-lg">
                  Professional arrives at your doorstep and delivers quality service
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Get Started Now</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Why Choose ServiceHub</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
              Your Trusted Service Partner
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver quality, reliability, and excellence in every service we provide
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <FiShield className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Verified</h3>
              <p className="text-gray-600 leading-relaxed">
                All providers are background-checked and certified professionals
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <FiClock className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Available</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock service availability for emergency needs
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <FiCheck className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">
                Money-back guarantee if you're not satisfied with the service
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <FiTrendingUp className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">
                Competitive pricing with transparent quotes and no hidden charges
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-10 border-2 border-blue-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center mb-4">
                  <FiUsers className="text-4xl text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Expert Professionals</h4>
                <p className="text-gray-600">Highly skilled and trained service providers</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-4">
                  <FiAward className="text-4xl text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Award Winning</h4>
                <p className="text-gray-600">Recognized for excellence in service delivery</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-4">
                  <FiStar className="text-4xl text-orange-500" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Top Rated</h4>
                <p className="text-gray-600">4.8+ average rating from thousands of customers</p>
              </div>
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
