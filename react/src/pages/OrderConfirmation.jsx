import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useOrder } from '../context/OrderContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ShoppingBag,
  CreditCard,
  Copy,
  Printer,
  ArrowRight,
  UtensilsCrossed,
  ChefHat,
  LayoutDashboard,
  Sparkles,
  Phone,
  Receipt,
  Store,
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrderById, currentOrder } = useOrder();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Retrieve order details
  const order = getOrderById(orderId) || currentOrder;

  // Handle Copy Order ID
  const handleCopyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      toast.success(`Copied Order ID: ${order.id}`);
    }
  };

  // Handle Print Receipt
  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <div className="flex-1 flex w-full relative overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            activeTab="cart"
            onSelectTab={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
              <h2 className="text-xl font-bold text-white">Order Not Found</h2>
              <p className="text-xs text-neutral-400">
                Could not find details for Order ID: <span className="text-red-400">{orderId}</span>
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Browse Food Catalog
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full print:bg-white print:text-black">
      {/* Top Navbar (Hidden on print) */}
      <div className="print:hidden">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Sidebar (Hidden on print) */}
        <div className="print:hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            activeTab="cart"
            onSelectTab={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950 print:p-0 print:bg-white">
          {/* Success Banner Hero */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden shadow-2xl text-center space-y-4 print:border-neutral-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-400">
                  Order Confirmed & Sent to Kitchen
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Thank You For Your Order!
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
                  Your meal is currently being prepped with fresh ingredients in the food court kitchen.
                </p>
              </div>

              {/* Order ID Pill with Copy button */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-md">
                <span className="text-xs text-neutral-400">Order ID:</span>
                <span className="font-mono font-black text-red-400 text-sm tracking-wider">
                  {order.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="p-1 hover:text-white text-neutral-400 transition cursor-pointer print:hidden"
                  title="Copy Order ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons Top Bar (Hidden on print) */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 print:hidden">
                <Link
                  to={`/track/${order.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Live Order Tracking</span>
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition cursor-pointer shadow"
                >
                  <LayoutDashboard className="w-4 h-4 text-red-400" />
                  <span>Dashboard Orders</span>
                </Link>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4 text-neutral-400" />
                  <span>Print Receipt</span>
                </button>

                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 font-bold text-xs transition cursor-pointer shadow"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Order More Food</span>
                </Link>
              </div>
            </div>

            {/* Estimated Delivery Time Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Estimated Delivery Time
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {order.estimatedDelivery?.minutesRange || '25-35 mins'}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                      Expected by {order.estimatedDelivery?.estimatedClockTime || 'Soon'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400 block">Current Status:</span>
                <span className="text-xs font-bold text-amber-400 flex items-center sm:justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  Kitchen Preparing
                </span>
              </div>
            </div>

            {/* Live Order Tracker (4 Stages) */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">
                Order Tracking Status
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {/* Step 1: Placed */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/50 flex flex-col items-center text-center space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-xs font-bold text-white">Order Confirmed</span>
                  <span className="text-[10px] text-emerald-400">{order.orderTime || 'Just now'}</span>
                </div>

                {/* Step 2: Preparing */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/60 flex flex-col items-center text-center space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs animate-bounce">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-300">In Kitchen</span>
                  <span className="text-[10px] text-amber-400">Prepping Dish</span>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center space-y-1.5 opacity-60">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span className="text-xs font-bold text-neutral-400">On The Way</span>
                  <span className="text-[10px] text-neutral-500">Express Runner</span>
                </div>

                {/* Step 4: Delivered */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center space-y-1.5 opacity-60">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span className="text-xs font-bold text-neutral-400">Delivered</span>
                  <span className="text-[10px] text-neutral-500">Enjoy your meal!</span>
                </div>
              </div>
            </div>

            {/* Details Grid: Address, Payment, Special Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Delivery Location
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {order.deliveryAddress?.fullName || order.customerName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-semibold">
                      {order.deliveryAddress?.type || 'Dine-in'}
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    {order.deliveryAddress?.street}
                    {order.deliveryAddress?.landmark ? `, ${order.deliveryAddress.landmark}` : ''}
                  </p>
                  <p className="text-neutral-400">
                    {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-neutral-400">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Contact: {order.deliveryAddress?.phone || order.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Payment Summary
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Payment Mode</span>
                    <span className="font-bold text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Payment Status</span>
                    <span className="font-semibold text-emerald-400">
                      {order.paymentStatus || 'Verified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Order Placed On</span>
                    <span className="text-white">
                      {order.orderDate} at {order.orderTime}
                    </span>
                  </div>
                  {order.chefInstructions && order.chefInstructions !== 'None' && (
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                        Kitchen Notes:
                      </span>
                      <p className="text-neutral-300 italic mt-0.5">"{order.chefInstructions}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Itemized Order Receipt Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="text-base font-extrabold text-white">Itemized Receipt</h3>
                    <p className="text-[11px] text-neutral-400">
                      From: {order.restaurant || 'Food Court Central Kitchen'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-400">
                  {order.items?.length || 1} Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-bold text-white text-xs block">{item.name}</span>
                        <span className="text-[10px] text-neutral-400">
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="font-extrabold text-white text-xs">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Financial Breakdown */}
              <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-semibold text-white">
                    ₹{order.billBreakdown?.subtotal || order.amount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Delivery Fee</span>
                  <span className="font-semibold text-white">
                    {order.billBreakdown?.deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${order.billBreakdown?.deliveryFee || 0}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Restaurant GST (5%)</span>
                  <span className="font-semibold text-white">
                    ₹{order.billBreakdown?.tax || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Packaging Fee</span>
                  <span className="font-semibold text-white">
                    ₹{order.billBreakdown?.packagingFee || 0}
                  </span>
                </div>

                {order.billBreakdown?.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold pt-1 border-t border-neutral-800/60">
                    <span>Discount ({order.billBreakdown.promoCode})</span>
                    <span>- ₹{order.billBreakdown.discountAmount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-white block">
                      Total Paid Amount
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      All taxes & food court charges included
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white">
                    ₹{order.billBreakdown?.grandTotal || order.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderConfirmation;
