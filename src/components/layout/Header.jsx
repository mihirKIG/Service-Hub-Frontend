import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FiBell, FiMenu, FiX, FiUser, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { logout } from '@features/auth/authSlice';
import Avatar from '@components/common/Avatar';
import NotificationBell from '@components/common/NotificationBell';
import AdminLoginModal from '@components/common/AdminLoginModal';
import { ROUTES } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';
import { handleProviderDashboardNavigation } from '@utils/providerUtils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarOpen, setSidebarOpen } = useAuth();
  const { unreadCount } = useSelector((state) => state.notifications);
  const { unreadCount: chatUnreadCount } = useSelector((state) => state.chat);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  const handleProviderDashboardClick = (e) => {
    e.preventDefault();
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast.error('Please login first', {
        icon: '🔒',
      });
      navigate(ROUTES.LOGIN, { state: { from: '/provider/dashboard' } });
      return;
    }
    
    // If user is a provider, go to provider dashboard
    if (user?.provider_status === 'approved' || user?.has_provider_access === true) {
      navigate('/provider/dashboard');
    } 
    // If user has pending application
    else if (user?.provider_status === 'pending') {
      toast.info('Your provider application is under review', {
        icon: '⏳',
      });
      navigate('/my-applications');
    }
    // If regular user or no provider status, go to become provider page
    else {
      toast.info('Apply to become a provider', {
        icon: '📝',
      });
      navigate('/become-provider');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">ServiceHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={ROUTES.HOME} className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to={ROUTES.PROVIDERS} className="text-gray-700 hover:text-primary-600">
              Find Services
            </Link>
            <a
              href="#"
              onClick={handleProviderDashboardClick}
              className="text-gray-700 hover:text-primary-600 cursor-pointer"
            >
              Provider Dashboard
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Chat */}
                <Link to={ROUTES.CHAT} className="relative text-gray-700 hover:text-primary-600">
                  <FiMessageSquare className="h-6 w-6" />
                  {chatUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {chatUnreadCount}
                    </span>
                  )}
                </Link>

                {/* Notification Bell Component */}
                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <Avatar
                      src={user?.profile_image}
                      name={user?.full_name || user?.email}
                      size="md"
                    />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiUser className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        to={ROUTES.MY_BOOKINGS}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to={ROUTES.LOGIN}>
                  <button className="px-4 py-2 text-gray-700 hover:text-primary-600">
                    Login
                  </button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Sign Up
                  </button>
                </Link>
                <button
                  onClick={() => {
                    console.log('Admin button clicked');
                    setAdminModalOpen(true);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 text-sm font-medium flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                  title="Admin Login"
                >
                  <span className="text-base">👑</span>
                  <span className="hidden sm:inline">Admin</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link to={ROUTES.HOME} className="block py-2 text-gray-700">
              Home
            </Link>
            <Link to={ROUTES.PROVIDERS} className="block py-2 text-gray-700">
              Find Services
            </Link>
            {isAuthenticated && user?.user_type === 'provider' && (
              <Link to={ROUTES.PROVIDER_DASHBOARD} className="block py-2 text-gray-700">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={adminModalOpen} 
        onClose={() => setAdminModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
