import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@features/auth/authSlice';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiCamera,
  FiStar, FiDollarSign, FiClock, FiCheckCircle, FiAward,
  FiBriefcase, FiCalendar, FiGlobe, FiUpload
} from 'react-icons/fi';
import Avatar from '@components/common/Avatar';
import Loading from '@components/common/Loading';
import { providerApi } from '@api/providerApi';
import toast from 'react-hot-toast';

const ProviderProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    bio: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });

  useEffect(() => {
    fetchProviderProfile();
  }, []);

  const fetchProviderProfile = async () => {
    try {
      setLoading(true);
      const response = await providerApi.getMyProfile();
      setProviderProfile(response.data);
      setFormData({
        business_name: response.data.business_name || '',
        bio: response.data.bio || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        zip_code: response.data.zip_code || '',
      });
    } catch (error) {
      console.error('Failed to fetch provider profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await providerApi.patchProvider(formData);
      setProviderProfile(response.data);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar 
              src={user?.avatar || user?.profile_picture} 
              alt={user?.name || 'Provider'} 
              size="2xl"
              className="ring-4 ring-white shadow-2xl"
            />
            <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
              <FiCamera className="w-5 h-5" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {providerProfile?.business_name || user?.name || 'Provider Name'}
            </h1>
            <p className="text-blue-100 text-lg mb-4">Professional Service Provider</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-300 mb-1">
                  <FiStar className="w-5 h-5" />
                  <span className="font-semibold">Rating</span>
                </div>
                <p className="text-2xl font-bold">
                  {providerProfile?.rating?.toFixed(1) || '0.0'}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-300 mb-1">
                  <FiCheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Completed</span>
                </div>
                <p className="text-2xl font-bold">
                  {providerProfile?.total_completed_orders || 0}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-300 mb-1">
                  <FiDollarSign className="w-5 h-5" />
                  <span className="font-semibold">Earnings</span>
                </div>
                <p className="text-2xl font-bold">
                  ৳{providerProfile?.total_earnings?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                <FiEdit2 className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setEditMode(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMail className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {user?.phone || providerProfile?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">
                    {providerProfile?.city && providerProfile?.state
                      ? `${providerProfile.city}, ${providerProfile.state}`
                      : 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FiCalendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-blue-600" />
              Provider Status
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-gray-700">Account Status</span>
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                  {providerProfile?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-gray-700">Verification</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  providerProfile?.is_verified 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {providerProfile?.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-gray-700">User Type</span>
                <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-semibold">
                  {user?.user_type || 'Provider'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiBriefcase className="w-5 h-5 text-blue-600" />
              Business Information
            </h2>
            
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your services..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full address"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Business Name</h3>
                  <p className="text-lg text-gray-900 font-semibold">
                    {providerProfile?.business_name || 'Not provided'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {providerProfile?.bio || 'No bio provided yet.'}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      {providerProfile?.address || 'No address provided'}
                    </p>
                    {(providerProfile?.city || providerProfile?.state) && (
                      <p className="text-gray-600 mt-1">
                        {providerProfile?.city && providerProfile?.city}
                        {providerProfile?.state && `, ${providerProfile?.state}`}
                        {providerProfile?.zip_code && ` - ${providerProfile?.zip_code}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-600 mb-1">Total Services</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {providerProfile?.total_services || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm text-green-600 mb-1">Active Orders</p>
                      <p className="text-2xl font-bold text-green-900">
                        {providerProfile?.active_orders || 0}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-sm text-purple-600 mb-1">Response Time</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {providerProfile?.avg_response_time || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <p className="text-sm text-yellow-600 mb-1">Reviews</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {providerProfile?.total_reviews || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
