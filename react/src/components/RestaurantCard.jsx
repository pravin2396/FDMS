import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Bike,
  MapPin,
  Heart,
  ArrowRight,
} from 'lucide-react';

const RestaurantCard = ({ restaurant, isFavorite, onToggleFavorite }) => {
  return (
    <div className="group rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-red-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20">
      <div>
        {/* Restaurant Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-800">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Open / Closed Status Badge */}
          <div className="absolute top-3 left-3">
            {restaurant.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-md backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Open Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600/90 text-white shadow-md backdrop-blur-md">
                Closed
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(restaurant.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isFavorite
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/80'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Badges on Image: Rating & Cuisine */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900/90 text-neutral-200 border border-neutral-700/80 backdrop-blur-md">
              {restaurant.cuisine}
            </span>

            {/* Rating */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 text-amber-400 font-bold text-xs border border-white/10 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-neutral-400 text-[10px]">({restaurant.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Restaurant Name */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
              {restaurant.description}
            </p>
          </div>

          {/* Delivery Info Row: Time & Charges */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800/80">
            {/* Delivery Time */}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-medium">{restaurant.deliveryTime}</span>
            </div>

            {/* Delivery Charges */}
            <div className="flex items-center gap-1">
              <Bike className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              {restaurant.deliveryCharges === 0 ? (
                <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full text-[11px] border border-emerald-500/30">
                  Free Delivery
                </span>
              ) : (
                <span className="text-neutral-300 font-medium">
                  ₹{restaurant.deliveryCharges} Delivery
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          {/* Tags preview */}
          {restaurant.tags && restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {restaurant.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Link */}
      <div className="p-4 sm:p-5 pt-0">
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-red-600 text-neutral-200 hover:text-white border border-neutral-700 hover:border-red-500 transition-all duration-200 cursor-pointer shadow group-hover:shadow-red-600/20"
        >
          <span>View Menu & Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
