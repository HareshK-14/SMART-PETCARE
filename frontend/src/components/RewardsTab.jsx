import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShoppingBag, Calendar, Share, Star, Gift, ChevronRight, Zap, X } from 'lucide-react';

const REWARDS_HISTORY = [
  { id: 1, action: 'Booked Vet Appointment', points: '+50', date: 'Today, 10:30 AM', icon: Calendar, color: 'text-sky-500 bg-sky-100' },
  { id: 2, action: 'Bought Premium Dog Food', points: '+120', date: 'Yesterday', icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-100' },
  { id: 3, action: '7-Day Login Streak', points: '+25', date: 'Oct 10, 2023', icon: Zap, color: 'text-amber-500 bg-amber-100' },
  { id: 4, action: 'Redeemed 10% Discount', points: '-500', date: 'Oct 05, 2023', icon: Gift, color: 'text-rose-500 bg-rose-100' },
];

const RewardsTab = () => {
  const [showRedeem, setShowRedeem] = useState(false);
  const totalPoints = 1240;
  const nextTier = 2000;
  const progress = (totalPoints / nextTier) * 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
        <div className="absolute inset-0"
             style={{
               backgroundImage: "radial-gradient(circle at top right, rgba(99,102,241,0.3), transparent 40%), radial-gradient(circle at bottom left, rgba(244,63,94,0.2), transparent 40%)"
             }}
        />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest border border-indigo-500/30 mb-4">
              <Star className="w-4 h-4" fill="currentColor"/> Gold Member
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Paw Points</h2>
            <p className="text-slate-400 text-lg">Earn points. Get rewards. Spoil your pet.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center min-w-[280px]">
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">Available Points</p>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-orange-500 mb-4 drop-shadow-sm">
              {totalPoints}
            </p>
            <button onClick={() => setShowRedeem(true)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition">
              Redeem Rewards
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tier Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Tier Progress</h3>
              <p className="text-slate-500">Reach Platinum for free shipping on all orders.</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-indigo-600 text-2xl">{totalPoints} <span className="text-slate-400 text-sm font-medium">/ 2000 pts</span></p>
            </div>
          </div>
          
          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-full" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm font-bold">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-amber-600">🥇 Gold (Current)</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">1.5x Points Multiplier</p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 shadow-inner">
              <span className="text-indigo-600 flex items-center justify-center gap-1"><Award className="w-4 h-4"/> Platinum</span>
              <p className="text-xs text-indigo-400 mt-1 font-medium">Unlock at 2000 pts</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 opacity-50">
              <span className="text-slate-600">💎 Diamond</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Unlock at 5000 pts</p>
            </div>
          </div>
        </div>

        {/* How to Earn */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Ways to Earn</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-indigo-500"/></div>
              <div className="flex-1"><p className="font-bold text-slate-800 text-sm">Shop Marketplace</p><p className="text-xs text-slate-500">2 pts per ₹100 spent</p></div>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center"><Calendar className="w-5 h-5 text-teal-500"/></div>
              <div className="flex-1"><p className="font-bold text-slate-800 text-sm">Book Appointments</p><p className="text-xs text-slate-500">50 pts per visit</p></div>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><Share className="w-5 h-5 text-rose-500"/></div>
              <div className="flex-1"><p className="font-bold text-slate-800 text-sm">Refer a Friend</p><p className="text-xs text-slate-500">500 pts per referral</p></div>
            </li>
          </ul>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-extrabold text-slate-900">Points History</h3>
          <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {REWARDS_HISTORY.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </div>
              </div>
              <div className={`font-extrabold text-lg ${item.points.startsWith('+') ? 'text-emerald-500' : 'text-slate-600'}`}>
                {item.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showRedeem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRedeem(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Rewards Store</h3>
              <p className="text-slate-500 text-sm mb-6">Sorry, you don't have enough Paw Points to redeem the <strong>Free Vet Consultation (2000 pts)</strong>. Earn more points by shopping or referring friends!</p>
              <button onClick={() => setShowRedeem(false)} className="w-full py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Got it</button>
            </motion.div>
          </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsTab;
