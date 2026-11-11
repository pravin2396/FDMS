import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UtensilsCrossed } from 'lucide-react';

const CATEGORIES = [
  'Pizza',
  'Burgers',
  'Main Course',
  'Asian',
  'Desserts',
  'Mexican & Wraps',
];

const PRESET_IMAGES = [
  { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
  { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Curry / Biryani', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Noodles / Ramen', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dessert', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
];

const MenuItemModal = ({ isOpen, onClose, onSubmitItem, initialData = null }) => {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
      image: '',
      prepTime: '20',
      calories: '350',
      ingredients: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || 'Main Course',
        isVeg: Boolean(initialData.isVeg),
        isAvailable: initialData.isAvailable !== false,
        image: initialData.image || '',
        prepTime: initialData.prepTime || '20',
        calories: initialData.calories || '350',
        ingredients: Array.isArray(initialData.ingredients)
          ? initialData.ingredients.join(', ')
          : initialData.ingredients || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        isVeg: true,
        isAvailable: true,
        image: PRESET_IMAGES[0].url,
        prepTime: '20',
        calories: '350',
        ingredients: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    onSubmitItem({
      ...data,
      price: parseFloat(data.price),
      prepTime: parseInt(data.prepTime, 10) || 20,
      calories: parseInt(data.calories, 10) || 350,
      isVeg: data.isVeg === true || data.isVeg === 'true',
      isAvailable: data.isAvailable === true || data.isAvailable === 'true',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-neutral-400 hover:text-white p-1.5 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-md">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-neutral-400">
              {isEdit
                ? 'Update food title, pricing, category, and availability'
                : 'Publish a new dish to the food court menu catalog'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
          {/* Dish Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Food Item Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Artisanal Truffle Mushroom Pizza"
              {...register('name', { required: 'Food name is required' })}
              className={`w-full px-4 py-2.5 bg-neutral-950 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition ${
                errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-800 focus:border-red-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              placeholder="Describe the dish ingredients, preparation style, and flavor notes..."
              {...register('description', { required: 'Description is required' })}
              className={`w-full px-4 py-2 bg-neutral-950 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition resize-none ${
                errors.description ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
              }`}
            />
            {errors.description && (
              <p className="text-red-400 text-[11px] mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Price & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 349"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 10, message: 'Minimum price is ₹10' },
                })}
                className={`w-full px-4 py-2.5 bg-neutral-950 border rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition ${
                  errors.price ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
                }`}
              />
              {errors.price && (
                <p className="text-red-400 text-[11px] mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-white outline-none transition cursor-pointer font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Veg/Non-Veg & Availability Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            {/* Veg / Non-Veg Toggle */}
            <div>
              <span className="block text-xs font-semibold text-neutral-300 mb-2">
                Food Type
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-200">
                  <input
                    type="radio"
                    value="true"
                    {...register('isVeg')}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Veg
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-200">
                  <input
                    type="radio"
                    value="false"
                    {...register('isVeg')}
                    className="accent-red-500 w-4 h-4"
                  />
                  <span className="inline-flex items-center gap-1 font-medium text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Non-Veg
                  </span>
                </label>
              </div>
            </div>

            {/* Availability Toggle */}
            <div>
              <span className="block text-xs font-semibold text-neutral-300 mb-2">
                Availability Status
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('isAvailable')}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <span className="text-xs text-neutral-300 font-medium">
                  In Stock & Available to Order
                </span>
              </label>
            </div>
          </div>

          {/* Prep Time & Calories */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                placeholder="20"
                {...register('prepTime')}
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                placeholder="350"
                {...register('calories')}
                className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          {/* Image URL & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300">
                Food Image URL
              </label>
              <span className="text-[11px] text-neutral-400">or pick a preset:</span>
            </div>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              {...register('image')}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
            />
            {/* Quick preset pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setValue('image', preset.url)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Key Ingredients (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Buffalo Mozzarella, Truffle Oil, Fresh Basil, San Marzano Tomatoes"
              {...register('ingredients')}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
            />
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/30 transition cursor-pointer disabled:opacity-60"
            >
              {isEdit ? 'Save Changes' : 'Publish Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;
