import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Tag, Ticket, HelpCircle } from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (appliedCoupon: Coupon | null, discountAmount: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Validate coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError('');
    setIsValidating(true);

    try {
      const res = await fetch(`/api/coupons/validate/${couponCode}`);
      if (res.ok) {
        const coupon: Coupon = await res.json();
        
        if (subtotal < coupon.minPurchase) {
          setCouponError(`This coupon requires a minimum purchase of $${coupon.minPurchase}.`);
          setAppliedCoupon(null);
        } else {
          setAppliedCoupon(coupon);
        }
      } else {
        const err = await res.json();
        setCouponError(err.error || 'Invalid promotion code.');
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error('Error validating coupon:', err);
      setCouponError('System unable to validate code at this time.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Compute discount value
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = subtotal * (appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full rounded-l-3xl border-l border-gray-100"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span className="font-display font-semibold text-lg text-dark">Your Shopping Bag</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-dark transition-colors cursor-pointer"
                  title="Close Cart"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Items List (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-dark text-base">Your bag is empty</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                        Add items from our premium catalogs to start your collection.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-primary hover:bg-dark text-white rounded-full text-xs font-semibold shadow-md shadow-primary/15 transition-all cursor-pointer"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                      className="flex gap-4 p-3 hover:bg-gray-50/50 rounded-2xl border border-gray-100/30 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Adjustments */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-dark line-clamp-1 font-display">
                            {item.product.name}
                          </h4>
                          <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400">
                            {item.product.brand}
                          </span>
                          
                          {/* Selected Finish Labels */}
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="flex gap-2 mt-0.5">
                              {item.selectedColor && (
                                <span className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
                                  Color: 
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block border border-gray-200"
                                    style={{ backgroundColor: item.selectedColor }}
                                  />
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="text-[9px] text-gray-500 font-mono">
                                  Size: <span className="font-semibold text-dark">{item.selectedSize}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center border border-gray-200 rounded-lg px-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-gray-500 hover:text-dark font-semibold text-xs cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-mono text-xs font-semibold text-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-gray-500 hover:text-dark font-semibold text-xs cursor-pointer"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-bold font-mono text-dark">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors self-center cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Summary & Coupon Section */}
              {cart.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-4">
                  {/* Coupon form */}
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Promo Code (e.g. WELCOME20)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 bg-white rounded-xl text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary uppercase font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isValidating || !couponCode.trim()}
                          className="px-4.5 py-2 bg-primary hover:bg-dark disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-colors"
                        >
                          {isValidating ? 'Validating...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[10px] text-red-500 font-medium pl-1">{couponError}</p>
                      )}
                      <p className="text-[9px] text-gray-400 pl-1 font-mono">
                        💡 Try code <span className="font-semibold text-primary">WELCOME20</span> (20% off) or <span className="font-semibold text-primary">APEX50</span> ($50 off)
                      </p>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Ticket className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-bold font-mono">{appliedCoupon.code}</p>
                          <p className="text-[10px] text-emerald-600 font-light">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-emerald-800 hover:text-red-500 font-bold px-2 py-1 hover:bg-white rounded-lg cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-bold">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-dark font-bold text-sm pt-2 border-t border-gray-200/50">
                      <span className="font-display">Estimated Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Proceed CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onProceedToCheckout(appliedCoupon, discount)}
                    className="w-full py-4 bg-primary hover:bg-dark text-white rounded-xl text-xs font-semibold shadow-xl shadow-primary/25 cursor-pointer text-center"
                  >
                    Proceed to Complimentary Checkout
                  </motion.button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
