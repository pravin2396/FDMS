import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await registerUser({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    }
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
        <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-sm shadow-2xl p-7 sm:p-9 transition-all">
          <div className="relative text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-12 bg-red-600/70"></span>
              <p className="text-neutral-200 text-sm sm:text-base font-light tracking-wider lowercase">
                fill out the form below to sign up
              </p>
              <span className="h-[1px] w-12 bg-red-600/70"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register('name', {
                  required: 'Full Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className={`w-full px-4 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm font-medium outline-none transition-all border ${
                  errors.name ? 'border-red-500' : 'border-transparent focus:border-red-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                {...register('username', {
                  required: 'Username is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,20}$/,
                    message: '3-20 chars, letters, numbers, and underscores only',
                  },
                })}
                className={`w-full px-4 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm font-medium outline-none transition-all border ${
                  errors.username ? 'border-red-500' : 'border-transparent focus:border-red-500'
                }`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full px-4 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm font-medium outline-none transition-all border ${
                  errors.email ? 'border-red-500' : 'border-transparent focus:border-red-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full pl-4 pr-11 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm font-medium outline-none transition-all border ${
                    errors.password ? 'border-red-500' : 'border-transparent focus:border-red-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 focus:outline-none cursor-pointer"
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) =>
                      val === passwordValue || 'Passwords do not match',
                  })}
                  className={`w-full pl-4 pr-11 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm font-medium outline-none transition-all border ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-transparent focus:border-red-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-neutral-700" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-700" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions',
                  })}
                  className="mt-0.5 w-4 h-4 rounded-sm border-neutral-400 text-red-600 bg-neutral-200 accent-red-600 cursor-pointer"
                />
                <span className="text-neutral-200 text-xs font-light leading-snug">
                  I agree to the Food Court Terms of Service and Privacy Policy
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#c4c4c4] hover:bg-red-600 hover:text-white text-neutral-800 font-semibold rounded-sm text-sm tracking-wide transition-all duration-200 shadow hover:shadow-lg disabled:opacity-60 uppercase cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Back to Login link */}
            <div className="pt-2 text-center border-t border-neutral-700/60 mt-4">
              <p className="text-neutral-300 text-xs sm:text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-red-400 hover:text-red-300 font-medium underline underline-offset-2 ml-1"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
