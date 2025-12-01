import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiCalendar, FiImage, FiClock } from 'react-icons/fi';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { ROUTES } from '@utils/constants';

const ProviderDashboardLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: ROUTES.PROVIDER_DASHBOARD, label: 'Dashboard', icon: FiHome },
    { path: ROUTES.PROVIDER_SERVICES, label: 'Services', icon: FiPackage },
    { path: ROUTES.PROVIDER_AVAILABILITY, label: 'Availability', icon: FiClock },
    { path: ROUTES.PROVIDER_PORTFOLIO, label: 'Portfolio', icon: FiImage },
    { path: ROUTES.MY_BOOKINGS, label: 'Bookings', icon: FiCalendar },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderDashboardLayout;
