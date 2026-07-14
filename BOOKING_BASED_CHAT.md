# Booking-Based Chat System 💬

## Current Implementation Status

**Status:** ✅ **FULLY WORKING!** Booking-based chat implemented  
**Backend:** ✅ Ready with booking_id support  
**Frontend:** ✅ Updated to use booking_id  

### What Works Now:
- ✅ **Each booking has its own isolated chat room!**
- ✅ Backend automatically creates/retrieves chat room by booking_id
- ✅ Real-time messaging via WebSocket
- ✅ Accessible from booking details page
- ✅ Proper authorization (only customer & provider can access)
- ✅ Collapsible chat UI with minimize/expand

## Overview

The chat system has been redesigned to be **booking-centric** instead of user-centric. This ensures that each booking gets its own isolated chat room, which is the correct approach for a marketplace platform.

## ❌ Old Design (Problem)

```
Customer + Provider = 1 Chat Room
```

**Issues:**
- Same customer and provider could have multiple bookings
- Different services at different times
- All conversations mixed together
- Old bookings interfered with new bookings

## ✅ New Design (Solution)

```
Customer + Provider + Booking = 1 Chat Room per Booking
```

**Benefits:**
- ✅ Each booking has its own isolated chat
- ✅ Multiple bookings = multiple separate chats
- ✅ Clear context for each conversation
- ✅ Historical chats organized by booking
- ✅ Realistic marketplace behavior

## Architecture

### 1. **Chat API** (`src/api/chatApi.js`)

```javascript
// NEW: Get or create chat room by booking ID
getOrCreateRoomByBooking: (bookingId) => 
  axiosClient.post('/chat/rooms/booking/', { booking_id: bookingId })
```

### 2. **Booking Chat Hook** (`src/hooks/useBookingChat.js`)

New hook specifically for booking-based chat:

```javascript
const { 
  messages, 
  sendMessage, 
  isConnected 
} = useBookingChat(bookingId);
```

**How it works:**
1. Takes `bookingId` as parameter
2. Automatically gets/creates chat room for that booking
3. Initializes WebSocket connection
4. Returns chat functionality isolated to that booking

### 3. **Booking Detail Page** (`src/pages/booking/BookingDetail.jsx`)

Complete booking detail page with integrated chat sidebar:

**Features:**
- 📋 Complete booking information
- 💬 Real-time chat with provider
- 🟢 Connection status indicator
- 📱 Responsive design
- ✅ Action buttons (Cancel, etc.)

**Layout:**
```
┌─────────────────────────────────────┬──────────────┐
│  Booking Details                    │   Chat       │
│  - Service Info                     │   Sidebar    │
│  - Provider Info                    │              │
│  - Date/Time/Location               │   Messages   │
│  - Amount                           │              │
│  - Notes                            │   Input      │
└─────────────────────────────────────┴──────────────┘
```

### 4. **Updated Booking Card** (`src/components/cards/BookingCard.jsx`)

Now includes "View & Chat" button:

```jsx
<Link to={`/bookings/${booking.id}`}>
  <Button size="sm" variant="outline">
    <FiMessageSquare className="inline mr-1" />
    View & Chat
  </Button>
</Link>
```

## Usage Flow

### Customer Perspective:

1. **Make a Booking**
   ```
   Book Service → Payment → Booking Created
   ```

2. **View Booking & Chat**
   ```
   My Bookings → View & Chat → Booking Detail Page
   ```

3. **Chat with Provider**
   ```
   Each booking has its own chat room
   Historical messages preserved
   Real-time communication
   ```

### Multiple Bookings Example:

```
Customer: John
Provider: ABC Cleaning Service

Booking #123 (Feb 1, House Cleaning)
  → Chat Room #1 (isolated)

Booking #456 (Feb 15, Office Cleaning) 
  → Chat Room #2 (isolated)

Booking #789 (Mar 1, House Cleaning)
  → Chat Room #3 (isolated)
```

Each booking maintains its own conversation history!

## Backend Requirements

The backend should implement:

### Endpoint: `POST /api/chat/rooms/booking/`

**Request:**
```json
{
  "booking_id": 123
}
```

**Response:**
```json
{
  "id": 456,
  "booking": 123,
  "customer": {...},
  "provider": {...},
  "created_at": "2026-02-25T10:00:00Z",
  "last_message": {...}
}
```

**Logic:**
1. Check if chat room exists for this booking
2. If yes, return existing room
3. If no, create new room linked to booking
4. Ensure only customer & provider can access

### WebSocket Connection:

```
ws://localhost:8001/chat/{room_id}/?token={access_token}
```

## File Structure

```
src/
├── api/
│   └── chatApi.js (✅ Updated with booking endpoint)
├── hooks/
│   ├── useChat.js (existing room-based chat)
│   └── useBookingChat.js (✅ NEW: booking-based chat)
├── pages/
│   └── booking/
│       ├── BookService.jsx
│       ├── BookingSuccess.jsx
│       └── BookingDetail.jsx (✅ NEW: with integrated chat)
├── components/
│   └── cards/
│       └── BookingCard.jsx (✅ Updated with chat button)
└── router/
    └── AppRouter.jsx (✅ Added /bookings/:id route)
```

## Key Features

### 1. **Isolated Conversations**
Each booking ID creates a unique chat room. No mixing of conversations.

### 2. **Real-time Updates**
WebSocket connection for instant messaging within each booking's context.

### 3. **Connection Status**
Visual indicator showing if chat is connected or reconnecting.

### 4. **Persistent History**
All messages saved per booking for future reference.

### 5. **Access Control**
Only the customer and provider of that specific booking can access its chat.

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/bookings/:id` | BookingDetail | View booking details & chat |
| `/user/bookings` | MyBookings | List all bookings |

## Testing

### Test Scenario:

1. Create multiple bookings with same provider
2. Go to "My Bookings"
3. Click "View & Chat" on each booking
4. Verify each has its own isolated chat room
5. Send messages in one booking
6. Confirm they don't appear in other bookings

## Benefits Summary

✅ **Realistic Marketplace Behavior**
- Mirrors real-world service platforms (Upwork, Fiverr, etc.)

✅ **Better Organization**
- Conversations grouped by service/booking

✅ **Clearer Context**
- Always know which service you're discussing

✅ **Scalability**
- Supports unlimited bookings per customer-provider pair

✅ **Professional**
- Industry-standard approach for service marketplaces

## Migration Notes

If you have existing chat rooms (old system):
- They will continue to work
- New bookings will create booking-based rooms
- Consider migrating old rooms to link with bookings

---

**Created:** February 2026  
**Status:** ✅ Ready for Production
