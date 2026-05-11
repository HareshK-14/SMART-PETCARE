import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, AlertTriangle, Phone, Flag, ShieldAlert, Crosshair, UserCircle } from 'lucide-react';

const LOST_PETS = [
  { id: 1, name: 'Buster', type: 'Dog', breed: 'Golden Retriever', age: 3, lastSeen: 'Central Park West', time: '2 hours ago', owner: 'Emily D.', phone: '+1 555-0102', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', status: 'LOST', lat: 40.7829, lng: -73.9654 },
  { id: 2, name: 'Luna', type: 'Cat', breed: 'Siamese', age: 1.5, lastSeen: '1st Avenue & E 75th St', time: '5 hours ago', owner: 'Mike R.', phone: '+1 555-0199', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', status: 'LOST', lat: 40.7712, lng: -73.9535 },
  { id: 3, name: 'Charlie', type: 'Dog', breed: 'Beagle', age: 4, lastSeen: 'Riverside Park', time: '1 day ago', owner: 'Sarah W.', phone: '+1 555-0144', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=300&fit=crop', status: 'FOUND', lat: 40.8010, lng: -73.9722 },
];

const RadarAnimation = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
    <motion.div className="w-[800px] h-[800px] rounded-full border border-rose-500/20 absolute" animate={{ scale: [0.8, 1.5], opacity: [0.8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
    <motion.div className="w-[800px] h-[800px] rounded-full border border-rose-500/30 absolute" animate={{ scale: [0.5, 1.2], opacity: [0.9, 0] }} transition={{ duration: 4, delay: 1.3, repeat: Infinity, ease: 'linear' }} />
    <motion.div className="w-[800px] h-[800px] rounded-full border border-rose-500/10 absolute" animate={{ scale: [0.2, 0.9], opacity: [1, 0] }} transition={{ duration: 4, delay: 2.6, repeat: Infinity, ease: 'linear' }} />
    
    <motion.div className="w-1/2 h-1/2 absolute top-1/2 left-1/2 origin-top-left" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(244,63,94,0.3) 90deg, transparent 90deg)' }} animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
  </div>
);

const LostAndFound = () => {
  const [filter, setFilter] = useState('ALL');
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const filtered = LOST_PETS.filter(p => filter === 'ALL' ? true : p.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-sm border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Community Pet Radar</h1>
          <p className="text-lg text-slate-600 mb-6">Real-time alerts for lost and found pets in your neighborhood. Let's bring them home together.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setShowReportModal(true)} className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition shadow-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5"/> Report Lost Pet
            </button>
            <button onClick={() => setShowReportModal(true)} className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-sm flex items-center gap-2">
              <Flag className="w-5 h-5"/> I Found a Pet
            </button>
          </div>
        </div>

        {/* Map UI Area */}
        <div className="relative h-[400px] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-12 border-4 border-white">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=800&fit=crop')", opacity: 0.4, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(120%) brightness(50%)' }} />
          <RadarAnimation />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(99,102,241,1)]"></div>
          </div>

          {LOST_PETS.map((pet, idx) => (
            <motion.div key={pet.id} 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.5 + 1 }}
              className={`absolute w-4 h-4 rounded-full ${pet.status === 'LOST' ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)]'} border-2 border-white cursor-pointer pointer-events-auto`}
              style={{ top: `${45 + (idx*10)}%`, left: `${40 + (idx*15)}%` }}
              onHoverStart={() => setActiveCard(pet.id)}
              onHoverEnd={() => setActiveCard(null)}
            />
          ))}

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-slate-800 flex items-center gap-2 shadow-lg">
            <Crosshair className="w-4 h-4 text-indigo-500"/> Live Radar Active
          </div>
        </div>

        {/* Feed matching map */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Nearby Alerts</h2>
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {['ALL', 'LOST', 'FOUND'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${filter === f ? (f==='LOST'?'bg-rose-500 text-white':f==='FOUND'?'bg-emerald-500 text-white':'bg-indigo-600 text-white') : 'text-slate-500 hover:bg-slate-50'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(pet => (
              <motion.div key={pet.id} layout initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 ${activeCard === pet.id ? 'border-indigo-400 shadow-xl scale-105' : 'border-slate-100'} transition-all duration-300`}>
                <div className="relative h-48">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover"/>
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-lg ${pet.status === 'LOST' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                    {pet.status === 'LOST' ? 'MISSING' : 'FOUND'}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-xl font-extrabold text-white">{pet.name}</h3>
                    <p className="text-slate-200 text-sm">{pet.breed} • {pet.type}</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <p><span className="font-bold text-slate-800">Last seen:</span> <br/>{pet.lastSeen} ({pet.time})</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <UserCircle className="w-5 h-5 text-indigo-400" /> {/* Replaced missing UserCircle import if any with manual or assume it works */}
                    <div>
                      <p className="font-bold text-slate-900">{pet.owner}</p>
                      <p className="text-xs">{pet.phone}</p>
                    </div>
                    <button className="ml-auto bg-indigo-100 text-indigo-700 p-2 rounded-lg hover:bg-indigo-200"><Phone className="w-4 h-4"/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Basic Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowReportModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Create an Alert</h3>
              <p className="text-slate-500 mb-6">Enter the pet's details, photos, and last known location to blast an alert to nearby community members.</p>
              
              <div className="space-y-4 text-left">
                <input type="text" placeholder="Pet Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50"/>
                <input type="text" placeholder="Last Seen Location" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50"/>
                <textarea placeholder="Description & Details" rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 resize-none"/>
                
                <button onClick={() => setShowReportModal(false)} className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 transition shadow-lg">Broadcast SOS Alert</button>
                <button onClick={() => setShowReportModal(false)} className="w-full bg-white text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition border border-slate-200">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LostAndFound;
