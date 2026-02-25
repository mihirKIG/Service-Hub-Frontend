import { useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, 
  FiLogOut, 
  FiPhone, 
  FiMail, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSettings,
  FiGrid,
  FiBookmark,
  FiHome
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { servicesApi } from '@api/servicesApi';
import ServiceCard from '@components/cards/ServiceCard';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    setLoadingServices(true);
    try {
      // Fetch featured services (top services by bookings and views)
      const response = await servicesApi.getFeaturedServices();
      console.log('Featured Services Response:', response.data);
      setServices((response.data || []).slice(0, 6)); // Get first 6 services
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to regular services if featured endpoint fails
      try {
        const response = await servicesApi.getServices({ 
          status: 'active',
          ordering: '-bookings_count',
          limit: 6 
        });
        console.log('Fallback Services Response:', response.data);
        setServices(response.data.results || response.data || []);
      } catch (fallbackError) {
        console.error('Error fetching fallback services:', fallbackError);
      }
    } finally {
      setLoadingServices(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ServiceHub
            </h1>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || user?.phone || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-pink-50 text-pink-700 font-medium"
            >
              <FiHome className="text-xl" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/services"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiGrid className="text-xl" />
              <span>All Services</span>
            </Link>
            
            <Link
              to="/bookings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiBookmark className="text-xl" />
              <span>My Bookings</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiUser className="text-xl" />
              <span>Profile</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.full_name || 'User'}! 👋
                </h2>
                <p className="text-gray-600 mt-1">
                  Explore services and manage your bookings
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-8 py-8">
          <div className="max-w-7xl">
            {/* Available Services */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Available Services</h3>
                  <p className="text-gray-500">Discover top-rated services for your needs</p>
                </div>
                <Link
                  to="/services"
                  className="group px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>View All</span>
                  <FiGrid className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {loadingServices ? (
                <div className="flex items-center justify-center py-12">
                  <Loading size="lg" />
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      {...service}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🛠️</div>
                  <p className="text-lg font-medium text-gray-900 mb-2">No services available yet</p>
                  <p className="text-sm text-gray-600">Check back later for available services</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-lg p-10 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-900">Quick Actions</h3>
                <div className="h-1 flex-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full ml-6 max-w-xs"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/services')}
                  className="group relative p-10 bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-transparent hover:border-blue-300 overflow-hidden transform hover:-translate-y-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <span className="text-5xl">🔍</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl">Browse Services</h4>
                    <p className="text-sm text-gray-600">Find professional service providers</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/bookings')}
                  className="group relative p-10 bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-transparent hover:border-purple-300 overflow-hidden transform hover:-translate-y-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <span className="text-5xl">📅</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl">My Bookings</h4>
                    <p className="text-sm text-gray-600">View and manage your bookings</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="group relative p-10 bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-transparent hover:border-orange-300 overflow-hidden transform hover:-translate-y-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <span className="text-5xl">⚙️</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl">Settings</h4>
                    <p className="text-sm text-gray-600">Manage your account & preferences</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
