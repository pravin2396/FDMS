import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  ShoppingBag,
  X,
} from 'lucide-react';

const RecentOrdersTable = ({ orders = [], onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Status Badge styling helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 animate-spin" />
            Preparing
          </span>
        );
      case 'On the Way':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Bike className="w-3 h-3" />
            On the Way
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
            {status}
          </span>
        );
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') {
      return order.status === 'Preparing' || order.status === 'On the Way';
    }
    return order.status === filterStatus;
  });

  const statuses = ['All', 'Active', 'Preparing', 'On the Way', 'Delivered', 'Cancelled'];

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 sm:p-6 border-b border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Recent Food Delivery Orders
              </h2>
            </div>
            <p className="text-neutral-400 text-xs mt-1">
              Real-time feed of kitchen orders, dispatch tracking, and delivery progress.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by order ID, customer, restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950/70 border-b border-neutral-800/80 text-neutral-400 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">Order ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Restaurant</th>
              <th className="py-3.5 px-4">Order Items</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Time</th>
              <th className="py-3.5 px-4 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-neutral-200 font-sans">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-400">
                  <p className="text-sm font-semibold">No orders found matching the filter.</p>
                  <p className="text-xs text-neutral-500 mt-1">Try resetting search or filters.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-800/50 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white whitespace-nowrap">
                    <span className="font-mono text-red-400">{order.id}</span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={order.avatar}
                        alt={order.customerName}
                        className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                      />
                      <span className="font-medium text-white">{order.customerName}</span>
                    </div>
                  </td>

                  {/* Restaurant */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-neutral-300">
                    {order.restaurant}
                  </td>

                  {/* Order Items */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-neutral-400" title={order.items}>
                    {order.items}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-white">
                    ₹{order.amount.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {renderStatusBadge(order.status)}
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-neutral-400 text-[11px]">
                    {order.time}
                  </td>

                  {/* Actions / Change Status Dropdown */}
                  <td className="py-3.5 px-4 text-right relative whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(order.id, e.target.value)}
                        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-[11px] font-medium rounded-lg px-2 py-1 outline-none focus:border-red-500 cursor-pointer transition"
                      >
                        <option value="Preparing">Preparing</option>
                        <option value="On the Way">On the Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
