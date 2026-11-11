import React, { createContext, useContext, useState, useEffect } from 'react';
import { foodService } from '../services/api';
import { toast } from 'react-toastify';

const DashboardContext = createContext(null);

// Initial dummy data for Recent Orders
const INITIAL_RECENT_ORDERS = [
  {
    id: 'ORD-8921',
    customerName: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    restaurant: 'Biryani Express',
    items: 'Hyderabadi Dum Biryani (x2), Mirchi Ka Salan',
    amount: 680,
    status: 'Preparing',
    time: '5 mins ago',
    date: '2026-11-03',
  },
  {
    id: 'ORD-8920',
    customerName: 'Meera Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    restaurant: 'Crust & Co. Pizzeria',
    items: 'Margherita Pizza, Garlic Breadsticks',
    amount: 540,
    status: 'On the Way',
    time: '18 mins ago',
    date: '2026-11-03',
  },
  {
    id: 'ORD-8919',
    customerName: 'Vikram Sengupta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    restaurant: 'Dragon Wok Bowl',
    items: 'Schezwan Noodles, Chicken Dimsums',
    amount: 490,
    status: 'Delivered',
    time: '42 mins ago',
    date: '2026-11-03',
  },
  {
    id: 'ORD-8918',
    customerName: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    restaurant: 'Burger Barn',
    items: 'Double Truffle Smash Burger, Peri Peri Fries',
    amount: 420,
    status: 'Delivered',
    time: '1 hour ago',
    date: '2026-11-03',
  },
  {
    id: 'ORD-8917',
    customerName: 'Rahul Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    restaurant: 'Spice Route Kitchen',
    items: 'Paneer Butter Masala, Butter Naan (x3)',
    amount: 610,
    status: 'Delivered',
    time: '2 hours ago',
    date: '2026-11-03',
  },
  {
    id: 'ORD-8916',
    customerName: 'Sneha Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    restaurant: 'Sweet Tooth Bakery',
    items: 'Chocolate Lava Cake, Cold Brew Hazelnut',
    amount: 350,
    status: 'Cancelled',
    time: '3 hours ago',
    date: '2026-11-03',
  },
];

// Initial Dummy Revenue Summary
const INITIAL_REVENUE_DATA = {
  totalRevenue: 485200,
  todayRevenue: 28450,
  averageOrderValue: 340,
  growthPercentage: 14.8,
  weeklyBreakdown: [
    { day: 'Mon', revenue: 32400, orders: 98 },
    { day: 'Tue', revenue: 38900, orders: 114 },
    { day: 'Wed', revenue: 41200, orders: 122 },
    { day: 'Thu', revenue: 36700, orders: 108 },
    { day: 'Fri', revenue: 54100, orders: 158 },
    { day: 'Sat', revenue: 68300, orders: 204 },
    { day: 'Sun', revenue: 71200, orders: 216 },
  ],
  monthlyBreakdown: [
    { month: 'Jun', revenue: 390000, orders: 1180 },
    { month: 'Jul', revenue: 415000, orders: 1240 },
    { month: 'Aug', revenue: 432000, orders: 1310 },
    { month: 'Sep', revenue: 458000, orders: 1360 },
    { month: 'Oct', revenue: 472000, orders: 1390 },
    { month: 'Nov', revenue: 485200, orders: 1420 },
  ],
};

export const DashboardProvider = ({ children }) => {
  // 1. Core Metrics State with LocalStorage persistence
  const [totalRestaurants, setTotalRestaurants] = useState(() => {
    const saved = localStorage.getItem('fdms_total_restaurants');
    return saved ? parseInt(saved, 10) : 28;
  });

  const [totalFoodItems, setTotalFoodItems] = useState(() => {
    try {
      const savedMenu = localStorage.getItem('fdms_menu_items');
      if (savedMenu) {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.length;
        }
      }
    } catch (e) {
      console.warn('Could not read fdms_menu_items', e);
    }
    const saved = localStorage.getItem('fdms_total_food_items');
    return saved ? parseInt(saved, 10) : 30;
  });

  const [totalOrders, setTotalOrders] = useState(() => {
    const saved = localStorage.getItem('fdms_total_orders');
    return saved ? parseInt(saved, 10) : 1420;
  });

  const [activeOrders, setActiveOrders] = useState(() => {
    const saved = localStorage.getItem('fdms_active_orders');
    return saved ? parseInt(saved, 10) : 38;
  });

  const [deliveredOrders, setDeliveredOrders] = useState(() => {
    const saved = localStorage.getItem('fdms_delivered_orders');
    return saved ? parseInt(saved, 10) : 1382;
  });

  const [totalCustomers, setTotalCustomers] = useState(() => {
    const saved = localStorage.getItem('fdms_total_customers');
    return saved ? parseInt(saved, 10) : 892;
  });

  // 2. Revenue Summary State
  const [revenueData, setRevenueData] = useState(() => {
    const saved = localStorage.getItem('fdms_revenue_data');
    return saved ? JSON.parse(saved) : INITIAL_REVENUE_DATA;
  });

  // 3. Recent Orders State
  const [recentOrders, setRecentOrders] = useState(() => {
    const saved = localStorage.getItem('fdms_recent_orders');
    return saved ? JSON.parse(saved) : INITIAL_RECENT_ORDERS;
  });

  // 4. API & Loading State
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiRecipes, setApiRecipes] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Sync Third-Party API food data via Axios
  useEffect(() => {
    const loadApiData = async () => {
      try {
        setIsLoadingApi(true);
        const data = await foodService.getRecipes(30, 0);
        if (data && data.recipes) {
          setApiRecipes(data.recipes);
          // Adjust total food items from API if not already tracked in local storage
          const hasSavedMenu = localStorage.getItem('fdms_menu_items');
          if (!hasSavedMenu && data.recipes && data.recipes.length) {
            setTotalFoodItems(data.recipes.length);
          }
        }
      } catch (err) {
        console.error('Failed to sync food API:', err);
        setApiError('Unable to sync live foods from DummyJSON API');
      } finally {
        setIsLoadingApi(false);
      }
    };

    loadApiData();
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('fdms_total_restaurants', totalRestaurants.toString());
    localStorage.setItem('fdms_total_food_items', totalFoodItems.toString());
    localStorage.setItem('fdms_total_orders', totalOrders.toString());
    localStorage.setItem('fdms_active_orders', activeOrders.toString());
    localStorage.setItem('fdms_delivered_orders', deliveredOrders.toString());
    localStorage.setItem('fdms_total_customers', totalCustomers.toString());
    localStorage.setItem('fdms_recent_orders', JSON.stringify(recentOrders));
    localStorage.setItem('fdms_revenue_data', JSON.stringify(revenueData));
  }, [
    totalRestaurants,
    totalFoodItems,
    totalOrders,
    activeOrders,
    deliveredOrders,
    totalCustomers,
    recentOrders,
    revenueData,
  ]);

  // Actions
  const addRestaurant = (restaurant) => {
    setTotalRestaurants((prev) => prev + 1);
    toast.success(`Restaurant "${restaurant.name}" registered successfully!`);
  };

  const addFoodItem = (food) => {
    setTotalFoodItems((prev) => prev + 1);
    toast.success(`Food item "${food.name}" added to menu!`);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setRecentOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const oldStatus = order.status;
          // Adjust active / delivered counters
          if (oldStatus !== 'Delivered' && newStatus === 'Delivered') {
            setActiveOrders((c) => Math.max(0, c - 1));
            setDeliveredOrders((c) => c + 1);
          } else if (oldStatus === 'Delivered' && newStatus !== 'Delivered') {
            setDeliveredOrders((c) => Math.max(0, c - 1));
            setActiveOrders((c) => c + 1);
          }
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
    toast.info(`Order #${orderId} status changed to "${newStatus}"`);
  };

  const addNewOrder = (order) => {
    const formattedOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: order.customerName || 'Walk-in Customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      restaurant: order.restaurant || 'Food Court Central',
      items: order.items || 'Meal Combo Box',
      amount: order.amount || 450,
      status: 'Preparing',
      time: 'Just now',
      date: new Date().toISOString().split('T')[0],
    };

    setRecentOrders((prev) => [formattedOrder, ...prev]);
    setTotalOrders((c) => c + 1);
    setActiveOrders((c) => c + 1);
    setRevenueData((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + formattedOrder.amount,
      todayRevenue: prev.todayRevenue + formattedOrder.amount,
    }));

    toast.success(`New order ${formattedOrder.id} placed!`);
  };

  return (
    <DashboardContext.Provider
      value={{
        metrics: {
          totalRestaurants,
          totalFoodItems,
          totalOrders,
          activeOrders,
          deliveredOrders,
          totalCustomers,
        },
        revenueData,
        recentOrders,
        apiRecipes,
        isLoadingApi,
        apiError,
        addRestaurant,
        addFoodItem,
        setTotalFoodItems,
        setTotalRestaurants,
        updateOrderStatus,
        addNewOrder,
        setTotalCustomers,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;
