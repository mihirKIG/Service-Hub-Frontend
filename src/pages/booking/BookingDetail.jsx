import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiDollarSign, FiMapPin, FiMessageSquare, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { bookingApi } from '@api/bookingApi';
import { useBookingChat } from '@hooks/useBookingChat';
import { formatters } from '@utils/formatters';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import toast from 'react-hot-toast';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true); // New state for chat visibility

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getBookingById(id);
      console.log('📋 Booking data loaded:', response.data);
      console.log('📋 Booking ID for chat:', id);
      setBooking(response.data);
    } catch (err) {
      toast.error('Failed to load booking details');
      console.error('❌ Failed to fetch booking:', err);
    } finally {
      setLoading(false);
    }
  };

  // Booking-specific chat - simplified, only needs booking ID
  console.log('💬 Initializing chat with booking ID:', id);
  const {
    messages,
    sendMessage,
    isConnected,
    loading: chatLoading,
    error: chatError,
  } = useBookingChat(id);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const result = await sendMessage(messageText);
    if (result.success) {
      setMessageText('');
    } else {
      toast.error('Failed to send message');
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingApi.cancelBooking(id, { reason: 'Cancelled by user' });
      toast.success('Booking cancelled successfully');
      navigate('/user/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <Loading />;
  if (!booking) return <div>Booking not found</div>;

  const statusBadge = formatters.status(booking.status);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-1">Booking ID: #{booking.id}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge.class}`}>
          {statusBadge.text}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service & Provider Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold text-lg">{booking.service?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium">{booking.provider?.business_name}</p>
                <p className="text-sm text-gray-600">{booking.provider?.user?.email}</p>
              </div>
              {booking.service?.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{booking.service.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <FiCalendar className="mr-3 text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatters.date(booking.booking_date)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FiClock className="mr-3 text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{booking.booking_time}</p>
                </div>
              </div>
              {booking.location && (
                <div className="flex items-center text-gray-700">
                  <FiMapPin className="mr-3 text-indigo-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{booking.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <FiDollarSign className="mr-3 text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">{formatters.currency(booking.total_amount)}</p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {booking.status === 'pending' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <Button variant="danger" onClick={handleCancelBooking}>
                Cancel Booking
              </Button>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between cursor-pointer hover:bg-indigo-700 transition-colors" onClick={() => setIsChatOpen(!isChatOpen)}>
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" size={20} />
                <h3 className="font-semibold">Chat with Provider</h3>
              </div>
              <div className="flex items-center space-x-3">
                {isConnected ? (
                  <span className="w-2 h-2 bg-green-400 rounded-full" title="Connected"></span>
                ) : (
                  <span className="w-2 h-2 bg-gray-400 rounded-full" title="Disconnected"></span>
                )}
                <button className="text-white hover:text-gray-200 transition-colors">
                  {isChatOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Chat Messages - Collapsible */}
            {isChatOpen && (
              <>
                <div className="h-96 overflow-y-auto p-4 bg-gray-50">{chatLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loading />
                </div>
              ) : chatError ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  <div className="text-center">
                    <p className="font-medium">Failed to load chat</p>
                    <p className="text-sm mt-1">{typeof chatError === 'string' ? chatError : 'Please try again later'}</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender?.id === booking.customer?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender?.id === booking.customer?.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {formatters.time(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-center">
                    No messages yet.<br />
                    Start a conversation!
                  </p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              {chatError ? (
                <div className="text-red-500 text-sm text-center py-2">
                  Chat unavailable. Please try refreshing the page.
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={chatLoading ? "Loading chat..." : "Type a message..."}
                    disabled={chatLoading || !isConnected}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <Button 
                    type="submit" 
                    disabled={!messageText.trim() || chatLoading || !isConnected}
                  >
                    Send
                  </Button>
                </div>
              )}
            </form>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
