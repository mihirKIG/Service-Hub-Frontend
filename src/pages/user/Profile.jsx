import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '@features/user/userSlice';
import useAuth from '@hooks/useAuth';
import useBookings from '@hooks/useBookings';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import { Link } from 'react-router-dom';
import { FiEdit, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { ROUTES } from '@utils/constants';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { bookings } = useBookings({ limit: 5 });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Link to={ROUTES.EDIT_PROFILE}>
          <Button variant="outline">
            <FiEdit className="mr-2" /> Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <Avatar
            src={user.profile_image}
            name={user.full_name || user.email}
            size="2xl"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
            <p className="text-gray-600">{user.user_type}</p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <FiMail className="mr-3" />
            <span>{user.email}</span>
          </div>
          {user.phone_number && (
            <div className="flex items-center text-gray-600">
              <FiPhone className="mr-3" />
              <span>{user.phone_number}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-3" />
              <span>{user.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          <Link to={ROUTES.MY_BOOKINGS} className="text-primary-600 hover:text-primary-700">
            View All
          </Link>
        </div>
        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{booking.service?.name}</p>
                  <p className="text-sm text-gray-600">{booking.provider?.business_name}</p>
                </div>
                <span className="text-sm text-gray-500">{booking.booking_date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No bookings yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
