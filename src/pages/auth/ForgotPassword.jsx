import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@api/authApi';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { FiMail } from 'react-icons/fi';
import { ROUTES } from '@utils/constants';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent password reset instructions to <strong>{email}</strong>
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button>Back to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset your password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<FiMail className="text-gray-400" />}
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          Send reset instructions
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
