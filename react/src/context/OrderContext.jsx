import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDashboard } from './DashboardContext';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const OrderContext = createContext(null);

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-default-1',
    fullName: 'Pravin Kumar',
    phone: '9876543210',
    type: 'Table / Dine-in',
    tag: 'Dine-in',
    street: 'Food Court 2nd Floor, Zone B',
    landmark: 'Table #08 (Near Juice Bar)',
    city: 'Chennai',
    pincode: '600001',
    isDefault: true,
  },
  {
    id: 'addr-default-2',
    fullName: 'Pravin Kumar',
    phone: '9876543210',
    type: 'Work',
    tag: 'Office',
    street: 'Ascendas IT Park, 4th Floor, Block C',
    landmark: 'Taramani',
    city: 'Chennai',
    pincode: '600113',
    isDefault: false,
  },
  {
    id: 'addr-default-3',
    fullName: 'Pravin Kumar',
    phone: '9876543210',
    type: 'Home',
    tag: 'Home',
    street: 'No. 24, 2nd Main Road, Gandhi Nagar',
    landmark: 'Opposite Community Hall',
    city: 'Chennai',
    pincode: '600020',
    isDefault: false,
  },
];

// Delivery Partner Mockup info
const DEFAULT_DELIVERY_PARTNER = {
  name: 'Ramesh Kumar',
  phone: '+91 98412 88721',
  vehicle: 'Honda Activa (TN 09 BX 4521)',
  rating: 4.9,
  totalDeliveries: '1,420+',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

// Initial Seed Orders for Instant Demo of all 4 statuses
const INITIAL_ORDERS_SEED = [
  {
    id: 'FDMS-ORD-2026-8919',
    orderNumber: 8919,
    items: [
      {
        id: 'food-seed-1',
        name: 'Classic Margherita Pizza',
        price: 350,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
        category: 'Pizza',
        isVeg: true,
      },
      {
        id: 'food-seed-2',
        name: 'Garlic Breadsticks with Dip',
        price: 200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
        category: 'Sides',
        isVeg: true,
      },
    ],
    itemsSummary: 'Classic Margherita Pizza (x1), Garlic Breadsticks with Dip (x1)',
    restaurant: 'Pizza & Pasta Co.',
    customerName: 'Pravin Kumar',
    customerPhone: '9876543210',
    deliveryAddress: {
      fullName: 'Pravin Kumar',
      phone: '9876543210',
      street: 'Food Court 2nd Floor, Zone B',
      landmark: 'Table #08 (Near Juice Bar)',
      city: 'Chennai',
      pincode: '600001',
      type: 'Table / Dine-in',
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Paid Online (Verified)',
    chefInstructions: 'Extra oregano and chili flakes please',
    billBreakdown: {
      subtotal: 550,
      deliveryFee: 0,
      tax: 28,
      packagingFee: 15,
      discountAmount: 50,
      promoCode: 'FOODCOURT50',
      grandTotal: 543,
    },
    amount: 543,
    status: 'Preparing', // Preparing status
    estimatedDelivery: {
      minutesRange: '15-20 mins',
      minMinutes: 15,
      maxMinutes: 20,
      estimatedClockTime: '10:05 AM',
      remainingMinutes: 18,
    },
    deliveryPartner: DEFAULT_DELIVERY_PARTNER,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: '09:45 AM',
    timeline: [
      {
        stage: 'Placed',
        title: 'Order Confirmed',
        time: '09:45 AM',
        description: 'Order received and verified by Pizza & Pasta Co.',
        completed: true,
      },
      {
        stage: 'Preparing',
        title: 'Kitchen Preparing',
        time: '09:48 AM',
        description: 'Chef is baking your pizza with fresh dough and mozzarella.',
        completed: true,
        current: true,
      },
      {
        stage: 'Out for Delivery',
        title: 'Out for Delivery',
        time: 'Expected 10:00 AM',
        description: 'Delivery partner will pick up hot food from counter.',
        completed: false,
      },
      {
        stage: 'Delivered',
        title: 'Delivered',
        time: 'Expected 10:05 AM',
        description: 'Enjoy your hot meal at Table #08.',
        completed: false,
      },
    ],
  },
  {
    id: 'FDMS-ORD-2026-8918',
    orderNumber: 8918,
    items: [
      {
        id: 'food-seed-3',
        name: 'Double Truffle Smash Burger',
        price: 320,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        category: 'Burgers',
        isVeg: false,
      },
      {
        id: 'food-seed-4',
        name: 'Peri Peri Fries',
        price: 100,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
        category: 'Sides',
        isVeg: true,
      },
    ],
    itemsSummary: 'Double Truffle Smash Burger (x1), Peri Peri Fries (x1)',
    restaurant: 'Burger Barn',
    customerName: 'Ananya Roy',
    customerPhone: '9845012345',
    deliveryAddress: {
      fullName: 'Ananya Roy',
      phone: '9845012345',
      street: 'Ascendas IT Park, 4th Floor, Block C',
      landmark: 'Taramani',
      city: 'Chennai',
      pincode: '600113',
      type: 'Work',
    },
    paymentMethod: 'Card',
    paymentStatus: 'Paid Online (Verified)',
    chefInstructions: 'Less salt on fries',
    billBreakdown: {
      subtotal: 420,
      deliveryFee: 40,
      tax: 21,
      packagingFee: 15,
      discountAmount: 0,
      promoCode: null,
      grandTotal: 496,
    },
    amount: 496,
    status: 'Out for Delivery', // Out for delivery status
    estimatedDelivery: {
      minutesRange: '8-12 mins',
      minMinutes: 8,
      maxMinutes: 12,
      estimatedClockTime: '09:55 AM',
      remainingMinutes: 10,
    },
    deliveryPartner: {
      ...DEFAULT_DELIVERY_PARTNER,
      name: 'Karthik Raja',
      phone: '+91 97911 23890',
    },
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: '09:30 AM',
    timeline: [
      {
        stage: 'Placed',
        title: 'Order Confirmed',
        time: '09:30 AM',
        description: 'Order accepted by Burger Barn.',
        completed: true,
      },
      {
        stage: 'Preparing',
        title: 'Kitchen Preparing',
        time: '09:34 AM',
        description: 'Burger smashed and packed hot.',
        completed: true,
      },
      {
        stage: 'Out for Delivery',
        title: 'Out for Delivery',
        time: '09:44 AM',
        description: 'Delivery partner Karthik is en route to Ascendas IT Park.',
        completed: true,
        current: true,
      },
      {
        stage: 'Delivered',
        title: 'Delivered',
        time: 'Expected 09:55 AM',
        description: 'Drop off at reception desk.',
        completed: false,
      },
    ],
  },
  {
    id: 'FDMS-ORD-2026-8917',
    orderNumber: 8917,
    items: [
      {
        id: 'food-seed-5',
        name: 'Paneer Butter Masala',
        price: 370,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
        category: 'Curries',
        isVeg: true,
      },
      {
        id: 'food-seed-6',
        name: 'Butter Naan',
        price: 80,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
        category: 'Breads',
        isVeg: true,
      },
    ],
    itemsSummary: 'Paneer Butter Masala (x1), Butter Naan (x3)',
    restaurant: 'Spice Route Kitchen',
    customerName: 'Rahul Verma',
    customerPhone: '9840199882',
    deliveryAddress: {
      fullName: 'Rahul Verma',
      phone: '9840199882',
      street: 'No. 24, 2nd Main Road, Gandhi Nagar',
      landmark: 'Opposite Community Hall',
      city: 'Chennai',
      pincode: '600020',
      type: 'Home',
    },
    paymentMethod: 'COD',
    paymentStatus: 'Paid via Cash (Delivered)',
    chefInstructions: 'Mild spicy curry',
    billBreakdown: {
      subtotal: 610,
      deliveryFee: 0,
      tax: 31,
      packagingFee: 15,
      discountAmount: 0,
      promoCode: null,
      grandTotal: 656,
    },
    amount: 656,
    status: 'Delivered', // Delivered status
    estimatedDelivery: {
      minutesRange: 'Delivered',
      minMinutes: 0,
      maxMinutes: 0,
      estimatedClockTime: 'Delivered at 09:15 AM',
      remainingMinutes: 0,
    },
    deliveryPartner: DEFAULT_DELIVERY_PARTNER,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: '08:35 AM',
    timeline: [
      {
        stage: 'Placed',
        title: 'Order Confirmed',
        time: '08:35 AM',
        description: 'Order confirmed by Spice Route Kitchen.',
        completed: true,
      },
      {
        stage: 'Preparing',
        title: 'Kitchen Preparing',
        time: '08:40 AM',
        description: 'Chef prepared tandoor naan and curry.',
        completed: true,
      },
      {
        stage: 'Out for Delivery',
        title: 'Out for Delivery',
        time: '08:58 AM',
        description: 'Runner picked up order.',
        completed: true,
      },
      {
        stage: 'Delivered',
        title: 'Delivered',
        time: '09:15 AM',
        description: 'Package handed over to customer.',
        completed: true,
        current: true,
      },
    ],
  },
  {
    id: 'FDMS-ORD-2026-8916',
    orderNumber: 8916,
    items: [
      {
        id: 'food-seed-7',
        name: 'Chocolate Lava Cake',
        price: 220,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        category: 'Dessert',
        isVeg: true,
      },
      {
        id: 'food-seed-8',
        name: 'Cold Brew Hazelnut',
        price: 130,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
        category: 'Beverage',
        isVeg: true,
      },
    ],
    itemsSummary: 'Chocolate Lava Cake (x1), Cold Brew Hazelnut (x1)',
    restaurant: 'Sweet Tooth Bakery',
    customerName: 'Sneha Kulkarni',
    customerPhone: '9822011223',
    deliveryAddress: {
      fullName: 'Sneha Kulkarni',
      phone: '9822011223',
      street: 'Tower B, Suite 102',
      landmark: 'Near Lift Lobby',
      city: 'Chennai',
      pincode: '600001',
      type: 'Work',
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Refunded to Source (Order Cancelled)',
    chefInstructions: 'Extra napkins',
    billBreakdown: {
      subtotal: 350,
      deliveryFee: 40,
      tax: 18,
      packagingFee: 15,
      discountAmount: 0,
      promoCode: null,
      grandTotal: 423,
    },
    amount: 423,
    status: 'Cancelled', // Cancelled status
    estimatedDelivery: {
      minutesRange: 'Cancelled',
      minMinutes: 0,
      maxMinutes: 0,
      estimatedClockTime: 'Cancelled',
      remainingMinutes: 0,
    },
    cancellationReason: 'Customer requested cancellation due to meeting reschedule',
    deliveryPartner: null,
    createdAt: new Date(Date.now() - 150 * 60000).toISOString(),
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: '07:20 AM',
    timeline: [
      {
        stage: 'Placed',
        title: 'Order Confirmed',
        time: '07:20 AM',
        description: 'Order placed by customer.',
        completed: true,
      },
      {
        stage: 'Cancelled',
        title: 'Order Cancelled',
        time: '07:24 AM',
        description: 'Customer requested cancellation. Full refund initiated.',
        completed: true,
        current: true,
        isCancelled: true,
      },
    ],
  },
];

export const OrderProvider = ({ children }) => {
  const { addNewOrder, updateOrderStatus: updateDashboardOrderStatus } = useDashboard();
  const { cartItems, totalPrice, subtotal, deliveryFee, tax, packagingFee, discountAmount, promoCode, clearCart } = useCart();
  const { user } = useAuth();

  // 1. Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('fdms_saved_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved addresses', e);
    }
    return DEFAULT_ADDRESSES;
  });

  // Selected delivery address
  const [selectedAddress, setSelectedAddress] = useState(() => {
    return savedAddresses[0] || DEFAULT_ADDRESSES[0];
  });

  // Persist saved addresses
  useEffect(() => {
    try {
      localStorage.setItem('fdms_saved_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.warn('Could not persist addresses', e);
    }
  }, [savedAddresses]);

  // 2. Orders History
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('fdms_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
    }
    return INITIAL_ORDERS_SEED;
  });

  // Most recent order
  const [currentOrder, setCurrentOrder] = useState(() => {
    try {
      const stored = localStorage.getItem('fdms_current_order');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read current order', e);
    }
    return orders[0] || INITIAL_ORDERS_SEED[0];
  });

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('fdms_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    if (currentOrder) {
      try {
        localStorage.setItem('fdms_current_order', JSON.stringify(currentOrder));
      } catch (e) {
        console.warn('Could not save current order', e);
      }
    }
  }, [currentOrder]);

  // Address helpers
  const addAddress = (newAddr) => {
    const formatted = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: savedAddresses.length === 0,
    };
    setSavedAddresses((prev) => [formatted, ...prev]);
    setSelectedAddress(formatted);
    toast.success('New delivery address added!');
    return formatted;
  };

  const removeAddress = (addressId) => {
    setSavedAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== addressId);
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(filtered[0] || null);
      }
      return filtered;
    });
    toast.info('Address removed');
  };

  // Helper to generate dynamic estimated delivery time
  const calculateEstimatedDelivery = (items = []) => {
    const maxPrep = items.reduce((max, it) => {
      const pt = parseInt(it.prepTime, 10) || 20;
      return pt > max ? pt : max;
    }, 20);

    const minMinutes = maxPrep + 5;
    const maxMinutes = maxPrep + 15;

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + maxMinutes * 60000);
    const formattedClock = arrivalTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      minutesRange: `${minMinutes}-${maxMinutes} mins`,
      minMinutes,
      maxMinutes,
      estimatedClockTime: formattedClock,
      remainingMinutes: maxMinutes,
      status: 'Kitchen Preparing',
    };
  };

  // Build standard timeline for an order given its current status
  const buildTimelineForStatus = (status, orderTime = 'Just now') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (status === 'Cancelled') {
      return [
        {
          stage: 'Placed',
          title: 'Order Confirmed',
          time: orderTime,
          description: 'Order confirmed and verified.',
          completed: true,
        },
        {
          stage: 'Cancelled',
          title: 'Order Cancelled',
          time: nowTime,
          description: 'Order was cancelled. Full refund initiated to original payment mode.',
          completed: true,
          current: true,
          isCancelled: true,
        },
      ];
    }

    return [
      {
        stage: 'Placed',
        title: 'Order Confirmed',
        time: orderTime,
        description: 'Order received and verified by kitchen.',
        completed: true,
        current: status === 'Placed',
      },
      {
        stage: 'Preparing',
        title: 'Kitchen Preparing',
        time: status === 'Placed' ? 'Upcoming' : nowTime,
        description: 'Chef is preparing fresh ingredients in the kitchen.',
        completed: status === 'Preparing' || status === 'Out for Delivery' || status === 'Delivered',
        current: status === 'Preparing',
      },
      {
        stage: 'Out for Delivery',
        title: 'Out for Delivery',
        time: status === 'Delivered' ? 'Completed' : status === 'Out for Delivery' ? nowTime : 'Upcoming',
        description: 'Assigned to delivery partner. Food is on its way.',
        completed: status === 'Out for Delivery' || status === 'Delivered',
        current: status === 'Out for Delivery',
      },
      {
        stage: 'Delivered',
        title: 'Delivered',
        time: status === 'Delivered' ? nowTime : 'Upcoming',
        description: 'Order handed over. Enjoy your meal!',
        completed: status === 'Delivered',
        current: status === 'Delivered',
      },
    ];
  };

  // 3. Place Order Function
  const placeOrder = ({
    deliveryAddress,
    paymentMethod = 'UPI',
    chefInstructions = '',
    customCustomerName = '',
  }) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Cannot place order: Your cart is empty!');
      return { success: false, error: 'Empty cart' };
    }

    if (!deliveryAddress) {
      toast.error('Please specify a delivery address');
      return { success: false, error: 'Missing address' };
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderId = `FDMS-ORD-2026-${randomSuffix}`;

    const estimatedDelivery = calculateEstimatedDelivery(cartItems);

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const primaryRestaurant = cartItems[0]?.restaurant || 'Food Court Central Kitchen';
    const itemsSummary = cartItems.map((ci) => `${ci.name} (x${ci.quantity})`).join(', ');

    const timeline = buildTimelineForStatus('Preparing', formattedTime);

    const newOrder = {
      id: generatedOrderId,
      orderNumber: randomSuffix,
      items: [...cartItems],
      itemsSummary,
      restaurant: primaryRestaurant,
      customerName: customCustomerName || deliveryAddress.fullName || user?.name || 'Pravin Kumar',
      customerPhone: deliveryAddress.phone || '9876543210',
      deliveryAddress: {
        fullName: deliveryAddress.fullName || user?.name || 'Pravin Kumar',
        phone: deliveryAddress.phone || '9876543210',
        street: deliveryAddress.street,
        landmark: deliveryAddress.landmark || '',
        city: deliveryAddress.city || 'Chennai',
        pincode: deliveryAddress.pincode || '600001',
        type: deliveryAddress.type || 'Table / Dine-in',
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending (Pay on Delivery)' : 'Paid Online (Verified)',
      chefInstructions: chefInstructions || 'None',
      billBreakdown: {
        subtotal,
        deliveryFee,
        tax,
        packagingFee,
        discountAmount,
        promoCode: promoCode || null,
        grandTotal: totalPrice,
      },
      amount: totalPrice,
      estimatedDelivery,
      deliveryPartner: DEFAULT_DELIVERY_PARTNER,
      status: 'Preparing', // Initial Status: Preparing
      timeline,
      createdAt: now.toISOString(),
      orderDate: formattedDate,
      orderTime: formattedTime,
    };

    // Replicate into Dashboard recent orders & revenue metrics
    addNewOrder({
      id: generatedOrderId,
      customerName: newOrder.customerName,
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      restaurant: primaryRestaurant,
      items: itemsSummary,
      amount: totalPrice,
      status: 'Preparing',
      deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}`,
      paymentMethod,
    });

    // Save in orders state
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);

    // Clear cart
    clearCart();

    toast.success(`Order #${generatedOrderId} placed successfully!`);
    return { success: true, order: newOrder };
  };

  // 4. Update Order Status (Preparing -> Out for Delivery -> Delivered -> Cancelled)
  const updateOrderStatus = (orderId, newStatus) => {
    if (!orderId || !newStatus) return;
    const cleanId = String(orderId).trim();

    setOrders((prevOrders) => {
      return prevOrders.map((ord) => {
        if (String(ord.id) === cleanId) {
          const updatedTimeline = buildTimelineForStatus(newStatus, ord.orderTime);
          const updated = {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline,
            paymentStatus:
              newStatus === 'Cancelled'
                ? 'Refund Initiated'
                : newStatus === 'Delivered' && ord.paymentMethod === 'COD'
                ? 'Paid in Cash (Verified)'
                : ord.paymentStatus,
          };
          if (currentOrder && String(currentOrder.id) === cleanId) {
            setCurrentOrder(updated);
          }
          return updated;
        }
        return ord;
      });
    });

    // Sync with DashboardContext
    if (updateDashboardOrderStatus) {
      updateDashboardOrderStatus(cleanId, newStatus);
    }

    toast.info(`Order #${cleanId} status updated to "${newStatus}"`);
  };

  // 5. Cancel Order
  const cancelOrder = (orderId, reason = 'Customer requested cancellation') => {
    if (!orderId) return;
    const cleanId = String(orderId).trim();

    setOrders((prevOrders) => {
      return prevOrders.map((ord) => {
        if (String(ord.id) === cleanId) {
          const updated = {
            ...ord,
            status: 'Cancelled',
            cancellationReason: reason,
            timeline: buildTimelineForStatus('Cancelled', ord.orderTime),
            paymentStatus: 'Refund Initiated',
          };
          if (currentOrder && String(currentOrder.id) === cleanId) {
            setCurrentOrder(updated);
          }
          return updated;
        }
        return ord;
      });
    });

    if (updateDashboardOrderStatus) {
      updateDashboardOrderStatus(cleanId, 'Cancelled');
    }

    toast.warning(`Order #${cleanId} has been cancelled.`);
  };

  // 6. Simulate Next Status (for interactive demo & testing)
  const simulateNextStatus = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return;

    if (order.status === 'Preparing') {
      updateOrderStatus(orderId, 'Out for Delivery');
    } else if (order.status === 'Out for Delivery') {
      updateOrderStatus(orderId, 'Delivered');
    } else if (order.status === 'Delivered') {
      toast.info('Order is already Delivered!');
    } else if (order.status === 'Cancelled') {
      toast.info('Order is Cancelled.');
    }
  };

  // Retrieve an order by its ID
  const getOrderById = (orderId) => {
    if (!orderId) return null;
    const cleanId = String(orderId).trim();
    if (currentOrder && String(currentOrder.id) === cleanId) {
      return currentOrder;
    }
    const found = orders.find((o) => String(o.id) === cleanId);
    if (found) return found;

    try {
      const stored = localStorage.getItem('fdms_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.find((o) => String(o.id) === cleanId) || null;
        }
      }
    } catch (e) {
      console.warn('Could not read orders from storage', e);
    }
    return null;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        savedAddresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        removeAddress,
        calculateEstimatedDelivery,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
        simulateNextStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
