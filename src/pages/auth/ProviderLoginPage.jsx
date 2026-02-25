import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginWithGoogle } from '@features/auth/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Loading from '@components/common/Loading';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '@config/firebase';
import { signInWithPopup } from 'firebase/auth';

const ProviderLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const from = location.state?.from || '/provider/dashboard';

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user is a provider
      if (user.is_provider && user.provider_status === 'approved') {
        navigate('/provider/dashboard');
      } else if (user.is_provider && user.provider_status === 'pending') {
        toast.info('Your provider application is pending approval');
        navigate('/provider/applications');
      } else {
        // Not a provider, redirect to become provider page
        toast.info('Please apply to become a provider first');
        navigate('/become-provider');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(login(formData)).unwrap();
      
      if (result.user) {
        // Check provider status
        if (result.user.is_provider && result.user.provider_status === 'approved') {
          toast.success('Welcome back, Provider!');
          navigate('/provider/dashboard');
        } else if (result.user.is_provider && result.user.provider_status === 'pending') {
          toast.info('Your provider application is pending approval');
          navigate('/provider/applications');
        } else {
          toast.info('Please apply to become a provider first');
          navigate('/become-provider');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const loginResult = await dispatch(loginWithGoogle({ token })).unwrap();

      if (loginResult.user) {
        if (loginResult.user.is_provider && loginResult.user.provider_status === 'approved') {
          toast.success('Welcome back, Provider!');
          navigate('/provider/dashboard');
        } else if (loginResult.user.is_provider && loginResult.user.provider_status === 'pending') {
          toast.info('Your provider application is pending approval');
          navigate('/provider/applications');
        } else {
          toast.info('Please apply to become a provider first');
          navigate('/become-provider');
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-4xl font-bold text-white">ServiceHub</h1>
          </Link>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Provider Login
            </h2>
            <p className="text-white/90 text-lg">
              Access your provider dashboard
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-green-400" />
            Provider Benefits
          </h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Manage your services and bookings
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Track earnings and performance
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Connect with customers directly
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Grow your business with us
            </li>
          </ul>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="provider@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loading size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <FiArrowRight />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Not a provider yet?{' '}
              <Link to="/become-provider" className="text-purple-600 hover:text-purple-700 font-semibold">
                Apply Now
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Regular user?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-white hover:text-white/80 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderLoginPage;
