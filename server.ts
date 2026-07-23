import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_CATEGORIES, INITIAL_REVIEWS } from './src/data.js';
import { Product, Order, Coupon, Review, CartItem } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Databases (State lasts as long as the server container is active)
let products: Product[] = [...INITIAL_PRODUCTS];
let categories = [...INITIAL_CATEGORIES];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let orders: Order[] = [];

// Helper to get Gemini Client safely
function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '') {
    return new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return null;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Products CRUD
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name || 'New Product',
    description: req.body.description || '',
    price: Number(req.body.price) || 0,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    rating: 5.0,
    reviewsCount: 0,
    image: req.body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    category: req.body.category || 'electronics',
    brand: req.body.brand || 'Generic',
    stock: Number(req.body.stock) || 10,
    specs: req.body.specs || {},
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    colors: Array.isArray(req.body.colors) ? req.body.colors : [],
    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
    isFeatured: !!req.body.isFeatured
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    name: req.body.name ?? products[index].name,
    description: req.body.description ?? products[index].description,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    originalPrice: req.body.originalPrice !== undefined ? (req.body.originalPrice ? Number(req.body.originalPrice) : undefined) : products[index].originalPrice,
    category: req.body.category ?? products[index].category,
    brand: req.body.brand ?? products[index].brand,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock,
    specs: req.body.specs ?? products[index].specs,
    tags: req.body.tags ?? products[index].tags,
    colors: req.body.colors ?? products[index].colors,
    sizes: req.body.sizes ?? products[index].sizes,
    isFeatured: req.body.isFeatured !== undefined ? !!req.body.isFeatured : products[index].isFeatured,
    image: req.body.image ?? products[index].image
  };

  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', id });
});

// 2. Categories List
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// 3. Coupon Validation
app.get('/api/coupons', (req, res) => {
  res.json(coupons);
});

app.post('/api/coupons', (req, res) => {
  const { code, discountType, value, minPurchase, description } = req.body;
  if (!code || !discountType || value === undefined) {
    return res.status(400).json({ error: 'Missing coupon parameters' });
  }
  const newCoupon: Coupon = {
    code: code.toUpperCase().trim(),
    discountType,
    value: Number(value),
    minPurchase: Number(minPurchase) || 0,
    isActive: true,
    description: description || `${discountType === 'percentage' ? `${value}%` : `$${value}`} discount`
  };
  coupons.push(newCoupon);
  res.status(201).json(newCoupon);
});

app.get('/api/coupons/validate/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const coupon = coupons.find(c => c.code === code);
  if (!coupon) {
    return res.status(404).json({ error: 'Coupon not found' });
  }
  if (!coupon.isActive) {
    return res.status(400).json({ error: 'Coupon is inactive' });
  }
  res.json(coupon);
});

// 4. Orders CRUD
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { items, subtotal, discount, total, couponCode, shippingAddress, paymentMethod } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
    return res.status(400).json({ error: 'Missing shipping details' });
  }

  // Deduct stocks
  for (const item of items as CartItem[]) {
    const prod = products.find(p => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  const newOrder: Order = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount) || 0,
    total: Number(total),
    couponCode,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
    trackingNumber: `HRM-${Math.floor(100000 + Math.random() * 900000)}`
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (status) {
    order.status = status;
  }
  res.json(order);
});

// 5. Product Reviews
app.get('/api/reviews/:productId', (req, res) => {
  const { productId } = req.params;
  const prodReviews = reviews.filter(r => r.productId === productId);
  res.json(prodReviews);
});

app.post('/api/reviews', (req, res) => {
  const { productId, userName, rating, comment } = req.body;
  if (!productId || !userName || rating === undefined || !comment) {
    return res.status(400).json({ error: 'Missing review parameters' });
  }
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName,
    rating: Number(rating),
    comment,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };
  reviews.unshift(newReview);

  // Recalculate average rating
  const prod = products.find(p => p.id === productId);
  if (prod) {
    const prodReviews = reviews.filter(r => r.productId === productId);
    const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    prod.rating = Number((totalRating / prodReviews.length).toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  res.status(201).json(newReview);
});

// 6. Admin Analytics Stats
app.get('/api/admin-stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  // Compile monthly trends (last 5 months simulation)
  const monthlySales = [
    { month: 'Mar', sales: 4200, orders: 15 },
    { month: 'Apr', sales: 5800, orders: 22 },
    { month: 'May', sales: 8100, orders: 34 },
    { month: 'Jun', sales: 9500, orders: 40 },
    { month: 'Jul', sales: totalRevenue > 0 ? 11000 + totalRevenue : 11000, orders: 45 + totalOrders }
  ];

  // Compile category shares
  const categorySalesMap: Record<string, number> = {
    electronics: 4500,
    fashion: 3100,
    home: 2400,
    fitness: 1000
  };

  orders.forEach(o => {
    o.items.forEach(item => {
      const cat = item.product.category;
      const amt = item.product.price * item.quantity;
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + amt;
    });
  });

  const categorySales = Object.entries(categorySalesMap).map(([name, value]) => ({
    name: name === 'electronics' ? 'Electronics' : name === 'fashion' ? 'Fashion' : name === 'home' ? 'Smart Home' : 'Fitness',
    value: Number(value.toFixed(2))
  }));

  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    totalProducts,
    monthlySales,
    categorySales
  });
});

// 7. Secure Server-Side Gemini API Chat Agent
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Inject current product listing into prompt context
  const catalogSummary = products.map(p => 
    `- ${p.name} (Brand: ${p.brand}, Category: ${p.category}, Price: $${p.price}, Stock: ${p.stock}${p.originalPrice ? `, Was: $${p.originalPrice}` : ''})`
  ).join('\n');

  const couponSummary = coupons.map(c => 
    `- Code: ${c.code} (${c.description}, Min spend: $${c.minPurchase})`
  ).join('\n');

  const systemPrompt = `You are the highly advanced, sophisticated AI Shopping Assistant of HooramMarket.
Your purpose is to assist customers with product discovery, details, recommendations, and pricing.
Below is the current REAL-TIME product catalog and active discount coupons in our store:

=== HOORAMMARKET CATALOG ===
${catalogSummary}

=== ACTIVE STORE COUPONS ===
${couponSummary}

Guidelines:
1. Always base recommendations on the actual products in our catalog.
2. If the user asks for a recommendation, recommend 1 or 2 specific products from our list, explaining their specifications and why they fit.
3. Be professional, elegant, and customer-focused. Speak with luxurious charm.
4. Keep answers concise, helpful, and beautifully formatted in markdown.
5. If the user is looking for deals, highlight coupons they can apply!
6. Do NOT mention that you are an LLM or have been provided a text block. You are the integrated boutique AI companion of HooramMarket.`;

  const lastUserMsg = messages[messages.length - 1]?.content || 'Hello!';

  const generateFallbackResponse = () => {
    const query = lastUserMsg.toLowerCase();
    let reply = "Welcome to **HooramMarket**! I am your luxury AI Shopping Assistant.\n\nBased on our catalog, here is a curated selection for you:\n\n";

    if (query.includes('headphone') || query.includes('sound') || query.includes('music') || query.includes('audio') || query.includes('ear')) {
      const headphone = products.find(p => p.id === 'prod-1') || products[0];
      reply += `🎧 **${headphone?.name}** ($${headphone?.price})\n- Features dynamic hybrid noise cancelling and lambskin comfort. Perfect for focus or deep acoustic immersion.\n\nWould you like me to guide you to the checkout or show you active coupons?`;
    } else if (query.includes('watch') || query.includes('wearable') || query.includes('smartwatch')) {
      const watch = products.find(p => p.id === 'prod-2') || products[1];
      reply += `⌚ **${watch?.name}** ($${watch?.price})\n- A luxurious hybrid watch featuring standard hand dials combined with a transparent AMOLED biometric tracking screen.\n\nShall I add this masterpiece to your catalog inspection?`;
    } else if (query.includes('espresso') || query.includes('coffee') || query.includes('brew')) {
      const espresso = products.find(p => p.id === 'prod-5') || products[2];
      reply += `☕ **${espresso?.name}** ($${espresso?.price})\n- Calibrated to 0.1°C with professional pressure profiling, it elevates counter espresso to a pure scientific art form.\n\nLet me know if you would like to apply our \`HOORAM50\` coupon for an instant $50 discount!`;
    } else if (query.includes('coupon') || query.includes('deal') || query.includes('discount') || query.includes('sale')) {
      reply += `🎟️ **Exclusive Active Promotions:**\n\n1. \`WELCOME20\` - **20% Off** orders above $50.\n2. \`HOORAM50\` - **$50 Off** luxury purchases above $200.\n3. \`SAVE10\` - **$10 Off** your $30+ orders.\n\nSimply input these codes inside your checkout drawer to claim instant reductions!`;
    } else {
      reply += `✨ **Bespoke Recommendations:**\n\n- 🎧 **Aether S9 Acoustic Headphones** ($349.99) - Ultra-comfort, elite audio.\n- ☕ **Element-H6 Precision Espresso Brewer** ($649.99) - The absolute gold standard of home brewing.\n- 🧥 **Nordic Studio Architectural Trench Coat** ($195.00) - Tailored organic fashion.\n\nWhat lifestyle category are you looking to elevate today?`;
    }
    return reply;
  };

  try {
    const ai = getAI();
    if (ai) {
      // Create chat history formatted for @google/genai SDK
      const history = messages.slice(0, messages.length - 1).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: lastUserMsg }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I am currently polishing my recommendations. How can I help you discover something beautiful today?";
      return res.json({ content: reply });
    } else {
      // No API Key, use simulated expert boutique logic
      return res.json({ content: generateFallbackResponse() });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.json({ content: generateFallbackResponse() });
  }
});

// ==========================================
// VITE OR STATIC SERVING MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
