import { Link, useNavigate } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { SOCIAL_LINKS, CONTACT_EMAIL, ROUTES } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
    <footer className="bg-gray-900 text-gray-300">
      {/* Provider CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-white text-2xl font-bold mb-2">
                Ready to Earn as a Service Provider?
              </h3>
              <p className="text-blue-100">
                Join our platform and start offering your services today
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to={ROUTES.BECOME_PROVIDER}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Become a Provider
              </Link>
              <button
                onClick={handleProviderDashboardClick}
                className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors border-2 border-white"
              >
                Provider Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">ServiceHub</h3>
            <p className="text-sm">
              Connect with trusted service providers for all your needs. Quality services at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to={ROUTES.PROVIDERS} className="hover:text-white">Find Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.BECOME_PROVIDER} className="hover:text-white">Become a Provider</Link>
              </li>
              <li>
                <button onClick={handleProviderDashboardClick} className="hover:text-white text-left">
                  Provider Dashboard
                </button>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white">Resources</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <p className="text-sm mb-4">
              Email: <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a>
            </p>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} ServiceHub. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
