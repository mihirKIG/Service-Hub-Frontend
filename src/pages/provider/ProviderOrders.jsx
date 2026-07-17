import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProviderOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  selectMyOrders,
  selectOrdersLoading,
} from '@features/providers/providerManagementSlice';
import { FiClock, FiCheck, FiX, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { BOOKING_STATUS } from '@utils/constants';
import toast from 'react-hot-toast';
import Avatar from '@components/common/Avatar';

const ProviderOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectOrdersLoading);
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { id: 'pending', label: 'New Requests', status: BOOKING_STATUS.PENDING },
    { id: 'accepted', label: 'Accepted', status: BOOKING_STATUS.ACCEPTED },
    { id: 'in_progress', label: 'In Progress', status: BOOKING_STATUS.IN_PROGRESS },
    { id: 'completed', label: 'Completed', status: BOOKING_STATUS.COMPLETED },
    { id: 'cancelled', label: 'Cancelled', status: BOOKING_STATUS.CANCELLED },
  ];

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    dispatch(fetchProviderOrders({ status: currentTab.status }));
  };

  const handleAccept = async (id) => {
    try {
      await dispatch(acceptOrder(id)).unwrap();
      toast.success('Order accepted successfully');
      loadOrders();
    } catch (error) {
      toast.error('Failed to accept order');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      try {
        await dispatch(rejectOrder({ id, reason })).unwrap();
        toast.success('Order rejected');
        loadOrders();
      } catch (error) {
        toast.error('Failed to reject order');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading && !orders) {
    return <Loading />;
  }

  const currentTab = tabs.find(t => t.id === activeTab);
  const filteredOrders = orders || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Orders</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Orders List */}
        <div className="p-6">
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={() => handleAccept(order.id)}
                  onReject={() => handleReject(order.id)}
                  onStatusUpdate={(status) => handleStatusUpdate(order.id, status)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No {currentTab.label.toLowerCase()} orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onAccept, onReject, onStatusUpdate }) => {
  const getStatusActions = () => {
    switch (order.status) {
      case BOOKING_STATUS.PENDING:
        return (
          <div className="flex space-x-2">
            <Button size="sm" onClick={onAccept} className="flex-1">
              <FiCheck className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onReject} className="flex-1">
              <FiX className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      case BOOKING_STATUS.ACCEPTED:
        return (
          <Button size="sm" onClick={() => onStatusUpdate(BOOKING_STATUS.ON_THE_WAY)}>
            Mark as On the Way
          </Button>
        );
      case BOOKING_STATUS.ON_THE_WAY:
        return (
          <Button size="sm" onClick={() => onStatusUpdate(BOOKING_STATUS.IN_PROGRESS)}>
            Start Working
          </Button>
        );
      case BOOKING_STATUS.IN_PROGRESS:
        return (
          <Button size="sm" onClick={() => onStatusUpdate(BOOKING_STATUS.COMPLETED)}>
            Complete Order
          </Button>
        );
      default:
        return null;
    }
  };

  const customerName = order.customer?.full_name || order.customer?.first_name
    ? `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim()
    : order.customer?.phone || 'Customer';

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Customer Info */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Customer</p>
          <div className="flex items-center">
            <Avatar src={order.customer?.profile_picture} alt={customerName} size="sm" />
            <div className="ml-2">
              <p className="font-medium text-gray-900">{customerName}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <FiPhone className="w-3 h-3 mr-1" />
                {order.customer?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Service</p>
          <p className="font-medium text-gray-900">{order.service_title}</p>
          <p className="text-sm text-gray-600">৳{order.total_amount}</p>
        </div>

        {/* Schedule & Location */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Schedule</p>
          <p className="text-sm text-gray-900">
            <FiClock className="inline w-4 h-4 mr-1" />
            {order.booking_date} at {order.start_time}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <FiMapPin className="inline w-4 h-4 mr-1" />
            {order.service_address}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {getStatusActions()}
      </div>
    </div>
  );
};

export default ProviderOrders;
