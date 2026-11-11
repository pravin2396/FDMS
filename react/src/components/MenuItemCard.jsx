import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Star,
  Clock,
  Flame,
  ShoppingBag,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';

const MenuItemCard = ({
  item,
  onAddToCart,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const { cartItems } = useCart();
  const cartEntry = cartItems?.find((ci) => String(ci.id) === String(item.id));
  const cartQty = cartEntry?.quantity || 0;
  return (
    <div className="group rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-red-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20">
      <div>
        {/* Food Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-800">
          <Link
            to={`/menu/${item.id}`}
            className="block w-full h-full cursor-pointer"
            title={`View ${item.name} details`}
          >
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                !item.isAvailable ? 'grayscale opacity-60' : ''
              }`}
              loading="lazy"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </Link>

          {/* Top Badges: Veg/Non-Veg & Availability */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {/* Veg / Non-Veg Icon Symbol */}
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center bg-black/80 backdrop-blur-md border ${
                item.isVeg ? 'border-emerald-500' : 'border-red-500'
              }`}
              title={item.isVeg ? 'Vegetarian Dish' : 'Non-Vegetarian Dish'}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              ></span>
            </div>

            {/* Availability Status Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleAvailability(item.id);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow cursor-pointer transition ${
                item.isAvailable
                  ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white'
                  : 'bg-red-600/90 hover:bg-red-700 text-white'
              }`}
              title="Click to toggle availability"
            >
              {item.isAvailable ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Available
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Out of Stock
                </>
              )}
            </button>
          </div>

          {/* Top Right Quick Management Actions (Edit, Delete) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg bg-black/70 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 backdrop-blur-md transition cursor-pointer"
              title="Edit Dish"
              aria-label="Edit Dish"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-neutral-300 hover:text-white border border-neutral-700 hover:border-red-500 backdrop-blur-md transition cursor-pointer"
              title="Delete Dish"
              aria-label="Delete Dish"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Badges on Image: Category & Rating */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900/90 text-neutral-200 border border-neutral-700/80 backdrop-blur-md">
              {item.category}
            </span>

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 text-amber-400 font-bold text-xs border border-white/10 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating || 4.7}</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <Link
              to={`/menu/${item.id}`}
              className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors line-clamp-1 block cursor-pointer"
            >
              {item.name}
            </Link>
            <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Nutritional / Prep info */}
          <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1 border-t border-neutral-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              {item.prepTime || 20} mins
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {item.calories || 350} kcal
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Order Action */}
      <div className="p-4 sm:p-5 pt-0 border-t border-neutral-800/60 mt-2">
        <div className="flex items-center justify-between pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Price</span>
            <span className="text-xl font-extrabold text-white">₹{item.price}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/menu/${item.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold transition cursor-pointer shadow-sm"
              title="View full details"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              disabled={!item.isAvailable}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer ${
                !item.isAvailable
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : cartQty > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
              title={cartQty > 0 ? `${cartQty} already in cart. Click to add more` : 'Add to cart'}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>
                {!item.isAvailable
                  ? 'Out'
                  : cartQty > 0
                  ? `In Cart (${cartQty})`
                  : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
