import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiX, FiMapPin, FiUser, FiCalendar, FiClock, FiDollarSign, FiPhone, FiEye, FiPackage } from 'react-icons/fi';
import { notificationApi } from '@api/notificationApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Load notifications on mount
  useEffect(() => {
    loadUnreadCount();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (showDropdown) {
      loadNotifications();
    }
  }, [showDropdown]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications();
      // Handle both paginated and non-paginated responses
      const notifData = response.data.results || response.data;
      setNotifications(notifData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Notifications load করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await notificationApi.markAsRead(notification.id);
        await loadUnreadCount();
        await loadNotifications();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }

    // Show details modal instead of navigating
    setSelectedNotification(notification);
    setShowDetailsModal(true);
    setShowDropdown(false);
  };

  const handleViewBooking = () => {
    if (selectedNotification?.booking) {
      navigate(`/provider-dashboard/bookings/${selectedNotification.booking}`);
      setShowDetailsModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedNotification(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      await loadUnreadCount();
      await loadNotifications();
      toast.success('সব notifications পড়া হয়েছে!');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('সমস্যা হয়েছে');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_created':
      case 'booking_new':
        return '📅';
      case 'booking_accepted':
        return '✅';
      case 'booking_rejected':
        return '❌';
      case 'booking_completed':
        return '🎉';
      case 'booking_cancelled':
        return '🚫';
      case 'payment_received':
        return '💰';
      case 'message_new':
        return '💬';
      default:
        return '🔔';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'এইমাত্র';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘণ্টা আগে`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} দিন আগে`;
    
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Notifications</h3>
                <p className="text-sm opacity-90">
                  {unreadCount > 0 ? `${unreadCount}টি নতুন notification` : 'সব পড়া হয়েছে'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  title="সব পড়া হয়েছে mark করুন"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>সব পড়া</span>
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500 text-sm">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-6xl mb-3">🔔</div>
                <p className="text-gray-500 text-center">কোনো notification নেই</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      !notif.is_read ? 'bg-blue-50 hover:bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          !notif.is_read ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {getNotificationIcon(notif.notification_type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm ${
                            !notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                          }`}>
                            {notif.title}
                          </h4>
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notif.message}
                        </p>

                        {/* Quick Preview */}
                        {notif.data && (
                          <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1 flex-1">
                                {notif.data.service_name && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500">Service:</span>
                                    <span className="font-medium text-gray-700">{notif.data.service_name}</span>
                                  </div>
                                )}
                                {notif.data.customer_name && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500">Customer:</span>
                                    <span className="font-medium text-gray-700">{notif.data.customer_name}</span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNotification(notif);
                                  setShowDetailsModal(true);
                                  setShowDropdown(false);
                                }}
                                className="ml-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                              >
                                <FiEye className="w-3 h-3" />
                                <span>Details</span>
                              </button>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/provider-dashboard/notifications');
                  setShowDropdown(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                সব notifications দেখুন →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                      {getNotificationIcon(selectedNotification.notification_type)}
                    </div>
                    <h2 className="text-xl font-bold">{selectedNotification.title}</h2>
                  </div>
                  <p className="text-sm opacity-90">{selectedNotification.message}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="ml-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedNotification.data ? (
                <div className="space-y-4">
                  {/* Service Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-4 h-4 text-white" />
                      </div>
                      Service Details
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedNotification.data.service_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            🔧
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Service Name</p>
                            <p className="font-semibold text-gray-900">{selectedNotification.data.service_name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-white" />
                      </div>
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedNotification.data.customer_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            👤
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-semibold text-gray-900">{selectedNotification.data.customer_name}</p>
                          </div>
                        </div>
                      )}
                      {selectedNotification.data.customer_phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <FiPhone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-semibold text-gray-900">
                              <a href={`tel:${selectedNotification.data.customer_phone}`} className="text-green-600 hover:underline">
                                {selectedNotification.data.customer_phone}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Schedule */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FiCalendar className="w-4 h-4 text-white" />
                      </div>
                      Schedule
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedNotification.data.booking_date && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            📅
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-gray-900">{selectedNotification.data.booking_date}</p>
                          </div>
                        </div>
                      )}
                      {selectedNotification.data.start_time && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <FiClock className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Start Time</p>
                            <p className="font-semibold text-gray-900">{selectedNotification.data.start_time}</p>
                          </div>
                        </div>
                      )}
                      {selectedNotification.data.end_time && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            ⏰
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">End Time</p>
                            <p className="font-semibold text-gray-900">{selectedNotification.data.end_time}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Location - IMPORTANT */}
                  {selectedNotification.data.service_address && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-4 h-4 text-white" />
                        </div>
                        <span>Service Location</span>
                        <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Important</span>
                      </h3>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            📍
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-2">
                              {selectedNotification.data.service_address}
                            </p>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedNotification.data.service_address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                              <FiMapPin className="w-4 h-4" />
                              Open in Google Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Information */}
                  {selectedNotification.data.total_amount && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-4 h-4 text-white" />
                        </div>
                        Payment Details
                      </h3>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-3xl font-bold text-green-600">৳{selectedNotification.data.total_amount}</p>
                          </div>
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            💰
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No additional details available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
              {selectedNotification.booking && (
                <button
                  onClick={handleViewBooking}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  View Full Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
