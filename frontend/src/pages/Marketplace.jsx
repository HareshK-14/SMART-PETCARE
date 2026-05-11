import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Star, Filter, Heart, Tag, Truck, X,
  Plus, Minus, CreditCard, CheckCircle, ArrowRight, Package, Sparkles, MessageSquare
} from 'lucide-react';

const STATIC_REVIEWS = [
  { id:1, user:"John D.", rating:5, date:"2026-03-15", text:"My dog loves this so much! His coat looks amazing after just 2 weeks." },
  { id:2, user:"Priya S.", rating:4, date:"2026-02-28", text:"Good quality, but shipping took a little bit longer than expected." },
  { id:3, user:"Rahul K.", rating:5, date:"2026-01-10", text:"Best product I have bought for my pet. Highly recommended." }
];

// ── All products with reliable, tested Unsplash images ──
const allProducts = [
  // FOOD
  {
    id: 1, name: "Royal Canin Golden Retriever Adult 12kg", price: 2999,
    category: "FOOD", rating: 4.8, reviews: 412, badge: "Best Seller",
    image: "/images/premium_dog_food.png",
    desc: "Tailored nutrition for adult Golden Retrievers. Supports healthy joints & coat."
  },
  {
    id: 2, name: "Hill's Science Diet Sensitive Stomach", price: 1999,
    category: "FOOD", rating: 4.7, reviews: 289, badge: "Vet Approved",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=400&fit=crop",
    desc: "Easy-to-digest formula with prebiotic fiber for a balanced gut microbiome."
  },
  {
    id: 3, name: "Purina Pro Plan Puppy Chicken & Rice", price: 1499,
    category: "FOOD", rating: 4.6, reviews: 183, badge: null,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=400&fit=crop",
    desc: "DHA from omega-rich fish oil for brain and vision development in puppies."
  },
  {
    id: 4, name: "Grain-Free Salmon Premium Cat Kibble", price: 1299,
    category: "FOOD", rating: 4.5, reviews: 97, badge: null,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop",
    desc: "High-protein, grain-free formula made with real Atlantic salmon for cats."
  },
  // TOYS
  {
    id: 5, name: "Interactive Feather Wand Cat Toy", price: 599,
    category: "TOY", rating: 4.6, reviews: 321, badge: "New",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&h=400&fit=crop",
    desc: "Stimulates natural hunting instincts. Retractable 90cm wand with bell."
  },
  {
    id: 6, name: "Heavy-Duty Rope & Rubber Tug Toy", price: 749,
    category: "TOY", rating: 4.5, reviews: 214, badge: null,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=400&fit=crop",
    desc: "Premium cotton rope with natural rubber core — great for dental health."
  },
  {
    id: 7, name: "Automatic Laser Pointer Cat Toy", price: 1499,
    category: "TOY", rating: 4.8, reviews: 507, badge: "Popular",
    image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&h=400&fit=crop",
    desc: "360° rotating laser with 3 speed modes. Auto shut-off after 15 minutes."
  },
  {
    id: 8, name: "Squeaky Plush Hedgehog Dog Toy", price: 499,
    category: "TOY", rating: 4.4, reviews: 142, badge: null,
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&h=400&fit=crop",
    desc: "Ultra-soft plush with embedded squeaker. Machine washable and durable."
  },
  // GROOMING
  {
    id: 9, name: "Organic Oatmeal & Aloe Pet Shampoo", price: 699,
    category: "GROOMING", rating: 4.7, reviews: 198, badge: "Organic",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=400&fit=crop",
    desc: "Sulfate-free, tearless formula. Soothes dry and irritated skin naturally."
  },
  {
    id: 10, name: "Professional Pet Deshedding Brush", price: 1299,
    category: "GROOMING", rating: 4.9, reviews: 634, badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=400&fit=crop",
    desc: "Reduces shedding by up to 90%. Ergonomic grip, stainless steel teeth."
  },
  {
    id: 11, name: "Waterless Dry Shampoo Spray — Citrus", price: 549,
    category: "GROOMING", rating: 4.3, reviews: 88, badge: null,
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=400&fit=crop",
    desc: "Quick-clean spray for between baths. Pleasant citrus scent lasting 48 hrs."
  },
  // ACCESSORIES
  {
    id: 12, name: "Orthopedic Memory Foam Pet Bed XL", price: 4999,
    category: "ACCESSORY", rating: 4.9, reviews: 827, badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&h=400&fit=crop",
    desc: "2-inch memory foam base with waterproof liner. Removable washable cover."
  },
  {
    id: 13, name: "GPS Smart Pet Collar (Pro Edition)", price: 4899,
    category: "ACCESSORY", rating: 4.9, reviews: 620, badge: "Trending",
    image: "/images/smart_pet_collar.png",
    desc: "Real-time location tracking with geofencing. LED display & waterproof."
  },
  {
    id: 14, name: "Stainless Steel Smart Water Fountain", price: 2499,
    category: "ACCESSORY", rating: 4.8, reviews: 456, badge: "New",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop&q=80",
    desc: "2.5 L capacity with activated carbon filter. Ultra-quiet pump, 3 flow modes."
  },
  // MEDICINE
  {
    id: 15, name: "Omega-3 Fish Oil Supplement 90 Capsules", price: 999,
    category: "MEDICINE", rating: 4.6, reviews: 267, badge: "Vet Approved",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop",
    desc: "Supports skin health, coat shine, and joint mobility. Norwegian fish oil."
  },
  {
    id: 16, name: "Daily Probiotic Chews for Dogs 60 ct.", price: 849,
    category: "MEDICINE", rating: 4.5, reviews: 189, badge: "Vet Approved",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&h=400&fit=crop",
    desc: "5 billion CFU per chew. Helps with digestion, immunity & allergy relief."
  },
];

const BADGE_COLORS = {
  'Best Seller':  'bg-amber-500',
  'Top Rated':    'bg-emerald-500',
  'Vet Approved': 'bg-blue-600',
  'New':          'bg-indigo-600',
  'Popular':      'bg-rose-500',
  'Organic':      'bg-green-600',
};

// ── Premium Coin Animation ───────────────────────────────────────────────────
const PARTICLE_COLORS = ['#fbbf24','#f59e0b','#fde68a','#6366f1','#14b8a6','#f97316'];
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (360 / 12) * i,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  distance: 55 + (i % 3) * 18,
  size: 6 + (i % 3) * 3,
}));

const PremiumCoin = () => (
  <div className="relative flex items-center justify-center w-36 h-36 mx-auto mb-4">
    {/* Pulsing outer glow ring */}
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.3, 0.7] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
    />
    {/* Spinning track ring */}
    <motion.div
      className="absolute w-32 h-32 rounded-full border-4 border-transparent"
      style={{ borderTopColor: '#fbbf24', borderRightColor: '#f59e0b', borderBottomColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
    />
    {/* Second counter-spin ring */}
    <motion.div
      className="absolute w-24 h-24 rounded-full border-[3px] border-transparent"
      style={{ borderTopColor: '#6366f1', borderLeftColor: '#14b8a6' }}
      animate={{ rotate: -360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
    />
    {/* Radial particle burst */}
    {PARTICLES.map(p => (
      <motion.div
        key={p.id}
        className="absolute rounded-full"
        style={{ width: p.size, height: p.size, backgroundColor: p.color }}
        animate={{
          x: [0, Math.cos((p.angle * Math.PI) / 180) * p.distance, 0],
          y: [0, Math.sin((p.angle * Math.PI) / 180) * p.distance, 0],
          opacity: [0, 1, 0],
          scale: [0.2, 1.4, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 1.4, delay: p.id * 0.1, ease: 'easeInOut' }}
      />
    ))}
    {/* 3-D flipping gold coin */}
    <motion.div
      className="relative w-16 h-16 flex items-center justify-center rounded-full z-10"
      style={{ transformStyle: 'preserve-3d', perspective: 400 }}
      animate={{ rotateY: [0, 360] }}
      transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
    >
      {/* Front face */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)',
          boxShadow: '0 0 24px rgba(251,191,36,0.8), inset 0 2px 4px rgba(255,255,255,0.5)',
        }}
      >
        <span className="text-2xl font-black text-yellow-900 select-none drop-shadow">₹</span>
      </div>
      {/* Back face */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #b45309 100%)',
          boxShadow: '0 0 24px rgba(251,191,36,0.8)',
        }}
      >
        <span className="text-lg font-black text-yellow-900 select-none">💰</span>
      </div>
    </motion.div>
  </div>
);

// ── Cart Drawer ──────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, onClose, onQty, onRemove }) => {
  const [payState, setPayState] = useState('idle'); // idle | confirm | processing | success
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + delivery;
  const orderId = `RZP${Math.floor(Math.random() * 9000000 + 1000000)}`;

  const handlePay = () => {
    setPayState('processing');
    setTimeout(() => setPayState('success'), 3000);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Backdrop */}
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={payState === 'idle' ? onClose : undefined} />

      {/* Drawer */}
      <motion.div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl overflow-hidden"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        {/* ── SUCCESS STATE ── */}
        {payState === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
            style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 40%, #eff6ff 100%)' }}>

            {/* Confetti dots */}
            {[...Array(14)].map((_, i) => (
              <motion.div key={i}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{ backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length], left: `${(i * 7.5) % 100}%`, top: '10%' }}
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: 320, opacity: [0, 1, 1, 0], rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
                transition={{ duration: 2.2, delay: i * 0.12, ease: 'easeIn' }}
              />
            ))}

            {/* Animated green tick */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
              className="relative mb-5"
            >
              {/* Outer pulse rings */}
              {[1, 2].map(r => (
                <motion.div key={r}
                  className="absolute inset-0 rounded-full"
                  style={{ border: '3px solid #10b981' }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.6 + r * 0.4, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: r * 0.4, ease: 'easeOut' }}
                />
              ))}
              <div className="w-28 h-28 rounded-full flex items-center justify-center relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                  boxShadow: '0 0 40px rgba(16,185,129,0.5), 0 12px 32px rgba(16,185,129,0.3)',
                }}>
                {/* SVG animated checkmark */}
                <svg viewBox="0 0 52 52" className="w-14 h-14">
                  <motion.path
                    d="M14 27 L22 35 L38 18"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                  />
                </svg>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Payment Successful! 🎉</h3>
              <p className="text-slate-500 mb-0.5">Amount paid: <span className="text-emerald-600 font-bold text-xl">₹{total.toLocaleString()}</span></p>
              <p className="text-xs text-slate-400 mb-5">via Razorpay Secure • Order ID: {orderId}</p>

              <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 text-left space-y-2 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Items Ordered</p>
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-5 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <Package className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Your order is confirmed. Delivery in 3–5 business days.
              </div>

              <button onClick={onClose}
                className="w-full py-3.5 font-bold text-white rounded-xl shadow-xl transition hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                🛍 Continue Shopping
              </button>
            </motion.div>
          </div>
        )}

        {/* ── PROCESSING STATE ── */}
        {payState === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center"
            style={{ background: 'linear-gradient(160deg, #fefce8 0%, #fff7ed 50%, #fdf4ff 100%)' }}>

            <PremiumCoin />

            <motion.h3
              className="text-xl font-extrabold text-slate-900 mb-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Processing Payment...
            </motion.h3>
            <p className="text-slate-500 text-sm mb-6">Securely communicating with Razorpay</p>

            {/* Razorpay brand bar */}
            <div className="w-full flex items-center justify-center gap-2 bg-white border border-indigo-100 rounded-2xl py-2.5 px-4 mb-5 shadow-sm">
              <span className="text-indigo-700 font-black text-sm tracking-tight">razorpay</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">🔒 256-bit SSL Encrypted</span>
            </div>

            {/* Items being paid */}
            <div className="w-full bg-white rounded-2xl p-4 text-left space-y-2 border border-slate-100 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Paying for</p>
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <p className="flex-1 text-xs font-medium text-slate-700 truncate">{item.name} × {item.qty}</p>
                  <span className="text-xs font-bold text-indigo-600 flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-sm font-bold text-indigo-600">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-5">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── IDLE (CART ITEMS) STATE ── */}
        {payState === 'idle' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-900 text-lg">Your Cart</h2>
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Your cart is empty</p>
                  <p className="text-sm text-slate-400 mt-1">Add products to get started</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex gap-3 bg-slate-50 rounded-xl p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">{item.name}</p>
                    <p className="text-indigo-600 font-bold mt-0.5 text-sm">₹{(item.price * item.qty).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onQty(item.id, -1)} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                      <button onClick={() => onQty(item.id, +1)} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-teal-50 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => onRemove(item.id)} className="ml-auto text-rose-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-white space-y-3">
                
                {/* Order summary */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-sm">
                  <p className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-2">Order Summary</p>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-xs text-slate-500">
                      <span className="truncate mr-2">{item.name} × {item.qty}</span>
                      <span className="font-semibold text-slate-700 flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-slate-500">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-teal-600 font-semibold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                </div>

                <div className="flex justify-between font-extrabold text-lg text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{total.toLocaleString()}</span>
                </div>

                {delivery > 0 && (
                  <p className="text-xs text-slate-400 text-center">Add ₹{(999 - subtotal).toLocaleString()} more for FREE delivery</p>
                )}

                <button
                  onClick={handlePay}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{total.toLocaleString()} via Razorpay
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-slate-400">🔒 Secured by Razorpay • 256-bit SSL</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// ── Main Marketplace ─────────────────────────────────────────────────────────
const Marketplace = ({ insideDashboard = false }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewsForm, setReviewsForm] = useState({ rating: 5, text: '' });
  const [savedReviews, setSavedReviews] = useState(() => JSON.parse(localStorage.getItem('productReviews') || '{}'));

  // Derived state for the modal
  const activeProduct = allProducts.find(p => p.id === activeReviewId);
  const productReviews = activeReviewId ? [...(savedReviews[activeReviewId] || []), ...STATIC_REVIEWS] : [];
  
  const submitReview = () => {
    if (!reviewsForm.text) return;
    const newRev = { id: Date.now(), user: JSON.parse(localStorage.getItem('currentUser') || '{}').name || "User", rating: reviewsForm.rating, date: new Date().toISOString().split('T')[0], text: reviewsForm.text };
    const updated = { ...savedReviews, [activeReviewId]: [newRev, ...(savedReviews[activeReviewId] || [])] };
    setSavedReviews(updated);
    localStorage.setItem('productReviews', JSON.stringify(updated));
    setReviewsForm({ rating: 5, text: '' });
  };
  const [addedFlash, setAddedFlash] = useState(null);

  const categories = ['ALL', 'FOOD', 'TOY', 'GROOMING', 'ACCESSORY', 'MEDICINE'];
  const catLabels = { ALL: '✨ All', FOOD: '🍖 Food', TOY: '🎾 Toys', GROOMING: '✂️ Grooming', ACCESSORY: '🛍 Accessories', MEDICINE: '💊 Medicine' };

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedFlash(product.id);
    setTimeout(() => setAddedFlash(null), 1500);
    setCartOpen(true);
  };

  const updateQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const toggleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className={insideDashboard ? "bg-slate-50 rounded-3xl pb-10 shadow-sm border border-slate-100" : "min-h-screen bg-slate-50"}>

      {/* Hero */}
      <div className={`relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-800 ${insideDashboard ? 'pt-8 pb-10 rounded-t-3xl overflow-hidden' : 'pt-24 pb-16 overflow-hidden'}`}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600&h=400&fit=crop" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Pet <span className="text-teal-300">Marketplace</span>
          </h1>
          <p className="text-indigo-200 mb-8 text-lg">Premium food, toys, grooming & more — delivered to your doorstep</p>

          <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="pl-5"><Search className="text-slate-400 w-5 h-5" /></div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search 'dog bed', 'cat food', 'shampoo'..."
              className="flex-1 py-4 px-4 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-base"
            />
            {search && <button onClick={() => setSearch('')} className="pr-3 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
            <button className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white px-8 py-4 font-bold">Search</button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-indigo-200">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-teal-400" />Free delivery over ₹999</span>
            <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-teal-400" />Best prices guaranteed</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-current" />Vet-approved products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Cart floating button */}
        {cartCount > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className={`fixed ${insideDashboard ? 'bottom-6 right-6' : 'top-20 right-6'} z-40 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-full shadow-xl font-semibold text-sm hover:bg-indigo-700 transition`}
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount} item{cartCount > 1 ? 's' : ''} · View Cart
          </button>
        )}

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="flex items-center text-slate-500 font-medium text-sm"><Filter className="w-4 h-4 mr-1.5" />Filter:</span>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}>
              {catLabels[cat]}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-400">{filtered.length} products</span>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, idx) => {
              const inCart = cart.find(i => i.id === product.id);
              const isFlash = addedFlash === product.id;
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.22, delay: idx * 0.03 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col"
                >
                  {/* Image — fixed height, object-cover always fills */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop'; }}
                    />
                    {product.badge && (
                      <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow ${BADGE_COLORS[product.badge]}`}>
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">{product.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{product.desc}</p>

                    <button onClick={() => setActiveReviewId(product.id)} className="flex items-center gap-1 mb-3 hover:bg-slate-50 p-1 -ml-1 rounded-lg transition-colors cursor-pointer w-max">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} />
                      ))}
                      <span className="text-xs text-indigo-500 font-bold ml-1 hover:underline">{product.reviews} Reviews</span>
                    </button>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isFlash
                            ? 'bg-teal-500 text-white scale-95'
                            : inCart
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isFlash ? '✓ Added!' : inCart ? `In Cart (${inCart.qty})` : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-xl font-semibold text-slate-600">No products found</p>
            <p className="text-slate-400 mt-2">Try a different search term or category</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {cartOpen && (
          <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onQty={updateQty} onRemove={removeFromCart} />
        )}
        
        {/* Reviews Modal */}
        {activeReviewId && activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setActiveReviewId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white shadow-2xl rounded-3xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500"/> Product Reviews</h3>
                <button onClick={() => setActiveReviewId(null)} className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-100 text-slate-400 transition"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="flex gap-4 items-center mb-4">
                  <img src={activeProduct.image} alt="" className="w-20 h-20 rounded-xl object-cover shadow-sm"/>
                  <div><p className="font-bold text-slate-900">{activeProduct.name}</p><div className="flex items-center mt-1">{[1,2,3,4,5].map(s=><Star key={s} className={`w-4 h-4 ${s<=Math.round(activeProduct.rating)?'text-amber-400 fill-current':'text-slate-200 fill-current'}`}/>)}<span className="ml-2 text-sm text-slate-500 font-bold">{activeProduct.rating} Out of 5</span></div></div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Write a Review</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Rating</label>
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setReviewsForm({...reviewsForm,rating:s})}><Star className={`w-6 h-6 ${s<=reviewsForm.rating?'text-amber-400 fill-current':'text-slate-200 fill-current'}`}/></button>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Your Review</label>
                    <textarea value={reviewsForm.text} onChange={e=>setReviewsForm({...reviewsForm,text:e.target.value})} rows={3} placeholder="What did you like about this product?" className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none resize-none"></textarea>
                  </div>
                  <button onClick={submitReview} disabled={!reviewsForm.text} className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition shadow-md">Post Review</button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Customer Reviews ({productReviews.length})</h4>
                  {productReviews.map(r => (
                    <div key={r.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-900 text-sm">{r.user}</p>
                        <p className="text-xs text-slate-400 font-medium">{r.date}</p>
                      </div>
                      <div className="flex mb-2">
                        {[1,2,3,4,5].map(s=><Star key={s} className={`w-3 h-3 ${s<=r.rating?'text-amber-400 fill-current':'text-slate-200 fill-current'}`}/>)}
                      </div>
                      <p className="text-slate-600 text-sm">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
