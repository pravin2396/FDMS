import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  ShoppingBag,
  X,
  ExternalLink,
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
    <div className="h-full flex flex-col rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-lg overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-2.5 sm:p-3 border-b border-neutral-800 space-y-2 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-red-600/20 text-red-500">
              <ShoppingBag className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-bold text-white tracking-tight">
              Recent Food Delivery Orders
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-6 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-[11px] text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <Search className="w-3 h-3 text-neutral-500 absolute left-2 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-red-600 text-white shadow-xs font-semibold'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950/80 border-b border-neutral-800/80 text-neutral-400 uppercase tracking-wider text-[10px] font-semibold sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Restaurant</th>
              <th className="py-2 px-3">Order Items</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-neutral-200 font-sans">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">
                  <p className="text-xs font-semibold">No orders found matching the filter.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-800/40 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">
                    <span className="font-mono text-red-400 text-[11px]">{order.id}</span>
                  </td>

                  {/* Customer */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={order.avatar}
                        alt={order.customerName}
                        className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                      />
                      <span className="font-medium text-white text-xs">{order.customerName}</span>
                    </div>
                  </td>

                  {/* Restaurant */}
                  <td className="py-2 px-3 whitespace-nowrap font-medium text-neutral-300 text-xs">
                    {order.restaurant}
                  </td>

                  {/* Order Items */}
                  <td className="py-2 px-3 max-w-[130px] truncate text-neutral-400 text-[11px]" title={order.items}>
                    {order.items}
                  </td>

                  {/* Amount */}
                  <td className="py-2 px-3 whitespace-nowrap font-bold text-white text-xs">
                    ₹{order.amount.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    {renderStatusBadge(order.status)}
                  </td>

                  {/* Actions / Change Status Dropdown & Track Link */}
                  <td className="py-2 px-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/track/${order.id}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white border border-neutral-700 hover:border-red-500 text-[10px] font-semibold transition cursor-pointer"
                        title="View Live Order Tracking"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Track</span>
                      </Link>

                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(order.id, e.target.value)}
                        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-[10px] font-medium rounded px-1.5 py-0.5 outline-none focus:border-red-500 cursor-pointer transition"
                      >
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
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
