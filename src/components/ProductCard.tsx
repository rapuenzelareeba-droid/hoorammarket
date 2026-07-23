import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, Eye, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onViewDetails,
  onAddToCart
}: ProductCardProps) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to highly reliable premium placeholder if the unsplash image fails to load
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-dark/5 group-hover:bg-dark/0 transition-colors" />

        {/* Action Triggers Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-3 bg-white hover:bg-primary text-dark hover:text-white rounded-full shadow-lg transition-colors cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`p-3 bg-primary text-white rounded-full shadow-lg transition-all cursor-pointer ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:bg-dark'}`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Wishlist Top Corner button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-md text-dark hover:text-red-500 transition-colors cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </motion.button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-mono font-bold bg-amber-500 text-white rounded-full uppercase tracking-wider shadow-sm">
              <Percent className="w-2.5 h-2.5" />
              <span>Save {discountPercent}%</span>
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-primary text-white rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Brand */}
        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
          {product.brand}
        </span>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="font-display font-semibold text-dark text-base mt-1 line-clamp-2 hover:text-primary transition-colors cursor-pointer flex-grow"
        >
          {product.name}
        </h3>

        {/* Reviews Summary */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-semibold text-dark ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewsCount} reviews)</span>
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {product.colors.map((c) => (
              <span
                key={c}
                className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-xs"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Pricing and Stock footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-dark font-mono">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-mono">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock Tracker */}
            <div className="mt-1">
              {isOutOfStock ? (
                <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-dark shadow-lg shadow-primary/15'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
