import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Flame, Trophy, Star, Lock, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#f59e0b,#ef4444,#6366f1)';

const INITIAL_CHALLENGES = [
  { id:1, emoji:'🚶', title:'Morning Walk',         desc:'Take your pet for a 15-min walk',     xp:30,  cat:'Activity',  done:true,  freq:'Daily' },
  { id:2, emoji:'💧', title:'Hydration Check',      desc:'Refill water bowl twice today',       xp:15,  cat:'Health',    done:true,  freq:'Daily' },
  { id:3, emoji:'🎾', title:'Play Session',          desc:'10 minutes of active play',           xp:25,  cat:'Activity',  done:false, freq:'Daily' },
  { id:4, emoji:'🧴', title:'Grooming Session',      desc:'Brush your pet\'s coat today',       xp:20,  cat:'Grooming',  done:false, freq:'Daily' },
  { id:5, emoji:'📸', title:'Memory Photo',          desc:'Take a cute photo for memory lane',   xp:10,  cat:'Memories',  done:false, freq:'Daily' },
  { id:6, emoji:'🍗', title:'Balanced Meal',         desc:'Serve a nutritionally complete meal', xp:20,  cat:'Nutrition', done:false, freq:'Daily' },
  { id:7, emoji:'🩺', title:'Weekly Health Check',   desc:'Check eyes, ears, paws and coat',    xp:50,  cat:'Health',    done:false, freq:'Weekly'},
  { id:8, emoji:'🤝', title:'Socialise Your Pet',   desc:'Let your pet meet another pet/person',xp:40,  cat:'Social',    done:false, freq:'Weekly'},
];

const ACHIEVEMENTS = [
  { id:'streak7',  emoji:'🔥', title:'Week Warrior',   desc:'7-day streak',      locked:false },
  { id:'feeder',   emoji:'🍗', title:'Nutritionist',   desc:'30 meals logged',   locked:false },
  { id:'walker',   emoji:'🦮', title:'Walkmaster',     desc:'50 walks done',     locked:true  },
  { id:'groomer',  emoji:'✂️', title:'Glam Boss',      desc:'20 groom sessions', locked:true  },
  { id:'social',   emoji:'🤝', title:'Social Star',    desc:'10 social events',  locked:true  },
  { id:'champion', emoji:'🏆', title:'Pet Champion',   desc:'All tasks 30 days', locked:true  },
];

const CAT_COLORS = {
  Activity: '#10b981', Health: '#6366f1', Grooming:'#8b5cf6',
  Nutrition:'#f59e0b', Memories:'#ec4899', Social:'#14b8a6',
};

export default function PetChallengesTab() {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [streak] = useState(7);
  const [filter, setFilter]         = useState('All');
  const [toast, setToast]           = useState('');

  const totalXP  = challenges.filter(c=>c.done).reduce((s,c)=>s+c.xp,0);
  const maxXP    = challenges.reduce((s,c)=>s+c.xp,0);
  const pct      = Math.round((totalXP/maxXP)*100);
  const cats     = ['All','Activity','Health','Grooming','Nutrition','Memories','Social'];

  const complete = (id) => {
    const ch = challenges.find(c=>c.id===id);
    if (!ch || ch.done) return;
    setChallenges(p => p.map(c => c.id===id ? {...c, done:true} : c));
    setToast(`+${ch.xp} XP earned! 🎉 "${ch.title}" completed!`);
    setTimeout(()=>setToast(''),3500);
  };

  const visible = challenges.filter(c => filter==='All' || c.cat===filter);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl"
            style={{background:'linear-gradient(135deg,#10b981,#14b8a6)'}}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[100px]">🏆</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🎮 Daily Challenges</span>
        <h2 className="text-2xl font-black mt-2">Interactive Pet Care Challenges</h2>
        <p className="text-orange-100 text-sm mt-1">Complete daily tasks, earn XP, build streaks, and unlock achievements!</p>
        <div className="flex gap-6 mt-4">
          {[['Streak', `🔥 ${streak} days`],['XP Today', `${totalXP}/${maxXP}`],['Progress', `${pct}%`],['Done', `${challenges.filter(c=>c.done).length}/${challenges.length}`]].map(([l,v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-orange-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
          <span>⚡ Daily XP Progress</span>
          <span>{totalXP} / {maxXP} XP</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 relative overflow-hidden">
          <motion.div className="h-4 rounded-full" style={{ background: GRAD }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-white">{pct}%</div>
        </div>
        {pct === 100 && (
          <p className="text-center text-sm font-bold text-amber-600 mt-2">🎉 All challenges complete! Amazing job!</p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${filter===c?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-amber-300'}`}
            style={filter===c?{background:CAT_COLORS[c]||GRAD}:{}}>
            {c}
          </button>
        ))}
      </div>

      {/* Challenge cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((c, i) => (
            <motion.div key={c.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition-all ${c.done?'border-emerald-200 opacity-80':'border-slate-100 hover:border-amber-200 hover:shadow-md'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${c.done?'bg-emerald-50':'bg-slate-50'}`}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className={`font-extrabold text-sm ${c.done?'text-slate-400 line-through':'text-slate-900'}`}>{c.title}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:(CAT_COLORS[c.cat]||'#6366f1')+'18',color:CAT_COLORS[c.cat]||'#6366f1'}}>{c.cat}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c.freq}</span>
                  </div>
                  <p className="text-xs text-slate-500">{c.desc}</p>
                  <p className="text-xs font-extrabold text-amber-600 mt-1">+{c.xp} XP</p>
                </div>
                <button onClick={() => complete(c.id)} disabled={c.done}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${c.done?'bg-emerald-500 border-emerald-500':'border-slate-200 hover:border-amber-400 active:scale-90'}`}>
                  {c.done && <CheckCircle className="w-5 h-5 text-white"/>}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🏆 Achievements</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} className={`text-center p-3 rounded-2xl border-2 transition-all ${a.locked?'bg-slate-50 border-slate-200 opacity-60':'bg-amber-50 border-amber-300 hover:scale-105'}`}>
              <div className={`text-3xl mb-1 ${a.locked?'grayscale':''}`}>{a.emoji}</div>
              <p className="text-xs font-extrabold text-slate-700">{a.title}</p>
              <p className="text-[10px] text-slate-400">{a.desc}</p>
              {a.locked && <Lock className="w-3 h-3 text-slate-400 mx-auto mt-1"/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
