import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantFilterBar from '../components/RestaurantFilterBar';
import Pagination from '../components/Pagination';
import { useRestaurants } from '../context/RestaurantContext';
import {
  Store,
  AlertCircle,
  RefreshCw,
  SearchX,
  Flame,
} from 'lucide-react';

const RestaurantList = () => {
  const {
    paginatedRestaurants,
    filteredRestaurants,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCuisine,
    setSelectedCuisine,
    selectedRating,
    setSelectedRating,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    favorites,
    toggleFavorite,
    resetFilters,
    fetchRestaurants,
  } = useRestaurants();

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Header */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Edge-to-Edge Stretched Layout with Sidebar */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab="restaurants"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Edge-to-Edge Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Page Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Food Court Restaurants
                </h1>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 ml-11">
                Explore multi-cuisine food court partners, ratings, delivery times, and chef specialties.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-white">{totalCount}</span> Outlets Available
              </span>
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <RestaurantFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={resetFilters}
            totalResults={totalCount}
          />

          {/* Loading Skeletons State */}
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2.5 text-xs text-neutral-400 py-4">
                <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                <span>Fetching restaurants & dishes from third-party API...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-4 animate-pulse"
                  >
                    <div className="h-48 rounded-xl bg-neutral-800"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-neutral-800 rounded w-2/3"></div>
                      <div className="h-3 bg-neutral-800 rounded w-full"></div>
                    </div>
                    <div className="h-8 bg-neutral-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8 rounded-2xl bg-red-950/30 border border-red-800 text-center space-y-3 max-w-xl mx-auto my-8">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Failed to Load Restaurants</h3>
              <p className="text-xs text-red-300">{error}</p>
              <button
                onClick={fetchRestaurants}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Retry Fetching
              </button>
            </div>
          )}

          {/* Empty Search / Filter State */}
          {!loading && !error && filteredRestaurants.length === 0 && (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <SearchX className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Restaurants Found</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  We couldn't find any outlets matching your current search or filters.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Restaurant Cards Grid */}
          {!loading && !error && filteredRestaurants.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isFavorite={favorites.includes(restaurant.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RestaurantList;
