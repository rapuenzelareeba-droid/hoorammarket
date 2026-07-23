import { Product, Category, Coupon, Review } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: 'Laptop',
    description: 'Precision engineered high-end devices, smartwatches, and acoustics.'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: 'Shirt',
    description: 'Minimalist designer wear, sustainable fabrics, and handcrafted accessories.'
  },
  {
    id: 'home',
    name: 'Smart Home & Living',
    icon: 'Home',
    description: 'Aesthetic appliances, smart purifiers, and professional brewing gear.'
  },
  {
    id: 'fitness',
    name: 'Fitness & Outdoors',
    icon: 'Flame',
    description: 'Performance training tools, hydration gear, and smart wellness devices.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aether S9 Hybrid Noise-Cancelling Headphones',
    description: 'Experience pure sonic isolation. The Aether S9 features hybrid active noise-cancelling, custom-tuned 40mm drivers, and 45 hours of high-fidelity wireless playback wrapped in full-grain lambskin leather and brushed aluminum.',
    price: 349.99,
    originalPrice: 420.00,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    category: 'electronics',
    brand: 'Aether Acoustics',
    stock: 25,
    specs: {
      'Driver Unit': '40mm Dynamic, Neodymium',
      'Battery Life': 'Up to 45 Hours (ANC On)',
      'Connectivity': 'Bluetooth 5.2, AAC, LDAC, AptX',
      'Materials': 'Lambskin Leather, Aircraft-grade Aluminum'
    },
    tags: ['wireless', 'anc', 'audio', 'premium'],
    colors: ['#1D2128', '#E5E7EB', '#215E61'],
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: 'Chronos-V Minimalist Chronograph Smartwatch',
    description: 'A masterpiece of hybrid micro-engineering. Chronos-V integrates a physical mechanical dial with a transparent AMOLED screen. Tracks biometrics, sleeps cycles, and daily activity with an uncompromised 14-day standby power.',
    price: 289.00,
    originalPrice: 350.00,
    rating: 4.6,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    category: 'electronics',
    brand: 'Chronos',
    stock: 14,
    specs: {
      'Screen': '1.3-inch Transparent AMOLED',
      'Battery Life': '14 Days Regular, 30 Days Standby',
      'Waterproof': '5 ATM / 50m Rated',
      'Sensors': 'Optical Heart Rate, SPO2, Accelerometer, Gyroscope'
    },
    tags: ['wearable', 'smartwatch', 'accessories', 'premium'],
    colors: ['#1D2128', '#B5945B'],
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: 'Linen-Blend Architectural Trench Coat',
    description: 'Crafted from a luxury blend of Belgian linen and organic cotton, this trench coat offers a structured, minimalist silhouette suitable for all seasons. Resistant to elements while maintaining complete breathability.',
    price: 195.00,
    rating: 4.7,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
    category: 'fashion',
    brand: 'Nórdic Studio',
    stock: 30,
    specs: {
      'Material': '60% Belgian Linen, 40% Organic Cotton',
      'Waterproofing': 'Durable Water Repellent (DWR) Coating',
      'Care': 'Dry Clean Recommended'
    },
    tags: ['apparel', 'trench', 'organic', 'minimalist'],
    colors: ['#E5E7EB', '#B5945B', '#111827'],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'Handcrafted Heritage V-Type Calfskin Sneakers',
    description: 'Individually dyed and sewn by master artisans, these V-Type court sneakers feature full-grain Italian calfskin leather and orthotic cork insoles that mold dynamically to your foot shape over time.',
    price: 160.00,
    originalPrice: 210.00,
    rating: 4.9,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    category: 'fashion',
    brand: 'Heritage Sarto',
    stock: 8,
    specs: {
      'Leather Type': 'Full-grain Italian Calfskin',
      'Insole': 'Natural Sustainable Cork + Memory Foam',
      'Sole': '100% Recycled Margom Rubber'
    },
    tags: ['footwear', 'leather', 'handcrafted', 'sneakers'],
    colors: ['#FFFFFF', '#E5E7EB', '#111827'],
    sizes: ['40', '41', '42', '43', '44'],
    isFeatured: false
  },
  {
    id: 'prod-5',
    name: 'Element-H6 Smart Precision Espresso Brewer',
    description: 'The ultimate counter-top laboratory. The Element-H6 brews espresso, pour-overs, and cold-brew with precision temperature controls calibrated to 0.1°C and pressure-profiling up to 9 bars.',
    price: 649.99,
    rating: 4.9,
    reviewsCount: 77,
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=600',
    category: 'home',
    brand: 'Element Appliances',
    stock: 10,
    specs: {
      'Pump System': 'Commercial Grade Rotary Pump, 9 Bars',
      'Boiler Type': 'Dual-PID Controlled Solid Copper Boiler',
      'Water Reservoir': '2.5L Self-Sterilizing UV Chamber'
    },
    tags: ['espresso', 'coffee', 'brewing', 'kitchen'],
    colors: ['#1D2128', '#E5E7EB'],
    isFeatured: true
  },
  {
    id: 'prod-6',
    name: 'AeroPure Tower 10 Smart Ionic Air Purifier',
    description: 'Eliminate 99.97% of airborne impurities silently. AeroPure uses a three-tier medical grade HEPA-H14 filter combined with premium carbon mesh to clean a 800 sq ft room in less than 12 minutes.',
    price: 220.00,
    originalPrice: 250.00,
    rating: 4.5,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    category: 'home',
    brand: 'AeroPure',
    stock: 18,
    specs: {
      'Filter Class': 'True HEPA H14 + Activated Carbon',
      'Coverage': 'Up to 800 sq ft',
      'Noise Level': '18dB Ultra-Quiet Sleep Mode'
    },
    tags: ['purifier', 'home', 'wellness', 'appliance'],
    colors: ['#FFFFFF', '#1D2128'],
    isFeatured: false
  },
  {
    id: 'prod-7',
    name: 'Helix Carbon-Fiber 1.2L Insulated Hydrator',
    description: 'For rigorous exploration and performance training. Structured with aerospace-grade woven carbon fiber wraps and a vacuum copper liner. Preserves heat for 18 hours or cold for 36 hours continuously.',
    price: 65.00,
    rating: 4.7,
    reviewsCount: 205,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
    category: 'fitness',
    brand: 'Helix Labs',
    stock: 45,
    specs: {
      'Capacity': '1.2 Liters / 40 oz',
      'Material': 'Aviation Carbon Fiber casing, Pro-Grade 18/8 Stainless Steel',
      'Insulation': 'Triple-wall Vacuum Copper Insulated'
    },
    tags: ['hydration', 'fitness', 'gear', 'carbon'],
    colors: ['#1D2128', '#215E61'],
    isFeatured: false
  },
  {
    id: 'prod-8',
    name: 'Somnus Intelligent Sleep Induction Mat',
    description: 'Synchronize your circadian rhythm. Using multi-point thermal waves and rhythmic micro-vibrations, the Somnus mat guides your heartbeat down to sleep-ready levels. Embedded biometric sensors track deep sleep phases.',
    price: 180.00,
    originalPrice: 220.00,
    rating: 4.4,
    reviewsCount: 55,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600',
    category: 'fitness',
    brand: 'Somnus Labs',
    stock: 12,
    specs: {
      'Dimensions': '72\" x 24\" Smart Mat',
      'Connection': 'Wi-Fi 2.4G / Bluetooth BLE',
      'Thermal Zones': 'Dual-Zone Smart Temperature Control (30-42°C)'
    },
    tags: ['sleep', 'mat', 'wellness', 'biometrics'],
    colors: ['#215E61', '#1D2128'],
    isFeatured: true
  },
  {
    id: 'prod-9',
    name: 'AuraSound Spatial Dolby Atmos Soundbar',
    description: 'Transform your living room into an acoustic sanctuary. Featuring 11 perfectly tuned, spatial-array micro-drivers and a dedicated carbon-cone wireless subwoofer, AuraSound replicates native cinema sound stages with absolute clarity.',
    price: 549.99,
    originalPrice: 620.00,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600',
    category: 'electronics',
    brand: 'AuraSound',
    stock: 15,
    specs: {
      'Audio Channels': '7.1.2 Surround with Dolby Atmos',
      'Total Output Power': '450W RMS',
      'Connectivity': 'eARC HDMI, Optical, Wi-Fi, AirPlay 2'
    },
    tags: ['soundbar', 'home-theater', 'electronics', 'premium'],
    colors: ['#1D2128', '#E5E7EB'],
    isFeatured: true
  },
  {
    id: 'prod-10',
    name: 'Luxe-Soft Hand-Tailored Cashmere Sweater',
    description: 'The epitome of slow, premium fashion. Hand-knitted from 100% pure Mongolian cashmere, this luxury crewneck provides unmatched softness, exceptional thermal insulation, and a perfectly tailored drape that refines your silhouette.',
    price: 245.00,
    rating: 5.0,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600',
    category: 'fashion',
    brand: 'Heritage Sarto',
    stock: 12,
    specs: {
      'Material': '100% Mongolian Cashmere (Grade A)',
      'Weave Type': '12-Gauge Double-Ply knit',
      'Care': 'Hand Wash or Dry Clean Only'
    },
    tags: ['apparel', 'cashmere', 'knitwear', 'luxury'],
    colors: ['#B5945B', '#E5E7EB', '#111827'],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true
  },
  {
    id: 'prod-11',
    name: 'PureH2O Smart Active-Carbon Water Filter',
    description: 'Drink pure, energized water. PureH2O utilizes state-of-the-art multi-stage active carbon block filtration integrated with ultraviolet sterilizers. Fits seamlessly onto standard boutique faucets to deliver bottled-quality water instantly.',
    price: 135.00,
    originalPrice: 170.00,
    rating: 4.7,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    category: 'home',
    brand: 'AeroPure',
    stock: 22,
    specs: {
      'Filtration Stages': '5-Stage Active Carbon + UV-C',
      'Flow Rate': '2.0 Liters per Minute',
      'Filter Lifespan': '1,200 Gallons / 6 Months'
    },
    tags: ['water-filter', 'home', 'appliances', 'health'],
    colors: ['#FFFFFF', '#E5E7EB'],
    isFeatured: false
  },
  {
    id: 'prod-12',
    name: 'Velo-X Smart Indoor Aerodynamic Bike',
    description: 'Ride through virtual valleys with realistic terrain feedback. Featuring dynamic electromagnetic resistance and a beautiful 22-inch high-contrast display, the Velo-X bike simulates road conditions down to the percentage gradient.',
    price: 899.00,
    originalPrice: 1100.00,
    rating: 4.8,
    reviewsCount: 50,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    category: 'fitness',
    brand: 'Velo-X Labs',
    stock: 6,
    specs: {
      'Resistance': 'Silent Smart Magnetic, 0-1000W range',
      'Screen': '22-inch Full HD Multi-Touch Panel',
      'Saddle': 'Bespoke Orthotech Ergonomic Saddle'
    },
    tags: ['exercise-bike', 'indoor-cycling', 'fitness', 'smart-trainer'],
    colors: ['#111827', '#E5E7EB'],
    isFeatured: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'HOORAM30',
    discountType: 'percentage',
    value: 30,
    minPurchase: 100,
    isActive: true,
    description: 'HooramMarket VIP Loyalty 30% discount on orders over $100'
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    value: 20,
    minPurchase: 50,
    isActive: true,
    description: 'Get 20% off all orders over $50'
  },
  {
    code: 'SAVE10',
    discountType: 'flat',
    value: 10,
    minPurchase: 30,
    isActive: true,
    description: 'Flat $10 off your purchase of $30 or more'
  },
  {
    code: 'HOORAM50',
    discountType: 'flat',
    value: 50,
    minPurchase: 200,
    isActive: true,
    description: 'Exclusive $50 off luxury items on orders above $200'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Alexander Wright',
    rating: 5,
    comment: 'The noise cancellation is phenomenal, blocking absolute chatter. Lambskin pads are incredibly comfortable during 6-hour work sprints. True audiophile balance.',
    date: 'July 1, 2026'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Elena Rostova',
    rating: 4,
    comment: 'Soundstage is expansive. The physical dials feel highly tactile and premium. Battery indeed lasts forever; I have only charged it once this week.',
    date: 'June 28, 2026'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Marcus Sterling',
    rating: 5,
    comment: 'Stunning watch! Combining physical watch hands with a digital AMOLED layer is genius. Battery indicator still reads 74% after 5 full days of constant notifications.',
    date: 'June 15, 2026'
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    userName: 'Sophia Laurent',
    rating: 5,
    comment: 'Incredible tailoring. The Belgian linen blend hangs perfectly and has a subtle sheen that reflects luxury. Best addition to my summer business travel wardrobe.',
    date: 'June 20, 2026'
  },
  {
    id: 'rev-5',
    productId: 'prod-5',
    userName: 'Dr. Kenji Sato',
    rating: 5,
    comment: 'For a coffee enthusiast, this espresso machine is a dream. The digital pressure profiling allows me to pull precise light roast shots that taste superb. Well worth the price.',
    date: 'July 03, 2026'
  }
];
