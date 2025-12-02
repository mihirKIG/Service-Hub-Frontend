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
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    user_type: 'customer',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [nonFieldError, setNonFieldError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setNonFieldError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password2) newErrors.password2 = 'Passwords do not match';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    return newErrors;
  };

  const mapServerErrors = (serverData) => {
    const mapped = {};
    if (!serverData || typeof serverData !== 'object') {
      return { non_field_errors: 'Registration failed' };
    }
    // DRF often returns { field: ["msg1", "msg2"], non_field_errors: ["..."], detail: "..." }
    for (const key of Object.keys(serverData)) {
      const val = serverData[key];
      if (Array.isArray(val)) {
        mapped[key] = val.join(' ');
      } else if (typeof val === 'object') {
        mapped[key] = Object.values(val).flat().join(' ') || JSON.stringify(val);
      } else {
        mapped[key] = String(val);
      }
    }
    return mapped;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNonFieldError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // send exactly the fields the serializer expects
      const payload = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        user_type: formData.user_type,
        address: formData.address,
      };

      await dispatch(register(payload)).unwrap();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      // handle common thunk/axios/rejectWithValue shapes
      // possible shapes:
      // - error.response.data (axios)
      // - error.payload (createAsyncThunk rejectWithValue)
      // - error.data
      // - error (plain object or string)
      let serverData = null;

      if (error?.response?.data) {
        serverData = error.response.data;
      } else if (error?.payload) {
        serverData = error.payload;
      } else if (error?.data) {
        serverData = error.data;
      } else if (typeof error === 'object' && Object.keys(error).length > 0) {
        serverData = error;
      }

      if (serverData) {
        const mapped = mapServerErrors(serverData);

        // Pull out generic messages
        if (mapped.non_field_errors) {
          setNonFieldError(mapped.non_field_errors);
          delete mapped.non_field_errors;
        } else if (mapped.detail) {
          setNonFieldError(mapped.detail);
          delete mapped.detail;
        } else if (mapped.error) {
          setNonFieldError(mapped.error);
          delete mapped.error;
        }

        setErrors((prev) => ({ ...prev, ...mapped }));
      } else {
        // fallback
        setNonFieldError(typeof error === 'string' ? error : 'Registration failed. Please try again.');
      }

      // keep console for debugging
      // eslint-disable-next-line no-console
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>

      {nonFieldError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {nonFieldError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          icon={<FiUser className="text-gray-400" />}
          required
        />

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
          label="Address (optional)"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          icon={<FiUser className="text-gray-400" />}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
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