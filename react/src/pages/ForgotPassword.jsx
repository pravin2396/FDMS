import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await forgotPassword(data.identifier, data.newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setTimeout(() => {
        navigate('/login');
      }, 1000);
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
        <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-sm shadow-2xl p-7 sm:p-10 transition-all">
          <div className="relative text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-12 bg-red-600/70"></span>
              <p className="text-neutral-200 text-sm sm:text-base font-light tracking-wider lowercase">
                recover or update your password
              </p>
              <span className="h-[1px] w-12 bg-red-600/70"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Username or Email */}
            <div>
              <input
                type="text"
                placeholder="Username or Registered Email"
                {...register('identifier', {
                  required: 'Please enter your username or email',
                })}
                className={`w-full px-4 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm sm:text-base font-medium outline-none transition-all border ${
                  errors.identifier ? 'border-red-500' : 'border-transparent focus:border-red-500'
                }`}
              />
              {errors.identifier && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter New Password (min 6 chars)"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full pl-4 pr-11 py-2.5 bg-[#e0dede] hover:bg-[#eae7e7] focus:bg-white text-neutral-800 placeholder-neutral-500 rounded-sm text-sm sm:text-base font-medium outline-none transition-all border ${
                    errors.newPassword ? 'border-red-500' : 'border-transparent focus:border-red-500'
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
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1 text-left font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#c4c4c4] hover:bg-red-600 hover:text-white text-neutral-800 font-semibold rounded-sm text-sm sm:text-base tracking-wide transition-all duration-200 shadow hover:shadow-lg disabled:opacity-60 cursor-pointer uppercase"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Resetting Password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>

            {/* Back to Login link */}
            <div className="pt-3 text-center border-t border-neutral-700/60 mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-red-400 text-xs sm:text-sm font-light transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
