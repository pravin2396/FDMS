import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Pre-fill remembered username if exists
  useEffect(() => {
    const remembered = localStorage.getItem('fdms_remembered_username');
    if (remembered) {
      setValue('username', remembered);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await login(data.username, data.password, data.rememberMe);
    setIsSubmitting(false);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  // Helper to autofill demo credentials
  const fillDemo = (username, password) => {
    setValue('username', username, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat font-sans selection:bg-red-500 selection:text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/dining-table.jpg')`,
      }}
    >
      {/* Center Card */}
      <div className="w-full max-w-[460px] z-10 my-auto">
        <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-sm shadow-2xl p-7 sm:p-10 transition-all">
          {/* Subtitle with red accent underline/lines matching sample */}
          <div className="relative text-center mb-7">
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-12 bg-red-600/70"></span>
              <p className="text-neutral-200 text-sm sm:text-base font-light tracking-wider lowercase">
                fill out the form below to login
              </p>
              <span className="h-[1px] w-12 bg-red-600/70"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Username / Email field */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  {...register('username', {
                    required: 'Username or Email is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                  })}
                  className={`w-full px-4 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm sm:text-base font-medium outline-none transition-all duration-150 border ${
                    errors.username
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-transparent focus:border-red-500'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password field with Show/Hide toggle */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full pl-4 pr-11 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm sm:text-base font-medium outline-none transition-all duration-150 border ${
                    errors.password
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-transparent focus:border-red-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 focus:outline-none transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-neutral-700" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-700" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox matching sample */}
            <div className="flex items-center justify-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded-sm border-neutral-400 text-red-600 bg-neutral-200 focus:ring-red-500 cursor-pointer accent-red-600"
                />
                <span className="text-neutral-200 text-xs sm:text-sm font-light group-hover:text-white transition-colors">
                  Remember Me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#c4c4c4] hover:bg-red-600 hover:text-white text-neutral-800 font-semibold rounded-sm text-sm sm:text-base tracking-wide transition-all duration-200 shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer uppercase"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {/* Forgot Password link matching sample */}
            <div className="text-center pt-2">
              <Link
                to="/forgot-password"
                className="text-neutral-200 hover:text-red-400 text-xs sm:text-sm font-light transition-colors hover:underline"
              >
                Forgot Password ?
              </Link>
            </div>

            {/* Register link */}
            <div className="pt-2 text-center border-t border-neutral-700/60 mt-4">
              <p className="text-neutral-300 text-xs sm:text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-red-400 hover:text-red-300 font-medium underline underline-offset-2 ml-1"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-5 p-2.5 bg-neutral-900/80 rounded border border-neutral-700/60 text-xs text-neutral-300">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
              <span className="font-semibold text-amber-400">Quick Test Credentials:</span>
              <span>Click to fill</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('pravin', 'Password123!')}
                className="flex-1 py-1 px-2 bg-neutral-800 hover:bg-neutral-700 hover:border-red-500/50 text-neutral-200 rounded text-[11px] text-center border border-neutral-700 transition cursor-pointer"
              >
                Admin (<span className="text-amber-400 font-semibold">pravin</span>)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('alex', 'Password123!')}
                className="flex-1 py-1 px-2 bg-neutral-800 hover:bg-neutral-700 hover:border-red-500/50 text-neutral-200 rounded text-[11px] text-center border border-neutral-700 transition cursor-pointer"
              >
                Customer (alex)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
