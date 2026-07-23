import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Sparkles, LayoutDashboard, ChevronDown, BookOpen, Crown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';

interface NavbarProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenDashboard: (view: 'customer' | 'admin' | 'about' | 'vip' | null) => void;
  onOpenAIChat: () => void;
  activeView: 'customer' | 'admin' | 'about' | 'vip' | null;
}

export default function Navbar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenDashboard,
  onOpenAIChat,
  activeView
}: NavbarProps) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => {
                onSelectCategory(null);
                onOpenDashboard(null);
                closeMobileMenu();
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                H
              </div>
              <span className="font-display font-bold text-lg sm:text-2xl tracking-tight text-dark">
                HOORAM<span className="text-primary font-light">MARKET</span>
              </span>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search premium electronics, sustainable fashion..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-dark transition-all placeholder-gray-400"
            />
          </div>

          {/* Navigation Controls - Desktop & Mobile Quick Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            
            {/* Quick Mobile Search Toggle Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-2 text-dark hover:text-primary transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick AI Assistant Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAIChat}
              className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              <span className="hidden xs:inline">Ask AI</span>
            </motion.button>

            {/* Categories Menu - Desktop */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-dark hover:text-primary transition-colors cursor-pointer font-medium"
              >
                <span>Shop</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showCategoryMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCategoryMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          onSelectCategory(null);
                          onOpenDashboard(null);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${!activeCategory && !activeView ? 'bg-primary/5 text-primary font-medium' : 'text-dark hover:bg-gray-50'}`}
                      >
                        All Offerings
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onOpenDashboard(null);
                            setShowCategoryMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeCategory === cat.id ? 'bg-primary/5 text-primary font-medium' : 'text-dark hover:bg-gray-50'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Brand Story Link - Desktop */}
            <button
              onClick={() => {
                onSelectCategory(null);
                onOpenDashboard('about');
              }}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-sm transition-colors cursor-pointer ${
                activeView === 'about' ? 'text-primary font-semibold' : 'text-dark hover:text-primary font-medium'
              }`}
              title="Brand Story"
            >
              <BookOpen className="w-4 h-4" />
              <span>Brand Story</span>
            </button>

            {/* VIP Club Link - Desktop */}
            <button
              onClick={() => {
                onSelectCategory(null);
                onOpenDashboard('vip');
              }}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-sm transition-colors cursor-pointer ${
                activeView === 'vip' ? 'text-primary font-semibold' : 'text-dark hover:text-primary font-medium'
              }`}
              title="VIP Club"
            >
              <Crown className="w-4 h-4" />
              <span>VIP Club</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 text-dark hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 text-dark hover:text-primary transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dashboards Toggle - Desktop */}
            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onOpenDashboard('customer')}
                className={`p-2.5 transition-colors rounded-full hover:bg-gray-100 cursor-pointer ${
                  activeView === 'customer' ? 'text-primary' : 'text-dark hover:text-primary'
                }`}
                title="Customer Dashboard"
              >
                <User className="w-5.5 h-5.5" />
              </button>
              
              <button
                onClick={() => onOpenDashboard('admin')}
                className={`p-2.5 transition-colors rounded-full hover:bg-gray-100 cursor-pointer ${
                  activeView === 'admin' ? 'text-primary' : 'text-dark hover:text-primary'
                }`}
                title="Admin Control Center"
              >
                <LayoutDashboard className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-dark hover:text-primary rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden pb-3 overflow-hidden"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="block w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full bg-white text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Mobile Search input inside drawer if not expanded */}
              {!showMobileSearch && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search electronics, fashion..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="block w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-dark focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold mb-1">Navigation</p>
                
                <button
                  onClick={() => {
                    onSelectCategory(null);
                    onOpenDashboard(null);
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                    !activeCategory && !activeView ? 'bg-primary/10 text-primary' : 'text-dark hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Storefront Home</span>
                </button>

                <button
                  onClick={() => {
                    onSelectCategory(null);
                    onOpenDashboard('about');
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                    activeView === 'about' ? 'bg-primary/10 text-primary' : 'text-dark hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Brand Story</span>
                </button>

                <button
                  onClick={() => {
                    onSelectCategory(null);
                    onOpenDashboard('vip');
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                    activeView === 'vip' ? 'bg-primary/10 text-primary' : 'text-dark hover:bg-gray-50'
                  }`}
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>VIP Club & Loyalty</span>
                </button>

                <button
                  onClick={() => {
                    onOpenDashboard('customer');
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                    activeView === 'customer' ? 'bg-primary/10 text-primary' : 'text-dark hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Customer Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onOpenDashboard('admin');
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                    activeView === 'admin' ? 'bg-primary/10 text-primary' : 'text-dark hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </button>
              </div>

              {/* Shop Categories Accordion/List */}
              <div className="pt-2 border-t border-gray-100">
                <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold mb-1">Categories</p>
                
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      onSelectCategory(null);
                      onOpenDashboard(null);
                      closeMobileMenu();
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left truncate ${
                      !activeCategory && !activeView ? 'bg-primary text-white font-bold' : 'bg-gray-50 text-dark hover:bg-gray-100'
                    }`}
                  >
                    All Offerings
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onOpenDashboard(null);
                        closeMobileMenu();
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left truncate ${
                        activeCategory === cat.id ? 'bg-primary text-white font-bold' : 'bg-gray-50 text-dark hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

