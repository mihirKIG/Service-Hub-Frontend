import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiLogOut, 
  FiPhone, 
  FiMail, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">ServiceHub</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center"
            >
              <FiLogOut className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
              <FiUser className="text-4xl text-pink-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back{user?.name ? `, ${user.name}` : ''}!
              </h2>
              <p className="text-pink-100">
                You're successfully logged in to your dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
              <button className="text-pink-600 hover:text-pink-700">
                <FiSettings className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              {user?.name && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FiUser className="text-pink-600 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                </div>
              )}

              {user?.phone_number && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FiPhone className="text-pink-600 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900 font-medium">{user.phone_number}</p>
                  </div>
                </div>
              )}

              {user?.email && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FiMail className="text-pink-600 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
              )}

              {user?.created_at && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-pink-600 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {!user?.name && !user?.phone_number && !user?.email && (
                <div className="text-center py-8 text-gray-500">
                  <p>No profile information available</p>
                  <p className="text-sm mt-2">Complete your profile to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <FiCheckCircle className="text-3xl text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <FiClock className="text-3xl text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">🎉 Welcome Bonus</p>
              <p className="text-xs text-blue-600">
                Get 10% off on your first service booking!
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/providers')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-center"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="font-semibold text-gray-900 mb-1">Browse Services</h4>
              <p className="text-sm text-gray-600">Find service providers</p>
            </button>

            <button 
              onClick={() => navigate('/bookings')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-center"
            >
              <div className="text-4xl mb-3">📅</div>
              <h4 className="font-semibold text-gray-900 mb-1">My Bookings</h4>
              <p className="text-sm text-gray-600">View your bookings</p>
            </button>

            <button 
              onClick={() => navigate('/profile')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-center"
            >
              <div className="text-4xl mb-3">⚙️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Settings</h4>
              <p className="text-sm text-gray-600">Manage your account</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg font-medium mb-2">No activity yet</p>
            <p className="text-sm">Start booking services to see your activity here</p>
            <Button
              onClick={() => navigate('/providers')}
              className="mt-4 bg-pink-600 hover:bg-pink-700"
            >
              Explore Services
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2025 ServiceHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
