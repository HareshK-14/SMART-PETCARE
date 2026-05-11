import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Star, Coffee, Trees, Waves, Hotel, Building2, Search } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#10b981,#14b8a6,#6366f1)';

const PLACES = [
  { id:1, type:'Park',      name:'Green Paws Park',          dist:'0.6 km', rating:4.9, fee:'Free',     emoji:'🌳', highlight:'Off-leash zone',      tags:['Dogs','Cats','Off-leash','Water station'] },
  { id:2, type:'Cafe',      name:'Pawsome Brew Café',        dist:'1.1 km', rating:4.8, fee:'₹200+',    emoji:'☕', highlight:'Dog-friendly menu',   tags:['Dogs','Outdoor seating','Pet treats'] },
  { id:3, type:'Beach',     name:'Sandy Paws Beach',         dist:'3.2 km', rating:4.7, fee:'Free',     emoji:'🏖️', highlight:'Pet swim area',       tags:['Dogs','Swimming','Sunrise walks'] },
  { id:4, type:'Hotel',     name:'PetLux Stay & Play',       dist:'4.5 km', rating:4.6, fee:'₹2,500/n', emoji:'🏨', highlight:'Pet spa included',    tags:['All pets','Grooming','Vet on-call'] },
  { id:5, type:'Park',      name:'Blossom Walking Trail',    dist:'0.9 km', rating:4.8, fee:'Free',     emoji:'🌷', highlight:'Shaded walking paths', tags:['Dogs','Cats','Strollers','Benches'] },
  { id:6, type:'Cafe',      name:'Furball Kitchen',          dist:'1.8 km', rating:4.7, fee:'₹150+',    emoji:'🍕', highlight:'Pet-exclusive menu',  tags:['Dogs','Indoor','Air-conditioned'] },
  { id:7, type:'Adventure', name:'PetPark Adventure Zone',   dist:'5.0 km', rating:4.9, fee:'₹300',     emoji:'🎡', highlight:'Agility courses',     tags:['Dogs','Training','Weekend events'] },
  { id:8, type:'Hotel',     name:'Cozy Tails Pet Resort',    dist:'6.2 km', rating:4.5, fee:'₹1,800/n', emoji:'🏩', highlight:'24/7 vet access',     tags:['Dogs','Cats','Indoor play area'] },
];

const TYPE_CFG = {
  Park:      { color:'#10b981', icon: Trees,     bg:'bg-emerald-50',  border:'border-emerald-200' },
  Cafe:      { color:'#f59e0b', icon: Coffee,    bg:'bg-amber-50',    border:'border-amber-200'   },
  Beach:     { color:'#14b8a6', icon: Waves,     bg:'bg-teal-50',     border:'border-teal-200'    },
  Hotel:     { color:'#6366f1', icon: Hotel,     bg:'bg-indigo-50',   border:'border-indigo-200'  },
  Adventure: { color:'#ef4444', icon: Building2, bg:'bg-rose-50',     border:'border-rose-200'    },
};

export default function PetLocationDiscoveryTab() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState([]);

  const types = ['All', ...Object.keys(TYPE_CFG)];

  const toggleSave = (id) => setSaved(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const visible = PLACES.filter(p => {
    const matchType   = filter === 'All' || p.type === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const place = selected ? PLACES.find(p => p.id === selected) : null;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[100px]">📍</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📍 Explore</span>
        <h2 className="text-2xl font-black mt-2">Pet-Friendly Location Discovery</h2>
        <p className="text-emerald-100 text-sm mt-1">Discover nearby pet-friendly parks, cafés, beaches, hotels, and adventure zones.</p>
        <div className="flex gap-6 mt-4">
          {[['Parks',PLACES.filter(p=>p.type==='Park').length],['Cafés',PLACES.filter(p=>p.type==='Cafe').length],['Saved',saved.length],['Within','6 km']].map(([l,v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search parks, cafés, beaches..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-300 outline-none"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => {
            const cfg = TYPE_CFG[t];
            return (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${filter===t?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'}`}
                style={filter===t?{background:cfg?.color||GRAD}:{}}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map embed */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500"/>
          <p className="font-extrabold text-slate-800 text-sm">Live Map · {visible.length} locations found</p>
        </div>
        <iframe title="Pet Locations Map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=80.2,12.9,80.3,13.0&layer=mapnik"
          className="w-full h-44 border-0" allowFullScreen/>
      </div>

      {/* Two-column grid when detail open */}
      <div className={`gap-4 ${place ? 'grid grid-cols-1 lg:grid-cols-2 items-start' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>

        {/* Place list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const cfg = TYPE_CFG[p.type] || TYPE_CFG['Park'];
              const Icon = cfg.icon;
              const isSelected = selected === p.id;
              return (
                <motion.div key={p.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.97}} transition={{delay:i*0.05}}
                  className={`bg-white rounded-2xl border-2 shadow-sm p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected?'ring-2 ring-emerald-400':''}`}
                  style={{borderColor: isSelected ? cfg.color : '#f1f5f9'}}
                  onClick={() => setSelected(isSelected ? null : p.id)}>
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <span className="text-2xl">{p.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:cfg.color+'18',color:cfg.color}}>{p.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>📍 {p.dist}</span>
                        <span>⭐ {p.rating}</span>
                        <span className="font-bold text-emerald-600">{p.fee}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">✨ {p.highlight}</p>
                    </div>
                    <button onClick={e=>{e.stopPropagation();toggleSave(p.id)}}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${saved.includes(p.id)?'bg-rose-500 border-rose-500':'border-slate-200 hover:border-rose-400'}`}>
                      <span className="text-sm">{saved.includes(p.id)?'♥':'♡'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {visible.length === 0 && (
            <div className="bg-slate-50 rounded-2xl p-10 text-center text-slate-400 col-span-2">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-bold">No places match your filter</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {place && (
            <motion.div key={place.id} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
              className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden self-start">
              <div className="p-5 text-white relative" style={{background:TYPE_CFG[place.type]?.color ? `linear-gradient(135deg,${TYPE_CFG[place.type].color},#6366f1)` : GRAD}}>
                <button onClick={()=>setSelected(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-sm transition">✕</button>
                <div className="text-5xl mb-2">{place.emoji}</div>
                <p className="text-xl font-black">{place.name}</p>
                <p className="text-sm opacity-80">{place.type} · {place.dist} away</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">⭐ {place.rating}</span>
                  <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{place.fee}</span>
                  <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">✨ {place.highlight}</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">🏷️ Amenities & Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map(t => (
                      <span key={t} className="text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5" style={{background:GRAD}}>
                    <Navigation className="w-3 h-3"/> Get Directions
                  </button>
                  <button onClick={()=>toggleSave(place.id)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl border-2 transition flex items-center justify-center gap-1.5 ${saved.includes(place.id)?'bg-rose-500 text-white border-rose-500':'bg-white text-slate-700 border-slate-200'}`}>
                    {saved.includes(place.id)?'♥ Saved':'♡ Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
