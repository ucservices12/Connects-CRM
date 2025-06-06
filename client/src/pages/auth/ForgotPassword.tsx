import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ResetPassword from './ResetPassword';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <div className="sm:mt-24">
      {!submitted ? (
        <>
          <Link
            to="/login"
            className="inline-flex items-center font-medium text-sm text-primary-600 hover:text-primary-800 mb-6"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to login
          </Link>

          <h2 className="text-2xl text-center font-semibold mb-2">Forgot Password</h2>
          <p className="text-neutral-600 mb-8">
            Enter your email below to reset your password.
          </p>
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@company.com"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>
        </>
      ) :
        <ResetPassword />
      }
    </div>
  );
};

export default ForgotPassword;
