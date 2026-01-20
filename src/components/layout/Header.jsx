import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FiBell, FiMenu, FiX, FiUser, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { logout } from '@features/auth/authSlice';
import Avatar from '@components/common/Avatar';
import { ROUTES } from '@utils/constants';
import { useAuth } from '@context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger Menu Button (only show when authenticated) */}
          {isAuthenticated && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          )}

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
            {isAuthenticated && user?.user_type === 'provider' && (
              <Link to={ROUTES.PROVIDER_DASHBOARD} className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
            )}
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

                {/* Notifications */}
                <Link to={ROUTES.NOTIFICATIONS} className="relative text-gray-700 hover:text-primary-600">
                  <FiBell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

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
    </header>
  );
};

export default Header;
