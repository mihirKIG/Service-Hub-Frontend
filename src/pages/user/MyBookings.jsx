import useBookings from '@hooks/useBookings';
import BookingCard from '@components/cards/BookingCard';
import Loading from '@components/common/Loading';
import { useDispatch } from 'react-redux';
import { cancelBooking } from '@features/bookings/bookingSlice';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, refetch } = useBookings();

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await dispatch(cancelBooking({ id: bookingId, reason: 'Cancelled by user' }));
      refetch();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {loading ? (
        <Loading />
      ) : bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No bookings yet</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
