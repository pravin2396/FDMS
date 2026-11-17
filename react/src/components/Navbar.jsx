import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, Utensils, Menu, X, ShoppingBag } from 'lucide-react';

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { totalItemsCount, subtotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if current route is part of Customer Portal or Admin Portal
  const isCustomerPortal = [
    '/profile',
    '/orders',
    '/order-history',
    '/track',
    '/cart',
    '/checkout',
    '/order-confirmation',
    '/payment',
  ].some((prefix) => location.pathname.startsWith(prefix));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Sidebar Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none transition cursor-pointer"
              title="Toggle Sidebar"
              aria-label="Toggle navigation sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="food-court-title text-2xl font-bold tracking-wide">
                Food Court
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-red-400 font-semibold -mt-1">
                Delivery Management
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Cart Badge, Admin / User Pill and Logout Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cart Live Action Link */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 transition cursor-pointer group shadow-sm"
            title="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-neutral-300 group-hover:text-red-400 transition-colors" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse shadow-md shadow-red-600/50">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold hidden md:inline">
              Cart
            </span>
            {totalItemsCount > 0 && (
              <span className="text-[11px] font-bold text-amber-400 hidden lg:inline">
                ₹{subtotal}
              </span>
            )}
          </Link>

          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Profile Badge Link: Admin Profile Badge in Admin Portal, Customer Profile Badge in Customer Portal */}
              <Link
                to="/profile"
                className="flex items-center gap-2 sm:gap-2.5 bg-neutral-800/90 hover:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700 hover:border-red-500/50 transition cursor-pointer group shadow-sm"
                title={isCustomerPortal ? "View & Edit Customer Profile" : "Admin Profile Badge"}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user.name}
                  className={`w-7 h-7 rounded-full object-cover border group-hover:scale-105 transition ${
                    isCustomerPortal ? 'border-emerald-500' : 'border-red-500'
                  }`}
                />
                <div className="text-left text-xs leading-none">
                  <span className="font-semibold text-white group-hover:text-red-400 transition block leading-tight">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-neutral-400 text-[10px]">@{user.username}</span>
                    <span className="text-neutral-500 text-[10px]">•</span>
                    {isCustomerPortal ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase tracking-wide">
                        Customer
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-950 text-red-400 border border-red-500/40 uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-red-600 rounded-lg border border-neutral-700 hover:border-red-500 transition-all duration-200 cursor-pointer shadow-sm"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
