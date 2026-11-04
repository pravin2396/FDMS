import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Store } from 'lucide-react';

const AddRestaurantModal = ({ isOpen, onClose, onAdd }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      cuisine: '',
      location: '',
      contact: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add New Restaurant</h3>
            <p className="text-neutral-400 text-xs">Register a new outlet to the food court</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Punjab Dhaba"
              {...register('name', { required: 'Restaurant name is required' })}
              className={`w-full px-3.5 py-2 bg-neutral-950 border rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition ${
                errors.name ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Cuisine Specialty *
            </label>
            <input
              type="text"
              placeholder="e.g. North Indian, Tandoori"
              {...register('cuisine', { required: 'Cuisine is required' })}
              className={`w-full px-3.5 py-2 bg-neutral-950 border rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition ${
                errors.cuisine ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
              }`}
            />
            {errors.cuisine && (
              <p className="text-red-400 text-[11px] mt-1">{errors.cuisine.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Floor / Stall Location
            </label>
            <input
              type="text"
              placeholder="e.g. Stall #14, Food Court 2nd Floor"
              {...register('location')}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Contact / Manager Phone
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              {...register('contact')}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/30 transition cursor-pointer disabled:opacity-60"
            >
              Register Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
