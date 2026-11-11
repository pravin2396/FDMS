import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MenuItemCard from '../components/MenuItemCard';
import MenuFilterBar from '../components/MenuFilterBar';
import MenuItemModal from '../components/MenuItemModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useMenu } from '../context/MenuContext';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  RefreshCw,
  AlertCircle,
  SearchX,
  Flame,
} from 'lucide-react';

const MenuList = () => {
  const {
    filteredMenuItems,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    vegFilter,
    setVegFilter,
    sortOption,
    setSortOption,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    resetFilters,
    fetchMenuItems,
    totalCount,
  } = useMenu();

  const { addNewOrder } = useDashboard();
  const { user } = useAuth();

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Submit Add or Edit
  const handleFormSubmit = async (data) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, data);
    } else {
      await addMenuItem(data);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (deletingItem) {
      await deleteMenuItem(deletingItem.id);
      setDeletingItem(null);
    }
  };

  // Add to Order action that replicates in Dashboard orders
  const handleAddToCart = (item) => {
    addNewOrder({
      customerName: user?.name || 'Pravin',
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      restaurant: 'Food Court Central Kitchen',
      items: item.name,
      amount: item.price,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar */}
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
          activeTab="menu"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Edge-to-Edge Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Page Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Food Court Menu Management
                </h1>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 ml-11">
                Manage food items, categories, pricing, veg/non-veg dietary tags, and stock availability.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-white">{totalCount}</span> Dishes Listed
              </span>
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <MenuFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            vegFilter={vegFilter}
            onSelectVegFilter={setVegFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onReset={resetFilters}
            onAddNew={handleOpenAdd}
            totalResults={totalCount}
          />

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 py-4">
                <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                <span>Loading food menu items from third-party catalog...</span>
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
              <h3 className="text-base font-bold text-white">Failed to Load Menu</h3>
              <p className="text-xs text-red-300">{error}</p>
              <button
                type="button"
                onClick={fetchMenuItems}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty Search / Filter State */}
          {!loading && !error && filteredMenuItems.length === 0 && (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <SearchX className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Food Items Found</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  We couldn't find any dishes matching your current filter criteria.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Food Cards Grid */}
          {!loading && !error && filteredMenuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onEdit={handleOpenEdit}
                  onDelete={(dish) => setDeletingItem(dish)}
                  onToggleAvailability={toggleAvailability}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Menu Item Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitItem={handleFormSubmit}
        initialData={editingItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        itemTitle={deletingItem?.name || ''}
      />
    </div>
  );
};

export default MenuList;
