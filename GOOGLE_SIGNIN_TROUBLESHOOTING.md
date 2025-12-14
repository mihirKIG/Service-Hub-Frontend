# 🔧 Google Sign-In Troubleshooting Guide

## ❌ Issue: Popup Closed by User

If you see this error: `auth/popup-closed-by-user`

**What it means:**
- The Google sign-in popup was closed before completing authentication
- OR the popup was blocked by browser

---

## ✅ Solutions

### Solution 1: Complete the Sign-In
1. Click "Sign in with Google" button
2. **Wait for the popup to fully load**
3. **Select your Google account**
4. **Click "Continue" or "Allow"**
5. Don't close the popup manually

### Solution 2: Allow Popups
If popup doesn't appear:
1. Check your browser's address bar for a popup blocker icon 🚫
2. Click it and select "Always allow popups from localhost"
3. Try again

### Solution 3: Check Browser Settings
**Chrome/Edge:**
1. Go to Settings → Privacy and security → Site Settings
2. Click "Pop-ups and redirects"
3. Add `http://localhost:3002` to "Allowed to send pop-ups"

**Firefox:**
1. Preferences → Privacy & Security
2. Scroll to "Permissions" → "Block pop-up windows"
3. Click "Exceptions" → Add `http://localhost:3002`

---

## 🧪 Testing Steps

### Test 1: Basic Google Sign-In
1. Go to http://localhost:3002/auth
2. Click "Sign in with Google"
3. Wait for popup (don't close it!)
4. Select account
5. Click "Continue"
6. ✅ Should redirect to dashboard

### Test 2: Cancel Sign-In
1. Click "Sign in with Google"
2. Close the popup manually
3. ✅ Should show: "Sign-in cancelled"
4. No error toast (working as intended)

### Test 3: Different Account
1. Sign in with one Google account
2. Logout
3. Sign in again
4. ✅ Should show account selector
5. Can choose different account

---

## 🔍 Console Logs to Check

**Success Flow:**
```
🔵 Starting Firebase Google Sign-In...
🔵 Opening Google popup...
✅ Google popup success, token received
✅ Firebase Sign-In Success
🔵 Sending token to backend...
✅ Google Login Response: {...}
✅ Google Login Complete
```

**Cancelled Flow:**
```
🔵 Starting Firebase Google Sign-In...
🔵 Opening Google popup...
❌ Firebase Google Sign-In Error: auth/popup-closed-by-user
(No error toast - user cancelled intentionally)
```

**Error Flow:**
```
🔵 Starting Firebase Google Sign-In...
❌ Firebase Google Sign-In Error: [error code]
❌ Google Login Failed: [error message]
Toast: "Google Sign-In failed. Please try again."
```

---

## 🔐 CORS/Popup Blocked Issues

If you see:
```
Cross-Origin-Opener-Policy policy would block the window.closed call
```

**This is normal!** It's just a warning from Firebase. The sign-in should still work.

**If sign-in doesn't work:**
1. Make sure you're using `http://localhost` (not `127.0.0.1`)
2. Try a different port
3. Clear browser cache
4. Try incognito/private mode

---

## 🎯 Common Issues & Fixes

### Issue: "Popup blocked"
**Fix:** Allow popups in browser settings (see Solution 2 above)

### Issue: Popup appears but closes immediately
**Fix:** 
- Check Firebase Console → Authentication → Sign-in methods
- Ensure Google is enabled
- Add `localhost` to authorized domains

### Issue: "Invalid token"
**Fix:** Backend not configured yet. See `FIREBASE_GOOGLE_AUTH.md` for backend setup

### Issue: Logged in but redirected to login
**Fix:** 
- Check if tokens are stored: Press F12 → Application → Local Storage
- Should see: `accessToken`, `refreshToken`, `user`
- If missing, backend might not be returning tokens correctly

---

## 📱 Mobile Testing

For testing on mobile devices:
1. Get your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update Firebase Console → Authorized domains
3. Add your IP (e.g., `192.168.1.100`)
4. Access from mobile: `http://192.168.1.100:3002`

---

## ✅ Checklist

Before reporting issues, check:
- [ ] Popups are allowed in browser
- [ ] Using http://localhost (not 127.0.0.1)
- [ ] Firebase project is active
- [ ] Google sign-in is enabled in Firebase Console
- [ ] Backend is running (if testing full flow)
- [ ] No browser extensions blocking popups
- [ ] Tried different browser/incognito mode

---

## 💡 Pro Tips

1. **Use Chrome for development** - Best Firebase support
2. **Check Console** - All operations are logged with emojis
3. **Test logout** - Make sure you can logout and login again
4. **Try both methods** - Test both Phone OTP and Google sign-in
5. **Clear localStorage** - If stuck, clear and try again

---

## 🆘 Still Not Working?

If Google Sign-In still doesn't work:

1. **Check Firebase Console:**
   - https://console.firebase.google.com
   - Select project: service-hub-9a13c
   - Authentication → Sign-in methods → Google (should be enabled)
   - Settings → Authorized domains (should include localhost)

2. **Check Browser Console:**
   - Press F12
   - Look for red errors
   - Share the error message for help

3. **Try Phone OTP Instead:**
   - Works without popups
   - More reliable for testing
   - Same backend integration

---

**Last Updated:** December 10, 2025
**Status:** ✅ Improved Error Handling
