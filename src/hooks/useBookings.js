import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '@features/bookings/bookingSlice';

const useBookings = (filters = {}) => {
  const dispatch = useDispatch();
  const { bookings, currentBooking, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings(filters));
  }, [dispatch, JSON.stringify(filters)]);

  const refetch = () => {
    dispatch(fetchBookings(filters));
  };

  return {
    bookings,
    currentBooking,
    loading,
    error,
    refetch,
  };
};

export default useBookings;
