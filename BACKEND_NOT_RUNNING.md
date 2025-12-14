# ⚠️ Backend Not Running - Quick Fix Guide

## 🔴 Current Issue

Your Google Sign-In is **stuck on "Loading..."** because:
- ✅ Firebase authentication works (popup completed)
- ❌ Backend server is **NOT running**
- ❌ Frontend cannot send token to backend

---

## ✅ Solution: Start Your Django Backend

### Quick Start Commands

**Option 1: Start Backend in New Terminal**
```bash
# Open a new terminal
cd path/to/your/backend

# Activate virtual environment (if you have one)
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Start Django server
python manage.py runserver
```

**Option 2: Start Backend (Specific Port)**
```bash
cd path/to/your/backend
python manage.py runserver 127.0.0.1:8000
```

---

## 🧪 Verify Backend is Running

After starting, test with:
```bash
curl http://127.0.0.1:8000/api/
```

You should see a response (not connection refused).

---

## 🔧 Backend Setup Required

Your backend needs the **Google login endpoint**. See the previous instructions:

### 1. Install Firebase Admin
```bash
pip install firebase-admin
```

### 2. Download Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings → Service Accounts
3. Generate New Private Key
4. Save as `serviceAccountKey.json` in backend root

### 3. Create firebase_config.py
```python
import firebase_admin
from firebase_admin import credentials, auth
import os
from django.conf import settings

cred = credentials.Certificate(os.path.join(settings.BASE_DIR, 'serviceAccountKey.json'))
firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return None
```

### 4. Add Google Login View (users/views.py)
```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from your_project.firebase_config import verify_firebase_token

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    id_token = request.data.get('token')
    
    if not id_token:
        return Response({'error': 'Token is required'}, status=400)
    
    decoded_token = verify_firebase_token(id_token)
    
    if not decoded_token:
        return Response({'error': 'Invalid token'}, status=401)
    
    email = decoded_token.get('email')
    name = decoded_token.get('name', '')
    picture = decoded_token.get('picture', '')
    
    name_parts = name.split(' ', 1)
    first_name = name_parts[0] if name_parts else ''
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'first_name': first_name,
            'last_name': last_name,
            'is_verified': True,
            'profile_picture': picture,
        }
    )
    
    if not created and not user.is_verified:
        user.is_verified = True
        user.save()
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'success': True,
        'message': 'Login successful' if not created else 'Registration successful',
        'created': created,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_verified': user.is_verified,
            'profile_picture': user.profile_picture,
            'date_joined': user.date_joined,
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=200)
```

### 5. Add Route (users/urls.py)
```python
path('google-login/', views.google_login, name='google-login'),
```

---

## 📋 Step-by-Step Checklist

- [ ] Navigate to backend directory
- [ ] Activate virtual environment (if applicable)
- [ ] Install firebase-admin: `pip install firebase-admin`
- [ ] Download serviceAccountKey.json from Firebase
- [ ] Create firebase_config.py
- [ ] Update users/views.py with google_login function
- [ ] Update users/urls.py with route
- [ ] Start server: `python manage.py runserver`
- [ ] Verify: `curl http://127.0.0.1:8000/api/`
- [ ] Test frontend Google Sign-In

---

## 🎯 What Will Happen After Backend Starts

1. **Current behavior:**
   - Google Sign-In button → Popup → Success → **STUCK on "Loading..."**

2. **After backend starts:**
   - Google Sign-In button → Popup → Success → **Backend receives token** → **Login successful!** → Redirect to dashboard ✅

---

## 🔍 Frontend Timeout Added

I've added a **30-second timeout** to the frontend. Now you'll see a proper error message:

**Before (hanging forever):**
```
Loading...
```

**After (if backend not running):**
```
❌ Backend not responding. Start Django server: python manage.py runserver
```

---

## 💡 Quick Test Without Backend

If you want to test the UI without backend, you can use **Phone OTP** instead:
1. Make sure backend is running
2. Use `/auth` page
3. Enter phone number
4. Receive OTP via SMS
5. Verify and login

---

## 🆘 Still Having Issues?

### Backend Not Starting?
```bash
# Check if port 8000 is already in use
# Windows:
netstat -ano | findstr :8000

# Mac/Linux:
lsof -i :8000

# Kill process if needed (Windows):
taskkill /PID <process_id> /F
```

### Django Errors?
```bash
# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (if needed)
python manage.py createsuperuser

# Check for errors
python manage.py check
```

### Wrong Python Version?
```bash
# Check Python version
python --version  # Should be 3.8+

# Or try python3
python3 manage.py runserver
```

---

## 📞 Summary

**Problem:** Google Sign-In hangs because backend is not running

**Solution:** 
1. Start Django backend: `python manage.py runserver`
2. Add Google login endpoint (see code above)
3. Test again on frontend

**Alternative:** Use Phone OTP authentication (already working)

---

**Your Next Command:**
```bash
cd path/to/backend && python manage.py runserver
```

Then refresh the frontend and try Google Sign-In again! 🚀
