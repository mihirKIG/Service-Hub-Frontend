import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiHome, FiPackage, FiShoppingBag, FiDollarSign, FiUser, 
  FiMenu, FiX, FiLogOut, FiBell, FiMail, FiPhone 
} from 'react-icons/fi';
import { selectUser, logout } from '@features/auth/authSlice';
import Avatar from '@components/common/Avatar';
import NotificationBell from '@components/common/NotificationBell';
import { ROUTES } from '@utils/constants';

const ProviderDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: ROUTES.PROVIDER_DASHBOARD, label: 'Dashboard', icon: FiHome },
    { path: ROUTES.PROVIDER_SERVICES, label: 'My Services', icon: FiPackage },
    { path: ROUTES.PROVIDER_ORDERS, label: 'Orders', icon: FiShoppingBag },
    { path: ROUTES.PROVIDER_EARNINGS, label: 'Earnings', icon: FiDollarSign },
    { path: ROUTES.PROVIDER_PROFILE, label: 'Profile', icon: FiUser },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Provider Portal</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Provider Info */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center mb-4">
              <Avatar 
                src={user?.avatar || user?.profile_picture} 
                alt={user?.name} 
                size="lg"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">{user?.name || 'Provider'}</p>
                <p className="text-xs text-gray-600">Service Provider</p>
              </div>
            </div>
            
            {/* Contact Info in Sidebar */}
            <div className="space-y-2 mt-3">
              {user?.email && (
                <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/50 px-3 py-2 rounded-lg">
                  <FiMail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/50 px-3 py-2 rounded-lg">
                  <FiPhone className="w-3 h-3 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FiMenu className="w-6 h-6" />
              </button>

              {/* Page Title - Shown on larger screens */}
              <h1 className="hidden lg:block text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Provider Dashboard'}
              </h1>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4 ml-auto">
                {/* Notification Bell Component */}
                <NotificationBell />

                {/* User Menu - Desktop */}
                <div className="hidden lg:flex items-center">
                  <Avatar 
                    src={user?.avatar} 
                    alt={user?.name} 
                    size="sm"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} ServiceHub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProviderDashboardLayout;
