import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Plus,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Pizza',
  'Burgers',
  'Main Course',
  'Asian',
  'Desserts',
  'Mexican & Wraps',
];

const MenuFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  vegFilter,
  onSelectVegFilter,
  sortOption,
  onSortChange,
  onReset,
  onAddNew,
  totalResults,
}) => {
  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Row: Search + Veg Toggle + Sort Dropdown + Add Item Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input with Interactive Clear 'X' */}
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search food by name, ingredients, or category..."
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
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group: Veg/Non-Veg + Sort Dropdown + Add Item Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Veg / Non-Veg Toggle Group */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => onSelectVegFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                vegFilter === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => onSelectVegFilter('veg')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                vegFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Veg Only
            </button>
            <button
              type="button"
              onClick={() => onSelectVegFilter('non-veg')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                vegFilter === 'non-veg'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-red-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Non-Veg
            </button>
          </div>

          {/* Sort By Price Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-200 text-xs rounded-xl pl-8 pr-8 py-2.5 outline-none focus:border-red-500 transition cursor-pointer font-medium"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-red-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-medium border border-neutral-700 transition cursor-pointer shrink-0"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Add New Item Button */}
          <button
            type="button"
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/30 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips Row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-neutral-400 font-semibold mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-400 font-medium whitespace-nowrap shrink-0">
          Showing <span className="font-bold text-white">{totalResults}</span> dishes
        </div>
      </div>
    </div>
  );
};

export default MenuFilterBar;
