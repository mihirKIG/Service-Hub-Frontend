# Chat Troubleshooting Guide 🔧

## Common Issues and Solutions

### 1. Chat Loading Forever (Spinning)

**Symptoms:**
- Click on "View & Chat" button
- Chat section shows loading spinner
- Never loads messages

**Possible Causes:**

#### A. Backend API Not Running
```bash
# Check if backend is running
curl http://127.0.0.1:8000/api/chat/rooms/

# Should return JSON response, not connection error
```

**Solution:** Start your Django backend server
```bash
python manage.py runserver
```

#### B. Authentication Token Missing/Invalid
**Check:** Open browser console (F12) and look for 401 Unauthorized errors

**Solution:** 
- Logout and login again
- Check if token is present in localStorage:
```javascript
// In browser console
localStorage.getItem('access_token')
```

#### C. CORS Issues
**Check:** Browser console shows CORS errors

**Solution:** Update Django `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### D. Chat Room Creation Failed
**Check:** Browser console shows error creating room

**Solution:** Verify your backend `/api/chat/rooms/create/` endpoint accepts:
```json
{
  "provider_id": 123,
  "name": "Chat for Booking #456"
}
```

### 2. Cannot Send Messages

**Possible Causes:**

#### A. WebSocket Not Connected
**Check:** Connection indicator shows gray/red dot instead of green

**Solution:** Verify WebSocket URL in `.env`:
```bash
VITE_WS_BASE_URL=ws://127.0.0.1:8001/ws
```

#### B. Chat Room ID Missing
**Check:** Browser console shows "roomId is undefined"

**Solution:** This is a data flow issue. Check:
1. Booking data loaded correctly
2. Provider info exists in booking
3. Chat room created successfully

### 3. Messages Not Appearing

**Possible Causes:**

#### A. WebSocket Not Working
**Test WebSocket manually:**
```javascript
// In browser console
const ws = new WebSocket('ws://127.0.0.1:8001/ws/chat/ROOM_ID/?token=YOUR_TOKEN');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', e.data);
```

#### B. Messages Sent to Wrong Room
**Check:** Verify room ID matches between API and WebSocket

### 4. Backend API Errors

#### Check Backend Logs
```bash
# Start Django with verbose output
python manage.py runserver --verbosity 2
```

#### Common Backend Errors:

**Error:** `Provider not found`
```python
# In your ChatRoomCreateView, ensure provider_id is handled:
provider_id = request.data.get('provider_id')
provider = User.objects.get(id=provider_id)  # May fail if wrong ID
```

**Error:** `Permission denied`
```python
# Ensure IsAuthenticated permission is set
permission_classes = [IsAuthenticated]
```

## Debug Mode

### Enable Console Logging

The frontend already has console logs enabled. Check browser console (F12) for:
- 🔵 Blue logs: Information (room initialization, etc.)
- ✅ Green logs: Success
- ❌ Red logs: Errors

### Key Log Messages:

```
🔵 Initializing chat for booking: 123
🔵 Provider: { id: 5, business_name: "ABC Services" }
🔵 Existing rooms: [...]
✅ Found existing room: 10
```

Or if creating new:
```
🔵 Creating new room with provider: 5
✅ Created new room: 15
```

### WebSocket Logs (useChat.js):
```
🔵 Opening Google popup...
✅ WebSocket connected
❌ WebSocket error: ...
```

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Backend server running (`http://127.0.0.1:8000`)
- [ ] Frontend server running (`http://localhost:3000`)
- [ ] Logged in as a customer
- [ ] Have at least one booking
- [ ] `.env` file configured correctly
- [ ] Browser console shows no CORS errors
- [ ] Access token present in localStorage
- [ ] Chat rooms API responds: `GET /api/chat/rooms/`
- [ ] WebSocket server running (if separate)

## Network Tab Analysis

Open Browser DevTools → Network Tab:

### Expected API Calls:

1. **Get Booking Details**
   ```
   GET /api/bookings/{id}/
   Status: 200 OK
   ```

2. **Get Chat Rooms**
   ```
   GET /api/chat/rooms/
   Status: 200 OK
   Response: { results: [...] }
   ```

3. **Create Chat Room** (if new)
   ```
   POST /api/chat/rooms/create/
   Status: 201 Created
   Body: { provider_id: 5, name: "..." }
   ```

4. **Get Messages**
   ```
   GET /api/chat/rooms/{room_id}/messages/
   Status: 200 OK
   ```

5. **WebSocket Connection** (check WS tab)
   ```
   WS ws://127.0.0.1:8001/ws/chat/{room_id}/?token=...
   Status: 101 Switching Protocols
   ```

### Common Error Responses:

**400 Bad Request**
- Invalid data sent to API
- Check request body format

**401 Unauthorized**
- Not logged in or token expired
- Re-login required

**403 Forbidden**
- Not authorized to access this resource
- Check user permissions

**404 Not Found**
- Endpoint doesn't exist
- Check URL path

**500 Internal Server Error**
- Backend error
- Check Django logs

## Manual Test Steps

### Test 1: API Accessibility
```bash
# Get your access token (from browser localStorage)
TOKEN="your_access_token_here"

# Test chat rooms endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://127.0.0.1:8000/api/chat/rooms/
```

Expected: JSON response with rooms array

### Test 2: Create Chat Room
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"provider_id": 5, "name": "Test Chat"}' \
  http://127.0.0.1:8000/api/chat/rooms/create/
```

Expected: 201 Created with room data

### Test 3: Send Message
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}' \
  http://127.0.0.1:8000/api/chat/rooms/ROOM_ID/messages/send/
```

Expected: 201 Created with message data

## Environment Variables

Verify your `.env` file:

```bash
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_WS_BASE_URL=ws://127.0.0.1:8001/ws

# Make sure no extra slashes or wrong ports
```

## Still Not Working?

If chat still doesn't work after all checks:

1. **Clear browser cache and localStorage**
   ```javascript
   // In browser console
   localStorage.clear();
   // Then refresh and login again
   ```

2. **Restart both servers**
   ```bash
   # Kill both frontend and backend
   # Restart backend
   python manage.py runserver
   
   # Restart frontend
   npm run dev
   ```

3. **Check Provider Data Structure**
   
   Your booking response should include provider info:
   ```json
   {
     "id": 123,
     "service": {...},
     "provider": {
       "id": 5,
       "business_name": "ABC Services",
       "user": {
         "id": 10,
         "email": "provider@example.com"
       }
     },
     ...
   }
   ```

4. **Verify Backend Chat Views**

   Ensure your Django views match these signatures:
   
   ```python
   class ChatRoomListView(generics.ListAPIView):
       permission_classes = [IsAuthenticated]
       # ...
   
   class ChatRoomCreateView(generics.CreateAPIView):
       permission_classes = [IsAuthenticated]
       # Should accept: provider_id, name (optional)
   ```

## Get Help

If issue persists, gather this info:

1. Browser console logs (screenshot)
2. Network tab (failed requests)
3. Backend error logs
4. Django version
5. Frontend package versions (`package.json`)

---

**Last Updated:** February 2026
