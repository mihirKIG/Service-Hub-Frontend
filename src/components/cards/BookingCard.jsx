import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { formatters } from '@utils/formatters';
import Button from '@components/common/Button';

const BookingCard = ({ booking, onCancel, onConfirm, showActions = true }) => {
  const statusBadge = formatters.status(booking.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {booking.service?.name || 'Service'}
          </h3>
          <p className="text-sm text-gray-500">
            {booking.provider?.business_name || 'Provider'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
          {statusBadge.text}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <FiCalendar className="mr-2" />
          <span>{formatters.date(booking.booking_date)}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FiClock className="mr-2" />
          <span>{booking.booking_time}</span>
        </div>
        {booking.customer && (
          <div className="flex items-center text-gray-600 text-sm">
            <FiUser className="mr-2" />
            <span>{booking.customer.full_name}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {booking.notes}
        </p>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-lg font-bold text-gray-900">
          {formatters.currency(booking.total_amount)}
        </span>

        {showActions && (
          <div className="flex space-x-2">
            <Link to={`/bookings/${booking.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
            {booking.status === 'pending' && onCancel && (
              <Button size="sm" variant="danger" onClick={() => onCancel(booking.id)}>
                Cancel
              </Button>
            )}
            {booking.status === 'pending' && onConfirm && (
              <Button size="sm" variant="success" onClick={() => onConfirm(booking.id)}>
                Confirm
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
