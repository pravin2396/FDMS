import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import RevenueSummary from '../components/RevenueSummary';
import RecentOrdersTable from '../components/RecentOrdersTable';
import QuickActionCards from '../components/QuickActionCards';
import AddRestaurantModal from '../components/AddRestaurantModal';
import AddFoodItemModal from '../components/AddFoodItemModal';
import { useDashboard } from '../context/DashboardContext';
import {
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
} from 'lucide-react';

const Dashboard = () => {
  const {
    metrics,
    revenueData,
    recentOrders,
    apiError,
    addRestaurant,
    addFoodItem,
    updateOrderStatus,
    addNewOrder,
  } = useDashboard();

  // Sidebar responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  // Toggle handlers
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Quick Action: Simulate Order
  const handleSimulateOrder = () => {
    const sampleDishes = [
      { name: 'Butter Chicken Biryani Bowl', restaurant: 'Spice Route Kitchen', price: 420 },
      { name: 'Double Cheese Margherita', restaurant: 'Crust & Co. Pizzeria', price: 480 },
      { name: 'Crispy Falafel Wrap Meal', restaurant: 'Mediterranean Bites', price: 340 },
      { name: 'Korean Spicy Ramen & Dimsums', restaurant: 'Dragon Wok Bowl', price: 520 },
      { name: 'Smoked Angus Beef Burger', restaurant: 'Burger Barn', price: 460 },
    ];
    const pick = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];
    const randomCustomers = [
      'Pooja Nair',
      'Karan Malhotra',
      'Divya Krishnan',
      'Siddharth Roy',
      'Tanvi Deshmukh',
    ];
    const customer = randomCustomers[Math.floor(Math.random() * randomCustomers.length)];

    addNewOrder({
      customerName: customer,
      restaurant: pick.restaurant,
      items: pick.name,
      amount: pick.price,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Header - Edge to Edge with logo, title, admin pill, and logout */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Edge-to-Edge Stretched Layout with Sidebar */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setIsSidebarOpen(false);
          }}
        />

        {/* Edge-to-Edge Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 bg-neutral-950">
          {/* Dashboard Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Food Court Overview
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Real-time multi-restaurant operations, orders dispatch, customer volume, and sales metrics.
              </p>
            </div>
          </div>

          {/* API Error Alert if present */}
          {apiError && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{apiError} — Displaying cached local metrics.</span>
              </div>
            </div>
          )}

          {/* 1. Six Core Metric Cards Required */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Key Performance Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Metric 1: Total Restaurants */}
              <StatCard
                title="Total Restaurants"
                value={metrics.totalRestaurants}
                change="+4 partners"
                isPositive={true}
                subtext="Active food outlets"
                icon={Store}
                accentColor="red"
              />

              {/* Metric 2: Total Food Items */}
              <StatCard
                title="Total Food Items"
                value={metrics.totalFoodItems}
                change="+18 items"
                isPositive={true}
                subtext="Available menu dishes"
                icon={UtensilsCrossed}
                accentColor="amber"
              />

              {/* Metric 3: Total Orders */}
              <StatCard
                title="Total Orders"
                value={metrics.totalOrders.toLocaleString()}
                change="+12.4%"
                isPositive={true}
                subtext="Lifetime processed"
                icon={ShoppingBag}
                accentColor="purple"
              />

              {/* Metric 4: Active Orders */}
              <StatCard
                title="Active Orders"
                value={metrics.activeOrders}
                change="Kitchen active"
                isPositive={true}
                subtext="In prep / dispatch"
                icon={Clock}
                accentColor="orange"
              />

              {/* Metric 5: Delivered Orders */}
              <StatCard
                title="Delivered Orders"
                value={metrics.deliveredOrders.toLocaleString()}
                change="98.2% rate"
                isPositive={true}
                subtext="Successfully completed"
                icon={CheckCircle2}
                accentColor="emerald"
              />

              {/* Metric 6: Total Customers */}
              <StatCard
                title="Total Customers"
                value={metrics.totalCustomers.toLocaleString()}
                change="+8.6%"
                isPositive={true}
                subtext="Registered accounts"
                icon={Users}
                accentColor="blue"
              />
            </div>
          </section>

          {/* 2. Quick Action Cards */}
          <section>
            <QuickActionCards
              onOpenAddRestaurant={() => setIsRestaurantModalOpen(true)}
              onOpenAddFoodItem={() => setIsFoodModalOpen(true)}
              onSimulateOrder={handleSimulateOrder}
            />
          </section>

          {/* 3. Revenue Summary (Dummy Data with Breakdown Bars & Key Stats) */}
          <section>
            <RevenueSummary revenueData={revenueData} />
          </section>

          {/* 4. Recent Orders Feed Table */}
          <section>
            <RecentOrdersTable
              orders={recentOrders}
              onUpdateStatus={updateOrderStatus}
            />
          </section>
        </main>
      </div>

      {/* Interactive Modals */}
      <AddRestaurantModal
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        onAdd={addRestaurant}
      />

      <AddFoodItemModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onAdd={addFoodItem}
      />
    </div>
  );
};

export default Dashboard;
