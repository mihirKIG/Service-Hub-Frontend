import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiStar, FiMapPin, FiClock, FiEye } from 'react-icons/fi';
import Button from '@components/common/Button';

const ServiceCard = ({ 
  id, 
  title, 
  image, 
  short_description, 
  base_price,
  pricing_type,
  hourly_rate,
  category_name,
  provider_name,
  average_rating,
  views_count,
  bookings_count,
  is_remote,
  is_onsite,
  status
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/service/${id}`);
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      navigate('/login', { state: { from: `/service/${id}` } });
      return;
    }

    navigate(`/book-service/${id}`);
  };

  const displayPrice = pricing_type === 'hourly' ? hourly_rate : base_price;
  const priceLabel = pricing_type === 'hourly' ? '/hr' : '';

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🛠️</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {category_name && (
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {category_name}
            </span>
          )}
          {status === 'active' && (
            <span className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
              Available
            </span>
          )}
        </div>

        {(is_remote || is_onsite) && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {is_onsite && (
              <span className="bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                <FiMapPin className="text-xs" /> Onsite
              </span>
            )}
            {is_remote && (
              <span className="bg-purple-500/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                <FiClock className="text-xs" /> Remote
              </span>
            )}
          </div>
        )}

        {views_count > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
              <FiEye className="text-xs" /> {views_count}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>
        
        {provider_name && (
          <p className="text-xs text-gray-500 mb-2">by {provider_name}</p>
        )}
        
        {short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
            {short_description}
          </p>
        )}

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          {average_rating > 0 && (
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-gray-700">{average_rating.toFixed(1)}</span>
            </div>
          )}
          {bookings_count > 0 && (
            <span>• {bookings_count} bookings</span>
          )}
          {views_count > 0 && (
            <span>• {views_count} views</span>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 space-y-3">
          {displayPrice && (
            <div className="text-xl font-bold text-pink-600">
              ৳{parseFloat(displayPrice).toFixed(0)}{priceLabel}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleViewDetails}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
            >
              View Details
            </Button>
            
            <Button
              onClick={handleBookNow}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
            >
              Book Now
              <FiArrowRight className="text-sm" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
