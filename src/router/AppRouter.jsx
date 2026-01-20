import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from '@utils/constants';
import Loading from '@components/common/Loading';
import ProtectedRoute from './ProtectedRoute';
import ProviderRoute from './ProviderRoute';

// Layouts
import AuthLayout from '@layouts/AuthLayout';
import UserDashboardLayout from '@layouts/UserDashboardLayout';
import ProviderDashboardLayout from '@layouts/ProviderDashboardLayout';

// Lazy load pages
const Home = lazy(() => import('@pages/home/Home'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const OTPTestPage = lazy(() => import('@pages/auth/OTPTestPage'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const AllServices = lazy(() => import('@pages/services/AllServices'));
const ServiceDetails = lazy(() => import('@pages/services/ServiceDetails'));
const Profile = lazy(() => import('@pages/user/Profile'));
const EditProfile = lazy(() => import('@pages/user/EditProfile'));
const MyBookings = lazy(() => import('@pages/user/MyBookings'));
const ProviderList = lazy(() => import('@pages/provider/ProviderList'));
const ProviderDetail = lazy(() => import('@pages/provider/ProviderDetail'));
const BookService = lazy(() => import('@pages/booking/BookService'));
const BookingSuccess = lazy(() => import('@pages/booking/BookingSuccess'));
const Checkout = lazy(() => import('@pages/payment/Checkout'));
const PaymentHistory = lazy(() => import('@pages/payment/PaymentHistory'));
const PaymentSuccess = lazy(() => import('@pages/payment/PaymentSuccess'));
const PaymentFail = lazy(() => import('@pages/payment/PaymentFail'));
const PaymentCancel = lazy(() => import('@pages/payment/PaymentCancel'));
const ChatRoom = lazy(() => import('@pages/chat/ChatRoom'));
const ChatList = lazy(() => import('@pages/chat/ChatList'));
const AddReview = lazy(() => import('@pages/review/AddReview'));
const Notifications = lazy(() => import('@pages/notifications/Notifications'));
const ProviderDashboard = lazy(() => import('@pages/provider/ProviderDashboard'));
const Services = lazy(() => import('@pages/provider/Services'));
const AddService = lazy(() => import('@pages/provider/AddService'));
const Portfolio = lazy(() => import('@pages/provider/Portfolio'));
const Availability = lazy(() => import('@pages/provider/Availability'));

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        
        {/* Authentication - Separate Login and Register Pages */}
        <Route path="/auth" element={<LoginPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        
        {/* OTP Test Page - Remove in production */}
        <Route path="/otp-test" element={<OTPTestPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Payment Callback Routes - Public */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* All Services */}
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/:category" element={<AllServices />} />
        <Route path="/service/:serviceId" element={<ServiceDetails />} />
        
        {/* Booking Routes - Standalone */}
        <Route path="/book/:providerId" element={<BookService />} />
        <Route path="/book-service/:serviceId" element={<BookService />} />
        <Route path="/booking/success" element={<BookingSuccess />} />

          {/* Provider Public Pages */}
          <Route path="/providers" element={<ProviderList />} />
          <Route path="/providers/:id" element={<ProviderDetail />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserDashboardLayout />}>
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
              <Route path={ROUTES.MY_BOOKINGS} element={<MyBookings />} />
              <Route path={ROUTES.PAYMENT} element={<Checkout />} />
              <Route path={ROUTES.PAYMENT_HISTORY} element={<PaymentHistory />} />
              <Route path={ROUTES.CHAT} element={<ChatList />} />
              <Route path="/chat/:roomId" element={<ChatRoom />} />
              <Route path="/review/:bookingId" element={<AddReview />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
            </Route>
          </Route>

          {/* Protected Provider Routes */}
          <Route element={<ProviderRoute />}>
            <Route element={<ProviderDashboardLayout />}>
              <Route path={ROUTES.PROVIDER_DASHBOARD} element={<ProviderDashboard />} />
              <Route path={ROUTES.PROVIDER_SERVICES} element={<Services />} />
              <Route path="/provider/services/add" element={<AddService />} />
              <Route path={ROUTES.PROVIDER_PORTFOLIO} element={<Portfolio />} />
              <Route path={ROUTES.PROVIDER_AVAILABILITY} element={<Availability />} />
            </Route>
          </Route>

        {/* 404 */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl">404 - Page Not Found</h1></div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
