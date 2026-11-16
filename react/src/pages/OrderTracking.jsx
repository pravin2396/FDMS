import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useOrder } from '../context/OrderContext';
import {
  Clock,
  MapPin,
  ShoppingBag,
  CreditCard,
  Copy,
  Printer,
  ArrowLeft,
  UtensilsCrossed,
  ChefHat,
  Bike,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  Receipt,
  User,
  Store,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Play,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, cancelOrder, simulateNextStatus, orders } = useOrder();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Cancel order modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of delivery plans');

  // Retrieve current order
  const order = getOrderById(orderId) || orders[0];

  // Helper to copy Order ID
  const handleCopyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      toast.success(`Copied Order ID: ${order.id}`);
    }
  };

  // Confirm cancel order
  const handleConfirmCancel = () => {
    if (order?.id) {
      cancelOrder(order.id, cancelReason);
      setIsCancelModalOpen(false);
    }
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
            activeTab="orders"
            onSelectTab={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 p-8 flex items-center justify-center bg-neutral-950">
            <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Order Not Found</h2>
              <p className="text-xs text-neutral-400">
                Could not find active tracking details for Order: <span className="text-red-400 font-mono">{orderId}</span>
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  to="/orders"
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                >
                  View All Orders
                </Link>
                <Link
                  to="/menu"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Calculate status badge style and text
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Preparing':
        return {
          bg: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
          dot: 'bg-amber-400 animate-ping',
          icon: ChefHat,
          label: 'Preparing in Kitchen',
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-950/60 text-blue-400 border-blue-500/40',
          dot: 'bg-blue-400 animate-ping',
          icon: Bike,
          label: 'Out for Delivery',
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
          label: 'Delivered Successfully',
        };
      case 'Cancelled':
        return {
          bg: 'bg-red-950/60 text-red-400 border-red-500/40',
          dot: 'bg-red-500',
          icon: XCircle,
          label: 'Order Cancelled',
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
          dot: 'bg-neutral-400',
          icon: Clock,
          label: status,
        };
    }
  };

  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;

  // Timeline stages definition
  const stages = [
    { key: 'Placed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'Preparing', label: 'Preparing', icon: ChefHat },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  // Helper to determine step completion index
  const getStepProgressIndex = () => {
    if (order.status === 'Cancelled') return -1;
    if (order.status === 'Delivered') return 4;
    if (order.status === 'Out for Delivery') return 3;
    if (order.status === 'Preparing') return 2;
    return 1;
  };

  const currentStepIndex = getStepProgressIndex();

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
          activeTab="orders"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Top Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Link to="/orders" className="hover:text-white transition flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>My Orders</span>
                </Link>
                <span>/</span>
                <span className="text-neutral-300 font-mono">{order.id}</span>
                <span>/</span>
                <span className="text-red-400 font-semibold">Live Tracking</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Track Order
                </h1>
                {/* Live Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${statusBadge.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></span>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{statusBadge.label}</span>
                </span>
              </div>
            </div>

            {/* Quick Actions & Order ID */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-bold text-red-400">{order.id}</span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="p-1 hover:text-white text-neutral-400 transition cursor-pointer"
                  title="Copy Order ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition cursor-pointer"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Interactive Simulation & Quick Status Switcher Bar */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-white">Live Status Simulator:</span>
              <span className="text-[11px] text-neutral-400 hidden sm:inline">
                Test and advance the order through all 4 stages in real time
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Advance Status Button */}
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <button
                  type="button"
                  onClick={() => simulateNextStatus(order.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    Advance to{' '}
                    {order.status === 'Preparing' ? 'Out for Delivery' : 'Delivered'}
                  </span>
                </button>
              )}

              {/* Status Pills */}
              {['Preparing', 'Out for Delivery', 'Delivered'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateOrderStatus(order.id, st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                    order.status === st
                      ? 'bg-neutral-800 text-white border-neutral-600 shadow'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}

              {/* Cancel Button */}
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 transition cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Main 2-Column Tracking Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Tracking Timeline & Progress (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Estimated Delivery Hero Card */}
              {order.status !== 'Cancelled' ? (
                <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                        {order.status === 'Delivered' ? (
                          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        ) : order.status === 'Out for Delivery' ? (
                          <Bike className="w-8 h-8 text-blue-400 animate-bounce" />
                        ) : (
                          <ChefHat className="w-8 h-8 text-amber-400 animate-pulse" />
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-400 block">
                          Estimated Delivery Time
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white">
                            {order.status === 'Delivered'
                              ? 'Delivered'
                              : order.estimatedDelivery?.minutesRange || '20-30 mins'}
                          </span>
                          {order.status !== 'Delivered' && (
                            <span className="text-xs text-emerald-400 font-bold">
                              (~{order.estimatedDelivery?.estimatedClockTime})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left sm:text-right self-start sm:self-auto">
                      <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
                        Drop-off Point
                      </span>
                      <span className="text-xs font-bold text-white block">
                        {order.deliveryAddress?.street}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {order.deliveryAddress?.city}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-semibold text-neutral-400">
                      <span>Order Progress</span>
                      <span className="text-red-400 font-bold">
                        {order.status === 'Delivered'
                          ? '100% Completed'
                          : order.status === 'Out for Delivery'
                          ? '75% En Route'
                          : order.status === 'Preparing'
                          ? '40% Cooking'
                          : '15% Placed'}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500 w-full'
                            : order.status === 'Out for Delivery'
                            ? 'bg-blue-500 w-3/4'
                            : order.status === 'Preparing'
                            ? 'bg-amber-500 w-2/5'
                            : 'bg-red-500 w-1/6'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Cancelled Order Notice */
                <div className="p-6 rounded-3xl bg-red-950/30 border border-red-800/60 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-white">This Order Was Cancelled</h3>
                      <p className="text-xs text-red-300">
                        Reason: {order.cancellationReason || 'Requested by customer'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                    <span className="font-semibold text-white">Refund Status: </span>
                    <span className="text-emerald-400">
                      {order.paymentStatus || 'Full refund initiated to original payment source (3-5 business days).'}
                    </span>
                  </div>
                </div>
              )}

              {/* Order Tracking Timeline Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-white">Order Tracking Timeline</h2>
                      <p className="text-[11px] text-neutral-400">
                        Live updates from kitchen and courier
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical Step Timeline */}
                {order.status !== 'Cancelled' ? (
                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-800">
                    {/* Stage 1: Order Placed */}
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-neutral-900 ${
                          currentStepIndex >= 1
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        ✓
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Order Confirmed</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 font-semibold">
                            {order.orderTime || '09:45 AM'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Order accepted and verified by {order.restaurant || 'Food Court Kitchen'}.
                        </p>
                      </div>
                    </div>

                    {/* Stage 2: Preparing in Kitchen */}
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-neutral-900 ${
                          order.status === 'Preparing'
                            ? 'bg-amber-500 text-neutral-950 animate-pulse'
                            : currentStepIndex >= 2
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              order.status === 'Preparing' ? 'text-amber-400' : 'text-white'
                            }`}
                          >
                            Kitchen Preparing
                          </span>
                          {order.status === 'Preparing' && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40 font-bold animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">
                          Chef is baking, tossing, and assembling your fresh dishes.
                        </p>
                        {order.chefInstructions && order.chefInstructions !== 'None' && (
                          <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-amber-300 italic">
                            Chef Note: "{order.chefInstructions}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage 3: Out for Delivery */}
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-neutral-900 ${
                          order.status === 'Out for Delivery'
                            ? 'bg-blue-500 text-white animate-bounce'
                            : currentStepIndex >= 3
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              order.status === 'Out for Delivery' ? 'text-blue-400' : 'text-white'
                            }`}
                          >
                            Out for Delivery
                          </span>
                          {order.status === 'Out for Delivery' && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-950 text-blue-400 border border-blue-500/40 font-bold">
                              En Route
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">
                          {order.deliveryPartner
                            ? `${order.deliveryPartner.name} picked up your hot food package and is en route.`
                            : 'Courier partner is bringing the meal to your table/location.'}
                        </p>
                      </div>
                    </div>

                    {/* Stage 4: Delivered */}
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-neutral-900 ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {order.status === 'Delivered' ? '✓' : '4'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              order.status === 'Delivered' ? 'text-emerald-400' : 'text-neutral-400'
                            }`}
                          >
                            Delivered
                          </span>
                          {order.status === 'Delivered' && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 font-bold">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">
                          Food package delivered. Bon appetit!
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Cancelled Timeline */
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-red-800/60">
                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-6 sm:-left-8 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">Order Placed</span>
                        <p className="text-xs text-neutral-400">{order.orderTime}</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-6 sm:-left-8 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                        ✕
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-red-400 text-sm">Order Cancelled</span>
                        <p className="text-xs text-neutral-300">
                          {order.cancellationReason || 'Cancelled upon customer request.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Partner Profile Card */}
              {order.deliveryPartner && order.status !== 'Cancelled' && (
                <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={order.deliveryPartner.avatar}
                      alt={order.deliveryPartner.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-neutral-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">
                          {order.deliveryPartner.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 font-bold">
                          ★ {order.deliveryPartner.rating || 4.9}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Express Food Court Courier • {order.deliveryPartner.vehicle}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-800/80 text-neutral-300 border border-neutral-700/80 text-xs font-semibold self-start sm:self-auto select-none">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Courier</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Details & Bill Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Details Header Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-red-500" />
                    <h3 className="text-base font-extrabold text-white">Order Details</h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-semibold">
                    {order.orderDate}
                  </span>
                </div>

                {/* Restaurant & Customer Info */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase font-bold">
                      <Store className="w-3.5 h-3.5 text-red-500" />
                      <span>Prepared By</span>
                    </div>
                    <span className="font-bold text-white text-sm block">
                      {order.restaurant || 'Food Court Central Kitchen'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase font-bold">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>Delivery Location</span>
                    </div>
                    <span className="font-bold text-white block">
                      {order.deliveryAddress?.fullName || order.customerName} (
                      {order.deliveryAddress?.phone || order.customerPhone})
                    </span>
                    <p className="text-neutral-300">
                      {order.deliveryAddress?.street}
                      {order.deliveryAddress?.landmark ? `, ${order.deliveryAddress.landmark}` : ''}
                    </p>
                    <p className="text-neutral-400">
                      {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                    </p>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider block">
                    Dishes ({order.items?.length || 1})
                  </span>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {order.items?.map((dish, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800"
                      >
                        <div className="flex items-center gap-2.5">
                          {dish.image && (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-bold text-white text-xs block line-clamp-1">
                              {dish.name}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              ₹{dish.price} × {dish.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-white text-xs">
                          ₹{dish.price * dish.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Breakdown */}
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
                    <span className="text-neutral-400">Restaurant Taxes (5% GST)</span>
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
                        Total Amount
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Paid via {order.paymentMethod}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-white">
                      ₹{order.billBreakdown?.grandTotal || order.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Back Buttons */}
              <div className="space-y-2">
                <Link
                  to="/orders"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                  <span>View All Order History</span>
                </Link>

                <Link
                  to="/menu"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Order More Food</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-950/60 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cancel Order?</h3>
                <p className="text-xs text-neutral-400">Order #{order.id}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to cancel this order? If you cancel, your order will be stopped immediately and a full refund will be processed.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-neutral-400 block">
                Reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Change of delivery plans">Change of delivery plans</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Taking too long">Taking too long</option>
                <option value="Changed food preference">Changed food preference</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30 cursor-pointer"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
