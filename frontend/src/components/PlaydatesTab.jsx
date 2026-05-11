import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, MapPin, Bone, Star, MessageCircle, PartyPopper, LayoutList, Map as MapIcon, Info, HelpCircle } from 'lucide-react';

const PET_PROFILES = [
  { id: 1, name: 'Max', breed: 'Husky mix', age: '2 yrs', distance: '1.2 km away', bio: 'High energy, loves fetching sticks and swimming in the lake!', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=800&fit=crop', mapPos: { top: '25%', left: '30%' } },
  { id: 2, name: 'Bella', breed: 'Golden Retriever', age: '4 yrs', distance: '0.8 km away', bio: 'Gentle giant. Looking for a calm walking buddy.', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop', mapPos: { top: '45%', left: '70%' } },
  { id: 3, name: 'Rocky', breed: 'French Bulldog', age: '1 yr', distance: '2.5 km away', bio: 'Short walks only! Will do anything for treats.', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=800&fit=crop', mapPos: { top: '75%', left: '40%' } },
  { id: 4, name: 'Daisy', breed: 'Poodle Mix', age: '3 yrs', distance: '0.5 km away', bio: 'Super smart and loves obstacle courses at the park.', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=800&fit=crop', mapPos: { top: '60%', left: '25%' } },
];

const SwipeCard = ({ profile, onSwipe, isFront, onViewDetails }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const colorLike = useTransform(x, [0, 100], ['rgba(16,185,129,0)', 'rgba(16,185,129,0.8)']);
  const colorPass = useTransform(x, [-100, 0], ['rgba(244,63,94,0.8)', 'rgba(244,63,94,0)']);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe('right', profile.id);
    } else if (info.offset.x < -100) {
      onSwipe('left', profile.id);
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-white cursor-grab active:cursor-grabbing border-4 border-slate-50"
      style={{ x, rotate, opacity }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover pointer-events-none" />
      
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none" />
      
      {/* Swipe Indicators overlay */}
      <motion.div className="absolute inset-0 flex items-center justify-center font-black text-6xl tracking-widest pointer-events-none z-10" style={{ opacity: x, color: 'rgba(16,185,129,1)' }}>
        <motion.span style={{ backgroundColor: colorLike, color: 'white', padding: '10px 30px', borderRadius: '15px', rotate: -15, scale: useTransform(x, [0, 100], [0.5, 1]), border: '4px solid rgba(255,255,255,0.5)' }}>LIKE</motion.span>
      </motion.div>
      <motion.div className="absolute inset-0 flex items-center justify-center font-black text-6xl tracking-widest pointer-events-none z-10">
        <motion.span style={{ backgroundColor: colorPass, color: 'white', padding: '10px 30px', borderRadius: '15px', rotate: 15, scale: useTransform(x, [-100, 0], [1, 0.5]), border: '4px solid rgba(255,255,255,0.5)' }}>NOPE</motion.span>
      </motion.div>

      <div className="absolute bottom-0 w-full p-8 text-white">
        
        <div className="flex justify-between items-end mb-2">
           <div>
             <h2 className="text-4xl font-extrabold mb-1 drop-shadow-md tracking-tight">{profile.name}, <span className="text-2xl font-medium opacity-90">{profile.age}</span></h2>
             <div className="flex items-center gap-2 text-indigo-100 bg-indigo-500/30 w-max px-3 py-1 rounded-full backdrop-blur-md border border-indigo-500/50">
               <MapPin className="w-4 h-4" /> <span className="text-sm font-bold tracking-wide">{profile.distance}</span>
             </div>
           </div>
           <button 
             onPointerDown={(e) => e.stopPropagation()} 
             onClick={() => onViewDetails(profile)}
             className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition active:scale-90 border border-white/30 shadow-lg cursor-pointer"
           >
              <Info className="w-6 h-6 text-white" />
           </button>
        </div>
        
        <p className="text-slate-200 text-sm leading-relaxed max-w-[85%] font-medium mt-4 line-clamp-2">{profile.bio}</p>
        
        <div className="flex gap-2 mt-5">
          <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 uppercase tracking-widest">{profile.breed}</span>
          <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 uppercase tracking-widest">Playdates</span>
        </div>
      </div>
    </motion.div>
  );
};

const PlaydatesTab = () => {
  const [profiles, setProfiles] = useState(PET_PROFILES);
  const [matchModal, setMatchModal] = useState(null);
  const [viewMode, setViewMode] = useState('swipe'); // 'swipe' or 'map'
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSwipe = (direction, id) => {
    if (direction === 'right') {
      // 50% chance of a mock match
      if (Math.random() > 0.5) {
        const matchedPet = profiles.find(p => p.id === id);
        setMatchModal(matchedPet);
      }
    }
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const manualSwipe = (direction) => {
    if (profiles.length === 0) return;
    const topCard = profiles[profiles.length - 1];
    handleSwipe(direction, topCard.id);
  };

  return (
    <div className="max-w-md mx-auto pt-4 relative">
      
      {/* Header and Toggle */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2 uppercase tracking-tighter">
          <Bone className="w-6 h-6 text-indigo-500" /> Park Buddies
        </h2>
        <div className="bg-slate-100 p-1 rounded-2xl flex max-w-[200px] mx-auto mt-4 shadow-inner">
           <button onClick={() => setViewMode('swipe')} className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${viewMode === 'swipe' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
              <LayoutList className="w-4 h-4"/> Swipe
           </button>
           <button onClick={() => setViewMode('map')} className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
              <MapIcon className="w-4 h-4"/> Map
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-[600px] mx-auto" style={{ perspective: 1000 }}>
        
        {viewMode === 'swipe' && (
          <AnimatePresence>
            {profiles.length > 0 ? (
              profiles.map((profile, index) => (
                <SwipeCard 
                  key={profile.id} 
                  profile={profile} 
                  isFront={index === profiles.length - 1} 
                  onSwipe={handleSwipe} 
                  onViewDetails={setSelectedProfile}
                />
              ))
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm text-center p-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">No more pets nearby</h3>
                <p className="text-slate-500 text-sm font-medium">Expand your search radius or check back later for new park buddies!</p>
                <button onClick={() => setProfiles(PET_PROFILES)} className="mt-8 px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-indigo-700 transition active:scale-95">Refresh Search</button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {viewMode === 'map' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-800">
             {/* Map Background */}
             <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop')" }} />
             
             {/* Radar Overlay */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] rounded-full border border-indigo-500/20" />
                <div className="absolute w-[600px] h-[600px] rounded-full border border-indigo-500/30" />
                <div className="absolute w-[400px] h-[400px] rounded-full border border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_50px_rgba(99,102,241,0.1)_inset]" />
             </div>

             {/* User Pin */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-75" />
                  <div className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-white shadow-lg relative z-10" />
                  <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-xl border border-slate-700">Luna (You)</span>
                </div>
             </div>

             {/* Nearby Pet Pins */}
             {PET_PROFILES.map((profile) => (
               <motion.button 
                 key={profile.id}
                 style={profile.mapPos}
                 onClick={() => setSelectedProfile(profile)}
                 whileHover={{ scale: 1.1, zIndex: 30 }}
                 className="absolute group z-10"
               >
                 <div className="relative flex flex-col items-center cursor-pointer">
                    <img src={profile.image} alt={profile.name} className="w-12 h-12 rounded-full border-2 border-white shadow-[0_5px_15px_rgba(0,0,0,0.3)] object-cover bg-slate-200" />
                    <div className="absolute top-14 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl text-center border border-slate-200 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                       <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{profile.name}</p>
                       <p className="text-[9px] font-bold text-indigo-600">{profile.distance}</p>
                    </div>
                 </div>
               </motion.button>
             ))}
          </motion.div>
        )}

      </div>

      {/* Swipe Controls (Only in Swipe mode) */}
      {viewMode === 'swipe' && (
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          <button onClick={() => manualSwipe('left')} className="w-16 h-16 bg-white rounded-full shadow-[0_10px_30px_rgba(244,63,94,0.15)] flex items-center justify-center text-rose-500 border border-rose-100 hover:scale-110 hover:bg-rose-50 transition-all duration-200 active:scale-95">
            <X className="w-8 h-8 stroke-[3]" />
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-[0_10px_30px_rgba(59,130,246,0.15)] flex items-center justify-center text-blue-500 border border-blue-100 hover:scale-110 hover:bg-blue-50 transition-all duration-200 active:scale-95">
            <Star className="w-6 h-6 fill-blue-500" />
          </button>
          <button onClick={() => manualSwipe('right')} className="w-16 h-16 bg-white rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.15)] flex items-center justify-center text-emerald-500 border border-emerald-100 hover:scale-110 hover:bg-emerald-50 transition-all duration-200 active:scale-95">
            <Heart className="w-8 h-8 stroke-[3] fill-emerald-500" />
          </button>
        </div>
      )}

      {/* ── Profile Detail Modal ── */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedProfile(null)} />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-auto"
            >
               <div className="h-2/5 sm:h-64 relative shrink-0">
                  <img src={selectedProfile.image} alt={selectedProfile.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <button onClick={() => setSelectedProfile(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition active:scale-90 border border-white/20">
                     <X className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-6 left-8 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                     <MapPin className="w-4 h-4 text-white" />
                     <span className="text-white text-xs font-black tracking-widest">{selectedProfile.distance}</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 bg-white relative">
                  {/* Floating Action Button */}
                  <button className="absolute -top-8 right-8 w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all border-4 border-white">
                     <Heart className="w-8 h-8 fill-current" />
                  </button>

                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{selectedProfile.name}</h2>
                  <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mt-1 mb-6">{selectedProfile.breed} • {selectedProfile.age}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">About Me</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{selectedProfile.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Personality Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Active</span>
                        <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Friendly</span>
                        <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Vaccinated</span>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <button onClick={() => setSelectedProfile(null)} className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5"/> Send Welcome Bark
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Match Modal Overlay */}
      <AnimatePresence>
        {matchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setMatchModal(null)} />
            
            <motion.div initial={{scale:0.8, opacity:0, y:50}} animate={{scale:1, opacity:1, y:0}} exit={{scale:0.8, opacity:0, y:50}} className="relative bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden border border-white/20">
              {/* Confetti effect background simple */}
              <div className="absolute inset-0 bg-indigo-500 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--tw-gradient-stops))' }}></div>
              
              <PartyPopper className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 mb-2 drop-shadow-sm tracking-tighter">New Match!</h2>
              <p className="text-slate-600 mb-8 font-medium">You and {matchModal.name} liked each other. Time for a playdate!</p>
              
              <div className="flex justify-center items-center gap-4 mb-8">
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop" alt="Luna" className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-xl object-cover bg-white" />
                <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center absolute z-10">
                   <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
                <img src={matchModal.image} alt={matchModal.name} className="w-24 h-24 rounded-full border-4 border-rose-100 shadow-xl object-cover bg-white" />
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <button className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5 fill-current"/> Message {matchModal.name}'s Owner
                </button>
                <button onClick={() => setMatchModal(null)} className="w-full bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-200 transition active:scale-95">
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PlaydatesTab;
