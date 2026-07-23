import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, ShoppingBag, Landmark, Coins, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { CartItem, Coupon, Order, ShippingAddress } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  discountAmount: number;
  onOrderPlaced: (order: Order) => void;
}

type CheckoutStep = 'details' | 'summary' | 'processing' | 'success';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  discountAmount,
  onOrderPlaced
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto'>('card');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Address Form States
  const [fullName, setFullName] = useState('Alexander Sterling');
  const [email, setEmail] = useState('sterling@apex.luxury');
  const [phone, setPhone] = useState('+1 (555) 902-1842');
  const [street, setStreet] = useState('742 Bellevue Avenue, Penthouse B');
  const [city, setCity] = useState('Seattle');
  const [state, setState] = useState('WA');
  const [zipCode, setZipCode] = useState('98102');

  // Card Form States
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/29');
  const [cvv, setCvv] = useState('382');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('summary');
  };

  const handlePlaceOrder = async () => {
    setStep('processing');
    
    const shippingAddress: ShippingAddress = {
      fullName, email, phone, street, city, state, zipCode
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          subtotal,
          discount: discountAmount,
          total,
          couponCode: appliedCoupon?.code,
          shippingAddress,
          paymentMethod
        })
      });

      if (response.ok) {
        const orderData: Order = await response.json();
        // Simulate premium packing and validation latency
        setTimeout(() => {
          setPlacedOrder(orderData);
          onOrderPlaced(orderData);
          setStep('success');
        }, 1800);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setStep('details');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step === 'processing' || step === 'success' ? undefined : onClose}
        className="absolute inset-0 bg-dark/60 backdrop-blur-md"
      />

      {/* Main wizard wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header - Hidden in processing or success */}
        {step !== 'processing' && step !== 'success' && (
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-dark">Complimentary Checkout</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Secure Triple-Layer Encrypted Gateway</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-dark transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* STEP 1: ADDRESS DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="space-y-6">
              
              {/* Shipping Form fields */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark block">1. Shipping Address</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123 Main St"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Contact Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +1 555-000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">State / Province</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">ZIP / Postcode</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Select Radios */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark block">2. Payment Method</span>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-3.5 border rounded-xl gap-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary font-bold ring-1 ring-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex flex-col items-center justify-center p-3.5 border rounded-xl gap-2 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5 text-primary font-bold ring-1 ring-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    <Landmark className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider">PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`flex flex-col items-center justify-center p-3.5 border rounded-xl gap-2 cursor-pointer transition-all ${paymentMethod === 'crypto' ? 'border-primary bg-primary/5 text-primary font-bold ring-1 ring-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    <Coins className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider">Crypto Coin</span>
                  </button>
                </div>

                {/* Simulated Card Forms */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-gray-50 border border-gray-100 rounded-2xl grid grid-cols-3 gap-3 mt-3 overflow-hidden text-xs"
                  >
                    <div className="col-span-3 space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Cardholder Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">CVV Security</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 pl-2 text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-600">SECURE PCI-DSS</span>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 mt-3 font-mono text-center">
                    🔒 You will be securely redirected to PayPal sandbox values. No real funds needed.
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 mt-3 font-mono text-center">
                    🪙 Instant connection to test address: <span className="font-semibold text-primary">0x4F...3B92</span>.
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-dark">
                  Total Payable: <span className="font-mono text-lg font-bold">${total.toFixed(2)}</span>
                </span>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-primary hover:bg-dark text-white rounded-xl text-xs font-semibold shadow-xl shadow-primary/25 flex items-center gap-2 cursor-pointer"
                >
                  <span>Review Order Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ORDER SUMMARY */}
          {step === 'summary' && (
            <div className="space-y-6">
              
              {/* Review Addresses and payment details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100/50 text-xs">
                <div>
                  <h4 className="font-bold text-dark font-display mb-2">Shipping Recipient</h4>
                  <p className="font-medium">{fullName}</p>
                  <p className="text-gray-500 font-light mt-0.5">{street}</p>
                  <p className="text-gray-500 font-light">{city}, {state} {zipCode}</p>
                  <p className="text-gray-400 font-mono mt-1">{phone}</p>
                </div>
                <div>
                  <h4 className="font-bold text-dark font-display mb-2">Payment Option</h4>
                  <p className="font-semibold uppercase font-mono flex items-center gap-1 text-primary">
                    {paymentMethod === 'card' ? <CreditCard className="w-4 h-4" /> : paymentMethod === 'paypal' ? <Landmark className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                    <span>{paymentMethod} billing</span>
                  </p>
                  <p className="text-gray-400 mt-1">Receipt will be emailed to:</p>
                  <p className="text-gray-600 font-medium">{email}</p>
                </div>
              </div>

              {/* Itemized Cart List */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark block">Items Collection</span>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs bg-gray-50/50 border border-gray-100/30 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-8 h-8 object-cover rounded-md" />
                        <div>
                          <p className="font-medium text-dark line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`}</p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-dark">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price list */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-500">
                  <span>Cart Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Active Coupon ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Shipping & Delivery</span>
                  <span className="text-emerald-600 font-semibold">Complimentary (Free)</span>
                </div>
                <div className="flex justify-between text-dark font-bold text-sm pt-2 border-t border-gray-200">
                  <span className="font-display">Total Net Amount</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex justify-between gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Back to Details
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-primary hover:bg-dark text-white rounded-xl text-xs font-semibold shadow-xl shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Authorize Secure Payment & Place Order</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING SIMULATOR */}
          {step === 'processing' && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="space-y-1">
                <h4 className="font-display font-semibold text-dark text-base">Processing Authorization...</h4>
                <p className="text-xs text-gray-400 max-w-[280px]">Contacting luxury settlement rails and validating package insurance.</p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && placedOrder && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                  Payment Authorized Successfully
                </span>
                <h3 className="font-display font-bold text-2xl text-dark">Order Confirmed!</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  Your premium artifacts are being curated, custom-polished, and prepped for complimentary express courier shipment.
                </p>
              </div>

              {/* Order Metadata summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 w-full max-w-sm space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-gray-100/50 pb-2">
                  <span className="text-gray-400 text-left">Order Reference</span>
                  <span className="text-dark font-bold text-right uppercase">{placedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100/50 pb-2">
                  <span className="text-gray-400 text-left">Tracking Number</span>
                  <span className="text-dark font-semibold text-right">{placedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100/50 pb-2">
                  <span className="text-gray-400 text-left">Shipment Method</span>
                  <span className="text-emerald-600 font-bold text-right">Express Insured Courier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-left">Net Amount Paid</span>
                  <span className="text-dark font-bold text-right">${placedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 w-full max-w-xs">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 bg-primary hover:bg-dark text-white rounded-xl text-xs font-semibold shadow-xl shadow-primary/20 cursor-pointer"
                >
                  Track Order in Dashboard
                </button>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
