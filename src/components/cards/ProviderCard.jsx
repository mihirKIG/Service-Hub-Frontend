import { Link } from 'react-router-dom';
import { FiStar, FiMapPin } from 'react-icons/fi';
import Avatar from '@components/common/Avatar';
import { formatters } from '@utils/formatters';

const ProviderCard = ({ provider }) => {
  return (
    <Link to={`/providers/${provider.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 bg-gray-200">
          {provider.cover_image ? (
            <img
              src={provider.cover_image}
              alt={provider.business_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.business_name)}&size=800&background=random`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-center">
                <div className="text-6xl mb-2">🏢</div>
                <span className="text-gray-500 text-sm">No image available</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            <Avatar
              src={provider.user?.profile_image}
              name={provider.business_name}
              size="md"
            />
            <div className="ml-3">
              <h3 className="font-semibold text-lg text-gray-900">
                {provider.business_name}
              </h3>
              <p className="text-sm text-gray-500">{provider.category?.name}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {provider.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-500">
              <FiStar className="fill-current" />
              <span className="ml-1 text-gray-900 font-medium">
                {formatters.rating(provider.average_rating)}
              </span>
              <span className="ml-1 text-gray-500 text-sm">
                ({provider.total_reviews})
              </span>
            </div>

            {provider.location && (
              <div className="flex items-center text-gray-500 text-sm">
                <FiMapPin className="mr-1" />
                <span>{provider.location}</span>
              </div>
            )}
          </div>

          {provider.starting_price && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Starting from </span>
              <span className="text-lg font-bold text-primary-600">
                {formatters.currency(provider.starting_price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProviderCard;
