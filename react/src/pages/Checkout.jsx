import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plus,
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  Building,
  Receipt,
  Sparkles,
  Tag,
  CheckCircle,
  AlertCircle,
  UtensilsCrossed,
  ChefHat,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const {
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    removeAddress,
    calculateEstimatedDelivery,
    placeOrder,
  } = useOrder();

  // Sidebar responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Address form toggle & state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || 'Pravin Kumar',
    phone: '9876543210',
    type: 'Table / Dine-in',
    tag: 'Dine-in',
    street: '',
    landmark: '',
    city: 'Chennai',
    pincode: '600001',
  });

  // Payment Method state: 'UPI' | 'Card' | 'COD' | 'NetBanking'
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Chef instructions state
  const [chefInstructions, setChefInstructions] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promo coupon input
  const [couponInput, setCouponInput] = useState('');

  // Calculate estimated delivery
  const estimatedDelivery = calculateEstimatedDelivery(cartItems);

  // Handle adding new address
  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street.trim()) {
      toast.error('Please enter street or table details');
      return;
    }
    if (!newAddress.phone.trim() || newAddress.phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const created = addAddress(newAddress);
    setSelectedAddress(created);
    setShowNewAddressForm(false);
    setNewAddress({
      fullName: user?.name || 'Pravin Kumar',
      phone: '9876543210',
      type: 'Table / Dine-in',
      tag: 'Dine-in',
      street: '',
      landmark: '',
      city: 'Chennai',
      pincode: '600001',
    });
  };

  // Handle coupon apply
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput);
    setCouponInput('');
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    // 1. Prevent Empty Cart Checkout
    if (cartItems.length === 0) {
      toast.error('Cannot place order with an empty cart. Please add food items first.');
      navigate('/menu');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select or add a delivery address.');
      return;
    }

    // Direct to dedicated Payment page for interactive card/UPI/wallet payment
    if (paymentMethod === 'Card' || paymentMethod === 'UPI' || paymentMethod === 'Wallet') {
      navigate('/payment');
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic order placement transmission
    setTimeout(() => {
      const result = placeOrder({
        deliveryAddress: selectedAddress,
        paymentMethod,
        chefInstructions,
        customCustomerName: selectedAddress.fullName || user?.name || 'Pravin Kumar',
      });

      setIsSubmitting(false);

      if (result.success && result.order) {
        navigate(`/order-confirmation/${result.order.id}`);
      }
    }, 900);
  };

  // Empty cart guard view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <div className="flex-1 flex w-full relative">
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            activeTab="cart"
            onSelectTab={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-neutral-950">
            <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-5 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-950/40 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white">Your Cart is Empty</h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  You cannot proceed to checkout without items. Explore our delicious live dishes and food court menus to start ordering.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Browse Food Catalog</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab="cart"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Header & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Link to="/cart" className="hover:text-white transition flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Cart</span>
                </Link>
                <span>/</span>
                <span className="text-red-400 font-semibold">Secure Checkout</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <ShieldCheck className="w-7 h-7 text-red-500" />
                <span>Order Checkout</span>
              </h1>
            </div>

            {/* Estimated Delivery Fast Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Estimated Delivery Time
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  ~{estimatedDelivery.minutesRange} (By {estimatedDelivery.estimatedClockTime})
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Delivery Address & Payment Method (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Section 1: Delivery Address */}
              <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-white">Delivery Address</h2>
                      <p className="text-[11px] text-neutral-400">
                        Select food delivery drop-off point or table
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm((prev) => !prev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-400" />
                    <span>{showNewAddressForm ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                {/* New Address Form (Collapsible) */}
                {showNewAddressForm && (
                  <form
                    onSubmit={handleAddNewAddress}
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-red-500" />
                        Enter Address Details
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                          placeholder="e.g. Pravin Kumar"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                          Phone Number (10 digits)
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                          placeholder="e.g. 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                        Street Address / Table / Floor / Zone
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                        placeholder="e.g. Table #14, 2nd Floor Food Court or Flat 302, Green Valley"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          value={newAddress.landmark}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, landmark: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                          placeholder="Near juice bar"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, pincode: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Address Type Badges */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                        Address Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Table / Dine-in', 'Work', 'Home', 'Other'].map((typeOption) => (
                          <button
                            key={typeOption}
                            type="button"
                            onClick={() =>
                              setNewAddress({ ...newAddress, type: typeOption, tag: typeOption })
                            }
                            className={`px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                              newAddress.type === typeOption
                                ? 'bg-red-600 text-white border-red-500'
                                : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                            }`}
                          >
                            {typeOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30 cursor-pointer"
                      >
                        Save & Use Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Saved Address Cards Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-950/20 border-red-500 shadow-md shadow-red-950/20'
                            : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {/* Radio Circle */}
                            <div
                              className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-red-500 bg-red-600'
                                  : 'border-neutral-600 bg-transparent'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs">
                                  {addr.fullName}
                                </span>
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-semibold">
                                  {addr.type || 'Address'}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-300">
                                {addr.street}
                                {addr.landmark ? `, ${addr.landmark}` : ''}
                              </p>
                              <p className="text-[11px] text-neutral-400">
                                {addr.city} - {addr.pincode} • Phone: {addr.phone}
                              </p>
                            </div>
                          </div>

                          {savedAddresses.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAddress(addr.id);
                              }}
                              className="text-neutral-500 hover:text-red-400 p-1 transition cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Payment Method Selection */}
              <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl">
                <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Payment Method</h2>
                    <p className="text-[11px] text-neutral-400">
                      Select how you would like to pay for your food
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* UPI / QR Code */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      paymentMethod === 'UPI'
                        ? 'bg-red-950/20 border-red-500'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-red-400 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">
                        UPI / QR Code
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Google Pay, PhonePe, Paytm, BHIM
                      </span>
                    </div>
                  </div>

                  {/* Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      paymentMethod === 'Card'
                        ? 'bg-red-950/20 border-red-500'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-blue-400 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">
                        Credit / Debit Card
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Visa, MasterCard, RuPay
                      </span>
                    </div>
                  </div>

                  {/* Cash on Delivery / Counter */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      paymentMethod === 'COD'
                        ? 'bg-red-950/20 border-red-500'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">
                        Cash on Delivery
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Pay cash directly upon delivery
                      </span>
                    </div>
                  </div>

                  {/* Digital Wallet */}
                  <div
                    onClick={() => setPaymentMethod('Wallet')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      paymentMethod === 'Wallet'
                        ? 'bg-red-950/20 border-red-500'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-purple-400 shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">
                        Digital Wallets
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Express Wallet, Paytm, Amazon Pay
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Link to Dedicated Payment & Coupons Page */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-neutral-300">
                      Want interactive Card mockup, QR code scan, or wallet balances?
                    </span>
                  </div>
                  <Link
                    to="/payment"
                    className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-xs font-bold transition shrink-0"
                  >
                    Open Payment Gateway
                  </Link>
                </div>

                {/* Chef Special Notes */}
                <div className="pt-3 border-t border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ChefHat className="w-4 h-4 text-amber-400" />
                    <span>Special Kitchen Notes & Instructions (Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={chefInstructions}
                    onChange={(e) => setChefInstructions(e.target.value)}
                    placeholder="e.g. Extra spicy, no onions, pack cutlery, ring bell on delivery"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Bill Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Dishes in Order Card */}
              <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-extrabold text-white">
                      Order Items ({totalItemsCount})
                    </h3>
                  </div>
                  <Link
                    to="/cart"
                    className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Edit Cart
                  </Link>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white text-xs line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 block">
                            ₹{item.price} × {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-white text-xs">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Card */}
              <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Tag className="w-4 h-4 text-red-500" />
                  <span>Coupon Offer</span>
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
                      placeholder="e.g. FOODCOURT50"
                      className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 uppercase font-semibold focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Order Bill Summary */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-2xl">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                  <Receipt className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-extrabold text-white">Final Bill Summary</h3>
                </div>

                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Items Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Delivery Fee</span>
                    <span className="font-semibold text-white">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Restaurant Taxes (5% GST)</span>
                    <span className="font-semibold text-white">₹{tax}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Packaging Fee</span>
                    <span className="font-semibold text-white">₹{packagingFee}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400 font-semibold pt-1 border-t border-neutral-800/60">
                      <span>Coupon Discount</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase font-bold block">
                        Grand Total
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Payment via {paymentMethod}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                  </div>
                </div>

                {/* Place Order Primary Action Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-black text-sm shadow-xl shadow-red-600/30 transition cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Processing Food Court Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order • ₹{totalPrice}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-neutral-500">
                  By clicking Place Order, your order replicates in Dashboard Recent Orders.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Checkout;
