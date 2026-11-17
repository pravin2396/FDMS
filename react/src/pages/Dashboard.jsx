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
import { useRestaurants } from '../context/RestaurantContext';
import { useMenu } from '../context/MenuContext';
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
    updateOrderStatus,
    addNewOrder,
  } = useDashboard();
  const { addRestaurant: addRestaurantToCatalog } = useRestaurants();
  const { menuItems, addMenuItem } = useMenu();

  const handleAddRestaurant = (restaurantData) => {
    addRestaurant(restaurantData);
    addRestaurantToCatalog(restaurantData);
  };

  const handleAddFoodItem = async (foodData) => {
    await addMenuItem(foodData);
  };

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
    <div className="h-screen max-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full overflow-hidden">
      {/* Top Header - Edge to Edge with logo, title, admin pill, and logout */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Edge-to-Edge Stretched Layout with Sidebar */}
      <div className="flex-1 min-h-0 flex w-full relative overflow-hidden">
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

        {/* Edge-to-Edge Single-Screen Main Content Area */}
        <main className="flex-1 min-h-0 h-full p-2.5 sm:p-3.5 flex flex-col gap-2.5 bg-neutral-950 overflow-hidden">
          {/* Dashboard Header Title Bar */}
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-neutral-800/80 shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Food Court Overview
              </h1>
              <span className="hidden sm:inline-block text-neutral-600 text-xs">•</span>
              <p className="hidden sm:block text-neutral-400 text-xs truncate">
                Real-time multi-restaurant operations, orders dispatch, customer volume, and sales metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                System Live
              </span>
            </div>
          </div>

          {/* API Error Alert if present */}
          {apiError && (
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/80 flex items-center justify-between gap-2 text-[11px] text-amber-300 shrink-0">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{apiError} — Displaying cached local metrics.</span>
              </div>
            </div>
          )}

          {/* 1. Six Core Metric Cards in Single Row Grid */}
          <section className="shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
              {/* Metric 1: Total Restaurants */}
              <StatCard
                title="Total Restaurants"
                value={metrics.totalRestaurants}
                change="+4 partners"
                isPositive={true}
                subtext="Active outlets"
                icon={Store}
                accentColor="red"
                linkTo="/restaurants"
              />

              {/* Metric 2: Total Food Items */}
              <StatCard
                title="Total Food Items"
                value={menuItems && menuItems.length > 0 ? menuItems.length : metrics.totalFoodItems}
                change="+18 items"
                isPositive={true}
                subtext="Available menu dishes"
                icon={UtensilsCrossed}
                accentColor="amber"
                linkTo="/menu"
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

          {/* 2. Lower Split Grid: Left (Quick Actions + Revenue Summary) | Right (Recent Orders Table) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden">
            {/* Left 7 Columns: Quick Actions + Revenue Summary */}
            <div className="lg:col-span-7 flex flex-col gap-2 h-full min-h-0 overflow-hidden">
              <QuickActionCards
                onOpenAddRestaurant={() => setIsRestaurantModalOpen(true)}
                onOpenAddFoodItem={() => setIsFoodModalOpen(true)}
                onSimulateOrder={handleSimulateOrder}
              />
              <div className="flex-1 min-h-0 overflow-hidden">
                <RevenueSummary revenueData={revenueData} />
              </div>
            </div>

            {/* Right 5 Columns: Recent Orders Table */}
            <div className="lg:col-span-5 h-full min-h-0 overflow-hidden">
              <RecentOrdersTable
                orders={recentOrders}
                onUpdateStatus={updateOrderStatus}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <AddRestaurantModal
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        onAdd={handleAddRestaurant}
      />

      <AddFoodItemModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onAdd={handleAddFoodItem}
      />
    </div>
  );
};

export default Dashboard;
