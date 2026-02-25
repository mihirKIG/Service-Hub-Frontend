import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardStats,
  fetchEarningsGraph,
  selectProviderStats,
  selectProviderEarningsGraph,
  selectProviderLoading,
} from '@features/providers/providerManagementSlice';
import { selectUser } from '@features/auth/authSlice';
import {
  FiPackage,
  FiShoppingBag,
  FiCheckCircle,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
} from 'react-icons/fi';
import Loading from '@components/common/Loading';
import { Link } from 'react-router-dom';
import { ROUTES } from '@utils/constants';

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const stats = useSelector(selectProviderStats);
  const earningsGraph = useSelector(selectProviderEarningsGraph);
  const loading = useSelector(selectProviderLoading);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchEarningsGraph(period));
  }, [dispatch, period]);

  if (loading && !stats) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome Back, {user?.name || 'Provider'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Here's an overview of your performance and earnings
              </p>
              {user?.email && (
                <p className="text-blue-200 text-sm mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {user.email}
                </p>
              )}
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/30">
                <p className="text-white/80 text-sm mb-1">Your Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-yellow-300">{stats?.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-white/80">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Services"
          value={stats?.totalServices || 0}
          icon={FiPackage}
          color="blue"
        />
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders || 0}
          icon={FiClock}
          color="yellow"
        />
        <StatCard
          title="Completed Orders"
          value={stats?.completedOrders || 0}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="Total Earnings"
          value={`৳${stats?.totalEarnings?.toLocaleString() || 0}`}
          icon={FiDollarSign}
          color="purple"
        />
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EarningsSummaryCard
          title="Weekly Earnings"
          amount={stats?.weeklyEarnings || 0}
          color="blue"
        />
        <EarningsSummaryCard
          title="Monthly Earnings"
          amount={stats?.monthlyEarnings || 0}
          color="green"
        />
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 border-2 border-transparent hover:border-yellow-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Your Rating</h3>
            <div className="bg-yellow-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {stats?.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-400 text-lg">/ 5.0</span>
          </div>
          <p className="text-sm text-gray-500">
            Based on {stats?.totalReviews || 0} reviews
          </p>
        </div>
      </div>

      {/* Earnings Graph Placeholder */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Earnings Overview
            </h2>
            <p className="text-gray-500">Track your earnings performance over time</p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  period === p
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600 font-medium mb-2">Earnings Chart</p>
            <p className="text-sm text-gray-500">Install chart.js for data visualization</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-lg p-10 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quick Actions
            </h2>
            <p className="text-gray-500">Manage your provider account efficiently</p>
          </div>
          <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-6 max-w-xs"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add New Service"
            description="Create a new service offering"
            link={ROUTES.PROVIDER_ADD_SERVICE}
            icon={FiPackage}
          />
          <QuickActionCard
            title="View Orders"
            description="Check pending and active orders"
            link={ROUTES.PROVIDER_ORDERS}
            icon={FiShoppingBag}
          />
          <QuickActionCard
            title="View Earnings"
            description="Check your earnings history"
            link={ROUTES.PROVIDER_EARNINGS}
            icon={FiDollarSign}
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component - Enhanced
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-cyan-400',
      bg: 'from-blue-50 to-cyan-50',
      text: 'from-blue-600 to-cyan-600',
      border: 'border-blue-200',
    },
    yellow: {
      gradient: 'from-yellow-500 to-orange-400',
      bg: 'from-yellow-50 to-orange-50',
      text: 'from-yellow-600 to-orange-600',
      border: 'border-yellow-200',
    },
    green: {
      gradient: 'from-green-500 to-emerald-400',
      bg: 'from-green-50 to-emerald-50',
      text: 'from-green-600 to-emerald-600',
      border: 'border-green-200',
    },
    purple: {
      gradient: 'from-purple-500 to-pink-400',
      bg: 'from-purple-50 to-pink-50',
      text: 'from-purple-600 to-pink-600',
      border: 'border-purple-200',
    },
  };

  const config = colorConfig[color];

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 border-2 border-transparent hover:${config.border} transform hover:-translate-y-2`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-3">{title}</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${config.text} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${config.gradient} p-5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r ${config.gradient} rounded-full opacity-20"></div>
    </div>
  );
};

// Earnings Summary Card - Enhanced
const EarningsSummaryCard = ({ title, amount, color }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-cyan-400',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    green: {
      gradient: 'from-green-500 to-emerald-400',
      text: 'text-green-600',
      bg: 'bg-green-50',
    },
  };

  const config = colorConfig[color];

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 border-2 border-transparent hover:border-${color}-200 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`${config.bg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <FiTrendingUp className={`w-5 h-5 ${config.text}`} />
        </div>
      </div>
      <p className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
        ৳{amount?.toLocaleString() || 0}
      </p>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-600 font-semibold">↑ 12%</span>
        <span className="text-gray-500 ml-2">vs last period</span>
      </div>
    </div>
  );
};

// Quick Action Card - Enhanced
const QuickActionCard = ({ title, description, link, icon: Icon }) => {
  return (
    <Link
      to={link}
      className="group relative block p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-300 overflow-hidden transform hover:-translate-y-2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative flex items-start gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiTrendingUp className="text-blue-600" />
        </div>
      </div>
    </Link>
  );
};

export default ProviderDashboard;
