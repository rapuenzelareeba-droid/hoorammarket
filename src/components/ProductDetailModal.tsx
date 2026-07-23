import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MessageSquarePlus, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch reviews for this product from Express backend
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews/${product.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    setSelectedColor(product.colors?.[0] || '');
    setSelectedSize(product.sizes?.[0] || '');
    setQuantity(1);
    setShowReviewForm(false);
    setNewComment('');
    setNewName('');
    setNewRating(5);
  }, [product]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newName.trim(),
          rating: newRating,
          comment: newComment.trim()
        })
      });

      if (res.ok) {
        // Refresh product reviews
        fetchReviews();
        setNewComment('');
        setNewName('');
        setNewRating(5);
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error('Error writing review:', err);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark/60 backdrop-blur-md"
      />

      {/* Main Content Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-gray-100 rounded-full shadow-lg border border-gray-100 text-dark hover:text-primary z-20 cursor-pointer transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Media Display */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center relative p-6 h-[40vh] md:h-auto">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl max-h-[35vh] md:max-h-[50vh]"
          />
          <div className="absolute bottom-6 left-6 flex flex-col gap-1.5 pointer-events-none">
            <span className="px-3 py-1 bg-dark/70 backdrop-blur-sm text-white text-[10px] font-mono rounded-full uppercase tracking-wider">
              {product.brand}
            </span>
          </div>
        </div>

        {/* Right Column: Information & Selections (Scrollable) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex-grow h-[45vh] md:h-auto space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">{product.category}</span>
            <h2 className="font-display font-bold text-2xl text-dark leading-tight">{product.name}</h2>
            
            {/* Rating summary */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold ml-1 text-dark">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.reviewsCount} verified purchases)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-bold font-mono text-dark">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through font-mono">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-sm text-gray-600 font-light leading-relaxed">{product.description}</p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark">Select Finish</span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${selectedColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark">Select Size</span>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-medium border rounded-xl transition-all cursor-pointer ${selectedSize === size ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions Grid */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-gray-100">
            {product.stock > 0 && (
              <div className="flex items-center border border-gray-200 rounded-xl px-2">
                <button
                  onClick={handleDecrement}
                  className="px-3 py-2 text-gray-500 hover:text-dark font-bold text-lg cursor-pointer"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-10 text-center font-mono text-sm text-dark font-semibold">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="px-3 py-2 text-gray-500 hover:text-dark font-bold text-lg cursor-pointer"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            )}

            <div className="flex-grow flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product, quantity, selectedColor, selectedSize)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white shadow-lg cursor-pointer transition-colors ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-dark shadow-primary/20'}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock === 0 ? 'Sold Out' : 'Add to Shopping Bag'}</span>
              </motion.button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 border rounded-xl transition-colors cursor-pointer ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Standard Assurances Banner */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-500 font-medium">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-primary/80" />
              <span>Genuine Product</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-primary/80" />
              <span>Complimentary Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-5 h-5 text-primary/80" />
              <span>30-Day Luxury Returns</span>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark block">Technical Specifications</span>
            <div className="bg-gray-50/60 rounded-2xl p-4 border border-gray-100/50 space-y-2 text-xs">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 border-b border-gray-100/30 last:border-0 font-mono">
                  <span className="text-gray-400">{key}</span>
                  <span className="text-dark font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Reviews Log */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark">Verified Reviews</span>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Review Input Box */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddReview}
                  className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3 overflow-hidden text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Rating</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Review Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with this premium craftsmanship..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-600 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4.5 py-1.5 bg-primary hover:bg-dark text-white rounded-lg font-medium shadow-md cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of customer reviews */}
            <div className="space-y-3">
              {loadingReviews ? (
                <div className="text-center text-xs text-gray-400 py-4 font-mono">Loading feedback log...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-4 font-mono">No feedback logged. Be the first to write!</div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-dark font-display">{r.userName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{r.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 font-light leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
