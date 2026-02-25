import { useState } from 'react';
import { FiX, FiUser, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  console.log('AdminLoginModal render - isOpen:', isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (phone.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }
    
    setLoading(true);

    try {
      // Format phone number with +88 prefix
      const formattedPhone = phone.startsWith('88') ? `+${phone}` : `+88${phone}`;
      
      console.log('Attempting admin login with phone:', formattedPhone);
      
      // Admin login
      const result = await adminLogin(formattedPhone, password);

      if (result.success) {
        toast.success('Admin login successful! 👑', {
          duration: 2000,
        });
        onClose();
        
        // Reset form
        setPhone('');
        setPassword('');
        
        // Navigate to admin dashboard
        setTimeout(() => {
          window.location.href = 'http://127.0.0.1:8000/admin/';
        }, 500);
      } else {
        toast.error(result.error || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FiX className="text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4">
            <span className="text-3xl">👑</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 text-sm">Enter admin credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">+88</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="1XXXXXXXXX"
                required
                maxLength={11}
                className="w-full pl-20 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">শুধু নাম্বার লিখুন, +88 auto add হবে</p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login as Admin'
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-center text-gray-400 mt-6">
          🔒 Admin access only - Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
};

export default AdminLoginModal;
