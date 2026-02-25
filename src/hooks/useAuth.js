import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const isProvider = user?.user_type === 'provider';
  const isCustomer = user?.user_type === 'customer';
  const isAdmin = user?.user_type === 'admin';

  return {
    user,
    isAuthenticated,
    loading,
    isProvider,
    isCustomer,
    isAdmin,
  };
};

export default useAuth;
