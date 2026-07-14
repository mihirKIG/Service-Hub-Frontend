# Backend API Requirements for Booking-Based Chat

## Current Status

✅ **Working with Existing Backend**  
The frontend has been updated to work with your current backend endpoints:
- `GET /api/chat/rooms/` - List chat rooms
- `POST /api/chat/rooms/create/` - Create chat room
- `GET /api/chat/rooms/{id}/` - Get room details
- `GET /api/chat/rooms/{id}/messages/` - Get messages
- `POST /api/chat/rooms/{id}/messages/send/` - Send message

**Current Behavior:**
- Chat works per customer-provider pair
- Same provider different bookings = same chat room
- ⚠️ Not ideal for marketplace but functional

## Future Enhancement: Booking-Specific Chat Rooms

For a proper marketplace experience, implement the following enhancement:

### `POST /api/chat/rooms/booking/`

Get or create a chat room for a specific booking.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "booking_id": 123
}
```

**Success Response (200 OK):**
```json
{
  "id": 456,
  "booking": {
    "id": 123,
    "service": {...},
    "booking_date": "2026-02-25",
    "status": "confirmed"
  },
  "customer": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  },
  "provider": {
    "id": 2,
    "business_name": "ABC Services",
    "user": {...}
  },
  "created_at": "2026-02-25T10:00:00Z",
  "last_message": {
    "message": "Hello!",
    "created_at": "2026-02-25T11:30:00Z",
    "sender": {...}
  } || null,
  "unread_count": 0
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Booking not found"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "You are not authorized to access this booking"
}
```

## Backend Logic

### Django Example Implementation:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_or_create_booking_chat(request):
    """
    Get existing or create new chat room for a booking.
    Each booking has exactly ONE chat room.
    """
    booking_id = request.data.get('booking_id')
    
    # Get booking
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Authorization: Only customer or provider can access
    user = request.user
    is_customer = booking.customer == user
    is_provider = booking.provider.user == user
    
    if not (is_customer or is_provider):
        return Response(
            {'error': 'You are not authorized to access this booking'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get or create chat room for this booking
    chat_room, created = ChatRoom.objects.get_or_create(
        booking=booking,
        defaults={
            'customer': booking.customer,
            'provider': booking.provider.user,
        }
    )
    
    # Serialize and return
    serializer = ChatRoomSerializer(chat_room)
    return Response(serializer.data, status=status.HTTP_200_OK)
```

## Database Schema Updates

### ChatRoom Model:

```python
class ChatRoom(models.Model):
    # NEW: Link to booking (one-to-one)
    booking = models.OneToOneField(
        'Booking', 
        on_delete=models.CASCADE,
        related_name='chat_room',
        unique=True  # Each booking has exactly one chat room
    )
    
    customer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='customer_chats'
    )
    
    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE, 
        related_name='provider_chats'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Chat for Booking #{self.booking.id}"
```

### Key Changes:

1. **Add `booking` field** - OneToOne relationship
2. **Ensure uniqueness** - One booking = one chat room
3. **Update queries** - Filter by booking instead of participants

## Migration Example

### Django Migration:

```python
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('chat', '0001_initial'),
        ('bookings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroom',
            name='booking',
            field=models.OneToOneField(
                default=None,
                null=True,
                blank=True,
                on_delete=models.CASCADE,
                related_name='chat_room',
                to='bookings.Booking'
            ),
        ),
        migrations.AlterUniqueTogether(
            name='chatroom',
            unique_together={('booking',)},
        ),
    ]
```

## URL Configuration

### Add to `urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    # ... existing patterns ...
    
    # NEW: Booking-based chat
    path('rooms/booking/', views.get_or_create_booking_chat, name='booking-chat'),
]
```

## Updated Endpoints List

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/rooms/` | List all chat rooms |
| **POST** | **`/api/chat/rooms/booking/`** | **Get/create chat by booking (NEW)** |
| POST | `/api/chat/rooms/create/` | Create chat room (legacy) |
| GET | `/api/chat/rooms/{id}/` | Get chat room details |
| GET | `/api/chat/rooms/{id}/messages/` | Get messages |
| POST | `/api/chat/rooms/{id}/messages/send/` | Send message |
| POST | `/api/chat/rooms/{id}/mark-read/` | Mark messages as read |

## WebSocket Updates

### Connection Logic:

When user connects to WebSocket, verify they have access to the chat room:

```python
# In your WebSocket consumer
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.user = self.scope['user']
        
        # Get chat room
        chat_room = await self.get_chat_room(self.room_id)
        
        # Verify user is customer or provider of the booking
        if not await self.has_access(chat_room, self.user):
            await self.close()
            return
        
        # Continue with connection...
        await self.channel_layer.group_add(...)
        await self.accept()
    
    async def has_access(self, chat_room, user):
        """Check if user is part of this booking's chat"""
        booking = await sync_to_async(lambda: chat_room.booking)()
        customer = await sync_to_async(lambda: booking.customer)()
        provider = await sync_to_async(lambda: booking.provider.user)()
        
        return user == customer or user == provider
```

## Testing Checklist

### Backend Tests:

- [ ] Create booking → verify chat room auto-created
- [ ] Customer can access their booking's chat
- [ ] Provider can access their booking's chat
- [ ] Other users cannot access the chat (403)
- [ ] Same booking always returns same chat room
- [ ] Different bookings get different chat rooms
- [ ] WebSocket connection authenticated properly

### Integration Tests:

```python
def test_booking_chat_creation():
    # Create a booking
    booking = create_test_booking()
    
    # Request chat room
    response = client.post('/api/chat/rooms/booking/', {
        'booking_id': booking.id
    })
    
    assert response.status_code == 200
    chat_room_id = response.data['id']
    
    # Request again, should get same room
    response2 = client.post('/api/chat/rooms/booking/', {
        'booking_id': booking.id
    })
    
    assert response2.data['id'] == chat_room_id  # Same room!
```

## Security Considerations

1. **Authorization**: Only booking customer and provider can access
2. **Validation**: Verify booking exists and is accessible
3. **Rate Limiting**: Prevent spam room creation attempts
4. **WebSocket Auth**: Verify JWT token on connection
5. **Message Access**: Only room participants can read/send messages

## Summary

### What Backend Needs to Do:

1. ✅ Add `booking` field to ChatRoom model
2. ✅ Create migration
3. ✅ Implement `POST /api/chat/rooms/booking/` endpoint
4. ✅ Update WebSocket consumer to verify booking access
5. ✅ Add authorization checks
6. ✅ Update serializers to include booking data
7. ✅ Write tests

### Expected Behavior:

```
Customer books service → Booking #123 created
Customer clicks "View & Chat" → POST /api/chat/rooms/booking/ {booking_id: 123}
Backend creates/returns ChatRoom #456 (linked to Booking #123)
Frontend connects to WebSocket for ChatRoom #456
Messages are isolated to this booking's chat room
```

---

**Status:** Ready for backend implementation  
**Priority:** High (core marketplace feature)
