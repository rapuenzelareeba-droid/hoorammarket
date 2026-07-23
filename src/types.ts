export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
  specs: Record<string, string>;
  tags: string[];
  colors?: string[];
  sizes?: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'paypal' | 'crypto';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  trackingNumber: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minPurchase: number;
  isActive: boolean;
  description: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  monthlySales: { month: string; sales: number; orders: number }[];
  categorySales: { name: string; value: number }[];
}
