import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, LayoutDashboard, Heart, History, Plus, Edit2, Trash2, ShoppingBag, 
  MapPin, CheckCircle, Package, Truck, Compass, BarChart3, LineChart, PieChart,
  DollarSign, TrendingUp, RefreshCw, X, SlidersHorizontal, ListCollapse
} from 'lucide-react';
import { Product, Order, Coupon, AdminStats } from '../types';
import { 
  ResponsiveContainer, LineChart as ReLineChart, Line, BarChart as ReBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell 
} from 'recharts';

interface DashboardProps {
  viewType: 'customer' | 'admin';
  products: Product[];
  orders: Order[];
  onRefreshData: () => void;
  onAddToCart: (product: Product) => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
}

export default function Dashboard({
  viewType,
  products,
  orders,
  onRefreshData,
  onAddToCart,
  wishlist,
  onRemoveFromWishlist
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'orders' | 'admin-products' | 'admin-orders' | 'admin-analytics'>('profile');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOrigPrice, setFormOrigPrice] = useState('');
  const [formCategory, setFormCategory] = useState('electronics');
  const [formBrand, setFormBrand] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formImage, setFormImage] = useState('');
  const [formSpecsKey1, setFormSpecsKey1] = useState('Finish');
  const [formSpecsVal1, setFormSpecsVal1] = useState('Space Black');
  const [formSpecsKey2, setFormSpecsKey2] = useState('Warranty');
  const [formSpecsVal2, setFormSpecsVal2] = useState('2-Year Platinum Coverage');

  useEffect(() => {
    if (viewType === 'admin') {
      setActiveTab('admin-analytics');
      fetchStats();
    } else {
      setActiveTab('profile');
    }
  }, [viewType]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Error fetching admin stats:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormDesc(p.description);
    setFormPrice(p.price.toString());
    setFormOrigPrice(p.originalPrice?.toString() || '');
    setFormCategory(p.category);
    setFormBrand(p.brand);
    setFormStock(p.stock.toString());
    setFormImage(p.image);
    
    const keys = Object.keys(p.specs);
    setFormSpecsKey1(keys[0] || 'Finish');
    setFormSpecsVal1(p.specs[keys[0]] || '');
    setFormSpecsKey2(keys[1] || 'Warranty');
    setFormSpecsVal2(p.specs[keys[1]] || '');
    
    setShowProductForm(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormOrigPrice('');
    setFormCategory('electronics');
    setFormBrand('');
    setFormStock('15');
    setFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600');
    setFormSpecsKey1('Finish');
    setFormSpecsVal1('Polished Silver');
    setFormSpecsKey2('Warranty');
    setFormSpecsVal2('1-Year Express coverage');
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formName,
      description: formDesc,
      price: Number(formPrice),
      originalPrice: formOrigPrice ? Number(formOrigPrice) : undefined,
      category: formCategory,
      brand: formBrand,
      stock: Number(formStock),
      image: formImage,
      specs: {
        [formSpecsKey1]: formSpecsVal1,
        [formSpecsKey2]: formSpecsVal2
      }
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowProductForm(false);
        onRefreshData();
        fetchStats();
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to retire this product from catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
        fetchStats();
      }
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onRefreshData();
        fetchStats();
      }
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  // Get order progress percentage for tracking display
  const getOrderProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'processing': return 'Custom Polishing & Packing';
      case 'shipped': return 'In Transit via Express Courier';
      case 'delivered': return 'Delivered & Hand-verified';
      default: return status;
    }
  };

  const COLORS_PIE = ['#215E61', '#4A5568', '#B5945B', '#E5E7EB'];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 space-y-8">
        
        {/* User Identity Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
            {viewType === 'admin' ? 'A' : 'AS'}
          </div>
          <div>
            <h4 className="font-display font-bold text-dark text-sm">
              {viewType === 'admin' ? 'Chief Administrator' : 'Alexander Sterling'}
            </h4>
            <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400">
              {viewType === 'admin' ? 'Management Level' : 'Platinum Account'}
            </span>
          </div>
        </div>

        {/* Dynamic Sidebar Buttons */}
        <div className="space-y-1.5">
          {viewType === 'customer' ? (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <User className="w-4 h-4" />
                <span>Profile Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'wishlist' ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Heart className="w-4 h-4" />
                <span>Your Wishlist ({wishlist.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <History className="w-4 h-4" />
                <span>Order History ({orders.length})</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('admin-analytics')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'admin-analytics' ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Business Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-products')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'admin-products' ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Package className="w-4 h-4" />
                <span>Manage Inventory</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-orders')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'admin-orders' ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Truck className="w-4 h-4" />
                <span>Fulfillment Logs ({orders.length})</span>
              </button>
            </>
          )}
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={onRefreshData}
            className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-gray-400 hover:text-primary cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Sync Live Server</span>
          </button>
        </div>

      </div>

      {/* Main content viewport */}
      <div className="flex-1 p-6 sm:p-8 overflow-x-hidden">
        
        {/* ==========================================
            CUSTOMER TAB: BIOGRAPHICAL PROFILE
            ========================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display font-bold text-xl text-dark">Profile Overview</h3>
              <p className="text-xs text-gray-400">Manage your private shipping coordinates and tiers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account profile card */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4">
                <span className="text-[10px] uppercase font-mono text-primary font-bold tracking-widest block">User Credentials</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Full Name</span>
                    <span className="text-dark font-medium">Alexander Sterling</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Email Address</span>
                    <span className="text-dark font-medium">sterling@apex.luxury</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Membership Class</span>
                    <span className="text-primary font-bold">VIP Platinum Elite</span>
                  </div>
                </div>
              </div>

              {/* Saved Addresses card */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
                <div className="flex items-center gap-1.5 text-primary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest">Active Coordinates</span>
                </div>
                <div className="text-xs text-dark space-y-1">
                  <p className="font-medium">Primary Residence</p>
                  <p className="text-gray-500 font-light">742 Bellevue Avenue, Penthouse B</p>
                  <p className="text-gray-500 font-light">Seattle, WA 98102</p>
                  <p className="text-gray-400 font-mono mt-1">+1 (555) 902-1842</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            CUSTOMER TAB: WISHLIST
            ========================================== */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display font-bold text-xl text-dark">Your Curated Wishlist</h3>
              <p className="text-xs text-gray-400">Exclusive items saved for future verification.</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-gray-400">
                <Heart className="w-10 h-10 mx-auto text-gray-200" />
                <p className="text-xs font-mono">Your wishlist is currently clear.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((p) => (
                  <div key={p.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                    <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-dark line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">{p.brand}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold font-mono">${p.price.toFixed(2)}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onRemoveFromWishlist(p)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onAddToCart(p)}
                            className="px-3 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Add Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            CUSTOMER TAB: ORDER HISTORY TRACKER
            ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display font-bold text-xl text-dark">Order History & Trackers</h3>
              <p className="text-xs text-gray-400">Monitor package insurance and delivery paths.</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-gray-400">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-200" />
                <p className="text-xs font-mono">No orders found on this session database.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const progress = getOrderProgress(order.status);
                  return (
                    <div key={order.id} className="p-5 border border-gray-100 rounded-2xl space-y-4 shadow-sm">
                      {/* Order metadata banner */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-gray-50 px-4 py-3 rounded-xl text-xs font-mono">
                        <div>
                          <span className="text-gray-400">Order ID: </span>
                          <span className="text-dark font-bold uppercase">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tracking: </span>
                          <span className="text-primary font-semibold">{order.trackingNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Total: </span>
                          <span className="text-dark font-bold">${order.total.toFixed(2)}</span>
                        </div>
                        <span className="text-[10px] uppercase text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          Express Insured
                        </span>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex justify-between items-center text-xs">
                            <span className="text-dark font-medium max-w-xs truncate">{item.product.name} (x{item.quantity})</span>
                            <span className="text-gray-400 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dynamic status tracker progress bar */}
                      <div className="space-y-2 pt-2 border-t border-gray-50">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Logistics Status:</span>
                          <span className="text-primary font-bold">{getOrderStatusLabel(order.status)}</span>
                        </div>
                        
                        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6 }}
                            className="absolute top-0 left-0 h-full bg-primary rounded-full"
                          />
                        </div>

                        {/* Tracker step labels */}
                        <div className="grid grid-cols-4 text-center text-[9px] text-gray-400 font-semibold font-mono">
                          <span className={order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-primary' : ''}>Received</span>
                          <span className={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-primary' : ''}>Polishing</span>
                          <span className={order.status === 'shipped' || order.status === 'delivered' ? 'text-primary' : ''}>Transit</span>
                          <span className={order.status === 'delivered' ? 'text-primary' : ''}>Delivered</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            ADMIN TAB: BUSINESS ANALYTICS
            ========================================== */}
        {activeTab === 'admin-analytics' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display font-bold text-xl text-dark">Business Analytics Dashboard</h3>
              <p className="text-xs text-gray-400">Simulated real-time business volumes and performance indicators.</p>
            </div>

            {loadingStats ? (
              <div className="text-center py-12 font-mono text-xs text-gray-400">Compiling financial aggregates...</div>
            ) : stats ? (
              <div className="space-y-6">
                
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Total Revenue</span>
                      <p className="text-base font-bold font-mono text-dark">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Fulfillment Count</span>
                      <p className="text-base font-bold font-mono text-dark">{stats.totalOrders} Orders</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Active Inventory</span>
                      <p className="text-base font-bold font-mono text-dark">{stats.totalProducts} Products</p>
                    </div>
                  </div>
                </div>

                {/* Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Recharts Area/Line Chart */}
                  <div className="p-5 border border-gray-100 rounded-3xl bg-white space-y-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark block">Sales Revenue Development</span>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart data={stats.monthlySales}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" stroke="#A0AEC0" fontSize={11} fontStyle="italic" />
                          <YAxis stroke="#A0AEC0" fontSize={11} />
                          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                          <Line type="monotone" dataKey="sales" stroke="#215E61" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts Pie Chart */}
                  <div className="p-5 border border-gray-100 rounded-3xl bg-white space-y-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark block">Revenue Share by Category</span>
                    <div className="h-64 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={stats.categorySales}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.categorySales.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                          <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 font-mono text-xs">Error loading dashboard aggregates.</div>
            )}
          </div>
        )}

        {/* ==========================================
            ADMIN TAB: MANAGE INVENTORY
            ========================================== */}
        {activeTab === 'admin-products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-dark">Inventory Management</h3>
                <p className="text-xs text-gray-400">Add, refine, or retire design specifications from catalog.</p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-dark text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-primary/15 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Slide Down Form Overlay */}
            <AnimatePresence>
              {showProductForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 border border-gray-100 rounded-3xl p-5 overflow-hidden"
                >
                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                        {editingProduct ? 'Edit Catalog Specifications' : 'New Product Formulation'}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setShowProductForm(false)}
                        className="text-gray-400 hover:text-dark cursor-pointer"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Product Title</label>
                        <input
                          type="text" required value={formName} onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Manufacturer Brand</label>
                        <input
                          type="text" required value={formBrand} onChange={(e) => setFormBrand(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Long Description</label>
                      <textarea
                        required rows={3} value={formDesc} onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-dark focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Pricing ($)</label>
                        <input
                          type="number" step="0.01" required value={formPrice} onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Strike Price ($)</label>
                        <input
                          type="number" step="0.01" value={formOrigPrice} onChange={(e) => setFormOrigPrice(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Stock Count</label>
                        <input
                          type="number" required value={formStock} onChange={(e) => setFormStock(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Section Category</label>
                        <select
                          value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none font-medium"
                        >
                          <option value="electronics">Electronics & Gadgets</option>
                          <option value="fashion">Fashion & Apparel</option>
                          <option value="home">Smart Home & Living</option>
                          <option value="fitness">Fitness & Outdoors</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Image Asset URL</label>
                      <input
                        type="text" required value={formImage} onChange={(e) => setFormImage(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-dark focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-200/50">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block">Catalog Specs Key-Value</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex gap-2">
                          <input type="text" placeholder="Key 1" value={formSpecsKey1} onChange={(e) => setFormSpecsKey1(e.target.value)} className="w-1/3 bg-white border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none" />
                          <input type="text" placeholder="Val 1" value={formSpecsVal1} onChange={(e) => setFormSpecsVal1(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none" />
                        </div>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Key 2" value={formSpecsKey2} onChange={(e) => setFormSpecsKey2(e.target.value)} className="w-1/3 bg-white border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none" />
                          <input type="text" placeholder="Val 2" value={formSpecsVal2} onChange={(e) => setFormSpecsVal2(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button" onClick={() => setShowProductForm(false)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary hover:bg-dark text-white rounded-xl font-bold shadow-lg shadow-primary/10 cursor-pointer"
                      >
                        Formulate & Save
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inventory table */}
            <div className="overflow-x-auto border border-gray-100 rounded-3xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] uppercase font-mono tracking-wider text-gray-500">
                    <th className="p-4">Artifact</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Retail Price</th>
                    <th className="p-4 text-center">In-Stock</th>
                    <th className="p-4 text-center">Edit / Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-dark">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-4 flex items-center gap-3 max-w-xs">
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-9 h-9 object-cover rounded-xl border border-gray-100" />
                        <div>
                          <p className="font-semibold line-clamp-1">{p.name}</p>
                          <span className="text-[9px] text-gray-400 font-mono uppercase">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-4 uppercase font-mono text-[10px] text-primary">{p.category}</td>
                      <td className="p-4 font-mono font-bold">${p.price.toFixed(2)}</td>
                      <td className="p-4 text-center font-mono font-medium">
                        <span className={`px-2.5 py-0.5 rounded-full ${p.stock <= 0 ? 'bg-red-50 text-red-600' : p.stock <= 5 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-primary rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ==========================================
            ADMIN TAB: ORDER FULFILLMENT LOGS
            ========================================== */}
        {activeTab === 'admin-orders' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display font-bold text-xl text-dark">Logistics & Fulfillment Center</h3>
              <p className="text-xs text-gray-400">Update shipping progress and coordinate express courier dispatches.</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-gray-400">
                <Truck className="w-10 h-10 mx-auto text-gray-200" />
                <p className="text-xs font-mono">No customer orders recorded in system yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-5 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    
                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-dark uppercase">{o.id}</span>
                        <span className="text-[9px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          {o.trackingNumber}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        <p className="font-medium text-dark">Recipient: {o.shippingAddress.fullName}</p>
                        <p className="font-light">{o.shippingAddress.street}, {o.shippingAddress.city}</p>
                        <p className="text-[10px] mt-1 font-mono">Date: {new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Price and status changer dropdown */}
                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-4">
                      <span className="font-mono text-sm font-bold text-dark">${o.total.toFixed(2)}</span>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Status</label>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none font-semibold text-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Polishing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
