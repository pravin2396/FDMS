import React from 'react';
import { useForm } from 'react-hook-form';
import { X, UtensilsCrossed } from 'lucide-react';

const AddFoodItemModal = ({ isOpen, onClose, onAdd }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      cuisine: '',
      price: '',
      prepTime: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onAdd({
      ...data,
      price: parseFloat(data.price) || 299,
      prepTime: parseInt(data.prepTime, 10) || 20,
    });
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
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-500 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add New Food Item</h3>
            <p className="text-neutral-400 text-xs">Add a dish to the food court menu</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Food / Dish Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Truffle Smashed Burger"
              {...register('name', { required: 'Food title is required' })}
              className={`w-full px-3.5 py-2 bg-neutral-950 border rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition ${
                errors.name ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Cuisine / Category *
              </label>
              <input
                type="text"
                placeholder="e.g. Italian, Burger"
                {...register('cuisine', { required: 'Category is required' })}
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
                Price (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 350"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 10, message: 'Min ₹10' },
                })}
                className={`w-full px-3.5 py-2 bg-neutral-950 border rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition ${
                  errors.price ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
                }`}
              />
              {errors.price && (
                <p className="text-red-400 text-[11px] mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Estimated Preparation Time (minutes)
            </label>
            <input
              type="number"
              placeholder="e.g. 20"
              {...register('prepTime')}
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/30 transition cursor-pointer disabled:opacity-60"
            >
              Publish Food Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodItemModal;
