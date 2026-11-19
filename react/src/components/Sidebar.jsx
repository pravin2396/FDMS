import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const Sidebar = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  activeTab,
  onSelectTab,
}) => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { orders } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  const activeOrdersCount = orders?.filter(
    (o) => o.status === 'Preparing' || o.status === 'Out for Delivery'
  )?.length || 0;

  // Determine if current route is part of Customer Portal (all customer-facing routes) or Admin Portal (Dashboard /)
  const isCustomerPortal = location.pathname !== '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      id: 'restaurants',
      label: 'Restaurants',
      icon: Store,
      path: '/restaurants',
    },
    {
      id: 'menu',
      label: 'Food Menu',
      icon: UtensilsCrossed,
      path: '/menu',
    },
    {
      id: 'cart',
      label: 'Shopping Cart',
      icon: ShoppingBag,
      path: '/cart',
      badge: totalItemsCount > 0 ? totalItemsCount : null,
    },
    {
      id: 'orders',
      label: 'Order History',
      icon: Clock,
      path: '/orders',
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'profile',
      label: 'Customer Profile',
      icon: User,
      path: '/profile',
    },
  ];

  const handleNavClick = (item) => {
    if (onSelectTab) {
      onSelectTab(item.id);
    }
    navigate(item.path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar Container - Sticky on desktop */}
      <aside
        className={`fixed lg:sticky top-16 z-30 flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300 select-none h-[calc(100vh-4rem)] shrink-0 self-start ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Navigation Header */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Management Panel
              </span>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer ml-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrentActive =
              activeTab === item.id ||
              (item.path === '/' && location.pathname === '/') ||
              (item.path === '/restaurants' && location.pathname.startsWith('/restaurants')) ||
              (item.path === '/menu' && location.pathname.startsWith('/menu')) ||
              (item.path === '/cart' && location.pathname === '/cart');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group cursor-pointer relative ${
                  isCurrentActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="relative">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isCurrentActive ? 'text-white' : 'text-neutral-400 group-hover:text-red-400'
                    }`}
                  />
                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Profile Badge & Logout Button */}
        {user && (
          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60 shrink-0">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* User Profile Badge: Admin in Admin Portal, Customer in Customer Portal */}
                <div
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 bg-neutral-900/90 hover:bg-neutral-800 p-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition cursor-pointer group"
                  title={isCustomerPortal ? "View Customer Profile" : "Admin Profile Badge"}
                >
                  <img
                    src={
                      user.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={user.name}
                    className={`w-9 h-9 rounded-full object-cover border shrink-0 group-hover:scale-105 transition ${
                      isCustomerPortal ? 'border-emerald-500' : 'border-red-500'
                    }`}
                  />
                  <div className="text-left text-xs leading-none overflow-hidden flex-1">
                    <span className="font-semibold text-white group-hover:text-red-400 transition block truncate leading-tight">
                      {user.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-neutral-400 text-[10px] truncate">@{user.username}</span>
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
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-red-600 rounded-xl border border-neutral-800 hover:border-red-500 transition-all duration-200 cursor-pointer shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* Collapsed State: Avatar and Logout Icon */
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700 hover:border-red-500 transition cursor-pointer relative group"
                  title={`${user.name} (@${user.username}) - ${isCustomerPortal ? 'Customer' : 'Admin'}`}
                >
                  <img
                    src={
                      user.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-neutral-900 ${
                      isCustomerPortal ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-red-600 rounded-lg transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
