# 🚀 Quick Reference - Phone OTP Authentication

## 📍 URLs

### Frontend
- **Main Auth Page:** http://localhost:3000/auth
- **Test Page:** http://localhost:3000/otp-test
- **Dashboard:** http://localhost:3000/dashboard

### Backend
- **API Base:** http://127.0.0.1:8000/api
- **Admin Panel:** http://127.0.0.1:8000/admin
- **SMS Logs:** http://127.0.0.1:8000/admin/notifications/smslog/

---

## 🔑 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/users/send-otp/` | Send OTP to phone |
| POST | `/api/users/verify-otp/` | Verify OTP & login |
| POST | `/api/users/logout/` | Logout user |
| POST | `/api/users/token/refresh/` | Refresh access token |
| GET | `/api/users/profile/` | Get user profile |

---

## 📱 Test Phone Numbers

**Format Options:**
- `+8801719159900` (with country code)
- `8801719159900` (with country code, no +)
- `01719159900` (without country code)

**Your Number:** `+8801719159900`

---

## 🧪 Quick Test

### 1. Open Test Page
```
http://localhost:3000/otp-test
```

### 2. Send OTP
- Enter: `+8801719159900` or `01719159900`
- Click "Send OTP"
- Check phone for SMS

### 3. Verify OTP
- Enter the 6-digit code
- Click "Verify OTP"
- You're logged in!

### 4. Test Protected Route
- Click "Get Profile"
- Should show your user data

### 5. Logout
- Click "Logout"
- Session ended

---

## 💾 LocalStorage Keys

After successful login, check Application > Local Storage:

```javascript
accessToken   // JWT access token (expires in 1 hour)
refreshToken  // JWT refresh token (expires in 7 days)
user          // User data JSON
```

---

## 🔍 Debug Checklist

### Backend Running?
```bash
curl http://127.0.0.1:8000/api/
```

### Check Tokens
```javascript
// In browser console
console.log(localStorage.getItem('accessToken'));
console.log(localStorage.getItem('refreshToken'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### Clear Auth State
```javascript
// In browser console
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');
location.reload();
```

---

## 📊 Response Examples

### Send OTP Response (DEBUG=True)
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phone": "+8801719159900",
  "otp": "123456",
  "expires_in_seconds": 120
}
```

### Verify OTP Response
```json
{
  "success": true,
  "message": "Login successful",
  "created": false,
  "user": {
    "id": 1,
    "phone": "+8801719159900",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "is_verified": true
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

## ⚡ Common Commands

### Start Backend
```bash
cd path/to/backend
python manage.py runserver
```

### Start Frontend (Already Running)
```bash
cd "d:\servicehub frontend"
npm run dev
```

### Test Backend Endpoint
```bash
curl -X POST http://127.0.0.1:8000/api/users/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+8801719159900"}'
```

---

## 🎯 Integration Status

- ✅ AuthPage.jsx (Production UI)
- ✅ OTPTestPage.jsx (Test UI)
- ✅ authApi.js (API Layer)
- ✅ otpService.js (Service Layer)
- ✅ AuthContext.jsx (State Management)
- ✅ Token Refresh (Automatic)
- ✅ Protected Routes
- ✅ Logout Flow

---

## 🚦 Next Steps

1. **Test Now:** Go to http://localhost:3000/otp-test
2. **Check Backend:** Ensure Django server is running
3. **Send OTP:** Enter your phone number
4. **Verify:** Enter OTP from SMS
5. **Celebrate:** You're authenticated! 🎉

---

## 📝 Notes

- **OTP Expiry:** 2 minutes (120 seconds)
- **Token Expiry:** Access = 1 hour, Refresh = 7 days
- **Debug Mode:** OTP shown in response when DEBUG=True
- **Production:** Remove `/otp-test` route before deployment

---

**Last Updated:** 2025-12-09
**Status:** ✅ Fully Integrated
