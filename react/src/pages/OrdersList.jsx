import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import {
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
  UtensilsCrossed,
  ChefHat,
  Bike,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  RotateCcw,
  FileText,
  Download,
  Printer,
  X,
  CreditCard,
  Building,
  Store,
  Eye,
  Check,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrdersList = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { addToCart } = useCart();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal states: Details Modal & Invoice Modal
  const [detailsModalOrder, setDetailsModalOrder] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Status categories with dynamic order counts
  const statusCounts = useMemo(() => {
    return {
      All: orders.length,
      Preparing: orders.filter((o) => o.status === 'Preparing').length,
      'Out for Delivery': orders.filter((o) => o.status === 'Out for Delivery').length,
      Delivered: orders.filter((o) => o.status === 'Delivered').length,
      Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };
  }, [orders]);

  const statuses = ['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  // Filtered orders list based on status and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status filter
      if (selectedStatus !== 'All' && order.status !== selectedStatus) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = String(order.id).toLowerCase().includes(query);
        const matchRest = String(order.restaurant || '').toLowerCase().includes(query);
        const matchCust = String(order.customerName || '').toLowerCase().includes(query);
        const matchItems = String(order.itemsSummary || '').toLowerCase().includes(query);
        const matchDishes = order.items?.some((i) => i.name.toLowerCase().includes(query));
        if (!matchId && !matchRest && !matchCust && !matchItems && !matchDishes) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Preparing':
        return {
          bg: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
          dot: 'bg-amber-400 animate-ping',
          icon: ChefHat,
          label: 'Preparing',
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
          label: 'Delivered',
        };
      case 'Cancelled':
        return {
          bg: 'bg-red-950/60 text-red-400 border-red-500/40',
          dot: 'bg-red-500',
          icon: XCircle,
          label: 'Cancelled',
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

  // Reorder Action: Adds all items from the past order back into active cart
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      // Fallback item if not explicitly structured
      addToCart(
        {
          id: `food-reorder-${Date.now()}`,
          name: order.itemsSummary || 'Meal Combo Box',
          price: order.amount || 299,
          quantity: 1,
          category: 'Main Course',
        },
        1,
        order.restaurant || 'Food Court Kitchen'
      );
      toast.success(`Reordered item from Order #${order.id}! Added to cart.`);
      navigate('/cart');
      return;
    }

    // Add each dish into cart
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id || `reorder-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          category: item.category || 'Specialty',
          isVeg: item.isVeg,
        },
        item.quantity || 1,
        order.restaurant || 'Food Court Kitchen'
      );
    });

    toast.success(
      `Added ${order.items.length} items from Order #${order.id} to your cart!`
    );
    navigate('/cart');
  };

  // Download Invoice (UI Only Simulation)
  const handleDownloadInvoice = (order) => {
    setIsDownloadingPdf(true);
    toast.info(`Generating official tax invoice for ${order.id}...`);

    setTimeout(() => {
      setIsDownloadingPdf(false);
      toast.success(
        `Invoice_${order.id}.pdf downloaded successfully! (Check Downloads)`
      );
    }, 1000);
  };

  // Print invoice helper
  const handlePrintInvoice = () => {
    window.print();
  };

  // Find active ongoing order for the top banner
  const activeOrder = orders.find(
    (o) => o.status === 'Preparing' || o.status === 'Out for Delivery'
  );

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
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <Clock className="w-7 h-7 text-red-500" />
                <span>Order History & Previous Orders</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                View all past orders, search history, reorder favorite meals, and download tax invoices
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-semibold transition"
              >
                <ShoppingBag className="w-4 h-4 text-red-400" />
                <span>View Cart</span>
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Order New Food</span>
              </Link>
            </div>
          </div>

          {/* Active Order Spotlight Banner (if an order is currently active) */}
          {activeOrder && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-red-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                  {activeOrder.status === 'Preparing' ? (
                    <ChefHat className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Bike className="w-6 h-6 animate-bounce" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">
                      Active Order in Progress: {activeOrder.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40 font-bold animate-pulse">
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5 line-clamp-1">
                    {activeOrder.itemsSummary ||
                      activeOrder.items?.map((i) => i.name).join(', ')}
                  </p>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                    Estimated Arrival: ~{activeOrder.estimatedDelivery?.minutesRange || '20 mins'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDetailsModalOrder(activeOrder)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition cursor-pointer"
                >
                  Details
                </button>
                <Link
                  to={`/track/${activeOrder.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
                >
                  <span>Live Tracking</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Search Orders & Filter by Status Bar */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
            {/* Search Input Bar with interactive clear 'X' */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by Order ID (e.g. 8919), dish name, or restaurant..."
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-full hover:bg-neutral-800 transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Status Pills with live counts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter by Status:</span>
              </div>

              {statuses.map((status) => {
                const count = statusCounts[status] || 0;
                const isSelected = selectedStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-800'
                    }`}
                  >
                    <span>{status}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? 'bg-red-800 text-white'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders Grid / Cards List */}
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;
                const totalDishes =
                  order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 shadow-xl transition flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Header: Order ID, Date & Status */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-red-400 text-sm">
                              {order.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-semibold">
                              {order.paymentMethod || 'Online'}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-400 block mt-0.5">
                            {order.orderDate} at {order.orderTime}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      {/* Restaurant & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {order.restaurant || 'Food Court Central Kitchen'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 block">Total Paid</span>
                          <span className="text-sm font-black text-white">
                            ₹{order.billBreakdown?.grandTotal || order.amount}
                          </span>
                        </div>
                      </div>

                      {/* Items Summary with thumbnails */}
                      <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>Items ({totalDishes})</span>
                          {order.billBreakdown?.promoCode && (
                            <span className="text-emerald-400 font-semibold">
                              Coupon {order.billBreakdown.promoCode} applied
                            </span>
                          )}
                        </div>

                        {/* Dishes list preview */}
                        <p className="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed">
                          {order.itemsSummary ||
                            order.items?.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ')}
                        </p>
                      </div>

                      {/* Location & Delivery Drop-off */}
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="truncate">
                          {order.deliveryAddress?.street || 'Food Court Table #08'}
                          {order.deliveryAddress?.city ? `, ${order.deliveryAddress.city}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Bar: Reorder, Order Details, Download Invoice, Track */}
                    <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* 1. Reorder Button */}
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
                          title="Add these dishes back to cart"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>

                        {/* 2. Order Details Button */}
                        <button
                          type="button"
                          onClick={() => setDetailsModalOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
                          title="View complete itemized order details"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Details</span>
                        </button>

                        {/* 3. Download Invoice Button */}
                        <button
                          type="button"
                          onClick={() => setInvoiceModalOrder(order)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700 transition cursor-pointer"
                          title="View and download invoice receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline">Invoice</span>
                        </button>
                      </div>

                      {/* 4. Track Link */}
                      <Link
                        to={`/track/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer transition"
                      >
                        <span>Tracking</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4 shadow-xl">
              <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Previous Orders Found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                No orders match your current search or status filter. Try resetting filters or place a delicious new meal order.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                >
                  Reset Filters
                </button>
                <Link
                  to="/menu"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: COMPLETE ORDER DETAILS MODAL */}
      {detailsModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-extrabold text-white">Order Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Header Summary */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-bold text-red-400">{detailsModalOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Date & Time:</span>
                <span className="text-white font-medium">
                  {detailsModalOrder.orderDate} at {detailsModalOrder.orderTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Restaurant:</span>
                <span className="text-white font-semibold">{detailsModalOrder.restaurant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery Address:</span>
                <span className="text-white">
                  {detailsModalOrder.deliveryAddress?.street || 'Food Court Dine-in'},{' '}
                  {detailsModalOrder.deliveryAddress?.city || 'Chennai'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payment Status:</span>
                <span className="text-emerald-400 font-bold">
                  {detailsModalOrder.paymentStatus || 'Paid Online'} ({detailsModalOrder.paymentMethod})
                </span>
              </div>
            </div>

            {/* Itemized Dishes List */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Dishes in this Order:
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {detailsModalOrder.items?.map((dish, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs"
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
                        <span className="font-bold text-white block line-clamp-1">
                          {dish.name}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          ₹{dish.price} × {dish.quantity || 1}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      ₹{dish.price * (dish.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="pt-3 border-t border-neutral-800 space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal:</span>
                <span>₹{detailsModalOrder.billBreakdown?.subtotal || detailsModalOrder.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery Fee:</span>
                <span>
                  {detailsModalOrder.billBreakdown?.deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    `₹${detailsModalOrder.billBreakdown?.deliveryFee || 0}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Restaurant Taxes (5% GST):</span>
                <span>₹{detailsModalOrder.billBreakdown?.tax || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Packaging Fee:</span>
                <span>₹{detailsModalOrder.billBreakdown?.packagingFee || 0}</span>
              </div>
              {detailsModalOrder.billBreakdown?.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount ({detailsModalOrder.billBreakdown.promoCode}):</span>
                  <span>- ₹{detailsModalOrder.billBreakdown.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-neutral-800 font-extrabold text-sm text-white">
                <span>Grand Total:</span>
                <span>₹{detailsModalOrder.billBreakdown?.grandTotal || detailsModalOrder.amount}</span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setDetailsModalOrder(null);
                  setInvoiceModalOrder(detailsModalOrder);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View Tax Invoice</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  to={`/track/${detailsModalOrder.id}`}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition"
                >
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Tracking</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setDetailsModalOrder(null);
                    handleReorder(detailsModalOrder);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder Dishes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DOWNLOAD INVOICE (UI ONLY) MODAL */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6 animate-in fade-in max-h-[92vh] overflow-y-auto print:bg-white print:text-black">
            {/* Invoice Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">Official Tax Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceModalOrder(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Tax Invoice Container */}
            <div className="space-y-5 p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              {/* Brand & Invoice Meta */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-base font-black text-white tracking-wide">
                    FOOD DELIVERY MANAGEMENT SYSTEM
                  </h2>
                  <p className="text-[11px] text-neutral-400">
                    Central Food Court Kitchens & Deliveries
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    GSTIN: 33AAAAA0000A1Z5 • FSSAI Lic: 12421008000412
                  </p>
                </div>

                <div className="sm:text-right font-mono">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Invoice No
                  </span>
                  <span className="text-xs font-black text-red-400">
                    INV-2026-{invoiceModalOrder.orderNumber || '8919'}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Date: {invoiceModalOrder.orderDate}
                  </span>
                </div>
              </div>

              {/* Billed To Details */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Billed To:
                  </span>
                  <span className="font-bold text-white block mt-0.5">
                    {invoiceModalOrder.deliveryAddress?.fullName ||
                      invoiceModalOrder.customerName ||
                      'Pravin Kumar'}
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    {invoiceModalOrder.deliveryAddress?.street || 'Food Court Table #08'}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Phone: {invoiceModalOrder.customerPhone || '9876543210'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Restaurant:
                  </span>
                  <span className="font-bold text-white block mt-0.5">
                    {invoiceModalOrder.restaurant || 'Food Court Central Kitchen'}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    Payment Mode: {invoiceModalOrder.paymentMethod || 'Online UPI'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    Status: {invoiceModalOrder.paymentStatus || 'Paid (Verified)'}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Description of Food Services:
                </span>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase">
                      <th className="py-1">Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Rate</th>
                      <th className="py-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {invoiceModalOrder.items?.map((dish, i) => (
                      <tr key={i}>
                        <td className="py-1.5 font-medium text-white">{dish.name}</td>
                        <td className="py-1.5 text-center">{dish.quantity || 1}</td>
                        <td className="py-1.5 text-right">₹{dish.price}</td>
                        <td className="py-1.5 text-right font-bold text-white">
                          ₹{dish.price * (dish.quantity || 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Calculations */}
              <div className="pt-3 border-t border-neutral-800 space-y-1 text-right text-[11px] text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">
                    ₹{invoiceModalOrder.billBreakdown?.subtotal || invoiceModalOrder.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="text-white">
                    {invoiceModalOrder.billBreakdown?.deliveryFee === 0 ? 'FREE' : `₹${invoiceModalOrder.billBreakdown?.deliveryFee || 0}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (2.5%):</span>
                  <span className="text-white">
                    ₹{Math.round((invoiceModalOrder.billBreakdown?.tax || 28) / 2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (2.5%):</span>
                  <span className="text-white">
                    ₹{Math.round((invoiceModalOrder.billBreakdown?.tax || 28) / 2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sanitary Packaging Fee:</span>
                  <span className="text-white">
                    ₹{invoiceModalOrder.billBreakdown?.packagingFee || 15}
                  </span>
                </div>
                {invoiceModalOrder.billBreakdown?.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Savings ({invoiceModalOrder.billBreakdown.promoCode}):</span>
                    <span>- ₹{invoiceModalOrder.billBreakdown.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-neutral-800 text-xs font-black text-white">
                  <span>Total Invoice Amount (INR):</span>
                  <span className="text-sm font-black text-emerald-400">
                    ₹{invoiceModalOrder.billBreakdown?.grandTotal || invoiceModalOrder.amount}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 text-center pt-2 border-t border-neutral-800">
                This is a computer-generated tax invoice and does not require a physical signature.
              </div>
            </div>

            {/* Invoice Download Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-neutral-400" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadInvoice(invoiceModalOrder)}
                disabled={isDownloadingPdf}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer"
              >
                {isDownloadingPdf ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Invoice (PDF)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
