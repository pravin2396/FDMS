import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Plus,
  Trash2,
  Clock,
  UtensilsCrossed,
  Heart,
  Sparkles,
  Save,
  X,
  Star,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

// Preset avatar options for UI image picker
const PRESET_AVATARS = [
  {
    id: 'av-1',
    label: 'Default Admin',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-2',
    label: 'Executive Chef',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-3',
    label: 'Foodie Enthusiast',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-4',
    label: 'Culinary Master',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-5',
    label: 'Gourmet Critic',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-6',
    label: 'Casual Diner',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  },
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { savedAddresses, selectedAddress, addAddress, updateAddress, removeAddress, setDefaultAddress, orders } = useOrder();

  // Sidebar responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active Profile Tab: 'details' | 'addresses' | 'activity'
  const [activeTab, setActiveTab] = useState('details');

  // Edit Profile Modal / Drawer state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Pravin',
    email: user?.email || 'pravin@foodcourt.com',
    phone: user?.phone || '9876543210',
    avatar: user?.avatar || PRESET_AVATARS[0].url,
    bio: user?.bio || 'Passionate foodie and regular food court diner.',
    favoriteCuisine: user?.favoriteCuisine || 'South Indian & Italian',
    dietaryPreference: user?.dietaryPreference || 'Veg & Non-Veg',
  });

  // Image Picker Modal state
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Address Modals state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || 'Pravin Kumar',
    phone: user?.phone || '9876543210',
    type: 'Table / Dine-in',
    tag: 'Dine-in',
    street: '',
    landmark: '',
    city: 'Chennai',
    pincode: '600001',
    isDefault: false,
  });

  // Handle open Edit Profile
  const handleOpenEditProfile = () => {
    setProfileForm({
      name: user?.name || 'Pravin',
      email: user?.email || 'pravin@foodcourt.com',
      phone: user?.phone || '9876543210',
      avatar: user?.avatar || PRESET_AVATARS[0].url,
      bio: user?.bio || 'Passionate foodie and regular food court diner.',
      favoriteCuisine: user?.favoriteCuisine || 'South Indian & Italian',
      dietaryPreference: user?.dietaryPreference || 'Veg & Non-Veg',
    });
    setIsEditProfileOpen(true);
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!profileForm.email.trim() || !profileForm.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!profileForm.phone.trim() || profileForm.phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    await updateProfile(profileForm);
    setIsEditProfileOpen(false);
  };

  // Submit Selected Preset Avatar
  const handleSelectPresetAvatar = (url) => {
    setProfileForm((prev) => ({ ...prev, avatar: url }));
    updateProfile({ avatar: url });
    setIsImagePickerOpen(false);
    toast.success('Profile avatar updated!');
  };

  // Submit Custom Image URL
  const handleApplyCustomAvatar = (e) => {
    e.preventDefault();
    if (!customAvatarUrl.trim()) return;
    setProfileForm((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
    updateProfile({ avatar: customAvatarUrl.trim() });
    setCustomAvatarUrl('');
    setIsImagePickerOpen(false);
    toast.success('Custom profile image applied!');
  };

  // Open Add Address Modal
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || 'Pravin Kumar',
      phone: user?.phone || '9876543210',
      type: 'Table / Dine-in',
      tag: 'Dine-in',
      street: '',
      landmark: '',
      city: 'Chennai',
      pincode: '600001',
      isDefault: savedAddresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  // Open Edit Address Modal
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      type: addr.type || 'Table / Dine-in',
      tag: addr.tag || addr.type,
      street: addr.street,
      landmark: addr.landmark || '',
      city: addr.city || 'Chennai',
      pincode: addr.pincode || '600001',
      isDefault: Boolean(addr.isDefault),
    });
    setIsAddressModalOpen(true);
  };

  // Save Address (Create or Update)
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.street.trim()) {
      toast.error('Please enter street or table details');
      return;
    }
    if (!addressForm.phone.trim() || addressForm.phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
      if (addressForm.isDefault) {
        setDefaultAddress(editingAddressId);
      }
    } else {
      const created = addAddress(addressForm);
      if (addressForm.isDefault) {
        setDefaultAddress(created.id);
      }
    }
    setIsAddressModalOpen(false);
  };

  // Customer order statistics
  const customerOrders = orders.filter(
    (o) =>
      o.customerName?.toLowerCase() === (user?.name || '').toLowerCase() ||
      o.customerPhone === (user?.phone || '9876543210')
  );
  const totalOrdersCount = customerOrders.length > 0 ? customerOrders.length : orders.length;

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout */}
      <div className="flex-1 min-h-0 flex w-full relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab="profile"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 min-h-0 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                <Link to="/" className="hover:text-white transition">Dashboard</Link>
                <span>/</span>
                <span className="text-red-400 font-semibold">Customer Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <User className="w-7 h-7 text-red-500" />
                <span>My Profile & Preferences</span>
              </h1>
            </div>

            {/* Quick Action: Edit Profile Button */}
            <button
              type="button"
              onClick={handleOpenEditProfile}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Profile Hero Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Avatar + Main Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
                {/* Profile Image with change trigger */}
                <div className="relative group cursor-pointer" onClick={() => setIsImagePickerOpen(true)}>
                  <img
                    src={user?.avatar || PRESET_AVATARS[0].url}
                    alt={user?.name || 'Customer'}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-neutral-700 shadow-xl group-hover:opacity-80 transition"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold transition backdrop-blur-xs">
                    <Camera className="w-6 h-6 mb-1 text-red-400" />
                    <span>Change</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {user?.name || 'Pravin'}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {user?.role || 'Customer'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>VIP Member</span>
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                    {user?.bio || 'Passionate foodie and regular food court diner.'}
                  </p>

                  {/* Contact Badges Row */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{user?.email || 'pravin@foodcourt.com'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Verified Email" />
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>+91 {user?.phone || '9876543210'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Verified Phone" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Badge Container */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Orders Placed
                  </span>
                  <span className="text-xl font-black text-white block mt-0.5">
                    {totalOrdersCount}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Saved Addresses
                  </span>
                  <span className="text-xl font-black text-red-400 block mt-0.5">
                    {savedAddresses.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Bottom Highlights Row */}
            <div className="mt-6 pt-5 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-red-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Member Since</span>
                  <span className="font-bold text-white">{user?.memberSince || 'November 2024'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Dietary Preference</span>
                  <span className="font-bold text-white">{user?.dietaryPreference || 'Veg & Non-Veg'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Favorite Cuisines</span>
                  <span className="font-bold text-white">{user?.favoriteCuisine || 'South Indian & Italian'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Profile Sections */}
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Account Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'addresses'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Delivery Addresses</span>
              <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px]">
                {savedAddresses.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Recent Orders
            </button>
          </div>

          {/* Tab 1: Account Details */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-red-500" />
                    <h3 className="text-base font-extrabold text-white">Personal Information</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenEditProfile}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-400">Full Name</span>
                    <span className="font-bold text-white text-sm">{user?.name || 'Pravin'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-400">Username</span>
                    <span className="font-mono text-neutral-300">@{user?.username || 'pravin'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-400">Email Address</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{user?.email || 'pravin@foodcourt.com'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-400">Mobile Number</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">+91 {user?.phone || '9876543210'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-400">Account Role</span>
                    <span className="font-bold text-emerald-400">{user?.role || 'Customer'}</span>
                  </div>
                </div>
              </div>

              {/* Dining & Food Preferences Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <UtensilsCrossed className="w-5 h-5 text-red-500" />
                    <h3 className="text-base font-extrabold text-white">Dining & Food Preferences</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenEditProfile}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">
                      Dietary Choice
                    </span>
                    <span className="font-bold text-white text-sm block">
                      {user?.dietaryPreference || 'Veg & Non-Veg'}
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Dishes matching your preference will be prominently highlighted in the catalog.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">
                      Favorite Cuisines
                    </span>
                    <span className="font-bold text-white text-sm block">
                      {user?.favoriteCuisine || 'South Indian & Italian'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">
                      Default Delivery Location
                    </span>
                    <span className="font-bold text-white text-sm block">
                      {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}` : 'No default address set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Delivery Address Management */}
          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
                <div>
                  <h3 className="text-base font-extrabold text-white">Delivery Addresses Management</h3>
                  <p className="text-xs text-neutral-400">
                    Manage food court table numbers, office locations, and home addresses for checkout
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Saved Addresses Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedAddresses.map((addr) => {
                  const isDefault = addr.isDefault || selectedAddress?.id === addr.id;

                  return (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                        isDefault
                          ? 'bg-neutral-900 border-red-500/80 shadow-lg shadow-red-950/20'
                          : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {addr.type || 'Dine-in'}
                          </span>
                          {isDefault ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                              <Check className="w-3 h-3" />
                              <span>Default</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] text-neutral-400 hover:text-white font-semibold cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-sm">{addr.fullName}</h4>
                          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                            {addr.street}
                            {addr.landmark ? `, ${addr.landmark}` : ''}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {addr.city} - {addr.pincode}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                          <Phone className="w-3.5 h-3.5 text-neutral-500" />
                          <span>+91 {addr.phone}</span>
                        </div>
                      </div>

                      {/* Address Card Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/60">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddress(addr)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
                        >
                          Edit
                        </button>

                        {savedAddresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAddress(addr.id)}
                            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white border border-neutral-700 hover:border-red-500 transition cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Recent Orders Activity */}
          {activeTab === 'activity' && (
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-extrabold text-white">Recent Customer Orders</h3>
                </div>
                <Link
                  to="/orders"
                  className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                >
                  View All ({orders.length})
                </Link>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-400 text-xs">{ord.id}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-semibold">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 font-medium">
                        {ord.itemsSummary || ord.restaurant}
                      </p>
                      <span className="text-[11px] text-neutral-400">
                        {ord.orderDate} at {ord.orderTime} • ₹{ord.amount}
                      </span>
                    </div>

                    <Link
                      to={`/track/${ord.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold self-start sm:self-auto border border-neutral-700 transition"
                    >
                      Track Order
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-extrabold text-white">Edit Customer Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Image Preview & Change */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <img
                  src={profileForm.avatar}
                  alt={profileForm.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-neutral-700"
                />
                <div>
                  <span className="font-bold text-white text-xs block">Profile Picture</span>
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer mt-1"
                  >
                    Change Picture (Choose Presets)
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Mobile Number & Dietary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Dietary Preference
                  </label>
                  <select
                    value={profileForm.dietaryPreference}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, dietaryPreference: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Veg & Non-Veg">Veg & Non-Veg (All)</option>
                    <option value="Pure Vegetarian">Pure Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              {/* Favorite Cuisines */}
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Favorite Cuisines
                </label>
                <input
                  type="text"
                  value={profileForm.favoriteCuisine}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, favoriteCuisine: e.target.value })
                  }
                  placeholder="e.g. South Indian, Italian, Burgers"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Bio / Dining Notes */}
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  About Me / Dining Bio
                </label>
                <textarea
                  rows={2}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preset Profile Image Picker Modal */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-extrabold text-white">Choose Profile Picture</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Select an Avatar Preset:
              </span>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPresetAvatar(preset.url)}
                    className="p-2 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-500 cursor-pointer transition text-center group"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-16 h-16 rounded-xl object-cover mx-auto group-hover:scale-105 transition"
                    />
                    <span className="text-[10px] text-neutral-300 block mt-1 line-clamp-1 font-medium">
                      {preset.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Or custom image URL */}
            <form onSubmit={handleApplyCustomAvatar} className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Or Enter Custom Image URL:
              </span>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-extrabold text-white">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Street Address / Food Court Table / Office Floor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table #12, 2nd Floor Zone A or Flat 401, Rose Tower"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Near counter"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Address Type Badges */}
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                  Address Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Table / Dine-in', 'Work', 'Home', 'Other'].map((typeOpt) => (
                    <button
                      key={typeOpt}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, type: typeOpt, tag: typeOpt })}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        addressForm.type === typeOpt
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-neutral-950 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      {typeOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, isDefault: e.target.checked })
                  }
                  className="rounded border-neutral-700 bg-neutral-950 text-red-600 focus:ring-red-500"
                />
                <span className="text-xs text-neutral-300">Set as my default delivery address</span>
              </label>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
