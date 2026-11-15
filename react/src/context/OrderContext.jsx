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

export const OrderProvider = ({ children }) => {
  const { addNewOrder } = useDashboard();
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
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
    }
    return [];
  });

  // Most recent order
  const [currentOrder, setCurrentOrder] = useState(() => {
    try {
      const stored = localStorage.getItem('fdms_current_order');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read current order', e);
    }
    return null;
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
    // Determine max prep time from items in cart
    const maxPrep = items.reduce((max, it) => {
      const pt = parseInt(it.prepTime, 10) || 20;
      return pt > max ? pt : max;
    }, 20);

    const minMinutes = maxPrep + 5;
    const maxMinutes = maxPrep + 15;

    // Calculate arrival clock time
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
      status: 'Kitchen Preparing',
    };
  };

  // 3. Place Order Function
  const placeOrder = ({
    deliveryAddress,
    paymentMethod = 'UPI',
    chefInstructions = '',
    customCustomerName = '',
  }) => {
    // PREVENT EMPTY CART CHECKOUT
    if (!cartItems || cartItems.length === 0) {
      toast.error('Cannot place order: Your cart is empty!');
      return { success: false, error: 'Empty cart' };
    }

    if (!deliveryAddress) {
      toast.error('Please specify a delivery address');
      return { success: false, error: 'Missing address' };
    }

    // Generate standardized unique Order ID: e.g. FDMS-ORD-2026-78491
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderId = `FDMS-ORD-2026-${randomSuffix}`;

    // Estimated delivery time
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
      paymentMethod, // 'UPI' | 'Card' | 'COD' | 'NetBanking'
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
      status: 'Kitchen Preparing',
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

  // Retrieve an order by its ID
  const getOrderById = (orderId) => {
    if (!orderId) return null;
    const cleanId = String(orderId).trim();
    if (currentOrder && String(currentOrder.id) === cleanId) {
      return currentOrder;
    }
    const found = orders.find((o) => String(o.id) === cleanId);
    if (found) return found;

    // Fallback search in localStorage
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
