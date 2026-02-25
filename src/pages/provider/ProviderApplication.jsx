import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServicePost, submitApplication, selectCurrentServicePost } from '@features/providers/providerManagementSlice';
import { uploadFile } from '@api/providerService';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { FiUpload, FiX, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { ROUTES } from '@utils/constants';

const ProviderApplication = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const servicePost = useSelector(selectCurrentServicePost);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    skills: '',
    experience: '',
    qualifications: '',
    location: '',
    serviceArea: '',
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadServicePost();
  }, [postId]);

  const loadServicePost = async () => {
    try {
      await dispatch(fetchServicePost(postId)).unwrap();
    } catch (error) {
      toast.error('Failed to load service post');
      navigate(ROUTES.BECOME_PROVIDER);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (documents.length + files.length > 5) {
      toast.error('Maximum 5 documents allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file, 'document'));
      const uploadedFiles = await Promise.all(uploadPromises);
      
      const newDocuments = uploadedFiles.map(response => ({
        url: response.data.url,
        filename: response.data.filename,
        size: response.data.size,
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      toast.success('Documents uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setSubmitting(true);
    try {
      const applicationData = {
        servicePostId: parseInt(postId),
        ...formData,
        documents: documents.map(doc => doc.url),
      };

      await dispatch(submitApplication(applicationData)).unwrap();
      
      toast.success('Application submitted successfully! You will be notified once reviewed.');
      navigate(ROUTES.MY_APPLICATIONS);
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!servicePost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Service post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for {servicePost.title}
          </h1>
          <p className="text-gray-600">{servicePost.description}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <span className="ml-2 text-gray-600">{servicePost.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <span className="ml-2 text-gray-600">{servicePost.location}</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Application Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
                placeholder="01XXXXXXXXX"
              />
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                placeholder="your.email@example.com"
              />
            </div>

            {/* Location */}
            <div>
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                error={errors.location}
                required
                placeholder="Your city/area"
              />
            </div>
          </div>

          {/* Service Area */}
          <div className="mt-6">
            <Input
              label="Service Area"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleInputChange}
              error={errors.serviceArea}
              placeholder="Areas where you can provide services (optional)"
            />
          </div>

          {/* Skills */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills <span className="text-red-500">*</span>
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.skills ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="List your relevant skills (e.g., Electrical wiring, circuit repair, installation)"
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
            )}
          </div>

          {/* Experience */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience <span className="text-red-500">*</span>
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.experience ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your work experience (e.g., 5 years as electrician, worked on residential projects)"
            />
            {errors.experience && (
              <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
            )}
          </div>

          {/* Qualifications */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications
            </label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your educational qualifications and certifications (optional)"
            />
          </div>

          {/* Documents Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documents (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Upload relevant documents (certificates, ID, etc.). Max 5 files, 5MB each.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="flex flex-col items-center cursor-pointer">
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload documents'}
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading || documents.length >= 5}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Documents List */}
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FiFileText className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.BECOME_PROVIDER)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderApplication;
