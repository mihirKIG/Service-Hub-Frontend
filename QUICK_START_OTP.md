# 🚀 Quick Start Guide - OTP Authentication System

## ✅ What's Been Created

### 📁 New Files
1. **`src/api/otpService.js`** - API service for OTP and Google auth
2. **`src/pages/auth/LoginOTP.jsx`** - Phone number login page  
3. **`src/pages/auth/OTPVerify.jsx`** - OTP verification page
4. **`src/pages/Dashboard.jsx`** - Protected dashboard
5. **`OTP_AUTH_README.md`** - Complete documentation

### 🔧 Modified Files
1. **`src/main.jsx`** - Added GoogleOAuthProvider wrapper
2. **`src/router/AppRouter.jsx`** - Added new routes
3. **`.env`** - Added VITE_GOOGLE_CLIENT_ID

## 🌐 New Routes

```
http://localhost:3001/login-otp     → Phone Login Page
http://localhost:3001/otp-verify    → OTP Verification Page
http://localhost:3001/dashboard     → Protected Dashboard
```

## 🔑 Setup Steps

### 1. Google OAuth Setup (Required)

1. Visit: https://console.cloud.google.com/
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:3001`
6. Copy Client ID
7. Update `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
   ```

### 2. Backend Requirements

Your Django backend needs these endpoints:

```python
# Send OTP
POST /api/send-otp/
Request: {"phone_number": "01712345678"}
Response: {"message": "OTP sent"}

# Verify OTP
POST /api/verify-otp/
Request: {"phone_number": "01712345678", "otp": "123456"}
Response: {
    "access": "jwt_token",
    "refresh": "refresh_token",
    "user": {...}
}

# Google Login
POST /api/google-login/
Request: {"token": "google_credential"}
Response: {
    "access": "jwt_token",
    "refresh": "refresh_token",
    "user": {...}
}
```

## 🧪 Testing

### Test Phone Login:
1. Go to `http://localhost:3001/login-otp`
2. Enter phone: `01712345678`
3. Click "Send OTP"
4. Check backend logs for OTP code
5. Enter OTP on verification page
6. Should redirect to dashboard

### Test Google Login:
1. Go to `http://localhost:3001/login-otp`
2. Click Google Sign-In button
3. Select Google account
4. Should redirect to dashboard

## 📱 Features

### Phone OTP Login ✅
- Phone validation (10-15 digits)
- OTP send functionality
- 6-digit OTP verification
- Auto-focus and auto-submit
- Resend OTP (60s countdown)
- Paste support
- Full error handling

### Google Sign-In ✅
- One-click authentication
- Secure token exchange
- Auto-redirect
- Error handling

### Dashboard ✅
- Protected route
- User profile display
- Quick stats
- Quick actions
- Logout

## 🔒 Security

- JWT tokens in localStorage
- Auto token refresh
- Protected routes
- Input validation
- Comprehensive error handling

## 💾 LocalStorage

After successful login:
```javascript
localStorage.accessToken   // JWT access token
localStorage.refreshToken  // JWT refresh token
localStorage.user         // User object (JSON)
```

## 🎨 UI Features

- Responsive design (mobile-first)
- TailwindCSS styling
- Gradient backgrounds
- Loading states
- Toast notifications
- Icons (react-icons)
- Smooth animations

## 📦 Dependencies Installed

```bash
✅ @react-oauth/google@^0.12.1
```

## 🚀 Run the App

```bash
npm run dev
```

Server: `http://localhost:3001/`

## 📋 File Structure

```
src/
├── api/
│   ├── otpService.js           ← NEW: OTP/Google auth service
│   └── axiosClient.js          ← Existing
├── pages/
│   ├── auth/
│   │   ├── LoginOTP.jsx        ← NEW: Phone login
│   │   ├── OTPVerify.jsx       ← NEW: OTP verification
│   │   ├── Login.jsx           ← Existing
│   │   └── Register.jsx        ← Existing
│   └── Dashboard.jsx           ← NEW: Protected dashboard
├── main.jsx                    ← UPDATED: Added GoogleOAuthProvider
└── router/AppRouter.jsx        ← UPDATED: Added new routes
```

## ⚠️ Important Notes

1. **Google Client ID**: Must be configured in `.env` for Google Sign-In to work
2. **Backend Ready**: Ensure your Django backend has the required endpoints
3. **CORS**: Backend must allow requests from `http://localhost:3001`
4. **OTP Service**: Backend must have SMS service configured

## 🐛 Troubleshooting

### Google Sign-In not working?
- Check if `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Verify authorized origins in Google Console
- Restart dev server after .env changes

### OTP not received?
- Check backend `/api/send-otp/` endpoint
- Verify SMS service is configured
- Check phone number format

### Token not saving?
- Open DevTools → Application → Local Storage
- Check if tokens are present
- Verify backend returns correct response format

## 📞 API Call Examples

```javascript
// Send OTP
import { sendOTP } from '@api/otpService';
await sendOTP('01712345678');

// Verify OTP
import { verifyOTP } from '@api/otpService';
await verifyOTP('01712345678', '123456');

// Google Login
import { googleLogin } from '@api/otpService';
await googleLogin(googleCredential);

// Check auth
import { isAuthenticated } from '@api/otpService';
const isLoggedIn = isAuthenticated();

// Get user
import { getCurrentUser } from '@api/otpService';
const user = getCurrentUser();

// Logout
import { logout } from '@api/otpService';
logout();
```

## ✨ Next Steps

1. Configure Google OAuth Client ID
2. Implement backend endpoints
3. Test phone OTP flow
4. Test Google Sign-In
5. Customize dashboard UI
6. Add more protected routes

## 📚 Full Documentation

See `OTP_AUTH_README.md` for complete documentation.

---

**Status**: ✅ Ready to Use  
**Server**: http://localhost:3001/  
**Test Route**: http://localhost:3001/login-otp
