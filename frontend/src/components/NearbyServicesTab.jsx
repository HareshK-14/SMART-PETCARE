import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Phone, Star, Clock, ShieldAlert, Scissors, ShoppingBag, Stethoscope } from 'lucide-react';

const SERVICES = [
  { id:1,  type:'Emergency Clinic',  name:'VetFirst 24/7 ER',            dist:'0.8 km', rating:4.9, open:'24/7',  phone:'+91-9876543210', emergency:true,  emoji:'🏥' },
  { id:2,  type:'Veterinary Clinic', name:'PawCare Animal Hospital',      dist:'1.2 km', rating:4.7, open:'Open',  phone:'+91-9123456789', emergency:false, emoji:'🩺' },
  { id:3,  type:'Grooming Salon',    name:'FurGlam Pet Spa',              dist:'1.5 km', rating:4.8, open:'Open',  phone:'+91-9001122334', emergency:false, emoji:'✂️' },
  { id:4,  type:'Pet Shop',          name:'PetWorld Superstore',          dist:'1.8 km', rating:4.5, open:'Open',  phone:'+91-9988776655', emergency:false, emoji:'🛍️' },
  { id:5,  type:'Veterinary Clinic', name:'City Veterinary Centre',       dist:'2.1 km', rating:4.6, open:'Open',  phone:'+91-9876001234', emergency:false, emoji:'🩺' },
  { id:6,  type:'Grooming Salon',    name:'Paws & Claws Grooming Studio', dist:'2.4 km', rating:4.9, open:'Open',  phone:'+91-9123001234', emergency:false, emoji:'✂️' },
  { id:7,  type:'Pet Shop',          name:'Happy Paws Store',             dist:'2.9 km', rating:4.3, open:'Open',  phone:'+91-9988001122', emergency:false, emoji:'🛍️' },
  { id:8,  type:'Emergency Clinic',  name:'Animal Emergency Hospital',    dist:'3.2 km', rating:4.8, open:'24/7',  phone:'+91-9001002003', emergency:true,  emoji:'🏥' },
];

const TYPE_COLORS = {
  'Emergency Clinic':  { bg:'bg-rose-50',    text:'text-rose-700',    border:'border-rose-200',    icon: ShieldAlert, color:'#ef4444' },
  'Veterinary Clinic': { bg:'bg-indigo-50',  text:'text-indigo-700',  border:'border-indigo-200',  icon: Stethoscope, color:'#6366f1' },
  'Grooming Salon':    { bg:'bg-violet-50',  text:'text-violet-700',  border:'border-violet-200',  icon: Scissors,    color:'#8b5cf6' },
  'Pet Shop':          { bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   icon: ShoppingBag, color:'#f59e0b' },
};

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

export default function NearbyServicesTab() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const types = ['All', ...Object.keys(TYPE_COLORS)];

  const visible = SERVICES.filter(s => {
    const matchType   = filter === 'All' || s.type === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-8 -top-8 opacity-10"><MapPin className="w-40 h-40"/></div>
        <div className="relative">
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📍 Nearby Services</span>
          <h2 className="text-2xl font-black mt-2">Pet Services Near You</h2>
          <p className="text-indigo-200 text-sm mt-1">Vets, grooming, pet shops & emergency clinics within 5km.</p>
          <div className="flex gap-6 mt-4">
            {[['Clinics',SERVICES.filter(s=>s.type.includes('Clinic')).length],['Grooming',SERVICES.filter(s=>s.type==='Grooming Salon').length],['Shops',SERVICES.filter(s=>s.type==='Pet Shop').length]].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clinics, groomers, shops..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 outline-none"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => {
            const tc = TYPE_COLORS[t];
            return (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${filter===t ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                style={filter===t ? {background: tc?.color || GRAD} : {}}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="font-extrabold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500"/>Live Map View</p>
          <span className="text-xs text-slate-400">{visible.length} results nearby</span>
        </div>
        <iframe title="Nearby Services Map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=80.2,12.9,80.3,13.0&layer=mapnik"
          className="w-full h-44 border-0" allowFullScreen/>
      </div>

      {/* Service list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((s, i) => {
            const tc = TYPE_COLORS[s.type];
            const Icon = tc?.icon || MapPin;
            return (
              <motion.div key={s.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.97}} transition={{delay:i*0.04}}
                className={`bg-white rounded-2xl border-2 shadow-sm p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${selected===s.id ? tc?.border || 'border-indigo-200' : 'border-slate-100'}`}
                onClick={() => setSelected(selected===s.id ? null : s.id)}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tc?.bg}`}>
                    <Icon className="w-5 h-5" style={{color: tc?.color}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-extrabold text-slate-900 text-sm">{s.name}</p>
                      {s.emergency && <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">24/7 ER</span>}
                    </div>
                    <p className="text-xs text-slate-400">{s.type} · {s.dist}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600">⭐ {s.rating}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.open==='24/7'?'bg-rose-100 text-rose-700':'bg-emerald-100 text-emerald-700'}`}>{s.open}</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selected === s.id && (
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                      className="mt-4 overflow-hidden">
                      <div className="flex gap-2">
                        <a href={`tel:${s.phone}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-white text-xs font-bold rounded-lg"
                          style={{background: tc?.color || GRAD}}>
                          <Phone className="w-3 h-3"/> Call Now
                        </a>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition">
                          <Navigation className="w-3 h-3"/> Get Directions
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-white text-xs font-bold rounded-lg" style={{background:GRAD}}>
                          <Star className="w-3 h-3"/> Book
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="col-span-2 bg-slate-50 rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold">No services match your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
