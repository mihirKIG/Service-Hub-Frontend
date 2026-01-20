/**
 * Example Usage of OTP Authentication System
 * This file demonstrates how to use the authentication functions
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  sendOTP, 
  verifyOTP, 
  googleLogin, 
  logout, 
  isAuthenticated, 
  getCurrentUser 
} from '@api/otpService';

// ============================================
// Example 1: Send OTP
// ============================================
const SendOTPExample = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await sendOTP(phone);
      console.log('OTP sent:', response);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleSendOTP} disabled={loading}>
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  );
};

// ============================================
// Example 2: Verify OTP
// ============================================
const VerifyOTPExample = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await verifyOTP(phone, otp);
      console.log('Login successful:', response);
      
      // Tokens are automatically saved to localStorage
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
        maxLength={6}
      />
      <button onClick={handleVerifyOTP} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
};

// ============================================
// Example 3: Google Sign-In
// ============================================
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignInExample = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      console.log('Google login successful:', response);
      
      // Tokens are automatically saved to localStorage
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleError = () => {
    alert('Google Sign-In failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

// ============================================
// Example 4: Check Authentication Status
// ============================================
const AuthCheckExample = () => {
  const navigate = useNavigate();

  const checkAuth = () => {
    if (isAuthenticated()) {
      console.log('User is logged in');
      const user = getCurrentUser();
      console.log('Current user:', user);
    } else {
      console.log('User is not logged in');
      navigate('/login-otp');
    }
  };

  return (
    <button onClick={checkAuth}>
      Check Auth Status
    </button>
  );
};

// ============================================
// Example 5: Protected Component
// ============================================
const ProtectedComponent = () => {
  const navigate = useNavigate();

  // Check auth on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login-otp');
    }
  }, [navigate]);

  const user = getCurrentUser();

  return (
    <div>
      <h1>Welcome, {user?.name || 'User'}!</h1>
      <p>Phone: {user?.phone_number}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

// ============================================
// Example 6: Logout
// ============================================
const LogoutExample = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears all tokens from localStorage
    console.log('Logged out successfully');
    navigate('/');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

// ============================================
// Example 7: Get User Info
// ============================================
const UserInfoExample = () => {
  const user = getCurrentUser();

  return (
    <div>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Phone: {user.phone_number}</p>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};

// ============================================
// Example 8: Complete Login Flow
// ============================================
const CompleteLoginFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOTP(phone);
      setStep('otp');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(phone, otp);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <form onSubmit={handleSendOTP}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        maxLength={6}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      <button type="button" onClick={() => setStep('phone')}>
        Change Phone Number
      </button>
    </form>
  );
};

// ============================================
// Example 9: Use in useEffect
// ============================================
import { useEffect } from 'react';

const AutoRedirectExample = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <div>Login Page</div>;
};

// ============================================
// Example 10: Custom Hook for Auth
// ============================================
const useAuth = () => {
  const navigate = useNavigate();

  const login = async (phone, otp) => {
    try {
      await verifyOTP(phone, otp);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    logout();
    navigate('/login-otp');
  };

  const checkAuth = () => {
    return isAuthenticated();
  };

  const getUser = () => {
    return getCurrentUser();
  };

  return {
    login,
    signOut,
    checkAuth,
    getUser,
    isAuthenticated: isAuthenticated(),
    user: getCurrentUser(),
  };
};

// Usage of custom hook
const CustomHookExample = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

// ============================================
// Export examples
// ============================================
export {
  SendOTPExample,
  VerifyOTPExample,
  GoogleSignInExample,
  AuthCheckExample,
  ProtectedComponent,
  LogoutExample,
  UserInfoExample,
  CompleteLoginFlow,
  AutoRedirectExample,
  useAuth,
  CustomHookExample,
};
