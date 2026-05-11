import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Battery, Heart, Zap, ShieldCheck, Trophy, Sparkles, Plus, Star, X, MessageCircle } from 'lucide-react';

// Cute generic CSS Dog face component
const DigitalPetAvatar = ({ isHappy, energy, equippedItem, onInteract, reaction }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer group" onClick={onInteract}>
      {/* ── Reaction Popups ── */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -80, scale: 1.2 }}
            exit={{ opacity: 0, y: -120 }}
            className="absolute z-[60] bg-white text-slate-900 px-4 py-2 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest border-2 border-indigo-100"
          >
            {reaction === 'bark' && "WOOF! ❤️"}
            {reaction === 'feed' && "YUM! 🦴"}
            {reaction === 'play' && "FUN!! 🎾"}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-indigo-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Glow / Ambient Aura ── */}
      <div className={`absolute inset-0 blur-[60px] rounded-full transition-all duration-1000 ${
        isHappy ? 'bg-amber-400/20' : 'bg-slate-400/10'
      } ${equippedItem === 'Neon Leash' ? 'bg-fuchsia-500/30' : ''}`} />
      
      {/* Helmet Overlay (if Astronaut Helmet equipped) */}
      {equippedItem === 'Astronaut Helmet' && (
        <div className="absolute inset-x-4 inset-y-8 bg-blue-100/10 backdrop-blur-[2px] rounded-[60px] border-4 border-white/30 z-50 shadow-[inset_0_20px_40px_rgba(255,255,255,0.4)] pointer-events-none overflow-hidden">
           <motion.div animate={{ x: [-200, 400] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-20 h-full bg-white/20 skew-x-12 opacity-50 absolute inset-0" />
        </div>
      )}

      {/* CSS Drawing Base */}
      <motion.div 
        animate={{ 
          y: energy > 50 ? [0, -10, 0] : [0, 5, 0],
          scale: reaction ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          duration: energy > 50 ? 2 : 4, 
          repeat: energy > 50 ? Infinity : 0, 
          ease: "easeInOut" 
        }}
        className="relative z-10 w-48 h-48 bg-amber-400 rounded-[50px] shadow-[inset_-10px_-10px_0px_rgba(0,0,0,0.1),_0_20px_40px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center transition-transform group-hover:scale-105 active:scale-95"
      >
        {/* Ears */}
        <motion.div animate={{ rotate: isHappy ? [0, -15, 0] : 0 }} transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatDelay: 3 }} className="absolute -top-6 -left-4 w-16 h-20 bg-amber-500 rounded-[40px] shadow-[inset_-5px_-5px_0px_rgba(0,0,0,0.1)] -z-10 origin-bottom-right" />
        <motion.div animate={{ rotate: isHappy ? [0, 15, 0] : 0 }} transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatDelay: 3.2 }} className="absolute -top-6 -right-4 w-16 h-20 bg-amber-500 rounded-[40px] shadow-[inset_-5px_-5px_0px_rgba(0,0,0,0.1)] -z-10 origin-bottom-left" />

        {/* Cyberpunk Goggles */}
        {equippedItem === 'Cyberpunk Goggles' && (
          <div className="absolute top-14 inset-x-4 h-12 bg-indigo-900/90 rounded-xl z-50 border-2 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] overflow-hidden">
            <div className="w-full h-1/2 bg-gradient-to-r from-sky-400 to-fuchsia-400 opacity-50 animate-pulse" />
          </div>
        )}

        {/* Eyes */}
        <div className="flex gap-10 mb-2 mt-4 relative">
          <motion.div animate={{ y: isHappy ? [0, -5, 0] : 2 }} className="absolute -top-4 w-6 h-2 bg-amber-600 rounded-full left-1" />
          <motion.div animate={{ y: isHappy ? [0, -5, 0] : 2 }} className="absolute -top-4 w-6 h-2 bg-amber-600 rounded-full right-1" />
          
          <div className="w-8 h-8 bg-slate-900 rounded-full relative overflow-hidden flex items-center justify-center shadow-inner">
             {isHappy ? <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1" /> : <div className="w-full h-1/2 bg-amber-400 absolute top-0 z-10" />}
          </div>
          <div className="w-8 h-8 bg-slate-900 rounded-full relative overflow-hidden flex items-center justify-center shadow-inner">
             {isHappy ? <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1" /> : <div className="w-full h-1/2 bg-amber-400 absolute top-0 z-10" />}
          </div>
        </div>

        {/* Snout & Nose */}
        <div className="w-20 h-16 bg-amber-100/90 rounded-[30px] flex flex-col items-center justify-start pt-2 shadow-sm relative">
           <div className="w-6 h-4 bg-slate-900 rounded-full mb-1" />
           <motion.div 
             animate={{ scale: isHappy ? [1, 1.2, 1] : 1, y: isHappy ? [0, 5, 0] : 0 }} 
             transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatDelay: 2 }}
             className="w-4 h-4 bg-rose-400 rounded-b-full shadow-inner relative z-0" 
           />
        </div>

        {/* Accessories (Collar) */}
        <div className={`absolute -bottom-4 w-32 h-8 rounded-[20px] border-4 shadow-xl flex items-center justify-center transition-all ${
          equippedItem === 'Golden Collar' ? 'bg-amber-400 border-amber-600' : 'bg-indigo-500 border-indigo-600'
        }`}>
           <div className={`w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center transform translate-y-3 transition-all ${
             equippedItem === 'Golden Collar' ? 'bg-amber-100 border-amber-300' : 'bg-yellow-400 border-yellow-500'
           }`}>
             <Star className={`w-4 h-4 transition-all ${
               equippedItem === 'Golden Collar' ? 'text-amber-500 fill-amber-500' : 'text-yellow-600 fill-yellow-600'
             }`} />
           </div>
        </div>

        {/* Neon Leash */}
        {equippedItem === 'Neon Leash' && (
          <div className="absolute bottom-0 -right-20 w-32 h-1 bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] transform -rotate-45" />
        )}
      </motion.div>
    </div>
  );
};

const DigitalTwinTab = () => {
  const [stats, setStats] = useState({
    happiness: 90,
    energy: 65,
    hunger: 40,
    level: 12,
    xp: 2450
  });

  const [equippedItem, setEquippedItem] = useState('Golden Collar');
  const [reaction, setReaction] = useState(null);
  const [vfx, setVfx] = useState([]);
  const [showVault, setShowVault] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState(['Golden Collar', 'Cyberpunk Goggles']);

  const isHappy = stats.happiness > 50 && stats.hunger > 30;

  const triggerReaction = (type) => {
    setReaction(type);
    setTimeout(() => setReaction(null), 1500);
  };

  const addVfx = (icon) => {
    const id = Date.now();
    setVfx(prev => [...prev, { id, icon }]);
    setTimeout(() => setVfx(prev => prev.filter(v => v.id !== id)), 1500);
  };

  const feedPet = () => {
    setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20), xp: prev.xp + 50 }));
    triggerReaction('feed');
    addVfx('🦴');
  };

  const playPet = () => {
    setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 20), energy: Math.max(0, prev.energy - 15), xp: prev.xp + 100 }));
    triggerReaction('play');
    addVfx('🎾');
  };

  const handleAvatarClick = () => {
    setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 5), xp: prev.xp + 5 }));
    triggerReaction('bark');
    addVfx('❤️');
  };

  const gearItems = [
    { name: 'Cyberpunk Goggles', icon: '🥽', price: 1500, rarity: 'EPIC' },
    { name: 'Golden Collar', icon: '📿', price: 2000, rarity: 'LEGENDARY' },
    { name: 'Neon Leash', icon: '🔗', price: 2500, rarity: 'RARE' },
    { name: 'Astronaut Helmet', icon: '👨‍🚀', price: 3000, rarity: 'MYTHIC' }
  ];

  const handleBuy = (item) => {
    if (!unlockedItems.includes(item.name)) {
      setUnlockedItems([...unlockedItems, item.name]);
    }
    setEquippedItem(item.name);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-2 pb-12">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2 uppercase tracking-tighter">
          <Gamepad2 className="w-8 h-8 text-indigo-500" /> Luna Metaverse
        </h2>
        <p className="text-slate-400 mt-2 font-black text-[10px] uppercase tracking-widest">Connect with your digital twin in real-time.</p>
      </div>

      <div className="bg-slate-950 rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/5 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&h=800&fit=crop')] opacity-10 bg-cover bg-center mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-transparent" />

        {/* ── 3D Showcase Area ── */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
           <DigitalPetAvatar 
             isHappy={isHappy} 
             energy={stats.energy} 
             equippedItem={equippedItem} 
             onInteract={handleAvatarClick}
             reaction={reaction}
           />
           
           {/* Floating VFX Layer */}
           <div className="absolute inset-0 pointer-events-none">
             <AnimatePresence>
               {vfx.map(v => (
                 <motion.div
                   key={v.id}
                   initial={{ opacity: 0, scale: 0, y: 180, x: Math.random() * 80 - 40 }}
                   animate={{ opacity: 1, scale: 1.5, y: -200 }}
                   exit={{ opacity: 0 }}
                   className="absolute left-1/2 -translate-x-1/2 text-4xl"
                 >
                   {v.icon}
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>

           {/* XP / Level Indicator */}
           <div className="absolute bottom-0 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Level Progress</span>
                <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                   <motion.div animate={{ width: `${(stats.xp % 1000 / 1000) * 100}%` }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
                {Math.floor(stats.xp / 1000) + 1}
              </div>
           </div>
        </div>

        {/* ── Stats & Actions Panel ── */}
        <div className="relative z-10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/10 shadow-3xl">
           <div className="flex items-center justify-between mb-10">
             <div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Luna Twin</h3>
               <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Active Metadata</p>
             </div>
             <span className="bg-indigo-500/10 text-indigo-300 font-mono text-[10px] font-black px-4 py-2 rounded-xl border border-indigo-500/20 shadow-inner">ID: #9402A</span>
           </div>

           <div className="space-y-8 mb-10">
              {/* Happiness */}
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                  <span className="text-rose-400 flex items-center gap-2"><Heart className="w-4 h-4 fill-rose-500"/> Happiness</span>
                  <span className="text-white">{stats.happiness}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div animate={{ width: `${stats.happiness}%` }} className="h-full bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
                </div>
              </div>

              {/* Energy */}
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                  <span className="text-amber-400 flex items-center gap-2"><Zap className="w-4 h-4 fill-amber-500"/> Energy</span>
                  <span className="text-white">{stats.energy}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div animate={{ width: `${stats.energy}%` }} className="h-full bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                </div>
              </div>

              {/* Satiety */}
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                  <span className="text-sky-400 flex items-center gap-2"><Battery className="w-4 h-4 fill-sky-500"/> Satiety</span>
                  <span className="text-white">{stats.hunger}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div animate={{ width: `${stats.hunger}%` }} className="h-full bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
                </div>
              </div>
           </div>

           {/* Action Buttons */}
           <div className="grid grid-cols-2 gap-4">
             <button onClick={feedPet} className="group relative bg-white/5 hover:bg-white/10 text-white font-black text-xs px-6 py-4 rounded-2xl border border-white/10 transition-all active:scale-95 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                FEED TREAT
             </button>
             <button onClick={playPet} className="group relative bg-white/5 hover:bg-white/10 text-white font-black text-xs px-6 py-4 rounded-2xl border border-white/10 transition-all active:scale-95 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                PLAY MINIGAME
             </button>
           </div>
        </div>

      </div>

      {/* Metaverse Virtual Gear Shop */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mt-10">
        <div className="flex justify-between items-center mb-8">
           <div>
             <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter"><Sparkles className="w-8 h-8 text-amber-500 fill-amber-300"/> Avatar Gear Shop</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Unlock exclusive metaverse gear for your twin</p>
           </div>
           <button onClick={() => setShowVault(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-lg active:scale-95">View Vault</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {gearItems.map((item, i) => (
             <div 
               key={i} 
               onClick={() => handleBuy(item)}
               className={`group bg-slate-50 border-4 rounded-[2rem] p-6 text-center transition-all cursor-pointer relative overflow-hidden active:scale-95 ${
                 equippedItem === item.name ? 'border-indigo-500 bg-indigo-50' : 'border-slate-50'
               }`}
             >
               {equippedItem === item.name && (
                 <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
                   Equipped
                 </div>
               )}
               {unlockedItems.includes(item.name) && equippedItem !== item.name && (
                 <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
                   In Vault
                 </div>
               )}
               <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-5 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all border border-slate-100">
                  <span className="text-4xl">{item.icon}</span>
               </div>
               <p className="font-black text-slate-900 text-xs mb-1 uppercase tracking-tight">{item.name}</p>
               <div className="flex items-center justify-center gap-1.5 bg-amber-100/50 w-max mx-auto px-2 py-0.5 rounded-full">
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                 <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{item.price}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* ── Vault Modal ── */}
      <AnimatePresence>
        {showVault && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowVault(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 40 }} 
               className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20"
             >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                   <div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                       <ShieldCheck className="w-7 h-7 text-indigo-400" /> Metaverse Vault
                     </h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Stored Rarity Tokens: {unlockedItems.length} Items</p>
                   </div>
                   <button onClick={() => setShowVault(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition active:scale-90">
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {gearItems.filter(item => unlockedItems.includes(item.name)).map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => setEquippedItem(item.name)}
                          className={`bg-white border-2 rounded-[2rem] p-6 text-center shadow-sm relative group cursor-pointer transition-all hover:shadow-xl active:scale-95 ${
                            equippedItem === item.name ? 'border-indigo-500' : 'border-white'
                          }`}
                        >
                           {equippedItem === item.name && (
                             <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                               <ShieldCheck className="w-5 h-5" />
                             </div>
                           )}
                           <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform">
                             {item.icon}
                           </div>
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{item.name}</h4>
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                              item.rarity === 'MYTHIC' ? 'bg-rose-100 text-rose-600' :
                              item.rarity === 'LEGENDARY' ? 'bg-amber-100 text-amber-600' :
                              item.rarity === 'EPIC' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                           }`}>
                             {item.rarity}
                           </span>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setEquippedItem(item.name);
                             }}
                             className={`w-full mt-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                               equippedItem === item.name ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900'
                             }`}
                           >
                             {equippedItem === item.name ? "EQUIPPED" : "EQUIP NOW"}
                           </button>
                        </div>
                      ))}

                      {/* Empty Slots */}
                      {[...Array(Math.max(0, 6 - unlockedItems.length))].map((_, i) => (
                        <div key={`empty-${i}`} className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-slate-300">
                           <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center mb-3">
                             <Plus className="w-6 h-6" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest">Locked Slot</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-8 bg-slate-100/50 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-sm">
                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                       </div>
                     ))}
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3,204 Users have collected these</p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalTwinTab;
