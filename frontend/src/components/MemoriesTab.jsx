import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, CalendarHeart, Plus, Heart, Award, Star, Quote, X, MapPin, PawPrint } from 'lucide-react';

const MOCK_MEMORIES = [
  { id: 1, type: 'photo', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=800&fit=crop', caption: 'Luna\'s first day home! 🏡', date: 'Oct 12, 2023', pet: 'Luna', likes: 12 },
  { id: 2, type: 'milestone', icon: Award, title: 'Graduated Puppy School', desc: 'Passed with flying colors! 🎓', date: 'Dec 05, 2023', pet: 'Luna', color: 'bg-amber-100 text-amber-600' },
  { id: 3, type: 'photo', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=500&fit=crop', caption: 'Beach day with the best boy 🌊', date: 'Jan 15, 2024', pet: 'Milo', likes: 24 },
  { id: 4, type: 'photo', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&h=500&fit=crop', caption: 'Sleeping like an angel 💤', date: 'Feb 20, 2024', pet: 'Luna', likes: 8 },
  { id: 5, type: 'milestone', icon: CalendarHeart, title: '1st Birthday! 🎂', desc: 'A whole year of unconditional love.', date: 'Mar 10, 2024', pet: 'Luna', color: 'bg-rose-100 text-rose-600' },
  { id: 6, type: 'photo', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=800&fit=crop', caption: 'New haircut! ✂️', date: 'Apr 02, 2024', pet: 'Milo', likes: 15 },
  { id: 7, type: 'quote', text: 'Dogs do speak, but only to those who know how to listen.', author: 'Orhan Pamuk', color: 'bg-indigo-600 text-white' },
];

const MemoriesTab = () => {
  const [memories, setMemories] = useState(MOCK_MEMORIES);
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [newMem, setNewMem] = useState({ title: '', desc: '', pet: 'Luna', type: 'milestone' });
  const pets = ['All', 'Luna', 'Milo'];

  const filtered = filter === 'All' ? memories : memories.filter(m => m.pet === filter || m.type === 'quote');

  const handleLike = (id, e) => {
    if (e) e.stopPropagation();
    setMemories(prev => prev.map(m => m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
  };

  const handleAdd = () => {
    if (!newMem.title) return;
    const item = {
      id: Date.now(),
      type: newMem.type,
      pet: newMem.pet,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    if (newMem.type === 'photo') {
      item.url = 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=600&h=800&fit=crop';
      item.caption = newMem.title;
      item.likes = 0;
    } else {
      item.icon = Star;
      item.title = newMem.title;
      item.desc = newMem.desc;
      item.color = 'bg-indigo-100 text-indigo-600';
    }

    setMemories([item, ...memories]);
    setShowAddModal(false);
    setNewMem({ title: '', desc: '', pet: 'Luna', type: 'milestone' });
  };

  return (
    <div className="space-y-8">
      {/* Header & Upload */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarHeart className="w-8 h-8 text-rose-500" /> Pet Memory Lane
          </h2>
          <p className="text-sm text-slate-500 mt-1">A digital scrapbook of your best moments together.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {pets.map(p => (
              <button key={p} onClick={() => setFilter(p)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${filter === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shrink-0">
            <Plus className="w-4 h-4" /> Add Memory
          </button>
        </div>
      </div>

      {/* Masonry Layout Container */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-12">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMemory(item)}
              className="break-inside-avoid cursor-pointer active:scale-[0.98] transition-transform"
            >
              {item.type === 'photo' && (
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                  <div className="relative overflow-hidden aspect-[4/5] bg-slate-50">
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest uppercase shadow-sm border border-white/20">
                      {item.pet}
                    </div>
                    {/* Add play icon for video types in future */}
                  </div>
                  <div className="p-5 bg-white relative z-10">
                    <p className="font-extrabold text-slate-800 text-base leading-snug mb-3 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{item.caption}</p>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-black tracking-widest uppercase">
                      <span>{item.date}</span>
                      <button onClick={(e) => handleLike(item.id, e)} className="flex items-center gap-1.5 hover:text-rose-500 transition-all bg-slate-50 px-3 py-1.5 rounded-full hover:bg-rose-50 border border-slate-100">
                        <Heart className={`w-3.5 h-3.5 ${item.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} /> {item.likes}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'milestone' && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-12 ${item.color}`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.date} • {item.pet}</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-none uppercase">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase">{item.desc}</p>
                </div>
              )}

              {item.type === 'quote' && (
                <div className={`rounded-[2rem] p-10 shadow-lg ${item.color} relative overflow-hidden group`}>
                  <Quote className="absolute -top-4 -right-4 w-40 h-40 opacity-10 rotate-12 transition-transform group-hover:rotate-0" />
                  <div className="relative z-10">
                    <p className="text-2xl font-serif italic font-bold leading-tight mb-6 uppercase tracking-tight">"{item.text}"</p>
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-0.5 bg-white/30" />
                       <p className="text-indigo-200 text-xs font-black tracking-widest uppercase">— {item.author}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {/* Add Memory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm overflow-hidden border border-white/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">New Memory</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-5">
                  <div className="flex p-1 bg-slate-100 rounded-2xl">
                    <button onClick={() => setNewMem({...newMem, type: 'milestone'})} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${newMem.type === 'milestone' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>MILESTONE</button>
                    <button onClick={() => setNewMem({...newMem, type: 'photo'})} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${newMem.type === 'photo' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>PHOTO</button>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">WHO IS IT FOR?</label>
                    <div className="flex gap-2">
                       {['Luna', 'Milo'].map(p => (
                         <button key={p} onClick={() => setNewMem({...newMem, pet: p})} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition border-2 ${newMem.pet === p ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>{p}</button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">TITLE / CAPTION *</label>
                    <input placeholder="E.G. FIRST BIRTHDAY!" value={newMem.title} onChange={e => setNewMem({...newMem, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all outline-none uppercase placeholder:text-slate-300" />
                  </div>
                  {newMem.type === 'milestone' && (
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">SHORT DESCRIPTION</label>
                      <textarea placeholder="WHAT HAPPENED?" value={newMem.desc} onChange={e => setNewMem({...newMem, desc: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none h-24 uppercase placeholder:text-slate-300" />
                    </div>
                  )}
                  <button disabled={!newMem.title} onClick={handleAdd} className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all mt-4 disabled:opacity-30">
                    Create Memory →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedMemory && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMemory(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              
              <button onClick={() => setSelectedMemory(null)} className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg active:scale-90">
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 relative overflow-hidden">
                {selectedMemory.type === 'photo' ? (
                  <img src={selectedMemory.url} alt={selectedMemory.caption} className="w-full h-full object-contain max-h-[50vh] md:max-h-full" />
                ) : (
                  <div className={`w-full aspect-square flex items-center justify-center ${selectedMemory.color || 'bg-indigo-600'}`}>
                    {selectedMemory.icon ? <selectedMemory.icon className="w-32 h-32 text-white/50" /> : <Quote className="w-32 h-32 text-white/50" />}
                  </div>
                )}
              </div>

              <div className="w-full md:w-[320px] bg-white p-8 md:p-10 flex flex-col justify-between border-l border-slate-100">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                         <PawPrint className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">THE PET</p>
                        <h4 className="text-xl font-black text-slate-900 leading-none">{selectedMemory.pet || 'All'}</h4>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{selectedMemory.date}</p>
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">{selectedMemory.caption || selectedMemory.title || "POETIC MOMENT"}</h2>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase">{selectedMemory.desc || selectedMemory.text}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black tracking-widest uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Home Sweet Home</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-8">
                   <button onClick={(e) => handleLike(selectedMemory.id, e)} className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest hover:scale-110 transition-transform">
                     <Heart className={`w-5 h-5 ${selectedMemory.likes > 0 ? 'fill-rose-500' : ''}`} /> {selectedMemory.likes || 0} LIKES
                   </button>
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                          {String.fromCharCode(64 + i)}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoriesTab;
