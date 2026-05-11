import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Star, Calendar, Film, Plus, X, Download } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#ec4899,#8b5cf6,#14b8a6)';

const INIT_MEMORIES = [
  { id:1, type:'photo', emoji:'🐾', title:"Bruno's First Walk",      date:'2026-01-15', category:'Milestone', note:'His very first walk in the park! He loved the grass.',         highlight:true,  color:'#10b981' },
  { id:2, type:'photo', emoji:'💉', title:'Vaccination Day',         date:'2026-02-10', category:'Health',    note:'Brave boy! Got all his shots with zero fuss.',                 highlight:false, color:'#6366f1' },
  { id:3, type:'video', emoji:'🎾', title:'First Fetch Session',     date:'2026-02-25', category:'Fun',       note:'Took 30 tries but he finally brought the ball back!',          highlight:true,  color:'#f59e0b' },
  { id:4, type:'photo', emoji:'🎂', title:"Bruno's 1st Birthday!",   date:'2026-03-05', category:'Milestone', note:'We had a mini paw-ty with his best park friends.',             highlight:true,  color:'#ef4444' },
  { id:5, type:'photo', emoji:'🏖️', title:'Beach Adventure',         date:'2026-03-20', category:'Travel',    note:'First time at the beach — he chased every wave!',              highlight:false, color:'#14b8a6' },
  { id:6, type:'video', emoji:'🎓', title:'Graduated Training Class',date:'2026-04-02', category:'Milestone', note:'Passed 8/10 commands. So proud of this champion!',             highlight:true,  color:'#8b5cf6' },
  { id:7, type:'photo', emoji:'🛁', title:'Spa & Grooming Day',      date:'2026-04-18', category:'Grooming',  note:'Smells like a dream. New fluffy look unlocked.',               highlight:false, color:'#ec4899' },
  { id:8, type:'photo', emoji:'🌧️', title:'Rainy Day Cuddles',       date:'2026-05-01', category:'Moments',   note:'Nothing beats a cuddle session on a stormy afternoon.',        highlight:false, color:'#3b82f6' },
];

const CATEGORIES = ['All','Milestone','Health','Fun','Travel','Grooming','Moments'];

const CAT_COLOR = {
  Milestone:'bg-amber-100 text-amber-700 border-amber-200',
  Health:   'bg-indigo-100 text-indigo-700 border-indigo-200',
  Fun:      'bg-orange-100 text-orange-700 border-orange-200',
  Travel:   'bg-teal-100 text-teal-700 border-teal-200',
  Grooming: 'bg-pink-100 text-pink-700 border-pink-200',
  Moments:  'bg-blue-100 text-blue-700 border-blue-200',
};

export default function PetMemoryGalleryTab() {
  const [memories, setMemories] = useState(INIT_MEMORIES);
  const [filter, setFilter]     = useState('All');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [newMem, setNewMem]     = useState({ title:'', category:'Moments', note:'', emoji:'📸', date:new Date().toISOString().split('T')[0], type:'photo' });

  const vis = memories.filter(m => filter==='All' || m.category===filter);
  const mem = selected ? memories.find(m=>m.id===selected) : null;
  const highlights = memories.filter(m=>m.highlight);

  const addMemory = () => {
    if (!newMem.title.trim()) return;
    setMemories(p => [{ id:Date.now(), ...newMem, highlight:false, color:['#10b981','#6366f1','#f59e0b','#ef4444','#14b8a6','#8b5cf6','#ec4899'][Math.floor(Math.random()*7)] }, ...p]);
    setNewMem({ title:'', category:'Moments', note:'', emoji:'📸', date:new Date().toISOString().split('T')[0], type:'photo' });
    setShowAdd(false);
  };

  const toggleHighlight = (e, id) => { e.stopPropagation(); setMemories(p => p.map(m => m.id===id ? {...m, highlight:!m.highlight} : m)); };
  const remove          = (e, id) => { e.stopPropagation(); setMemories(p=>p.filter(m=>m.id!==id)); if(selected===id)setSelected(null); };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[120px]">🌥️</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">☁️ Memory Cloud</span>
        <h2 className="text-2xl font-black mt-2">Pet Memory Cloud Gallery</h2>
        <p className="text-pink-100 text-sm mt-1">Your pet's most cherished moments, milestones, and memories — beautifully preserved.</p>
        <div className="flex gap-6 mt-4">
          {[['Total Memories',memories.length],['Highlights',highlights.length],['Milestones',memories.filter(m=>m.category==='Milestone').length],['Videos',memories.filter(m=>m.type==='video').length]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-pink-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Highlights reel */}
      {highlights.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">⭐ Memory Highlights</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {highlights.map(h => (
              <motion.button key={h.id} whileHover={{scale:1.05}} onClick={()=>setSelected(h.id===selected?null:h.id)}
                className="flex-shrink-0 w-28 text-center">
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl mb-2 shadow-md"
                  style={{background:`linear-gradient(135deg,${h.color}22,${h.color}55)`}}>
                  {h.emoji}
                </div>
                <p className="text-xs font-bold text-slate-700 truncate">{h.title}</p>
                <p className="text-[10px] text-slate-400">{h.date}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap flex-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={()=>setFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${filter===c?'text-white bg-pink-500 border-pink-500':'bg-white border-slate-200 text-slate-600 hover:border-pink-300'}`}>
              {c} {c!=='All'&&`(${memories.filter(m=>m.category===c).length})`}
            </button>
          ))}
        </div>
        <button onClick={()=>setShowAdd(v=>!v)}
          className="flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl flex-shrink-0" style={{background:GRAD}}>
          <Plus className="w-3.5 h-3.5"/> Add Memory
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            className="bg-white rounded-2xl border-2 border-pink-200 shadow-md p-5 space-y-3">
            <p className="font-extrabold text-slate-800">✨ Add New Memory</p>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Memory title…" value={newMem.title} onChange={e=>setNewMem(n=>({...n,title:e.target.value}))}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"/>
              <input type="date" value={newMem.date} onChange={e=>setNewMem(n=>({...n,date:e.target.value}))}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"/>
            </div>
            <div className="flex gap-3">
              <input placeholder="Emoji (e.g. 🐾)" value={newMem.emoji} onChange={e=>setNewMem(n=>({...n,emoji:e.target.value}))}
                className="w-24 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none text-center"/>
              <select value={newMem.category} onChange={e=>setNewMem(n=>({...n,category:e.target.value}))}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none">
                {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                {['photo','video'].map(t=>(
                  <button key={t} onClick={()=>setNewMem(n=>({...n,type:t}))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition ${newMem.type===t?'bg-pink-500 text-white border-pink-500':'bg-white border-slate-200 text-slate-600'}`}>
                    {t==='photo'?'📷 Photo':'🎥 Video'}
                  </button>
                ))}
              </div>
            </div>
            <textarea placeholder="Describe this memory…" value={newMem.note} onChange={e=>setNewMem(n=>({...n,note:e.target.value}))} rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-300 outline-none resize-none"/>
            <div className="flex gap-2">
              <button onClick={addMemory} className="flex-1 py-2.5 text-white font-bold rounded-xl text-sm" style={{background:GRAD}}>✨ Save Memory</button>
              <button onClick={()=>setShowAdd(false)} className="px-4 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud gallery + detail */}
      <div className={`gap-5 ${mem ? 'grid grid-cols-1 lg:grid-cols-5 items-start' : ''}`}>
        {/* Grid */}
        <div className={`${mem ? 'lg:col-span-3' : ''} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
          <AnimatePresence mode="popLayout">
            {vis.map((m, i) => (
              <motion.div key={m.id} layout initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{delay:i*0.05}}
                onClick={()=>setSelected(m.id===selected?null:m.id)}
                className={`bg-white rounded-2xl border-2 shadow-sm cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden ${selected===m.id?'ring-2 ring-pink-400':'border-slate-100'}`}>
                <div className="h-24 flex items-center justify-center text-4xl" style={{background:`linear-gradient(135deg,${m.color}22,${m.color}55)`}}>
                  {m.emoji}
                  {m.type==='video' && <div className="absolute ml-10 mb-6 text-white text-xs font-extrabold bg-black/40 rounded-full px-1">▶</div>}
                </div>
                <div className="p-3 relative">
                  {m.highlight && <span className="absolute top-2 right-2 text-xs">⭐</span>}
                  <p className="font-extrabold text-slate-800 text-xs leading-tight line-clamp-1">{m.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.date}</p>
                  <span className={`mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${CAT_COLOR[m.category]||'bg-slate-100 text-slate-500 border-slate-200'}`}>{m.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {vis.length===0 && (
            <div className="col-span-4 bg-slate-50 rounded-2xl p-10 text-center text-slate-400">
              <div className="text-4xl mb-3">☁️</div>
              <p className="font-bold">No memories found for this category.</p>
            </div>
          )}
        </div>

        {/* Detail card */}
        <AnimatePresence>
          {mem && (
            <motion.div key={mem.id} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
              className="lg:col-span-2 bg-white rounded-2xl border-2 border-pink-200 shadow-lg overflow-hidden self-start">
              <div className="p-5 text-white relative" style={{background:`linear-gradient(135deg,${mem.color},${mem.color}99)`}}>
                <button onClick={()=>setSelected(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-sm">✕</button>
                <div className="text-5xl mb-2">{mem.emoji}</div>
                <p className="text-xl font-black">{mem.title}</p>
                <p className="text-sm opacity-80">{mem.date} · {mem.type === 'video' ? '🎥 Video' : '📷 Photo'}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{mem.category}</span>
                  {mem.highlight && <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">⭐ Highlight</span>}
                </div>
              </div>
              <div className="p-5 space-y-4">
                {mem.note && (
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">📝 Memory Note</p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">{mem.note}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={(e)=>toggleHighlight(e,mem.id)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl border-2 transition flex items-center justify-center gap-1.5 ${mem.highlight?'bg-amber-500 text-white border-amber-500':'bg-white border-amber-300 text-amber-600'}`}>
                    ⭐ {mem.highlight?'Remove Star':'Add Star'}
                  </button>
                  <button onClick={(e)=>remove(e,mem.id)} className="flex-1 py-2.5 bg-rose-50 text-rose-600 border-2 border-rose-200 text-xs font-bold rounded-xl hover:bg-rose-100 transition">🗑 Delete</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
