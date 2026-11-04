import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const Sidebar = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  activeTab = 'dashboard',
  onSelectTab,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-30 flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300 select-none ${
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

        {/* Navigation Links - Only Dashboard */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab && onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-red-400'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">{item.label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Profile Badge & Logout Button */}
        {user && (
          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* User Profile Badge */}
                <div className="flex items-center gap-3 bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                  <img
                    src={
                      user.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-red-500 shrink-0"
                  />
                  <div className="text-left text-xs leading-none overflow-hidden">
                    <span className="font-semibold text-white block truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-neutral-400 text-[10px] truncate block mt-0.5">
                      @{user.username} •{' '}
                      <span className="text-amber-400 font-semibold">{user.role}</span>
                    </span>
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
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-red-500"
                  title={`${user.name} (@${user.username}) - ${user.role}`}
                />
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
