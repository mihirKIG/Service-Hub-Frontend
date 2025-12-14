import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Loading from '@components/common/Loading';

const LoginPage = () => {
  const navigate = useNavigate();
  const { sendOTP: sendOTPService, verifyOTP: verifyOTPService, googleLogin: googleLoginService } = useAuth();

  // Step management
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  
  // Phone step
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // OTP step
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Google
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP input refs
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === 'otp' && otpRefs[0].current) {
      otpRefs[0].current.focus();
    }
  }, [step]);

  // Resend timer
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  // Validate phone number
  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^[0-9]{10,11}$/.test(phone)) return 'Enter valid 10-11 digit phone number';
    return null;
  };

  // Handle phone input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhoneNumber(value);
      setPhoneError('');
    }
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    const error = validatePhone(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    setPhoneLoading(true);
    setPhoneError('');

    // Add country code
    const fullPhone = `+88${phoneNumber}`;
    const result = await sendOTPService(fullPhone);

    if (result.success) {
      toast.success('OTP sent to your phone!');
      setStep('otp');
      setResendTimer(60);
      setCanResend(false);
    } else {
      setPhoneError(result.error);
      toast.error(result.error);
    }

    setPhoneLoading(false);
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && value && newOtp.every((digit) => digit)) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpRefs[5].current?.focus();
      
      // Auto-submit
      setTimeout(() => handleVerifyOTP(pastedData), 100);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpCode = null) => {
    const otpValue = otpCode || otp.join('');

    if (otpValue.length !== 6) {
      setOtpError('Please enter 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    const fullPhone = `+88${phoneNumber}`;
    const result = await verifyOTPService(fullPhone, otpValue);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      setOtpError(result.error);
      toast.error(result.error);
      setOtp(['', '', '', '', '', '']);
      otpRefs[0].current?.focus();
    }

    setOtpLoading(false);
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);

    const fullPhone = `+88${phoneNumber}`;
    const result = await sendOTPService(fullPhone);

    if (result.success) {
      toast.success('OTP resent successfully!');
      otpRefs[0].current?.focus();
    } else {
      toast.error(result.error);
      setCanResend(true);
    }
  };

  // Google login with Firebase
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    const result = await googleLoginService();

    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      // Don't show error toast if user just closed the popup
      if (!result.error?.includes('cancelled')) {
        toast.error(result.error || 'Google Sign-In failed. Please try again.');
      }
    }

    setGoogleLoading(false);
  };

  // Back to phone step
  const handleBack = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">ServiceHub</h1>
          <p className="text-gray-600">Welcome back! Sign in to continue</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Phone Step */}
          {step === 'phone' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Enter your phone number to login</p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                      <span className="text-gray-500 font-medium">+88</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      disabled={phoneLoading}
                      className={`w-full pl-14 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
                        phoneError ? 'border-red-500' : 'border-gray-300'
                      } ${
                        phoneLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`}
                    />
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send you a one-time password
                  </p>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  disabled={phoneLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg"
                >
                  {phoneLoading ? (
                    <span className="flex items-center justify-center">
                      <Loading size="sm" />
                      <span className="ml-2">Sending OTP...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Send OTP
                      <FiArrowRight className="ml-2" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Google Sign-In */}
              <div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <>
                      <Loading size="sm" />
                      <span className="text-gray-700">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <FcGoogle className="text-2xl" />
                      <span className="text-gray-700 font-medium">Continue with Google</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-gray-600">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-semibold text-blue-600">+88{phoneNumber}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex justify-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      disabled={otpLoading}
                      className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        digit
                          ? 'border-blue-600 bg-blue-50'
                          : otpError
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } ${otpLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-sm text-red-600 text-center">{otpError}</p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                onClick={() => handleVerifyOTP()}
                fullWidth
                disabled={otpLoading || otp.some((d) => !d)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg mb-4"
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center">
                    <Loading size="sm" />
                    <span className="ml-2">Verifying...</span>
                  </span>
                ) : (
                  'Verify & Sign In'
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResendOTP}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Resend OTP in <span className="font-semibold text-blue-600">{resendTimer}s</span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms</a>
          {' & '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
