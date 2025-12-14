import { useState } from 'react';
import { authApi } from '@api/authApi';

/**
 * OTP Test Page - For Testing Backend Integration
 * Remove this in production
 */
const OTPTestPage = () => {
  const [phone, setPhone] = useState('+8801719159900');
  const [otp, setOtp] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(null);

  const handleSendOTP = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await authApi.sendOTP(phone);
      setResponse(result.data);
      console.log('✅ OTP Sent:', result.data);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await authApi.verifyOTP(phone, otp, {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
      });
      setResponse(result.data);
      setTokens(result.data.tokens);
      console.log('✅ OTP Verified:', result.data);
      
      // Store tokens
      if (result.data.tokens) {
        localStorage.setItem('accessToken', result.data.tokens.access);
        localStorage.setItem('refreshToken', result.data.tokens.refresh);
      }
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProfile = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await authApi.getProfile();
      setResponse(result.data);
      console.log('✅ Profile:', result.data);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const result = await authApi.logout(refreshToken);
      setResponse(result.data);
      console.log('✅ Logged out:', result.data);
      
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setTokens(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">OTP Authentication Test</h1>
          <p className="text-gray-600 mb-4">
            Backend: <code className="bg-gray-100 px-2 py-1 rounded">http://127.0.0.1:8000/api</code>
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ This is a test page. Remove in production.
            </p>
          </div>
        </div>

        {/* Step 1: Send OTP */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Step 1: Send OTP</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+8801719159900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: +8801XXXXXXXXX or 8801XXXXXXXXX or 01XXXXXXXXX
            </p>
          </div>

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>

        {/* Step 2: Verify OTP */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Step 2: Verify OTP</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="123456"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code from SMS or check console in DEBUG mode
            </p>
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>

        {/* Step 3: Protected Routes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Step 3: Protected Routes</h2>
          
          <div className="flex gap-4">
            <button
              onClick={handleGetProfile}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Profile'}
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>

          {tokens && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm font-medium text-green-800 mb-2">✅ Authenticated</p>
              <p className="text-xs text-green-700">
                Access Token: {tokens.access.substring(0, 30)}...
              </p>
            </div>
          )}
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">✅ Success Response</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">❌ Error Response</h3>
            <pre className="bg-red-50 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📝 Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter your Bangladesh phone number (with or without +88)</li>
            <li>Click "Send OTP" - check your phone for the SMS</li>
            <li>Enter the 6-digit OTP code</li>
            <li>Click "Verify OTP" to login/register</li>
            <li>Once logged in, try "Get Profile" to test protected routes</li>
            <li>Click "Logout" to end the session</li>
          </ol>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-medium text-blue-800 mb-2">💡 Development Tips</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• In DEBUG mode, OTP is shown in the send-otp response</li>
              <li>• OTP expires in 2 minutes (120 seconds)</li>
              <li>• Each OTP can only be used once</li>
              <li>• Check browser console for detailed logs</li>
              <li>• SMS logs available in Django admin: http://127.0.0.1:8000/admin/notifications/smslog/</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPTestPage;
