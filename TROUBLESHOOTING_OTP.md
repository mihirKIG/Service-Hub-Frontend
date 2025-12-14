# 🔧 COMPLETE FIX GUIDE - "Failed to send OTP"

## 🎯 Quick Diagnosis

I've added a **Debug Tool** to your auth page at the bottom-right corner. It will test the API directly and show you the exact error.

### Open your browser and:
1. Go to `http://localhost:3003/auth`
2. Look at the **bottom-right corner** for the pink debug panel
3. Click **"🧪 Test API Direct"** button
4. Check the response

---

## ✅ Most Likely Issue: CORS

Your frontend runs on **port 3003** but Django backend only allows ports 3000, 3001, 5173, 8000.

### Fix in Django Backend:

**File:** `servicehub_backend/servicehub_backend/settings.py`

**Find:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:8000",
]
```

**Change to:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3003",  # ← ADD THIS
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3003",  # ← ADD THIS TOO
]
```

**Then restart Django:**
```bash
python manage.py runserver
```

---

## 🔍 Other Possible Issues

### Issue 1: Backend Not Running
**Check:** Is Django running on port 8000?

```bash
curl http://127.0.0.1:8000/api/users/send-otp/
```

**Expected:** `{"detail":"Method \"GET\" not allowed."}`
**If not working:** Start Django server

### Issue 2: Wrong Phone Format
**Backend expects:** `+8801719159900` (with + and country code)
**Not:** `01719159900` or `8801719159900`

The code already adds `+88` prefix, so this should be fine.

### Issue 3: Network/Firewall
**Check:** Firewall blocking localhost connections?

---

## 📊 Console Logs to Check

With the new logging added, open Browser Console (F12) and look for:

### ✅ Success:
```
🔵 Sending OTP to: +8801719159900
✅ OTP Response: {success: true, otp: "518040"}
```

### ❌ CORS Error:
```
❌ OTP Error: Error
Access to fetch at 'http://127.0.0.1:8000/api/users/send-otp/' 
from origin 'http://localhost:3003' has been blocked by CORS policy
```
**Fix:** Add port 3003 to Django CORS_ALLOWED_ORIGINS

### ❌ Network Error:
```
❌ OTP Error: Failed to fetch
```
**Fix:** Django not running or wrong URL

### ❌ API Error:
```
❌ OTP Error: {...}
Error details: { message: "...", response: {...}, status: 400 }
```
**Fix:** Check the response details

---

## 🧪 Step-by-Step Testing

### Test 1: Direct API Call (using debug tool)
1. Open `http://localhost:3003/auth`
2. See debug panel at bottom-right
3. Click "Test API Direct"
4. Check response

### Test 2: From Form
1. Enter phone: `01719159900`
2. Click "Send OTP"
3. Check browser console for logs

### Test 3: From Terminal
```bash
curl -X POST http://127.0.0.1:8000/api/users/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone":"+8801719159900"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phone": "+8801719159900",
  "otp": "518040",
  "expires_in_seconds": 120
}
```

---

## 🎯 Quick Solution Summary

1. **Add port 3003 to Django CORS** (most likely fix)
2. **Restart Django server**
3. **Refresh frontend page**
4. **Use debug tool to test**
5. **Check browser console for detailed logs**

---

## 🗑️ Remove Debug Tool Later

Once it's working, remove the debug tool:

**File:** `src/pages/auth/AuthPage.jsx`

**Remove these lines:**
```jsx
import OTPDebugger from '../../components/debug/OTPDebugger';

// And at the bottom:
<OTPDebugger />
```

---

## 📞 Still Not Working?

Take a screenshot of:
1. The debug panel response
2. Browser console (F12 → Console tab)
3. Browser network tab (F12 → Network → failed request)

This will show the exact error!

---

## ✅ Verification

Once fixed, you should see:
- ✅ Debug tool shows green success message
- ✅ Browser console shows: `✅ OTP Response: {success: true, otp: "..."}`
- ✅ Toast notification: "OTP sent to your phone!"
- ✅ Page changes to OTP input step

---

**Expected Fix Time:** 2-5 minutes (just adding CORS + restart)
