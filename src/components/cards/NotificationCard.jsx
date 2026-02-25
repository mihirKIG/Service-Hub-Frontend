import { formatters } from '@utils/formatters';
import { FiBell } from 'react-icons/fi';

const NotificationCard = ({ notification, onClick, onMarkAsRead }) => {
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
        notification.is_read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full mr-3 ${
          notification.is_read ? 'bg-gray-200' : 'bg-blue-500'
        }`}>
          <FiBell className={`h-5 w-5 ${
            notification.is_read ? 'text-gray-600' : 'text-white'
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-900 truncate">
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
              {formatters.relativeTime(notification.created_at)}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>

          {!notification.is_read && onMarkAsRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="text-xs text-primary-600 hover:text-primary-700 mt-2"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
