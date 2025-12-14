# 🚨 URGENT FIX - CORS Issue on Port 3003

## Problem
Your frontend is running on `http://localhost:3003` but your Django backend only allows CORS from ports 3000, 3001, 5173, and 8000.

## Solution - Add Port 3003 to CORS

### Step 1: Find Your Backend Settings File
Open: `servicehub_backend/servicehub_backend/settings.py`

### Step 2: Update CORS_ALLOWED_ORIGINS

Find this section:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:8000",
]
```

Change to:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3003",  # ← ADD THIS LINE
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3003",  # ← ADD THIS TOO (for 127.0.0.1)
]
```

### Step 3: Restart Django Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
python manage.py runserver
```

## That's It!

After restarting the Django server, refresh your frontend at `http://localhost:3003/auth` and try sending OTP again.

---

## Alternative: Quick Test Without Fixing Backend

If you can't modify the backend right now, restart your frontend on port 3000:

```bash
# Stop current server (Ctrl+C in terminal)
# Then:
PORT=3000 npm run dev
```

Then open `http://localhost:3000/auth` instead of 3003.

---

## Verify It's Working

After fixing CORS, you should see in browser console:
```
✅ POST http://127.0.0.1:8000/api/users/send-otp/ 200 OK
✅ Response: {success: true, otp: "518040"}
```

Instead of:
```
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```
