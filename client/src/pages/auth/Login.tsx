import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import { toast } from '../../components/common/Toaster';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(login({ credentials: form, navigate, toast }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-danger-600 text-sm">{error}</p>}

      <div>
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="name@company.com"
          className={`form-input ${errors.email ? 'border-danger-500' : ''}`}
        />
        {errors.email && <p className="text-xs text-danger-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="form-label">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input pr-10 ${errors.password ? 'border-danger-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-danger-600">{errors.password}</p>}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
            </svg>
            Signing in...
          </span>
        ) : 'Sign In'}
      </button>

      <Link to="/forgot-password" className="text-sm text-center block underline mt-2">
        Forgot password?
      </Link>
    </form>
  );
};

export default Login;
