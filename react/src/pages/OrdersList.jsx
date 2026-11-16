import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useOrder } from '../context/OrderContext';
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
} from 'lucide-react';

const OrdersList = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Status categories
  const statuses = ['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  // Filtered orders list
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
        if (!matchId && !matchRest && !matchCust && !matchItems) {
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

  // Find if there is an active order (Preparing or Out for Delivery)
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
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <Clock className="w-7 h-7 text-red-500" />
                <span>Order History & Tracking</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Track live food preparation, delivery progress, and past order receipts
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition self-start sm:self-auto cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Order Food</span>
            </Link>
          </div>

          {/* Active Order Spotlight Banner */}
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
                      Active Order: {activeOrder.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40 font-bold animate-pulse">
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5 line-clamp-1">
                    {activeOrder.itemsSummary}
                  </p>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                    Estimated Arrival: ~{activeOrder.estimatedDelivery?.minutesRange || '20 mins'}
                  </span>
                </div>
              </div>

              <Link
                to={`/track/${activeOrder.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition self-start sm:self-auto cursor-pointer"
              >
                <span>Live Tracking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Search Bar & Status Filter Tabs */}
          <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by Order ID, dish name, or restaurant..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-800">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1">
                Filter Status:
              </span>
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards List */}
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 shadow-xl transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Card Header: Order ID & Status */}
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-red-400 text-sm">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-neutral-400 block">
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

                      {/* Restaurant & Summary */}
                      <div className="py-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {order.restaurant || 'Food Court Central Kitchen'}
                          </span>
                          <span className="text-xs font-black text-white">
                            ₹{order.billBreakdown?.grandTotal || order.amount}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                          {order.itemsSummary ||
                            order.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            {order.deliveryAddress?.street || 'Food Court Dine-in'}
                          </span>
                          <span>•</span>
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        {order.status === 'Delivered'
                          ? 'Order delivered'
                          : order.status === 'Cancelled'
                          ? 'Order cancelled'
                          : `ETA: ~${order.estimatedDelivery?.minutesRange || '20 mins'}`}
                      </span>

                      <Link
                        to={`/track/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-red-600 text-neutral-200 hover:text-white border border-neutral-700 hover:border-red-500 text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        <span>Track Order</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Orders Found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                No orders match your current search or status filter. Try resetting filters or place a new food order.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold mr-2"
                >
                  Reset Filters
                </button>
                <Link
                  to="/menu"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrdersList;
