import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Utensils, Menu, X } from 'lucide-react';

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

        {/* Right Side: Admin / User Pill and Logout Button */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin / User Pill */}
            <div className="flex items-center gap-2.5 bg-neutral-800/90 px-3 py-1.5 rounded-full border border-neutral-700 shadow-sm">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-red-500"
              />
              <div className="text-left text-xs leading-none">
                <span className="font-semibold text-white block leading-tight">{user.name}</span>
                <span className="text-neutral-400 text-[10px]">
                  @{user.username} • <span className="text-amber-400 font-semibold">{user.role}</span>
                </span>
              </div>
            </div>

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
    </header>
  );
};

export default Navbar;
