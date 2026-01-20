# 🚀 ServiceHub Frontend - Quick Start Guide

**Last Updated:** January 7, 2026

## ⚡ Quick Setup (5 Minutes)

### 1. Prerequisites Check
```bash
# Check Node.js version (requires 16+)
node --version

# Check npm version
npm --version

# Ensure backend is running
curl http://localhost:8000/api/users/profile/
```

### 2. Install & Run
```bash
# Navigate to project
cd "servicehub frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ **App running at:** http://localhost:3001/

---

## 🎯 Test the Complete Flow

### Customer Journey

#### 1. **Register/Login**
- Visit http://localhost:3001/login
- Choose Phone OTP or Google Sign-In
- For OTP: Enter phone number → Receive code → Verify

#### 2. **Browse Services**
- Click "Services" in navigation
- Apply filters:
  - Category (Plumbing, Electrical, etc.)
  - Pricing type (Hourly/Fixed/Package)
  - Price range
  - Location type (Remote/On-site)
- Search by keywords

#### 3. **Book a Service**
- Click "Book Now" on any service card
- Fill booking form:
  - Select date & time
  - Enter service address
  - Add special notes
- See real-time price calculation
- Submit booking

#### 4. **View Bookings**
- Navigate to "My Bookings"
- See booking status (Pending/Confirmed/Completed)
- View booking details
- Cancel if needed

#### 5. **Leave Review**
- After service completion
- Rate provider (1-5 stars)
- Write review comment
- Upload photos (optional)

#### 6. **Chat with Provider**
- Open chat from booking
- Send messages in real-time
- Upload attachments
- See typing indicators

---

### Provider Journey

#### 1. **Create Provider Profile**
```javascript
// Navigate to /provider/create
{
  business_name: "ABC Services",
  categories: [1, 2],
  experience_years: 5,
  hourly_rate: "50.00",
  city: "New York",
  state: "NY",
  certifications: "Licensed #12345"
}
```

#### 2. **Add Services**
- Go to Provider Dashboard → Services
- Click "Add New Service"
- Fill in:
  - Title & description
  - Pricing type
  - Price
  - Service type (Remote/On-site)
  - Images & FAQs

#### 3. **Set Availability**
```javascript
// Set working hours for each day
{
  day_of_week: 0, // Monday
  start_time: "09:00:00",
  end_time: "17:00:00",
  is_available: true
}
```

#### 4. **Manage Bookings**
- View incoming booking requests
- Update status:
  - Confirm booking
  - Mark in progress
  - Complete service
  - Handle cancellations

#### 5. **Upload Portfolio**
- Add project photos
- Write project descriptions
- Set project dates
- Showcase work to customers

---

## 🔌 API Endpoints Quick Reference

### Authentication
```javascript
// Send OTP
POST /api/users/send-otp/
{ "phone_number": "+1234567890" }

// Verify OTP
POST /api/users/verify-otp/
{ "phone_number": "+1234567890", "otp": "123456" }

// Google Login
POST /api/users/google/
{ "token": "google_oauth_token" }
```

### Services
```javascript
// List services
GET /api/services/?category=1&pricing_type=hourly&min_price=20

// Get service
GET /api/services/123/

// Create service (Provider)
POST /api/services/
{
  "title": "Professional Plumbing",
  "pricing_type": "hourly",
  "hourly_rate": "50.00"
}
```

### Bookings
```javascript
// Create booking
POST /api/bookings/create/
{
  "provider_id": 1,
  "service_title": "Emergency Repair",
  "booking_date": "2026-01-15",
  "start_time": "10:00:00",
  "end_time": "12:00:00"
}

// Update booking
PATCH /api/bookings/123/update/
{ "status": "confirmed" }

// Cancel booking
POST /api/bookings/123/cancel/
{ "cancellation_reason": "Schedule conflict" }
```

### Reviews
```javascript
// Create review
POST /api/reviews/create/
{
  "provider": 1,
  "booking": 5,
  "rating": 5,
  "comment": "Excellent service!"
}

// Get provider reviews
GET /api/reviews/provider/1/
```

### Chat
```javascript
// Create chat room
POST /api/chat/rooms/create/
{ "provider": 1 }

// Send message
POST /api/chat/rooms/123/messages/send/
{ "message": "Hello!" }

// WebSocket connection
ws://localhost:8000/ws/chat/123/?token=<access_token>
```

---

## 🎨 Using Custom Hooks

### 1. Services Hook
```javascript
import { useServices } from './hooks/useServices';

function ServicesPage() {
  const { services, loading, pagination } = useServices({
    category: 1,
    pricing_type: 'hourly',
    min_price: 20,
    max_price: 100,
    status: 'active',
    ordering: '-views_count',
  });

  if (loading) return <Loading />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {services.map(service => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
}
```

### 2. Bookings Hook
```javascript
import { useBookings } from './hooks/useBookings';

function MyBookings() {
  const { bookings, loading } = useBookings({
    status: 'pending',
    ordering: '-booking_date',
  });

  const handleCancel = async (id) => {
    await bookingApi.cancelBooking(id, {
      cancellation_reason: 'User requested'
    });
    refetch();
  };

  return (
    <div>
      {bookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
}
```

### 3. Chat Hook
```javascript
import { useChat } from './hooks/useChat';

function ChatRoom({ roomId }) {
  const {
    messages,
    sendMessage,
    isConnected,
    typingUsers,
    setTyping
  } = useChat(roomId);

  const handleSend = (text) => {
    sendMessage(text);
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.message}</div>
        ))}
      </div>
      
      {typingUsers.length > 0 && (
        <div>Someone is typing...</div>
      )}
      
      <input
        onFocus={() => setTyping(true)}
        onBlur={() => setTyping(false)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend(e.target.value);
          }
        }}
      />
      
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
    </div>
  );
}
```

---

## 🛠️ Common Tasks

### Add a New Filter to Services
```javascript
// In src/pages/services/AllServices.jsx

const [filters, setFilters] = useState({
  category: '',
  pricing_type: '',
  min_price: '',
  max_price: '',
  status: 'active',
  is_remote: false,  // Add new filter
  search: '',
  ordering: '-created_at',
});

// Add UI control
<label>
  <input
    type="checkbox"
    checked={filters.is_remote}
    onChange={(e) => setFilters({
      ...filters,
      is_remote: e.target.checked
    })}
  />
  Remote Services Only
</label>
```

### Create a Payment
```javascript
import { paymentApi } from './api/paymentApi';

async function processPayment(bookingId, amount) {
  try {
    const payment = await paymentApi.createPayment({
      booking: bookingId,
      amount: amount,
      payment_method: 'credit_card',
      payment_details: {
        card_number: '****1234',
        card_holder: 'John Doe'
      }
    });
    
    console.log('Payment successful:', payment.data);
  } catch (error) {
    console.error('Payment failed:', error);
  }
}
```

### Mark Notifications as Read
```javascript
import { useNotifications } from './hooks/useNotifications';

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  return (
    <div>
      <div className="bell-icon">
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>
      
      <div className="dropdown">
        {notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
            className={!notif.is_read ? 'unread' : ''}
          >
            {notif.message}
          </div>
        ))}
        
        <button onClick={markAllAsRead}>
          Mark All as Read
        </button>
      </div>
    </div>
  );
}
```

---

## 🐛 Debugging Tips

### Check API Calls
```javascript
// In browser console
localStorage.getItem('access_token')  // Check if logged in

// View all API calls in Network tab
// Filter by: XHR or Fetch
```

### Token Issues
```javascript
// Clear tokens and re-login
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
window.location.href = '/login';
```

### WebSocket Not Connecting
```javascript
// Check WebSocket URL
const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;
console.log('Connecting to:', wsUrl);

// Verify token is valid
console.log('Token:', localStorage.getItem('access_token'));
```

### CORS Errors
```python
# In Django settings.py, add:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
]

CORS_ALLOW_CREDENTIALS = True
```

---

## 📊 Features Checklist

### Implemented ✅
- [x] Phone OTP Authentication
- [x] Google OAuth
- [x] Service Browsing with Filters
- [x] Service Booking
- [x] Booking Management
- [x] Provider Profiles
- [x] Service Management (Provider)
- [x] Reviews & Ratings
- [x] Payment Integration
- [x] Real-time Chat
- [x] Notifications
- [x] File Uploads
- [x] Search Functionality
- [x] Responsive Design

### Ready to Build 🚧
- [ ] Provider Dashboard Analytics
- [ ] Customer Dashboard Analytics
- [ ] Advanced Search with Maps
- [ ] Email Notifications
- [ ] SMS Notifications
- [ ] Payment History Export
- [ ] Multi-language Support
- [ ] Dark Mode

---

## 🎯 Next Steps

1. **Test with Backend**
   - Start Django server: `python manage.py runserver`
   - Verify all endpoints working
   - Test complete flows

2. **Customize UI**
   - Update color scheme in `tailwind.config.js`
   - Modify component styles
   - Add your branding

3. **Add Features**
   - Build provider analytics dashboard
   - Implement advanced search
   - Add more filters
   - Create admin panel

4. **Deploy**
   - Build production version: `npm run build`
   - Deploy to hosting (Vercel, Netlify, etc.)
   - Configure environment variables

---

## 📞 Support

- **API Documentation:** [FRONTEND_API_INTEGRATION.md](./FRONTEND_API_INTEGRATION.md)
- **Troubleshooting:** [TROUBLESHOOTING_OTP.md](./TROUBLESHOOTING_OTP.md)
- **Backend Docs:** http://localhost:8000/swagger/

---

**Happy Coding! 🚀**

*Last Updated: January 7, 2026*
