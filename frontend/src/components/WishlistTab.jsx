import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';

const WISHLIST_DEFAULTS = [
  { id:1, name:'Premium Dog Bed (Large)', price:2499, image:'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=200&h=200&fit=crop', category:'Accessories' },
  { id:2, name:'Interactive Cat Toy Set', price:899, image:'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=200&h=200&fit=crop', category:'Toys' },
  { id:3, name:'Stainless Steel Pet Bowl', price:349, image:'https://images.unsplash.com/photo-1601758174493-8f3b19caced5?w=200&h=200&fit=crop', category:'Feeding' },
];

const WishlistTab = () => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('wishlist') || 'null') || WISHLIST_DEFAULTS);
  const [toast, setToast] = useState('');

  const saveItems = (next) => { setItems(next); localStorage.setItem('wishlist', JSON.stringify(next)); };
  const remove = (id) => saveItems(items.filter(i => i.id !== id));
  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const exists = cart.find(c => c.id === item.id);
    if (exists) {
      localStorage.setItem('cartItems', JSON.stringify(cart.map(c => c.id === item.id ? {...c, qty: c.qty+1} : c)));
    } else {
      localStorage.setItem('cartItems', JSON.stringify([...cart, {...item, qty:1}]));
    }
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2"><Heart className="w-6 h-6 text-rose-500 fill-rose-500"/>Wishlist</h2>
          <p className="text-slate-500 text-sm">{items.length} saved items</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Heart className="w-12 h-12 mx-auto mb-3 text-slate-200"/>
          <p className="font-bold">Your wishlist is empty</p>
          <p className="text-sm mt-1">Save products you love for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map(item => (
            <motion.div key={item.id} whileHover={{ y:-4 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e=>{e.target.src='https://placehold.co/200x200/e2e8f0/6366f1?text=🛍';}}/>
                <button onClick={() => remove(item.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow text-rose-400 hover:text-rose-600 transition">
                  <Trash2 className="w-4 h-4"/></button>
                <span className="absolute top-3 left-3 bg-white/90 text-xs font-bold px-2 py-0.5 rounded-full text-slate-600">{item.category}</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-slate-800 text-sm mb-1">{item.name}</p>
                <p className="text-indigo-600 font-extrabold text-lg mb-3">₹{item.price.toLocaleString()}</p>
                <button onClick={() => addToCart(item)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
                  <ShoppingCart className="w-4 h-4"/> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:40}}
            className="fixed bottom-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2">
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistTab;
