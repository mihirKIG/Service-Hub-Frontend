import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyServices,
  deleteProviderService,
  toggleServiceStatus,
  selectMyServices,
  selectServicesLoading,
} from '@features/providers/providerManagementSlice';
import { FiPlus, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiDollarSign } from 'react-icons/fi';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { ROUTES } from '@utils/constants';
import toast from 'react-hot-toast';

const ProviderServices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const services = useSelector(selectMyServices);
  const loading = useSelector(selectServicesLoading);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, [filter]);

  const loadServices = () => {
    const params = filter === 'all' ? {} : { isActive: filter === 'active' };
    dispatch(fetchMyServices(params));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await dispatch(deleteProviderService(id)).unwrap();
        toast.success('Service deleted successfully');
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleServiceStatus(id)).unwrap();
      toast.success('Service status updated');
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  if (loading && !services) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
        <Button onClick={() => navigate(ROUTES.PROVIDER_ADD_SERVICE)}>
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-2">
          {['all', 'active', 'inactive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => navigate(ROUTES.PROVIDER_EDIT_SERVICE.replace(':id', service.id))}
              onDelete={() => handleDelete(service.id)}
              onToggleStatus={() => handleToggleStatus(service.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No services found</p>
          <Button onClick={() => navigate(ROUTES.PROVIDER_ADD_SERVICE)}>
            Add Your First Service
          </Button>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Service Image */}
      {service.images && service.images.length > 0 && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.serviceName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              service.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="text-xs text-gray-500">{service.category}</span>
        </div>

        {/* Service Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {service.serviceName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center mb-4">
          <FiDollarSign className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-lg font-bold text-gray-900">
            ৳{service.price}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            / {service.pricingType}
          </span>
        </div>

        {/* Delivery Time */}
        {service.estimatedDeliveryTime && (
          <p className="text-xs text-gray-500 mb-4">
            ⏱ {service.estimatedDeliveryTime}
          </p>
        )}

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <FiEdit className="inline w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={onToggleStatus}
            className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title={service.isActive ? 'Deactivate' : 'Activate'}
          >
            {service.isActive ? (
              <FiToggleRight className="w-5 h-5" />
            ) : (
              <FiToggleLeft className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderServices;
