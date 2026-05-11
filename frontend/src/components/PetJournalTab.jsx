import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Smile, Frown, Meh, Sun, CloudRain, Zap, Edit3, Trash2 } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#f59e0b,#ec4899,#6366f1)';

const MOOD_OPTIONS = [
  { id:'happy',   label:'Happy',    emoji:'😄', color:'#10b981' },
  { id:'excited', label:'Excited',  emoji:'🤩', color:'#f59e0b' },
  { id:'calm',    label:'Calm',     emoji:'😌', color:'#6366f1' },
  { id:'tired',   label:'Tired',    emoji:'😴', color:'#8b5cf6' },
  { id:'sad',     label:'Sad',      emoji:'😢', color:'#3b82f6' },
  { id:'sick',    label:'Not Well', emoji:'🤒', color:'#ef4444' },
];

const ACTIVITY_OPTIONS = [
  'Morning Walk','Playtime','Grooming','Vet Visit','Training','Feeding','Cuddle Time','Bath','Park Visit','Nap'
];

const INIT_ENTRIES = [
  {
    id:1, date:'2026-05-07', mood:'happy', activities:['Morning Walk','Playtime'],
    note:'Bruno had the best day today! Found a new friend at the park. Ate all his food.',
    weather:'sunny', petName:'Bruno', highlight:true,
  },
  {
    id:2, date:'2026-05-06', mood:'tired', activities:['Vet Visit','Grooming'],
    note:'Vaccination day. Bruno was a bit nervous but very brave. Got a treat after!',
    weather:'cloudy', petName:'Bruno', highlight:false,
  },
  {
    id:3, date:'2026-05-05', mood:'excited', activities:['Training','Cuddle Time'],
    note:'Learned "shake hands" command today! We practiced for 20 mins straight.',
    weather:'sunny', petName:'Bruno', highlight:true,
  },
];

const WEATHER_ICONS = { sunny:'☀️', cloudy:'☁️', rainy:'🌧️', windy:'💨' };

export default function PetJournalTab() {
  const [entries, setEntries]   = useState(INIT_ENTRIES);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    petName:'Bruno', mood:'happy', activities:[], note:'', weather:'sunny', highlight:false,
    date: new Date().toISOString().split('T')[0],
  });

  const moodCfg = Object.fromEntries(MOOD_OPTIONS.map(m => [m.id, m]));

  const toggleActivity = (a) => setForm(f => ({
    ...f,
    activities: f.activities.includes(a) ? f.activities.filter(x=>x!==a) : [...f.activities, a],
  }));

  const save = () => {
    if (!form.note.trim()) return;
    if (editing) {
      setEntries(p => p.map(e => e.id===editing ? {...form, id:editing} : e));
      setEditing(null);
    } else {
      setEntries(p => [{ ...form, id: Date.now() }, ...p]);
    }
    setForm({ petName:'Bruno', mood:'happy', activities:[], note:'', weather:'sunny', highlight:false, date:new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const startEdit = (e, ev) => {
    e.stopPropagation();
    setForm({ petName:ev.petName, mood:ev.mood, activities:ev.activities, note:ev.note, weather:ev.weather, highlight:ev.highlight, date:ev.date });
    setEditing(ev.id);
    setShowForm(true);
    setSelected(null);
  };

  const remove = (e, id) => { e.stopPropagation(); setEntries(p => p.filter(x=>x.id!==id)); if(selected===id)setSelected(null); };

  const entry = selected ? entries.find(e=>e.id===selected) : null;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[120px]">📖</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📖 Daily Journal</span>
        <h2 className="text-2xl font-black mt-2">Pet Daily Journal</h2>
        <p className="text-orange-100 text-sm mt-1">Capture your pet's everyday moments, moods, and milestones.</p>
        <div className="flex gap-6 mt-4">
          {[['Total Entries',entries.length],['Highlights',entries.filter(e=>e.highlight).length],['Happy Days',entries.filter(e=>e.mood==='happy').length]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-orange-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className={`gap-5 ${entry ? 'grid grid-cols-1 lg:grid-cols-5' : ''}`}>
        {/* Entry list */}
        <div className={entry ? 'lg:col-span-3 space-y-4' : 'space-y-4'}>
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-slate-800">📋 Journal Entries</p>
            <button onClick={() => { setShowForm(v=>!v); setEditing(null); setForm({petName:'Bruno',mood:'happy',activities:[],note:'',weather:'sunny',highlight:false,date:new Date().toISOString().split('T')[0]}); }}
              className="flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl" style={{background:GRAD}}>
              <Plus className="w-3.5 h-3.5"/> New Entry
            </button>
          </div>

          {/* New/Edit form */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                className="bg-white rounded-2xl border-2 border-orange-200 shadow-md p-5 space-y-4">
                <p className="font-extrabold text-slate-800">{editing ? '✏️ Edit Entry' : '✨ New Journal Entry'}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Pet Name</label>
                    <input value={form.petName} onChange={e=>setForm(f=>({...f,petName:e.target.value}))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Date</label>
                    <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Pet Mood Today</label>
                  <div className="flex gap-2 flex-wrap">
                    {MOOD_OPTIONS.map(m => (
                      <button key={m.id} onClick={()=>setForm(f=>({...f,mood:m.id}))}
                        className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition ${form.mood===m.id?'border-transparent text-white':'bg-slate-50 border-slate-200'}`}
                        style={form.mood===m.id?{background:m.color}:{}}>
                        {m.emoji} {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Activities Today</label>
                  <div className="flex gap-2 flex-wrap">
                    {ACTIVITY_OPTIONS.map(a => (
                      <button key={a} onClick={()=>toggleActivity(a)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${form.activities.includes(a)?'bg-orange-500 text-white border-orange-500':'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 mb-2">
                    {['sunny','cloudy','rainy','windy'].map(w => (
                      <button key={w} onClick={()=>setForm(f=>({...f,weather:w}))}
                        className={`text-xl p-2 rounded-xl border-2 transition ${form.weather===w?'border-orange-400 bg-orange-50':'border-slate-200'}`}>
                        {WEATHER_ICONS[w]}
                      </button>
                    ))}
                    <label className="ml-auto flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.highlight} onChange={e=>setForm(f=>({...f,highlight:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
                      <span className="text-xs font-bold text-slate-600">⭐ Highlight</span>
                    </label>
                  </div>
                  <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} rows={3}
                    placeholder="What happened today? How was your pet feeling? Any special moments?"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 outline-none resize-none"/>
                </div>
                <div className="flex gap-2">
                  <button onClick={save} className="flex-1 py-2.5 text-white font-bold rounded-xl text-sm" style={{background:GRAD}}>
                    {editing ? '✅ Save Changes' : '✨ Save Entry'}
                  </button>
                  <button onClick={()=>{setShowForm(false);setEditing(null);}} className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries */}
          <AnimatePresence>
            {entries.map((e, i) => {
              const mood = moodCfg[e.mood];
              const isSelected = selected === e.id;
              return (
                <motion.div key={e.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.97}} transition={{delay:i*0.06}}
                  onClick={()=>setSelected(isSelected?null:e.id)}
                  className={`bg-white rounded-2xl border-2 shadow-sm p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected?'ring-2 ring-orange-400':e.highlight?'border-amber-300':'border-slate-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:(mood?.color||'#6366f1')+'18'}}>
                      {mood?.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-extrabold text-slate-900 text-sm">{e.petName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:(mood?.color||'#6366f1')+'18',color:mood?.color||'#6366f1'}}>{mood?.label}</span>
                        {e.highlight && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Highlight</span>}
                        <span className="ml-auto text-xs text-slate-400">{WEATHER_ICONS[e.weather]} {e.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{e.note}</p>
                      {e.activities.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {e.activities.slice(0,4).map(a=>(
                            <span key={a} className="text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">{a}</span>
                          ))}
                          {e.activities.length>4 && <span className="text-[10px] text-slate-400">+{e.activities.length-4} more</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={(ev)=>startEdit(ev,e)} className="p-1.5 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition">
                        <Edit3 className="w-3.5 h-3.5 text-slate-500"/>
                      </button>
                      <button onClick={(ev)=>remove(ev,e.id)} className="p-1.5 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-300 transition">
                        <Trash2 className="w-3.5 h-3.5 text-slate-500"/>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {entry && (
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
              className="lg:col-span-2 bg-white rounded-2xl border-2 border-orange-200 shadow-lg overflow-hidden self-start">
              <div className="p-5 text-white relative" style={{background: GRAD}}>
                <button onClick={()=>setSelected(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-sm">✕</button>
                <div className="text-4xl mb-2">{moodCfg[entry.mood]?.emoji}</div>
                <p className="text-xl font-black">{entry.petName}'s Day</p>
                <p className="text-sm text-orange-200">{entry.date} · {WEATHER_ICONS[entry.weather]}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{moodCfg[entry.mood]?.label}</span>
                  {entry.highlight && <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">⭐ Highlight</span>}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">📝 Journal Entry</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">{entry.note}</p>
                </div>
                {entry.activities.length > 0 && (
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">🎯 Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.activities.map(a => (
                        <span key={a} className="text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button onClick={(e)=>startEdit(e,entry)} className="flex-1 py-2.5 text-white text-xs font-bold rounded-xl" style={{background:GRAD}}>✏️ Edit</button>
                  <button onClick={(e)=>remove(e,entry.id)} className="flex-1 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl hover:bg-rose-100 transition">🗑 Delete</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
