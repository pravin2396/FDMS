import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  Receipt,
  Store,
} from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    totalItemsCount,
    subtotal,
    deliveryFee,
    tax,
    packagingFee,
    discountAmount,
    totalPrice,
    promoCode,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    checkout,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Sidebar responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Promo code input state
  const [couponInput, setCouponInput] = useState('');
  const [chefInstructions, setChefInstructions] = useState('');
  const [tableNumber, setTableNumber] = useState('Table #08 (Food Court 2nd Floor)');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput);
    setCouponInput('');
  };

  const handlePlaceOrder = () => {
    const success = checkout({
      name: user?.name || 'Pravin',
      instructions: chefInstructions,
      location: tableNumber,
    });
    if (success) {
      setIsOrderSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar with live cart indicator */}
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
          activeTab="cart"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Edge-to-Edge Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Your Food Court Cart
                </h1>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 ml-12">
                Review your items, customize quantities, apply discount coupons, and checkout.
              </p>
            </div>

            {/* Actions: Clear Cart Button */}
            {cartItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmClearOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-red-600/20 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/40 text-xs font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>
            )}
          </div>

          {/* Order Placement Success View */}
          {isOrderSuccess && (
            <div className="py-12 px-6 max-w-xl mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Order Placed Successfully!</h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Your food order has been dispatched to the Food Court central kitchen and registered in the real-time Dashboard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left text-xs space-y-1.5 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Delivery Destination:</span>
                  <span className="font-semibold text-white">{tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Estimated Dispatch Time:</span>
                  <span className="font-semibold text-emerald-400">20-25 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Dashboard Replication:</span>
                  <span className="font-semibold text-amber-400">Active in Recent Orders</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOrderSuccess(false);
                    navigate('/');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  View in Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOrderSuccess(false);
                    navigate('/menu');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-700 transition cursor-pointer"
                >
                  Order More Dishes
                </button>
              </div>
            </div>
          )}

          {/* Empty Cart State */}
          {!isOrderSuccess && cartItems.length === 0 && (
            <div className="py-20 text-center space-y-5 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500 shadow-inner">
                <ShoppingBag className="w-10 h-10 text-neutral-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Your Cart is Empty</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Looks like you haven't added any dishes yet. Browse our live food court menus and partner restaurants to add your favorites!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Browse Food Menu</span>
                </Link>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold border border-neutral-800 transition cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>View Restaurants</span>
                </Link>
              </div>
            </div>
          )}

          {/* Active Cart View (Items + Order Summary Grid) */}
          {!isOrderSuccess && cartItems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List (7 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                {/* Items Container Card */}
                <div className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden divide-y divide-neutral-800/80 shadow-xl">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-800/20 transition-colors"
                    >
                      {/* Left: Image & Details */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <Link
                          to={`/menu/${item.id}`}
                          className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/60 group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div
                            className={`absolute top-1.5 left-1.5 w-4 h-4 rounded-sm flex items-center justify-center bg-black/80 border ${
                              item.isVeg ? 'border-emerald-500' : 'border-red-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            ></span>
                          </div>
                        </Link>

                        <div className="space-y-1 min-w-0 flex-1">
                          <Link
                            to={`/menu/${item.id}`}
                            className="font-bold text-sm sm:text-base text-white hover:text-red-400 transition-colors block truncate"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            <span className="text-amber-400 font-medium">
                              {item.restaurant}
                            </span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                          <div className="text-xs font-semibold text-neutral-300">
                            ₹{item.price}{' '}
                            <span className="text-[10px] text-neutral-500 font-normal">
                              each
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity Selector & Line Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total Price */}
                        <div className="text-right min-w-[70px]">
                          <span className="text-base font-extrabold text-white block">
                            ₹{Math.round(item.price * item.quantity)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Order Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Delivery Location / Table Card */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>Food Court Delivery Spot</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        {isEditingAddress ? 'Done' : 'Change'}
                      </button>
                    </div>
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g. Table #12, 2nd Floor Zone B"
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    ) : (
                      <p className="text-xs text-neutral-300 font-medium">
                        {tableNumber}
                      </p>
                    )}
                  </div>

                  {/* Special Instructions for Kitchen */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Chef Preparation Notes</span>
                    </div>
                    <input
                      type="text"
                      value={chefInstructions}
                      onChange={(e) => setChefInstructions(e.target.value)}
                      placeholder="e.g. Less spicy, pack cutlery, extra ketchup"
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Back to Menu Link */}
                <div>
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue browsing food catalog</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Cart Summary & Bill Breakdown (5 cols) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-5">
                {/* Coupon Code Card */}
                <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3.5 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <Tag className="w-4 h-4 text-red-500" />
                    <span>Apply Food Court Coupon</span>
                  </div>

                  {promoCode ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold text-xs text-emerald-400 block">
                            {promoCode} APPLIED
                          </span>
                          <span className="text-[10px] text-emerald-300">
                            Saved ₹{discountAmount} on this order!
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. FOODCOURT50)"
                        className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 uppercase font-semibold focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-red-600/30"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Quick Clickable Promo Badges */}
                  <div className="pt-2 border-t border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase block mb-1.5">
                      Available Offers:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyPromoCode('FOODCOURT50')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-semibold text-neutral-300 hover:text-white transition cursor-pointer"
                      >
                        FOODCOURT50 <span className="text-emerald-400">(₹50 OFF)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPromoCode('WELCOME10')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-semibold text-neutral-300 hover:text-white transition cursor-pointer"
                      >
                        WELCOME10 <span className="text-emerald-400">(10% OFF)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cart Summary Card */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-2xl relative">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                    <Receipt className="w-5 h-5 text-red-500" />
                    <h2 className="text-base font-extrabold text-white">
                      Bill Summary
                    </h2>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300">
                      {totalItemsCount} items
                    </span>
                  </div>

                  {/* Summary Breakdown Rows */}
                  <div className="space-y-3 text-xs text-neutral-300">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Item Total</span>
                      <span className="font-semibold text-white">₹{subtotal}</span>
                    </div>

                    {/* Delivery Fee */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Delivery Charges</span>
                        {deliveryFee === 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                            FREE
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-white">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-400">₹0</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    {/* Delivery threshold tip */}
                    {subtotal < 500 && subtotal > 0 && (
                      <p className="text-[10px] text-amber-400/90 font-medium">
                        Add ₹{500 - subtotal} more to qualify for FREE delivery!
                      </p>
                    )}

                    {/* Restaurant Taxes */}
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Restaurant GST & Taxes (5%)</span>
                      <span className="font-semibold text-white">₹{tax}</span>
                    </div>

                    {/* Packaging & Platform */}
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Packaging & Service Charge</span>
                      <span className="font-semibold text-white">₹{packagingFee}</span>
                    </div>

                    {/* Discount row if applicable */}
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-400 font-semibold pt-1 border-t border-neutral-800/60">
                        <span>Coupon Discount ({promoCode})</span>
                        <span>- ₹{discountAmount}</span>
                      </div>
                    )}

                    {/* Total Price Row */}
                    <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-neutral-400 uppercase font-bold block">
                          Grand Total
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          Inclusive of all applicable taxes
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-white block">
                          ₹{totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition cursor-pointer active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Orders replicate directly into Dashboard metrics</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Clear Shopping Cart?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to remove all {totalItemsCount} dishes from your cart? This cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setIsConfirmClearOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
