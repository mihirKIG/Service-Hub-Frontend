# Chat Feature Quick Test Guide 🧪

## Prerequisites

✅ Backend Django server running on `http://127.0.0.1:8000`  
✅ Frontend Vite server running on `http://localhost:3000`  
✅ Logged in as a customer  
✅ At least one booking created  

## Step-by-Step Test

### 1. Open Browser Console
Press `F12` or `Ctrl+Shift+I` to open DevTools

### 2. Navigate to Bookings
```
http://localhost:3000/user/bookings
```

You should see your bookings list.

### 3. Click "View & Chat" Button

Watch the console for these logs:

**Expected Console Output:**
```
🔵 Initializing chat for booking: 123
🔵 Provider: { id: 5, business_name: "ABC Services", ... }
🔵 Existing rooms: [...]
```

Then either:
```
✅ Found existing room: 10
```

Or if new:
```
🔵 Creating new room with provider: 5
✅ Created new room: 15
```

### 4. Check Network Tab

**Expected API Calls:** (in DevTools → Network)

1. `GET /api/bookings/123/` → Status: 200 ✅
2. `GET /api/chat/rooms/` → Status: 200 ✅
3. `POST /api/chat/rooms/create/` → Status: 201 ✅ (if new room)
4. `GET /api/chat/rooms/15/messages/` → Status: 200 ✅

### 5. Check WebSocket Connection

In Network tab → **WS** (WebSocket) filter:

Expected:
```
ws://127.0.0.1:8001/ws/chat/15/?token=eyJ0eXA...
Status: 101 Switching Protocols
```

### 6. Send Test Message

Type "Hello" and click Send.

**Expected:**
- Message appears in chat window immediately
- Console shows WebSocket message sent
- No errors in console

## Troubleshooting Quick Checklist

If chat doesn't load, check in order:

### 1. Backend Running?
```bash
curl http://127.0.0.1:8000/api/chat/rooms/
```
Should return JSON, not connection error.

### 2. Logged In?
```javascript
// In browser console
localStorage.getItem('access_token')
// Should return long token string
```

### 3. Provider Data Present?
Check booking details in Network tab response:
```json
{
  "id": 123,
  "provider": {
    "id": 5,  // ← Must be present!
    "business_name": "...",
    "user": { "id": 10 }  // ← This too!
  }
}
```

### 4. CORS Headers?
Backend should have:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### 5. Chat Endpoints Working?
Test manually:
```bash
# Get your token from localStorage
TOKEN="your_access_token"

# List rooms
curl -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:8000/api/chat/rooms/

# Create room
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"provider_id": 5}' \
  http://127.0.0.1:8000/api/chat/rooms/create/
```

## Common Error Messages

### "Failed to load chat"
❌ **Problem:** API request failed  
✅ **Solution:** Check backend is running and accessible

### "Provider not found in booking"
❌ **Problem:** Booking data incomplete  
✅ **Solution:** Verify booking has provider info

### Red dot (disconnected) instead of green
❌ **Problem:** WebSocket not connecting  
✅ **Solution:** Check `VITE_WS_BASE_URL` in `.env` file

### Chat keeps loading forever
❌ **Problem:** API request hanging  
✅ **Solution:** 
1. Check backend console for errors
2. Verify CORS settings
3. Check authentication token

## Success Indicators

✅ Green dot on chat header (connected)  
✅ Console logs show room created/found  
✅ Messages can be sent and appear  
✅ No red errors in console  
✅ Network tab shows all 200/201 responses  

## Video Walkthrough

Expected flow:

1. **Page loads** → Booking details appear
2. **Chat initializes** (2-3 seconds) → Console shows logs
3. **Chat ready** → Green dot appears, input enabled
4. **Send message** → Appears instantly in chat
5. **Refresh page** → Messages persist

## Backend Verification

### Check Chat Room Created

```bash
# Login to Django admin
http://127.0.0.1:8000/admin/chat/chatroom/
```

You should see your chat room with:
- Customer: Your user
- Provider: The service provider
- Name: "Chat for Booking #123"

### Check Messages Saved

```bash
http://127.0.0.1:8000/admin/chat/message/
```

Your sent messages should appear here.

## Need More Help?

See [CHAT_TROUBLESHOOTING.md](CHAT_TROUBLESHOOTING.md) for detailed debugging steps.

---

**Expected Time:** 2-5 minutes  
**Difficulty:** Easy  
**Success Rate:** 95%+ (if backend configured correctly)
