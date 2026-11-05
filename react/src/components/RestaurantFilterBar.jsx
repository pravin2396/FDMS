import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Star,
  ArrowUpDown,
} from 'lucide-react';

const RestaurantFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCuisine,
  onSelectCuisine,
  selectedRating,
  onSelectRating,
  sortBy,
  onSortChange,
  onReset,
  totalResults,
}) => {
  const cuisines = [
    'All',
    'Italian',
    'Indian',
    'Asian',
    'American',
    'Mexican',
    'Mediterranean',
    'Desserts',
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: 'All' },
    { label: '4.5+ ⭐ (Top Rated)', value: '4.5' },
    { label: '4.0+ ⭐ & above', value: '4.0' },
    { label: '3.5+ ⭐ & above', value: '3.5' },
  ];

  const sortOptions = [
    { label: 'Popularity (Most Reviewed)', value: 'popularity' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Fastest Delivery Time', value: 'deliveryTime' },
    { label: 'Lowest Delivery Charges', value: 'deliveryCharge' },
  ];

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Row: Search Input + Rating Dropdown + Sort Dropdown */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar with Interactive Clear 'X' */}
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search by restaurant name, cuisine, address, or dish..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Row: Rating & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Rating Filter Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedRating}
              onChange={(e) => onSelectRating(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-200 text-xs rounded-xl pl-8 pr-8 py-2.5 outline-none focus:border-red-500 transition cursor-pointer font-medium"
            >
              {ratingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Star className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-200 text-xs rounded-xl pl-8 pr-8 py-2.5 outline-none focus:border-red-500 transition cursor-pointer font-medium"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-red-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-medium border border-neutral-700 transition cursor-pointer shrink-0"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Cuisine Filter Chips Row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-neutral-400 font-semibold mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            Cuisine:
          </span>
          {cuisines.map((c) => {
            const isSelected = selectedCuisine === c;
            return (
              <button
                key={c}
                onClick={() => onSelectCuisine(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Total Results Count */}
        <div className="text-xs text-neutral-400 font-medium whitespace-nowrap shrink-0">
          Showing <span className="font-bold text-white">{totalResults}</span> outlets
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilterBar;
