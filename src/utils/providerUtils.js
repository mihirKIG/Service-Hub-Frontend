/**
 * Provider Status Check Utility
 * Centralized provider verification logic
 */

/**
 * Check if user is an approved provider
 * @param {Object} user - User object from auth context
 * @returns {boolean} - True if user is approved provider
 */
export const isApprovedProvider = (user) => {
  if (!user) return false;
  
  const status = user.provider_status || user.has_provider_access;
  return status === 'approved' || status === true;
};

/**
 * Check if user has pending provider application
 * @param {Object} user - User object from auth context
 * @returns {boolean} - True if application is pending
 */
export const hasPendingApplication = (user) => {
  if (!user) return false;
  
  const status = user.provider_status || user.has_provider_access;
  return status === 'pending';
};

/**
 * Check if user has rejected provider application
 * @param {Object} user - User object from auth context
 * @returns {boolean} - True if application was rejected
 */
export const hasRejectedApplication = (user) => {
  if (!user) return false;
  
  const status = user.provider_status || user.has_provider_access;
  return status === 'rejected';
};

/**
 * Check if user has no provider status
 * @param {Object} user - User object from auth context
 * @returns {boolean} - True if user never applied
 */
export const hasNoProviderStatus = (user) => {
  if (!user) return true;
  
  const status = user.provider_status || user.has_provider_access;
  return !status || status === 'none';
};

/**
 * Get provider status message in Bangla
 * @param {Object} user - User object from auth context
 * @returns {Object} - {message, type, route}
 */
export const getProviderStatusMessage = (user) => {
  if (!user) {
    return {
      message: 'আপনাকে লগইন করতে হবে',
      type: 'error',
      route: '/login',
    };
  }

  const status = user.provider_status || user.has_provider_access;

  if (!status || status === 'none') {
    return {
      message: 'আপনাকে প্রথমে Provider হিসেবে আবেদন করতে হবে',
      type: 'warning',
      route: '/become-provider',
      icon: '⚠️',
    };
  }

  if (status === 'pending') {
    return {
      message: 'আপনার Provider আবেদন পর্যালোচনাধীন আছে',
      type: 'info',
      route: '/provider-applications/my-applications',
      icon: '⏳',
    };
  }

  if (status === 'rejected') {
    return {
      message: 'আপনার Provider আবেদন প্রত্যাখ্যান করা হয়েছে। আবার আবেদন করুন।',
      type: 'error',
      route: '/become-provider',
      icon: '❌',
    };
  }

  if (status === 'approved' || status === true) {
    return {
      message: 'Provider Dashboard',
      type: 'success',
      route: '/provider/dashboard',
      icon: '✅',
    };
  }

  return {
    message: 'Provider status যাচাই করতে সমস্যা হয়েছে',
    type: 'error',
    route: '/dashboard',
  };
};

/**
 * Handle provider dashboard navigation with proper checks
 * Routes to provider login page first, which will then redirect based on status
 * @param {Object} user - User object
 * @param {Function} navigate - React Router navigate function
 * @param {Function} toast - Toast notification function (optional)
 */
export const handleProviderDashboardNavigation = (user, navigate, toast = null) => {
  // If not logged in, go to provider login page
  if (!user) {
    if (toast) {
      toast.error('Please login as a provider', {
        duration: 3000,
        icon: '🔒',
      });
    }
    navigate('/provider-login');
    return;
  }

  // If logged in, check provider status
  const status = user.provider_status || user.has_provider_access;
  
  if (status === 'approved' || status === true) {
    // Approved provider - go to dashboard
    navigate('/provider/dashboard');
  } else if (status === 'pending') {
    // Pending approval
    if (toast) {
      toast.info('Your provider application is pending approval', {
        duration: 3000,
        icon: '⏳',
      });
    }
    navigate('/provider/applications');
  } else if (status === 'rejected') {
    // Rejected - can apply again
    if (toast) {
      toast.error('Your provider application was rejected. Please apply again.', {
        duration: 3000,
        icon: '❌',
      });
    }
    navigate('/become-provider');
  } else {
    // Not a provider - go to become provider page
    if (toast) {
      toast.info('Please apply to become a provider first', {
        duration: 3000,
        icon: '⚠️',
      });
    }
    navigate('/become-provider');
  }
};
