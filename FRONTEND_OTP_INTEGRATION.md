# 📱 Phone OTP Authentication - Frontend Integration

Your ServiceHub frontend is now fully integrated with the Phone OTP authentication system!

## 🎯 What's Been Implemented

### 1. API Integration (`src/api/`)
- ✅ **authApi.js** - Complete OTP authentication endpoints
- ✅ **otpService.js** - Service layer with token handling
- ✅ **axiosClient.js** - Automatic JWT token refresh

### 2. Components & Pages
- ✅ **AuthPage.jsx** - Beautiful phone OTP authentication UI
- ✅ **OTPTestPage.jsx** - Test page for backend integration
- ✅ **AuthContext.jsx** - Authentication state management
- ✅ **OTPDebugger.jsx** - Debug helper component

### 3. Features Implemented
- ✅ Phone number validation (Bangladesh format)
- ✅ 6-digit OTP input with auto-focus
- ✅ OTP paste support
- ✅ Resend OTP with countdown timer
- ✅ Auto-submit on complete OTP
- ✅ JWT token storage and refresh
- ✅ Protected routes
- ✅ Google OAuth fallback

---

## 🚀 Quick Start

### 1. Start Backend Server
Make sure your Django backend is running:
```bash
cd path/to/backend
python manage.py runserver
```

Backend should be running at: `http://127.0.0.1:8000`

### 2. Start Frontend (Already Running)
Your frontend is already running at: `http://localhost:3000`

### 3. Test the Integration

#### Option A: Use the Test Page (Recommended for Development)
Visit: **http://localhost:3000/otp-test**

This page lets you:
- Send OTP to any phone number
- Verify OTP codes
- Test protected routes
- View API responses
- Debug issues

#### Option B: Use the Main Auth Page
Visit: **http://localhost:3000/auth**

This is the production-ready authentication page with:
- Beautiful UI
- Phone OTP authentication
- Google Sign-In option
- Full error handling

---

## 📋 Testing Steps

### Step 1: Send OTP
1. Go to http://localhost:3000/otp-test
2. Enter a Bangladesh phone number:
   - Format: `+8801719159900` or `01719159900`
3. Click "Send OTP"
4. Check your phone for the SMS

**In DEBUG mode:** The OTP will also appear in the response (check browser console)

### Step 2: Verify OTP
1. Enter the 6-digit OTP from SMS
2. Click "Verify OTP"
3. On success:
   - JWT tokens are stored in localStorage
   - User data is stored
   - You're logged in! 🎉

### Step 3: Test Protected Routes
1. Click "Get Profile" to fetch user data
2. Should work because you're authenticated
3. Click "Logout" to end the session

---

## 🔧 Configuration

### Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Backend Configuration Required
Your backend should have these endpoints:
- `POST /api/users/send-otp/` - Send OTP
- `POST /api/users/verify-otp/` - Verify OTP & Login/Register
- `POST /api/users/logout/` - Logout
- `POST /api/users/token/refresh/` - Refresh access token
- `GET /api/users/profile/` - Get user profile

---

## 📦 API Usage Examples

### 1. Send OTP
```javascript
import { authApi } from '@api/authApi';

const sendOTP = async () => {
  try {
    const response = await authApi.sendOTP('+8801719159900');
    console.log('OTP sent:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. Verify OTP
```javascript
import { authApi } from '@api/authApi';

const verifyOTP = async () => {
  try {
    const response = await authApi.verifyOTP(
      '+8801719159900',
      '123456',
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      }
    );
    console.log('User:', response.data.user);
    console.log('Tokens:', response.data.tokens);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3. Get Profile (Protected Route)
```javascript
import { authApi } from '@api/authApi';

const getProfile = async () => {
  try {
    const response = await authApi.getProfile();
    console.log('Profile:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 4. Logout
```javascript
import { authApi } from '@api/authApi';

const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await authApi.logout(refreshToken);
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎨 Using the Auth Components

### In Your Pages
```jsx
import { useAuth } from '@context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, sendOTP, verifyOTP, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Redirect to Auth Page
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return <button onClick={handleLoginClick}>Login</button>;
}
```

---

## 🔐 Security Features

### Token Management
- ✅ Access tokens stored in localStorage
- ✅ Refresh tokens for long-term auth
- ✅ Automatic token refresh on 401 errors
- ✅ Secure logout (blacklists tokens)

### OTP Security
- ✅ 2-minute OTP expiry
- ✅ Single-use OTPs
- ✅ Rate limiting (backend)
- ✅ Phone number verification

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
1. Check if backend is running: `curl http://127.0.0.1:8000/api/`
2. Verify `.env` has correct `VITE_API_BASE_URL`
3. Check CORS settings in Django backend

### Issue: "Invalid or expired OTP"
**Solution:**
1. OTP expires after 2 minutes
2. Each OTP can only be used once
3. Request a new OTP

### Issue: OTP not received on phone
**Solution:**
1. Check phone number format: `+8801XXXXXXXXX`
2. Verify BulkSMS BD credentials in backend
3. Check SMS logs: http://127.0.0.1:8000/admin/notifications/smslog/

### Issue: "401 Unauthorized" on protected routes
**Solution:**
1. Check if tokens are stored: `localStorage.getItem('accessToken')`
2. Verify tokens haven't expired
3. Try logging in again

---

## 📂 Project Structure

```
src/
├── api/
│   ├── authApi.js           # Main auth API functions
│   ├── otpService.js         # OTP service layer
│   └── axiosClient.js        # HTTP client with auth
├── pages/
│   └── auth/
│       ├── AuthPage.jsx      # Main auth UI (production)
│       └── OTPTestPage.jsx   # Test page (development)
├── context/
│   └── AuthContext.jsx       # Auth state management
├── components/
│   └── debug/
│       └── OTPDebugger.jsx   # Debug helper
└── router/
    └── AppRouter.jsx         # Route configuration
```

---

## 🎯 What's Next?

### Production Checklist
- [ ] Remove OTP test page route
- [ ] Remove OTPDebugger component
- [ ] Add production error handling
- [ ] Implement rate limiting UI
- [ ] Add phone number validation for other countries
- [ ] Set up HTTPS
- [ ] Configure HttpOnly cookies for tokens
- [ ] Add session timeout warnings

### Optional Enhancements
- [ ] Add "Remember me" option
- [ ] Add biometric authentication
- [ ] Add SMS cost tracking
- [ ] Add multi-language support
- [ ] Add accessibility features

---

## 📞 Test Phone Numbers

For development testing with BulkSMS BD:
- Your actual BD number: `+8801719159900`

**Note:** In DEBUG mode, the OTP will be shown in the API response, so you don't need to wait for SMS during development.

---

## 🎉 Success!

Your frontend is now fully integrated with the Phone OTP authentication system!

- ✅ Users can sign up with phone number
- ✅ OTP verification works
- ✅ JWT authentication is configured
- ✅ Protected routes are secured
- ✅ Token refresh is automatic

**Test it now:** http://localhost:3000/otp-test

---

## 📚 Additional Resources

- Backend API Documentation: See `QUICK_START_OTP.md`
- Django Admin Panel: http://127.0.0.1:8000/admin/
- SMS Logs: http://127.0.0.1:8000/admin/notifications/smslog/

---

## 💡 Development Tips

1. **Check Console Logs:** All API calls are logged with ✅ success or ❌ error icons
2. **Use Test Page:** The `/otp-test` page shows raw API responses
3. **Debug Mode:** Backend shows OTP in response when `DEBUG=True`
4. **Network Tab:** Check browser DevTools Network tab for API calls
5. **LocalStorage:** Inspect tokens in Application > Local Storage

---

## 🤝 Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Check backend server logs
3. Verify SMS logs in Django admin
4. Test with `/otp-test` page first

Happy coding! 🚀
