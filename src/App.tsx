import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, SlidersHorizontal, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import BrandStoryPage from './components/BrandStoryPage';
import VipClubPage from './components/VipClubPage';
import { Product, Category, CartItem, Order, Coupon } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data';

export default function App() {
  // Global Catalogs & Database States loaded from Express APIs
  // Using robust initial fallbacks so the app remains fully functional on static hosting (Vercel, Netlify)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Wishlist persistence (Local Storage bindings for state safety)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('apex_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('apex_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal & Drawer triggers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  
  // Checkout coordinates
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Dashboard Toggle ('customer' | 'admin' | 'about' | 'vip' | null (Storefront))
  const [dashboardView, setDashboardView] = useState<'customer' | 'admin' | 'about' | 'vip' | null>(null);

  // Sorting State
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');

  // Sync state with local storage
  useEffect(() => {
    localStorage.setItem('apex_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('apex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Initial Data Fetching from fullstack Express API endpoints
  const refreshAllData = async () => {
    try {
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }

      const cRes = await fetch('/api/categories');
      if (cRes.ok) {
        const cData = await cRes.json();
        setCategories(cData);
      }

      const oRes = await fetch('/api/orders');
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData);
      }
    } catch (e) {
      console.error('Error synchronizing data with backend:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Cart Management Methods
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => 
          item.product.id === product.id &&
          item.selectedColor === (color || product.colors?.[0]) &&
          item.selectedSize === (size || product.sizes?.[0])
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = Math.min(product.stock, updated[existingIdx].quantity + quantity);
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor: color || product.colors?.[0],
            selectedSize: size || product.sizes?.[0]
          }
        ];
      }
    });

    // Animate visual opening of the cart drawer for premium response feel
    setIsCartOpen(true);
    setSelectedProduct(null); // Close product details if open
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => 
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Management Methods
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Initiate Checkout modal
  const handleProceedToCheckout = (coupon: Coupon | null, discount: number) => {
    setActiveCoupon(coupon);
    setDiscountAmount(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Callback on order completed
  const handleOrderPlaced = (newOrder: Order) => {
    setCart([]); // Clear shopping bag
    setIsCheckoutOpen(false);
    setOrders((prev) => [newOrder, ...prev]);
    refreshAllData(); // Pull fresh inventory stock counts from Express server

    // Set view to customer dashboard to track order path instantly
    setDashboardView('customer');
  };

  // Multi-criteria Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'newest') {
        const getNum = (id: string) => {
          const parsed = parseInt(id.replace('prod-', ''), 10);
          return isNaN(parsed) ? 0 : parsed;
        };
        return getNum(b.id) - getNum(a.id);
      }
      return 0; // Default order
    });

  return (
    <div className="min-h-screen bg-secondary text-dark flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Dynamic Header Component */}
      <Navbar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setActiveCategory(id);
          setDashboardView(null); // Switch back to storefront on category select
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setDashboardView(null); // Switch back to storefront on search query
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setDashboardView('customer');
        }}
        onOpenDashboard={(view) => setDashboardView(view)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        activeView={dashboardView}
      />

      {/* Main View Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        
        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="font-mono text-xs text-gray-400">Loading catalog assets...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* 1. STATEFUL CUSTOMER OR ADMIN DASHBOARD PAGE VIEW */}
            {dashboardView ? (
              <motion.div
                key={`dashboard-view-${dashboardView}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Back Link */}
                <button
                  onClick={() => setDashboardView(null)}
                  className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-dark cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Return to Boutique Storefront</span>
                </button>

                {dashboardView === 'about' ? (
                  <BrandStoryPage />
                ) : dashboardView === 'vip' ? (
                  <VipClubPage />
                ) : (
                  <Dashboard
                    viewType={dashboardView as 'customer' | 'admin'}
                    products={products}
                    orders={orders}
                    onRefreshData={refreshAllData}
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                )}
              </motion.div>
            ) : (
              
              /* 2. REGULAR STOREFRONT VIEW */
              <motion.div
                key="storefront-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Visual Banner slideshow */}
                <Hero 
                  onExplore={(catId) => {
                    setActiveCategory(catId);
                    setDashboardView(null);
                  }} 
                />

                {/* Categories Fast Filter Bar */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-dark tracking-tight">Curated Catalogs</h2>
                      <p className="text-xs text-gray-400">Precision selections calibrated to clean lifestyle metrics.</p>
                    </div>
                    {activeCategory && (
                      <button
                        onClick={() => {
                          setActiveCategory(null);
                          setSortBy('default');
                        }}
                        className="text-xs font-mono font-bold uppercase text-primary hover:underline cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-1">
                      <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all ${!activeCategory ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-200'}`}
                      >
                        All Offerings
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all ${activeCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-200'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* Sorting selector dropdown */}
                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Sort By:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-xs font-bold text-dark focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="default">Default / Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search result header if query active */}
                {searchQuery && (
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span>Showing {filteredProducts.length} premium results matching <span className="font-bold text-dark">"{searchQuery}"</span></span>
                  </div>
                )}

                {/* Grid List representation */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-100">
                      <Sparkles className="w-7 h-7 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-dark text-base">No Matching Artifacts</h3>
                      <p className="text-xs text-gray-400 mt-1">Try broadening your search guidelines or filters.</p>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product) => (
                        <div key={product.id}>
                          <ProductCard
                            product={product}
                            isWishlisted={wishlist.some((p) => p.id === product.id)}
                            onToggleWishlist={handleToggleWishlist}
                            onViewDetails={(p) => setSelectedProduct(p)}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        )}

      </main>

      {/* Footer Branding Area */}
      <footer className="bg-dark text-white border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs font-light text-gray-400">
          <div className="space-y-4">
            <span className="font-display font-bold text-lg tracking-tight text-white">
              HOORAM<span className="text-primary font-light">MARKET</span>
            </span>
            <p className="leading-relaxed">
              An elite digital shopping experience serving pure, high-end acoustic micro-engineering, tailored organic fibers, and luxury lifestyle apparatus.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider font-display">Active Storefront Guarantees</h4>
            <p>🛡️ Triple PCI-DSS Encrypted Checkouts</p>
            <p>✈️ Fully Insured Express Courier Shipments</p>
            <p>🔄 30-Day No-Hassle Luxury Returns</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider font-display">Boutique Inquiries</h4>
            <p>📞 Phone: +1 (800) HOORAM-LUX</p>
            <p>📧 Email: concierge@hoorammarket.luxury</p>
            <p>📍 Office: Seattle, Washington State, US</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mt-8 border-t border-white/5 text-[10px] text-gray-500 font-mono">
          © 2026 HooramMarket Inc. All Rights Reserved. Fully Certified Full Stack Security Encrypted Sandbox.
        </div>
      </footer>

      {/* ==========================================
          MODALS & DRAWER FLOATING TRIGGERS
          ========================================== */}
      
      {/* 1. Detailed Product view popup */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isWishlisted={wishlist.some((p) => p.id === selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </AnimatePresence>

      {/* 2. Side-sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Secure Checkout multi-step console modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cart={cart}
            appliedCoupon={activeCoupon}
            discountAmount={discountAmount}
            onOrderPlaced={handleOrderPlaced}
          />
        )}
      </AnimatePresence>

      {/* 4. AI Shopping Concierge Advisor */}
      <AIAssistant
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOpen={() => setIsAIChatOpen(true)}
      />

    </div>
  );
}
