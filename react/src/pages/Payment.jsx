import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  Receipt,
  Tag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
  RotateCcw,
  QrCode,
  Lock,
  Building,
  Check,
  Percent,
  Copy,
  ExternalLink,
  UtensilsCrossed,
} from 'lucide-react';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    cartItems,
    totalItemsCount,
    subtotal,
    deliveryFee,
    tax,
    packagingFee,
    discountAmount,
    totalPrice,
    promoCode,
    availableCoupons,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { selectedAddress, placeOrder } = useOrder();

  // Sidebar responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active Payment Tab: 'card' | 'upi' | 'wallet' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Coupon input state
  const [couponInput, setCouponInput] = useState('');

  // 1. Credit / Debit Card UI State
  const [cardData, setCardData] = useState({
    number: '4532 8921 7843 9021',
    name: user?.name ? user.name.toUpperCase() : 'PRAVIN KUMAR',
    expiry: '09/28',
    cvv: '842',
    saveCard: true,
  });

  // 2. UPI UI State
  const [upiMode, setUpiMode] = useState('vpa'); // 'vpa' | 'qr'
  const [vpaInput, setVpaInput] = useState('pravin@okaxis');
  const [vpaVerified, setVpaVerified] = useState(true);
  const [qrCountdown, setQrCountdown] = useState(299); // 5 mins in seconds

  // 3. Wallet UI State
  const [selectedWallet, setSelectedWallet] = useState('express'); // 'express' | 'paytm' | 'amazon' | 'phonepe'
  const expressWalletBalance = 1500;

  // 4. Payment Flow & Result Screens State: 'input' | 'processing' | 'success' | 'failure'
  const [paymentScreen, setPaymentScreen] = useState('input');
  const [simulationMode, setSimulationMode] = useState('success'); // 'success' | 'failure'
  const [processedOrder, setProcessedOrder] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [failureReason, setFailureReason] = useState('');

  // QR Code countdown timer
  useEffect(() => {
    let timer;
    if (paymentMethod === 'upi' && upiMode === 'qr' && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentMethod, upiMode, qrCountdown]);

  // Format QR countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card brand detection helper
  const getCardBrand = (number) => {
    const clean = number.replace(/\s+/g, '');
    if (clean.startsWith('4')) return { name: 'Visa', color: 'text-blue-400', bg: 'bg-blue-600' };
    if (clean.startsWith('5')) return { name: 'MasterCard', color: 'text-amber-400', bg: 'bg-amber-600' };
    if (clean.startsWith('6')) return { name: 'RuPay', color: 'text-emerald-400', bg: 'bg-emerald-600' };
    return { name: 'Card', color: 'text-neutral-300', bg: 'bg-neutral-700' };
  };
  const cardBrand = getCardBrand(cardData.number);

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData({ ...cardData, number: formatted });
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardData({ ...cardData, expiry: val });
  };

  // Handle Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput);
    setCouponInput('');
  };

  // Trigger Payment & Order Placement
  const handleProcessPayment = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty. Please add food items before payment.');
      navigate('/menu');
      return;
    }

    setPaymentScreen('processing');

    setTimeout(() => {
      // Check simulation mode
      if (simulationMode === 'failure') {
        // Render Payment Failure Screen
        setPaymentScreen('failure');
        setFailureReason(
          'ERR_BANK_TIMEOUT: Card gateway or bank server timed out while verifying 3D Secure OTP. No funds were debited.'
        );
        toast.error('Payment transaction failed.');
      } else {
        // Render Payment Success Screen & Place Order
        const genTxnId = `TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        setTransactionId(genTxnId);

        let finalPaymentMethodName = 'Card Payment (Visa)';
        if (paymentMethod === 'upi') {
          finalPaymentMethodName = upiMode === 'qr' ? 'UPI QR Code Scan' : `UPI (${vpaInput})`;
        } else if (paymentMethod === 'wallet') {
          finalPaymentMethodName =
            selectedWallet === 'express'
              ? 'Food Court Express Wallet'
              : `${selectedWallet.toUpperCase()} Wallet`;
        } else if (paymentMethod === 'cod') {
          finalPaymentMethodName = 'Cash on Delivery / Counter';
        }

        const result = placeOrder({
          deliveryAddress: selectedAddress || {
            fullName: user?.name || 'Pravin Kumar',
            phone: user?.phone || '9876543210',
            street: 'Table #08 Food Court 2nd Floor',
            city: 'Chennai',
            pincode: '600001',
            type: 'Table / Dine-in',
          },
          paymentMethod: finalPaymentMethodName,
          chefInstructions: 'Paid via ' + finalPaymentMethodName,
          customCustomerName: user?.name || 'Pravin Kumar',
        });

        if (result.success && result.order) {
          setProcessedOrder(result.order);
          setPaymentScreen('success');
          toast.success('Payment verified & order placed successfully!');
        } else {
          setPaymentScreen('failure');
          setFailureReason('Unable to register order with the kitchen.');
        }
      }
    }, 1200);
  };

  // Retry from Failure Screen
  const handleRetryPayment = () => {
    setPaymentScreen('input');
    setSimulationMode('success'); // reset to normal success
  };

  // Empty cart guard view
  if (cartItems.length === 0 && paymentScreen !== 'success') {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <div className="flex-1 flex w-full relative overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            activeTab="cart"
            onSelectTab={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 p-8 flex items-center justify-center bg-neutral-950">
            <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-950/40 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
                <Receipt className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">No Pending Payment</h2>
              <p className="text-xs text-neutral-400">
                Your cart is currently empty. Add dishes from our food catalog to proceed to payment.
              </p>
              <div className="pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Browse Food Catalog</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeTab="cart"
          onSelectTab={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-950">
          {/* SCREEN 1: PAYMENT SUCCESS SCREEN */}
          {paymentScreen === 'success' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
              <div className="p-8 rounded-3xl bg-neutral-900 border border-emerald-500/50 text-center space-y-5 shadow-2xl relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Payment Successful & Verified
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    ₹{processedOrder?.billBreakdown?.grandTotal || totalPrice} Paid Successfully
                  </h1>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Your transaction has been processed securely. Food Court kitchen is now preparing your order.
                  </p>
                </div>

                {/* Transaction & Order Details Pill Box */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs text-left max-w-lg mx-auto">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Transaction ID:</span>
                    <span className="font-mono font-bold text-white">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Order ID:</span>
                    <span className="font-mono font-bold text-red-400">{processedOrder?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Payment Mode:</span>
                    <span className="font-bold text-white">{processedOrder?.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Estimated Delivery:</span>
                    <span className="font-bold text-emerald-400">
                      ~{processedOrder?.estimatedDelivery?.minutesRange || '25 mins'}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={`/track/${processedOrder?.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Track Live Order</span>
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition cursor-pointer"
                  >
                    <span>View in Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: PAYMENT FAILURE SCREEN */}
          {paymentScreen === 'failure' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
              <div className="p-8 rounded-3xl bg-neutral-900 border border-red-500/50 text-center space-y-5 shadow-2xl relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
                  <XCircle className="w-12 h-12" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-red-400">
                    Payment Failed
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    Transaction Could Not Be Completed
                  </h1>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    We were unable to charge your account. Your cart and chosen food items remain completely safe.
                  </p>
                </div>

                {/* Error Box */}
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/60 text-xs text-left max-w-lg mx-auto space-y-1.5">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Error Details</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-mono text-[11px]">
                    {failureReason}
                  </p>
                </div>

                {/* Retry & Change Payment Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetryPayment}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentScreen('input');
                      setPaymentMethod('upi');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition cursor-pointer"
                  >
                    <span>Try UPI / Wallet Instead</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: NORMAL PAYMENT & COUPON FLOW */}
          {(paymentScreen === 'input' || paymentScreen === 'processing') && (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                    <Link to="/checkout" className="hover:text-white transition flex items-center gap-1">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Checkout</span>
                    </Link>
                    <span>/</span>
                    <span className="text-red-400 font-semibold">Payment & Coupons</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <CreditCard className="w-7 h-7 text-red-500" />
                    <span>Coupons & Secure Payment</span>
                  </h1>
                </div>

                {/* Simulation Mode Toggle Pill (For testing failure / success) */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
                  <span className="text-[11px] font-bold text-neutral-400">Simulation:</span>
                  <button
                    type="button"
                    onClick={() => setSimulationMode('success')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      simulationMode === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulationMode('failure')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      simulationMode === 'failure'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Fail Screen
                  </button>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Payment Methods UI (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Payment Method Selector Tabs */}
                  <div className="p-2 rounded-2xl bg-neutral-900 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        paymentMethod === 'wallet'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Wallets</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash</span>
                    </button>
                  </div>

                  {/* 1. CARD PAYMENT UI */}
                  {paymentMethod === 'card' && (
                    <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-5 h-5 text-red-500" />
                          <h3 className="text-base font-extrabold text-white">Card Payment UI</h3>
                        </div>
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>256-Bit SSL Encrypted</span>
                        </span>
                      </div>

                      {/* Visual Card Mockup */}
                      <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl p-5 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-red-950 border border-neutral-700 shadow-2xl flex flex-col justify-between text-white select-none">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">
                            Food Court Smart Card
                          </span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${cardBrand.bg}`}>
                            {cardBrand.name}
                          </span>
                        </div>

                        {/* Chip + Contactless icon */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-200 to-amber-400 border border-amber-500/50 shadow-inner"></div>
                          <span className="text-xs text-neutral-400 font-mono">))))</span>
                        </div>

                        {/* Number Display */}
                        <div className="font-mono text-lg sm:text-xl tracking-widest font-black text-neutral-100">
                          {cardData.number || '•••• •••• •••• ••••'}
                        </div>

                        {/* Name and Expiry */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                          <div>
                            <span className="text-[8px] text-neutral-400 uppercase block">Card Holder</span>
                            <span className="font-bold tracking-wider">{cardData.name || 'YOUR NAME'}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-neutral-400 uppercase block">Expires</span>
                            <span className="font-bold">{cardData.expiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Card Inputs */}
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                            Card Number (16 Digits)
                          </label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            placeholder="4532 8921 7843 9021"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                            placeholder="PRAVIN KUMAR"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs uppercase text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                              Expiry Date (MM/YY)
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardData.expiry}
                              onChange={handleExpiryChange}
                              placeholder="09/28"
                              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                              CVV (3 Digits)
                            </label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardData.cvv}
                              onChange={(e) =>
                                setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })
                              }
                              placeholder="842"
                              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={cardData.saveCard}
                            onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
                            className="rounded border-neutral-700 bg-neutral-950 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-xs text-neutral-300">
                            Save card securely for 1-click checkout next time
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 2. UPI PAYMENT UI */}
                  {paymentMethod === 'upi' && (
                    <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2.5">
                          <Smartphone className="w-5 h-5 text-red-500" />
                          <h3 className="text-base font-extrabold text-white">UPI Payment UI</h3>
                        </div>
                        <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
                          <button
                            type="button"
                            onClick={() => setUpiMode('vpa')}
                            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                              upiMode === 'vpa' ? 'bg-red-600 text-white' : 'text-neutral-400'
                            }`}
                          >
                            UPI ID
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiMode('qr')}
                            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                              upiMode === 'qr' ? 'bg-red-600 text-white' : 'text-neutral-400'
                            }`}
                          >
                            QR Code
                          </button>
                        </div>
                      </div>

                      {upiMode === 'vpa' ? (
                        /* UPI VPA Mode */
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                              Enter Virtual Payment Address (UPI ID)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={vpaInput}
                                onChange={(e) => setVpaInput(e.target.value)}
                                placeholder="e.g. mobile@upi or name@okaxis"
                                className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setVpaVerified(true);
                                  toast.success('UPI ID verified!');
                                }}
                                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl border border-neutral-700 transition"
                              >
                                Verify
                              </button>
                            </div>
                            {vpaVerified && (
                              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified: Pravin Kumar (State Bank of India)</span>
                              </span>
                            )}
                          </div>

                          {/* Quick UPI Apps */}
                          <div className="pt-2 border-t border-neutral-800">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">
                              Or Select Instant UPI App:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                                <button
                                  key={app}
                                  type="button"
                                  onClick={() => {
                                    setVpaInput(`9876543210@${app.toLowerCase().replace(/\s+/g, '')}`);
                                    setVpaVerified(true);
                                  }}
                                  className="p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/50 text-xs font-semibold text-white transition text-center"
                                >
                                  {app}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* UPI QR Code Mode */
                        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
                          <span className="text-xs font-bold text-white block">
                            Scan QR Code with Any UPI App to Pay ₹{totalPrice}
                          </span>

                          {/* Interactive QR Simulation Container */}
                          <div className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center relative">
                            <QrCode className="w-36 h-36 text-neutral-950" />
                            <span className="text-[9px] font-black tracking-wider text-red-600 uppercase">
                              FDMS FOOD COURT
                            </span>
                          </div>

                          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>QR Code expires in: </span>
                            <span className="font-mono font-bold text-amber-400">
                              {formatTime(qrCountdown)}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-400">
                            Accepts Google Pay, PhonePe, Paytm, CRED, Amazon Pay, & any banking UPI app.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. WALLET PAYMENT UI */}
                  {paymentMethod === 'wallet' && (
                    <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2.5">
                          <Wallet className="w-5 h-5 text-red-500" />
                          <h3 className="text-base font-extrabold text-white">Wallet Payment UI</h3>
                        </div>
                      </div>

                      {/* Primary Express Wallet Option */}
                      <div
                        onClick={() => setSelectedWallet('express')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedWallet === 'express'
                            ? 'bg-red-950/20 border-red-500 shadow-md'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">
                              Food Court Express Wallet
                            </span>
                            <span className="text-xs text-neutral-400">
                              Instant 1-Click Payment • Zero OTP Required
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            Balance
                          </span>
                          <span className="text-base font-black text-emerald-400">
                            ₹{expressWalletBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Other Popular Wallets */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          Other Digital Wallets:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'paytm', name: 'Paytm Wallet' },
                            { id: 'amazon', name: 'Amazon Pay' },
                            { id: 'phonepe', name: 'PhonePe Wallet' },
                          ].map((wal) => (
                            <div
                              key={wal.id}
                              onClick={() => setSelectedWallet(wal.id)}
                              className={`p-3.5 rounded-2xl border transition cursor-pointer text-center ${
                                selectedWallet === wal.id
                                  ? 'bg-red-950/20 border-red-500 text-white font-bold'
                                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                              }`}
                            >
                              <span className="text-xs block">{wal.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. CASH ON DELIVERY UI */}
                  {paymentMethod === 'cod' && (
                    <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl animate-in fade-in text-center">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <Banknote className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-extrabold text-white">Cash on Delivery / Counter</h3>
                      <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                        Pay ₹{totalPrice} in cash directly to our delivery partner or food court counter when your order arrives.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Coupons & Payment Summary (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* COUPON CODE APPLICATION CARD */}
                  <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                      <Tag className="w-4 h-4 text-red-500" />
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                        Apply Coupon Code
                      </h3>
                    </div>

                    {promoCode ? (
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-emerald-400 block">
                              {promoCode} APPLIED
                            </span>
                            <span className="text-[10px] text-emerald-300">
                              Discount Savings: ₹{discountAmount}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removePromoCode}
                          className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Coupon (e.g. TASTY20)"
                          className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs uppercase font-bold text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-red-600/30"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {/* Available Offers List */}
                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Available Coupons:
                      </span>
                      <div className="space-y-2">
                        {availableCoupons?.map((coup) => (
                          <div
                            key={coup.code}
                            className="p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-white text-xs">
                                  {coup.code}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                                  {coup.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-400">{coup.description}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => applyPromoCode(coup.code)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-neutral-700 text-[11px] font-bold cursor-pointer transition shrink-0"
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FINAL PAYMENT SUMMARY CARD */}
                  <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                      <Receipt className="w-5 h-5 text-red-500" />
                      <h3 className="text-base font-extrabold text-white">Payment Summary</h3>
                      <span className="ml-auto text-xs text-neutral-400 font-semibold">
                        {totalItemsCount} Items
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-neutral-300">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Items Subtotal</span>
                        <span className="font-semibold text-white">₹{subtotal}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Delivery Charges</span>
                        <span className="font-semibold text-white">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-400 font-bold">FREE</span>
                          ) : (
                            `₹${deliveryFee}`
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Restaurant GST & Taxes (5%)</span>
                        <span className="font-semibold text-white">₹{tax}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Sanitary Packaging Fee</span>
                        <span className="font-semibold text-white">₹{packagingFee}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex items-center justify-between text-emerald-400 font-semibold pt-1 border-t border-neutral-800/60">
                          <span>Coupon Discount ({promoCode})</span>
                          <span>- ₹{discountAmount}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                        <div>
                          <span className="text-xs uppercase font-extrabold text-white block">
                            Final Payable Amount
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            Inclusive of all taxes & offers
                          </span>
                        </div>
                        <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                      </div>
                    </div>

                    {/* Primary Pay & Place Order Button */}
                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      disabled={paymentScreen === 'processing'}
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-black text-sm shadow-xl shadow-red-600/30 transition cursor-pointer active:scale-[0.99]"
                    >
                      {paymentScreen === 'processing' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Processing Payment Securely...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay & Place Order • ₹{totalPrice}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Guaranteed safe payment via RBI compliant gateways</span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Payment;
