import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications, selectApplications } from '@features/providers/providerManagementSlice';
import { FiClock, FiCheckCircle, FiXCircle, FiFileText } from 'react-icons/fi';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { ROUTES, APPLICATION_STATUS } from '@utils/constants';
import { formatters } from '@utils/formatters';

const MyApplications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const applications = useSelector(selectApplications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      await dispatch(fetchMyApplications()).unwrap();
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case APPLICATION_STATUS.APPROVED:
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case APPLICATION_STATUS.REJECTED:
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      [APPLICATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [APPLICATION_STATUS.APPROVED]: 'bg-green-100 text-green-800',
      [APPLICATION_STATUS.REJECTED]: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-2">
              Track the status of your provider applications
            </p>
          </div>
          <Button onClick={() => navigate(ROUTES.BECOME_PROVIDER)}>
            Apply for New Position
          </Button>
        </div>

        {/* Applications List */}
        {applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any provider applications yet.
            </p>
            <Button onClick={() => navigate(ROUTES.BECOME_PROVIDER)}>
              Browse Available Positions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Application Card Component
const ApplicationCard = ({ application, getStatusIcon, getStatusBadge }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            {getStatusIcon(application.status)}
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {application.servicePost?.title}
              </h3>
              <p className="text-sm text-gray-500">
                Applied on {formatters.formatDate(application.createdAt)}
              </p>
            </div>
          </div>
          {getStatusBadge(application.status)}
        </div>

        {/* Application Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="text-sm font-medium text-gray-900">
              {application.servicePost?.category}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-sm font-medium text-gray-900">
              {application.location}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">
              {application.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-900">
              {application.phone}
            </p>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Skills</p>
          <p className="text-sm text-gray-900">{application.skills}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Experience</p>
          <p className="text-sm text-gray-900">{application.experience}</p>
        </div>

        {/* Documents */}
        {application.documents && application.documents.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Uploaded Documents</p>
            <div className="flex flex-wrap gap-2">
              {application.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100"
                >
                  Document {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Admin Notes (if reviewed) */}
        {application.reviewedAt && application.adminNotes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Admin Feedback</p>
            <p className="text-sm text-gray-900">{application.adminNotes}</p>
            <p className="text-xs text-gray-500 mt-2">
              Reviewed on {formatters.formatDate(application.reviewedAt)}
            </p>
          </div>
        )}

        {/* Approved Notice */}
        {application.status === APPLICATION_STATUS.APPROVED && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              🎉 Congratulations! Your application has been approved.
            </p>
            <p className="text-xs text-green-700 mt-1">
              You can now access the Provider Dashboard and start offering your services.
            </p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => navigate(ROUTES.PROVIDER_DASHBOARD)}
            >
              Go to Provider Dashboard
            </Button>
          </div>
        )}

        {/* Rejected Notice */}
        {application.status === APPLICATION_STATUS.REJECTED && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              Your application was not approved at this time.
            </p>
            <p className="text-xs text-red-700 mt-1">
              You can apply for other positions or reapply later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
