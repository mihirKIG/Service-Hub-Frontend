import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useNotifications from '@hooks/useNotifications';
import NotificationCard from '@components/cards/NotificationCard';
import Loading from '@components/common/Loading';
import Button from '@components/common/Button';
import { markAsRead, markAllAsRead } from '@features/notifications/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useNotifications();

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => {}}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No notifications</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
