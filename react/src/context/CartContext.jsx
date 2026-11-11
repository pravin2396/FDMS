import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useDashboard } from './DashboardContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addNewOrder } = useDashboard();
  const { user } = useAuth();

  // 1. Initialize Cart Items from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fdms_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
      return [];
    }
  });

  // Promo code state
  const [promoCode, setPromoCode] = useState(() => {
    return localStorage.getItem('fdms_cart_promo') || '';
  });
  const [discountAmount, setDiscountAmount] = useState(0);

  // 2. Persist Cart Items to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('fdms_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Persist Promo Code
  useEffect(() => {
    if (promoCode) {
      localStorage.setItem('fdms_cart_promo', promoCode);
    } else {
      localStorage.removeItem('fdms_cart_promo');
    }
  }, [promoCode]);

  // 3. Add to Cart
  const addToCart = (item, quantity = 1, restaurantName = 'Food Court Central Kitchen') => {
    if (!item) return;

    setCartItems((prevItems) => {
      const cleanId = String(item.id);
      const existingIndex = prevItems.findIndex((ci) => String(ci.id) === cleanId);

      if (existingIndex > -1) {
        // Increment quantity of existing item
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        toast.success(`Updated "${item.name}" quantity to ${newQty}`);
        return updated;
      } else {
        // Add new item to cart
        const newItem = {
          id: cleanId,
          name: item.name,
          price: parseFloat(item.price) || 299,
          quantity: Math.max(1, quantity),
          image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          category: item.category || 'Main Course',
          isVeg: Boolean(item.isVeg),
          restaurant: restaurantName || item.restaurant || 'Food Court Central Kitchen',
          prepTime: item.prepTime || 20,
        };
        toast.success(`Added "${item.name}" to your cart!`);
        return [...prevItems, newItem];
      }
    });
  };

  // 4. Remove from Cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((ci) => String(ci.id) === String(id));
      const filtered = prevItems.filter((ci) => String(ci.id) !== String(id));
      if (target) {
        toast.info(`Removed "${target.name}" from cart`);
      }
      return filtered;
    });
  };

  // 5. Update Quantity (increment / decrement)
  const updateQuantity = (id, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) => {
      return prevItems.map((ci) => {
        if (String(ci.id) === String(id)) {
          return { ...ci, quantity: qty };
        }
        return ci;
      });
    });
  };

  // 6. Clear Cart
  const clearCart = () => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    setPromoCode('');
    setDiscountAmount(0);
    localStorage.removeItem('fdms_cart');
    localStorage.removeItem('fdms_cart_promo');
    toast.info('Cart has been cleared.');
  };

  // 7. Check if Item is in Cart & get its current quantity
  const getItemQuantity = (id) => {
    const found = cartItems.find((ci) => String(ci.id) === String(id));
    return found ? found.quantity : 0;
  };

  // 8. Calculations & Summary
  const {
    totalItemsCount,
    subtotal,
    deliveryFee,
    tax,
    packagingFee,
    totalPrice,
  } = useMemo(() => {
    const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Free delivery on orders above ₹500, else ₹40 (0 if empty cart)
    const delFee = rawSubtotal === 0 ? 0 : rawSubtotal >= 500 ? 0 : 40;

    // 5% GST Restaurant Tax
    const calculatedTax = rawSubtotal === 0 ? 0 : Math.round(rawSubtotal * 0.05);

    // Packaging fee of ₹15 if cart not empty
    const packFee = rawSubtotal === 0 ? 0 : 15;

    // Calculate Promo Discount
    let promoDiscount = 0;
    if (promoCode.toUpperCase() === 'FOODCOURT50' && rawSubtotal >= 299) {
      promoDiscount = 50;
    } else if (promoCode.toUpperCase() === 'WELCOME10' && rawSubtotal > 0) {
      promoDiscount = Math.round(rawSubtotal * 0.1);
    }
    setDiscountAmount(promoDiscount);

    // Grand Total
    const grandTotal = Math.max(0, rawSubtotal + delFee + calculatedTax + packFee - promoDiscount);

    return {
      totalItemsCount: itemsCount,
      subtotal: rawSubtotal,
      deliveryFee: delFee,
      tax: calculatedTax,
      packagingFee: packFee,
      totalPrice: grandTotal,
    };
  }, [cartItems, promoCode]);

  // 9. Promo code validator
  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a coupon code' };

    if (clean === 'FOODCOURT50') {
      if (subtotal < 299) {
        toast.warning('Coupon FOODCOURT50 is valid on orders above ₹299');
        return { success: false, message: 'Minimum order ₹299 required' };
      }
      setPromoCode('FOODCOURT50');
      toast.success('Coupon FOODCOURT50 applied! ₹50 OFF');
      return { success: true, message: '₹50 discount applied' };
    }

    if (clean === 'WELCOME10') {
      setPromoCode('WELCOME10');
      toast.success('Coupon WELCOME10 applied! 10% OFF');
      return { success: true, message: '10% discount applied' };
    }

    toast.error('Invalid coupon code. Try FOODCOURT50 or WELCOME10');
    return { success: false, message: 'Invalid coupon' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountAmount(0);
    toast.info('Coupon removed');
  };

  // 10. Checkout action (Replicates order to Dashboard recent orders & updates metrics)
  const checkout = (customerDetails = {}) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before checking out.');
      return false;
    }

    const itemSummary = cartItems
      .map((ci) => `${ci.name} (x${ci.quantity})`)
      .join(', ');

    const primaryRestaurant = cartItems[0]?.restaurant || 'Food Court Kitchen';

    // Place order in Dashboard
    addNewOrder({
      customerName: customerDetails.name || user?.name || 'Pravin',
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      restaurant: primaryRestaurant,
      items: itemSummary,
      amount: totalPrice,
    });

    // Clear cart upon successful order placement
    setCartItems([]);
    setPromoCode('');
    setDiscountAmount(0);
    localStorage.removeItem('fdms_cart');
    localStorage.removeItem('fdms_cart_promo');

    toast.success('Order placed successfully! Replicated in Dashboard Recent Orders.');
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        deliveryFee,
        tax,
        packagingFee,
        discountAmount,
        totalPrice,
        promoCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        applyPromoCode,
        removePromoCode,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
