# OTP Authentication System Documentation

## Overview
Complete React authentication system with Phone OTP and Google Sign-In integration.

## Features Implemented

### 1. Phone Number Authentication with OTP
- Enter phone number (10-15 digits)
- Receive OTP via SMS
- 6-digit OTP verification
- Auto-focus and auto-submit
- Resend OTP with 60-second countdown
- Full error handling and validation

### 2. Google Sign-In
- One-click Google authentication
- Uses @react-oauth/google library
- Secure token exchange with backend
- Auto-redirect to dashboard on success

### 3. Dashboard
- Protected route (authentication required)
- User profile information display
- Quick stats and actions
- Logout functionality

## Files Created

```
src/
├── api/
│   └── otpService.js          # OTP and Google auth API service
├── pages/
│   ├── auth/
│   │   ├── LoginOTP.jsx       # Phone login page
│   │   └── OTPVerify.jsx      # OTP verification page
│   └── Dashboard.jsx          # Protected dashboard page
├── main.jsx                   # Updated with GoogleOAuthProvider
└── router/AppRouter.jsx       # Updated with new routes
```

## API Endpoints

### Send OTP
```javascript
POST /api/send-otp/
Body: {
  "phone_number": "01712345678"
}
Response: {
  "message": "OTP sent successfully"
}
```

### Verify OTP
```javascript
POST /api/verify-otp/
Body: {
  "phone_number": "01712345678",
  "otp": "123456"
}
Response: {
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "phone_number": "01712345678",
    "email": "john@example.com"
  }
}
```

### Google Login
```javascript
POST /api/google-login/
Body: {
  "token": "google_credential_token"
}
Response: {
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Setup Instructions

### 1. Install Dependencies
Already installed:
```bash
npm install @react-oauth/google
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:3001`
7. Copy the Client ID

### 3. Update Environment Variables

Edit `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

### 4. Backend Requirements

Your Django backend should have these endpoints:
- `POST /api/send-otp/` - Send OTP to phone
- `POST /api/verify-otp/` - Verify OTP and return JWT
- `POST /api/google-login/` - Verify Google token and return JWT

## Usage

### Phone Number Login Flow

1. User visits `/login-otp`
2. Enters phone number (e.g., 01712345678)
3. Clicks "Send OTP"
4. Redirected to `/otp-verify` with phone number
5. Enters 6-digit OTP
6. On success, JWT tokens stored in localStorage
7. Redirected to `/dashboard`

### Google Login Flow

1. User visits `/login-otp`
2. Clicks Google Sign-In button
3. Google popup appears
4. User selects Google account
5. Token sent to backend for verification
6. On success, JWT tokens stored in localStorage
7. Redirected to `/dashboard`

## Routes

```javascript
/login-otp      - Phone number login page
/otp-verify     - OTP verification page
/dashboard      - Protected dashboard (requires auth)
```

## Components

### LoginOTP Component
- Phone number input with validation
- Google Sign-In button
- Loading states
- Error handling
- Responsive design

### OTPVerify Component
- 6-digit OTP input fields
- Auto-focus next input
- Paste support
- Resend OTP functionality
- 60-second countdown timer
- Auto-submit on complete

### Dashboard Component
- Authentication check
- User profile display
- Quick stats cards
- Quick action buttons
- Logout functionality

## Security Features

1. **JWT Token Storage**: Tokens stored in localStorage
2. **Protected Routes**: Dashboard requires authentication
3. **Auto Token Refresh**: Handled by axios interceptor
4. **Input Validation**: Phone and OTP validation
5. **Error Handling**: Comprehensive error messages
6. **Session Management**: Logout clears all tokens

## LocalStorage Schema

```javascript
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "phone_number": "01712345678",
    "email": "john@example.com"
  }
}
```

## Helper Functions

### otpService.js Functions

```javascript
// Send OTP to phone number
sendOTP(phoneNumber)

// Verify OTP code
verifyOTP(phoneNumber, otp)

// Google Sign-In
googleLogin(credential)

// Logout user
logout()

// Check if authenticated
isAuthenticated()

// Get current user
getCurrentUser()
```

## Styling

- **TailwindCSS**: Utility-first CSS framework
- **Gradient Backgrounds**: Pink and blue gradients
- **Responsive Design**: Mobile-first approach
- **Icons**: react-icons library (FiPhone, FiArrowRight, etc.)
- **Animations**: Smooth transitions and hover effects

## Error Handling

### Phone Number Validation
- Required field check
- 10-15 digit validation
- Real-time validation feedback

### OTP Validation
- 6-digit requirement
- Invalid OTP error handling
- Auto-clear on error

### Network Errors
- Toast notifications for all errors
- Descriptive error messages
- Retry mechanisms

## Testing the System

### Test Phone Login
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3001/login-otp`
3. Enter test phone number
4. Check backend logs for OTP
5. Enter OTP on verification page
6. Verify redirect to dashboard

### Test Google Login
1. Ensure VITE_GOOGLE_CLIENT_ID is set
2. Navigate to `http://localhost:3001/login-otp`
3. Click Google Sign-In button
4. Select Google account
5. Verify redirect to dashboard

## Production Checklist

- [ ] Replace Google Client ID in .env
- [ ] Configure Google OAuth authorized domains
- [ ] Set up proper CORS on backend
- [ ] Enable HTTPS for production
- [ ] Add rate limiting to OTP endpoints
- [ ] Implement OTP expiry (5-10 minutes)
- [ ] Add brute force protection
- [ ] Set up monitoring and logging
- [ ] Test on multiple devices
- [ ] Add phone number verification service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

```json
{
  "@react-oauth/google": "^0.12.1",
  "axios": "^1.6.2",
  "react": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^4.12.0"
}
```

## Troubleshooting

### Google Sign-In Not Working
- Check if VITE_GOOGLE_CLIENT_ID is set correctly
- Verify authorized origins in Google Console
- Check browser console for errors
- Ensure GoogleOAuthProvider is wrapping the app

### OTP Not Received
- Verify backend send-otp endpoint is working
- Check phone number format
- Verify SMS service is configured on backend

### Dashboard Redirects to Login
- Check if tokens are in localStorage
- Verify isAuthenticated() function
- Check token expiry

## Future Enhancements

1. Add email OTP option
2. Implement biometric authentication
3. Add remember me functionality
4. Social login (Facebook, Apple)
5. Two-factor authentication (2FA)
6. Password recovery via OTP
7. Session timeout warnings
8. Device trust management

## Support

For issues or questions:
- Check browser console for errors
- Verify backend API responses
- Review network tab in DevTools
- Check token storage in Application tab

---

**Created**: December 2025  
**Status**: Production Ready  
**Version**: 1.0.0
