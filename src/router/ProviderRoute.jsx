import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '@utils/constants';
import Loading from '@components/common/Loading';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const ProviderRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show appropriate messages when access is denied
    if (!loading && isAuthenticated && user) {
      const providerStatus = user.provider_status || user.has_provider_access;
      
      if (!providerStatus) {
        toast.error('আপনাকে প্রথমে Provider হিসেবে আবেদন করতে হবে', {
          duration: 4000,
          icon: '⚠️',
        });
      } else if (providerStatus === 'pending') {
        toast.error('আপনার Provider আবেদন পর্যালোচনাধীন আছে', {
          duration: 4000,
          icon: '⏳',
        });
      } else if (providerStatus === 'rejected') {
        toast.error('আপনার Provider আবেদন প্রত্যাখ্যান করা হয়েছে', {
          duration: 4000,
          icon: '❌',
        });
      }
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return <Loading fullScreen />;
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check provider status
  const providerStatus = user?.provider_status || user?.has_provider_access;
  
  // No provider status → redirect to application page
  if (!providerStatus || providerStatus === 'none') {
    return <Navigate to={ROUTES.BECOME_PROVIDER} replace />;
  }
  
  // Pending application → redirect to my applications
  if (providerStatus === 'pending') {
    return <Navigate to={ROUTES.MY_APPLICATIONS} replace />;
  }
  
  // Rejected application → redirect to become provider page
  if (providerStatus === 'rejected') {
    return <Navigate to={ROUTES.BECOME_PROVIDER} replace />;
  }
  
  // Approved provider → allow access
  if (providerStatus === 'approved' || providerStatus === true) {
    return <Outlet />;
  }

  // Default: redirect to user dashboard
  return <Navigate to="/dashboard" replace />;
};

export default ProviderRoute;
