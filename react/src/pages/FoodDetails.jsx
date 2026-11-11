import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MenuItemModal from '../components/MenuItemModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { menuService } from '../services/api';
import { useMenu } from '../context/MenuContext';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  Star,
  Clock,
  Flame,
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  UtensilsCrossed,
  ChefHat,
  Tag,
} from 'lucide-react';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menuItems, updateMenuItem, deleteMenuItem } = useMenu();
  const { addNewOrder } = useDashboard();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();

  const [orderQuantity, setOrderQuantity] = useState(1);

  const cleanId = String(id || '').trim();
  const rawNumeric = cleanId.replace(/^food-/, '');

  // Helper to instantly locate item from active context or local storage
  const locateItem = () => {
    // 1. Try finding in active menuItems from useMenu()
    if (menuItems && menuItems.length > 0) {
      const found = menuItems.find(
        (m) =>
          String(m.id) === cleanId ||
          String(m.id) === rawNumeric ||
          String(m.id).replace(/^food-/, '') === rawNumeric
      );
      if (found) return found;
    }

    // 2. Try finding in localStorage
    try {
      const saved = localStorage.getItem('fdms_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const found = parsed.find(
            (m) =>
              String(m.id) === cleanId ||
              String(m.id) === rawNumeric ||
              String(m.id).replace(/^food-/, '') === rawNumeric
          );
          if (found) return found;
        }
      }
    } catch (e) {
      console.warn('Could not read local menu items', e);
    }

    return null;
  };

  const [item, setItem] = useState(() => locateItem());
  const [loading, setLoading] = useState(() => !locateItem());
  const [error, setError] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Safely parse ingredients into an array of string items regardless of incoming format
  const ingredientsList = Array.isArray(item?.ingredients)
    ? item.ingredients
    : typeof item?.ingredients === 'string' && item.ingredients.trim()
    ? item.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    : ['Fresh herbs', 'Chef special spices', 'Gourmet seasoning'];

  // Safely parse instructions into an array of step items regardless of incoming format
  const instructionsList = Array.isArray(item?.instructions)
    ? item.instructions
    : typeof item?.instructions === 'string' && item.instructions.trim()
    ? item.instructions.split('\n').map((s) => s.trim()).filter(Boolean)
    : ['Prepared fresh in the Food Court kitchen following strict hygiene and temperature controls. Served fresh and hot.'];

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      try {
        const data = await menuService.getMenuItemById(id);
        if (isMounted && data) {
          setItem(data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.warn('API sync warning:', err.message);
        if (isMounted) {
          setItem((current) => {
            const fallback = current || locateItem();
            if (fallback) {
              setLoading(false);
              return fallback;
            }
            setError(err.message || 'Food item not found');
            return null;
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Add to Cart action that also replicates in Dashboard orders
  const handleAddToCart = () => {
    if (!item) return;
    addToCart(item, orderQuantity, 'Food Court Central Kitchen');
    addNewOrder({
      customerName: user?.name || 'Pravin',
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      restaurant: 'Food Court Central Kitchen',
      items: `${item.name}${orderQuantity > 1 ? ` (x${orderQuantity})` : ''}`,
      amount: item.price * orderQuantity,
    });
  };

  // Handle Edit update (replicated in Network tab PUT request and Dashboard)
  const handleSaveEdit = async (updatedData) => {
    await updateMenuItem(item.id, updatedData);
    const parsedIng = Array.isArray(updatedData.ingredients)
      ? updatedData.ingredients
      : typeof updatedData.ingredients === 'string' && updatedData.ingredients.trim()
      ? updatedData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : item.ingredients;

    setItem((prev) => ({
      ...prev,
      ...updatedData,
      ingredients: parsedIng,
    }));
  };

  // Handle Delete confirm (replicated in Network tab DELETE request and Dashboard food counter)
  const handleConfirmDelete = async () => {
    await deleteMenuItem(item.id);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab="menu"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Back Navigation Button */}
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Food Menu</span>
            </Link>
          </div>

          {/* Loading State */}
          {loading && !item && (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto" />
              <p className="text-neutral-400 text-sm">Loading dish recipe & details...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && !item && (
            <div className="p-8 rounded-2xl bg-red-950/40 border border-red-800 text-center space-y-3 max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Item Not Found</h3>
              <p className="text-xs text-red-300">{error}</p>
              <Link
                to="/menu"
                className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Return to Menu
              </Link>
            </div>
          )}

          {/* Food Details Card */}
          {item && (
            <div className="space-y-8 max-w-5xl">
              {/* Hero Banner Card */}
              <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
                {/* Image */}
                <div className="h-64 sm:h-96 w-full relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
                </div>

                {/* Info Container */}
                <div className="p-6 sm:p-8 -mt-28 relative z-10 space-y-6">
                  {/* Top Badges & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category */}
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900/90 border border-neutral-700 text-neutral-200 backdrop-blur-md">
                        {item.category}
                      </span>

                      {/* Veg / Non-Veg */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                          item.isVeg
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                            : 'bg-red-950/80 text-red-400 border-red-500/50'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        ></span>
                        {item.isVeg ? 'Pure Veg' : 'Non-Vegetarian'}
                      </span>

                      {/* Availability */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                          item.isAvailable
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-red-600/90 text-white'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Available
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Out of Stock
                          </>
                        )}
                      </span>
                    </div>

                    {/* Edit & Delete Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Item</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white border border-neutral-700 hover:border-red-500 text-xs font-semibold transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Price Header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {item.name}
                      </h1>
                      <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-right self-start sm:self-auto shrink-0">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                        Dish Price
                      </span>
                      <span className="text-3xl font-extrabold text-white">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800">
                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-red-500 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Prep Time</span>
                        <span className="font-bold text-white text-sm">{item.prepTime || 20} mins</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <Flame className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Calories</span>
                        <span className="font-bold text-white text-sm">{item.calories || 350} kcal</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Rating</span>
                        <span className="font-bold text-white text-sm">{item.rating || 4.7} / 5</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <Tag className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Dietary</span>
                        <span className="font-bold text-white text-sm">{item.isVeg ? 'Vegetarian' : 'Non-Veg'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Order Action Bar */}
                  <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-neutral-400">Order from Food Court Kitchen:</span>
                      <p className="text-sm font-semibold text-white">Delivered in {parseInt(item.prepTime || 20, 10) + 15} minutes</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Quantity Stepper */}
                      {item.isAvailable && (
                        <div className="flex items-center rounded-2xl bg-neutral-950 border border-neutral-800 p-1">
                          <button
                            type="button"
                            onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                            disabled={orderQuantity <= 1}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-40 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-white text-sm">
                            {orderQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setOrderQuantity((q) => q + 1)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!item.isAvailable}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-xl shadow-red-600/30 transition cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {item.isAvailable
                            ? `Add ${orderQuantity > 1 ? `(${orderQuantity}) ` : ''}to Cart`
                            : 'Currently Out of Stock'}
                        </span>
                      </button>

                      {/* View Cart shortcut */}
                      <Link
                        to="/cart"
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-sm font-semibold transition cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 text-red-500" />
                        <span>Go to Cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients & Instructions Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ingredients Card */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-white">Key Ingredients</h2>
                  </div>

                  {ingredientsList && ingredientsList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {ingredientsList.map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">Fresh chef selected ingredients.</p>
                  )}
                </div>

                {/* Preparation Notes Card */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-white">Chef Preparation Notes</h2>
                  </div>

                  {instructionsList && instructionsList.length > 0 ? (
                    <ol className="space-y-2 list-decimal list-inside text-xs text-neutral-300 leading-relaxed">
                      {instructionsList.map((step, idx) => (
                        <li key={idx} className="text-neutral-300">
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Prepared fresh in the Food Court kitchen following strict hygiene and temperature controls. Served fresh and hot.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      <MenuItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitItem={handleSaveEdit}
        initialData={item}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={item?.name || ''}
      />
    </div>
  );
};

export default FoodDetails;
