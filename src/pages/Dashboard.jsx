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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <FiCalendar className="text-3xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Completed</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <FiCheckCircle className="text-3xl" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm mb-1">Pending</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <FiClock className="text-3xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Available Services */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Available Services</h3>
                <Link
                  to="/services"
                  className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
                >
                  View All
                  <FiGrid />
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/services')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-center group"
                >
                  <div className="text-4xl mb-3">🔍</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Browse Services</h4>
                  <p className="text-sm text-gray-600">Find service providers</p>
                </button>

                <button
                  onClick={() => navigate('/bookings')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-center group"
                >
                  <div className="text-4xl mb-3">📅</div>
                  <h4 className="font-semibold text-gray-900 mb-1">My Bookings</h4>
                  <p className="text-sm text-gray-600">View your bookings</p>
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-center group"
                >
                  <div className="text-4xl mb-3">⚙️</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Settings</h4>
                  <p className="text-sm text-gray-600">Manage your profile</p>
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
