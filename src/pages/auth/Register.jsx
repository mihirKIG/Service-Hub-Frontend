import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@features/auth/authSlice';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { ROUTES } from '@utils/constants';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    user_type: 'customer',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password2) newErrors.password2 = 'Passwords do not match';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            icon={<FiUser className="text-gray-400" />}
            required
          />

          <Input
            label="Last Name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            icon={<FiUser className="text-gray-400" />}
            required
          />
        </div>

        <Input
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<FiMail className="text-gray-400" />}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          error={errors.phone_number}
          icon={<FiPhone className="text-gray-400" />}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FiLock className="text-gray-400" />}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          error={errors.password2}
          icon={<FiLock className="text-gray-400" />}
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I want to
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="user_type"
                value="customer"
                checked={formData.user_type === 'customer'}
                onChange={handleChange}
                className="mr-2"
              />
              Find services
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="user_type"
                value="provider"
                checked={formData.user_type === 'provider'}
                onChange={handleChange}
                className="mr-2"
              />
              Offer services
            </label>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
