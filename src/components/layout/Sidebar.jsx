import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHome, FiGrid, FiBookmark, FiUser, FiLogOut, FiX, FiMenu } from 'react-icons/fi';
import { useAuth } from '@context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, sidebarOpen, setSidebarOpen } = useAuth();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', color: 'blue' },
    { path: '/services', icon: FiGrid, label: 'All Services', color: 'purple' },
    { path: '/bookings', icon: FiBookmark, label: 'My Bookings', color: 'green' },
    { path: '/profile', icon: FiUser, label: 'Profile', color: 'pink' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getColorClasses = (color, active) => {
    if (active) {
      const colors = {
        blue: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-l-4 border-blue-600',
        purple: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-l-4 border-purple-600',
        green: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-600',
        pink: 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 border-l-4 border-pink-600',
      };
      return colors[color];
    }
    return 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-l-4 border-transparent';
  };

  return (
    <>
      {/* Hamburger Menu Button - Always Visible */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 ${
          sidebarOpen ? 'left-[19rem]' : 'left-4'
        }`}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {/* Overlay - Shows when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-white shadow-2xl fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
          <Link to="/" onClick={() => sidebarOpen && toggleSidebar()}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ServiceHub
            </h1>
          </Link>
        </div>

        {/* User Info - Enhanced */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate mb-1">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || user?.phone || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Enhanced */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleSidebar}
                className={`group flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${getColorClasses(item.color, active)} ${
                  active ? 'shadow-md transform scale-105' : 'hover:transform hover:translate-x-1'
                }`}
              >
                <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  <Icon className="text-xl" />
                </div>
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Enhanced */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-red-50/50 to-pink-50/50">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center space-x-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 border-2 border-transparent hover:border-red-200 transition-all duration-300 hover:shadow-md transform hover:scale-105"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
