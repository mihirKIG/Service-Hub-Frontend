import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import userReducer from '@features/user/userSlice';
import providerReducer from '@features/providers/providerSlice';
import bookingReducer from '@features/bookings/bookingSlice';
import paymentReducer from '@features/payments/paymentSlice';
import reviewReducer from '@features/reviews/reviewSlice';
import notificationReducer from '@features/notifications/notificationSlice';
import chatReducer from '@features/chat/chatSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  providers: providerReducer,
  bookings: bookingReducer,
  payments: paymentReducer,
  reviews: reviewReducer,
  notifications: notificationReducer,
  chat: chatReducer,
});

export default rootReducer;
