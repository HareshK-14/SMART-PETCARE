import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Star, Zap, Heart, Moon } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#a855f7,#6366f1,#14b8a6)';

const SIGNS = [
  { sign:'Aries ♈',     dates:'Mar 21–Apr 19', trait:'Bold & Energetic',  emoji:'🐏', lucky:'Tennis ball', planet:'Mars' },
  { sign:'Taurus ♉',    dates:'Apr 20–May 20', trait:'Loyal & Calm',       emoji:'🐂', lucky:'Snack time',  planet:'Venus' },
  { sign:'Gemini ♊',    dates:'May 21–Jun 20', trait:'Curious & Playful',  emoji:'👯', lucky:'New toy',      planet:'Mercury' },
  { sign:'Cancer ♋',    dates:'Jun 21–Jul 22', trait:'Nurturing & Loving', emoji:'🦀', lucky:'Cuddles',      planet:'Moon' },
  { sign:'Leo ♌',       dates:'Jul 23–Aug 22', trait:'Confident & Bold',   emoji:'🦁', lucky:'Attention',    planet:'Sun' },
  { sign:'Virgo ♍',     dates:'Aug 23–Sep 22', trait:'Smart & Observant',  emoji:'🌾', lucky:'Routine',      planet:'Mercury' },
  { sign:'Libra ♎',     dates:'Sep 23–Oct 22', trait:'Gentle & Balanced',  emoji:'⚖️', lucky:'Socializing',  planet:'Venus' },
  { sign:'Scorpio ♏',   dates:'Oct 23–Nov 21', trait:'Intense & Loyal',    emoji:'🦂', lucky:'Exploration',  planet:'Pluto' },
  { sign:'Sagittarius ♐',dates:'Nov 22–Dec 21',trait:'Adventurous & Free', emoji:'🏹', lucky:'Outdoor run',  planet:'Jupiter' },
  { sign:'Capricorn ♑', dates:'Dec 22–Jan 19', trait:'Patient & Disciplined',emoji:'🐐',lucky:'Training',   planet:'Saturn' },
  { sign:'Aquarius ♒',  dates:'Jan 20–Feb 18', trait:'Unique & Independent',emoji:'🌊',lucky:'Discovery',   planet:'Uranus' },
  { sign:'Pisces ♓',    dates:'Feb 19–Mar 20', trait:'Gentle & Dreamy',    emoji:'🐟', lucky:'Rest & swim',  planet:'Neptune' },
];

const DAILY_TIPS = {
  'Aries ♈':     ['Your pet craves a sprint today — let them run free!','Bold adventures ahead. Try a new park route.','High energy day — 2 walks minimum.'],
  'Taurus ♉':    ['Snack time has cosmic approval today 🍖','Comfort and routine bring deep peace.','A gentle massage session is written in the stars.'],
  'Gemini ♊':    ['Social interactions boost your pet\'s mood today.','Try a new trick — they\'re mentally sharp!','Playdates are cosmically aligned today.'],
  'Cancer ♋':    ['Extra cuddles today strengthen your bond.','Your pet needs emotional closeness — stay nearby.','Home comfort is their safe universe today.'],
  'Leo ♌':       ['Your pet wants to be the centre of attention today.','Show them off — they\'re at their most charming!','Royal treatment is deserved and appreciated.'],
  'Virgo ♍':     ['Grooming session + health check aligns perfectly today.','Maintain their routine for peak wellness.','Analytical energy — great day for training.'],
  'Libra ♎':     ['Balance rest and play in equal harmony today.','Social interactions lift their spirits.','Introduce a friend for a cosmic playdate.'],
  'Scorpio ♏':   ['Deep exploration mode is activated today.','Trust-building activities strengthen loyalty.','Intense curiosity — hide treats for them to find!'],
  'Sagittarius ♐':['Adventure calls — explore somewhere new today!','Freedom and space will make them flourish.','An outdoor excursion is written in the stars.'],
  'Capricorn ♑': ['Structured training today yields brilliant results.','Discipline and rewards create life-long habits.','Patience is rewarded — keep up the routine.'],
  'Aquarius ♒':  ['Innovation is in the air — try a new activity.','Independence and curiosity are peaked today.','Let them explore freely — discovery awaits.'],
  'Pisces ♓':    ['Gentle, calm energy is all they need today.','Quiet bonding moments create deep connection.','Dreams and rest take centre stage today.'],
};

const WELLNESS_CATEGORIES = [
  { label:'Energy', icon:'⚡', value:82, color:'#f59e0b' },
  { label:'Sleep',  icon:'🌙', value:75, color:'#6366f1' },
  { label:'Social', icon:'🐾', value:90, color:'#10b981' },
  { label:'Focus',  icon:'🎯', value:68, color:'#ef4444' },
];

export default function PetHoroscopeTab() {
  const [selected, setSelected]   = useState(SIGNS[4]); // Leo default
  const [tipIdx, setTipIdx]       = useState(0);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [luckyNumber]             = useState(Math.floor(Math.random()*9)+1);

  const tips = DAILY_TIPS[selected.sign] || [];

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setTipIdx(Math.floor(Math.random()*tips.length)); setGenerated(true); setLoading(false); }, 1500);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[100px]">🔮</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🌟 Cosmic Wellness</span>
        <h2 className="text-2xl font-black mt-2">Pet Horoscope & Wellness Insights</h2>
        <p className="text-violet-200 text-sm mt-1">Daily cosmic guidance and personalized wellness suggestions for your pet.</p>
        <div className="flex gap-6 mt-4">
          {[['Sign', selected.sign.split(' ')[0]],['Trait', selected.trait.split(' ')[0]],['Planet', selected.planet],['Lucky', selected.lucky.split(' ')[0]]].map(([l,v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-violet-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Sign selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🐾 Select Your Pet's Star Sign</p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {SIGNS.map(s => (
            <button key={s.sign} onClick={() => { setSelected(s); setGenerated(false); }}
              className={`p-2 rounded-xl text-center border-2 transition-all hover:scale-105 ${selected.sign===s.sign ? 'bg-violet-50 border-violet-300' : 'bg-slate-50 border-slate-200 hover:border-violet-200'}`}>
              <div className="text-xl">{s.emoji}</div>
              <div className="text-[10px] font-bold text-slate-600 mt-0.5">{s.sign.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Reading */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-1">✨ Today's Cosmic Reading</p>
          <p className="text-xs text-slate-400 mb-4">{selected.sign} · {selected.dates}</p>

          <div className="text-center p-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 mb-4">
            <div className="text-6xl mb-3">{selected.emoji}</div>
            <p className="font-extrabold text-violet-800 text-lg">{selected.sign}</p>
            <p className="text-sm text-violet-600 mt-1">{selected.trait}</p>
            <div className="flex justify-center gap-4 mt-3">
              <span className="text-xs font-bold bg-white border border-violet-200 text-violet-700 px-3 py-1 rounded-full">🪐 {selected.planet}</span>
              <span className="text-xs font-bold bg-white border border-violet-200 text-violet-700 px-3 py-1 rounded-full">🔢 Lucky #{luckyNumber}</span>
            </div>
          </div>

          <AnimatePresence>
            {generated && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800 font-medium leading-relaxed mb-3">
                🔮 {tips[tipIdx]}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-extrabold text-amber-600 mb-1">🍀 Lucky Activity Today</p>
            <p className="font-bold text-amber-800">{selected.lucky}</p>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-2.5 text-white font-bold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: GRAD }}>
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/>Reading the stars...</> : '🔮 Generate Daily Reading'}
          </button>
        </div>

        {/* Wellness meters */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">📊 Cosmic Wellness Meters</p>
            {WELLNESS_CATEGORIES.map((c, i) => (
              <div key={c.label} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                  <span>{c.icon} {c.label}</span>
                  <span style={{color:c.color}}>{c.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <motion.div className="h-3 rounded-full"
                    initial={{width:0}} animate={{width:`${c.value}%`}} transition={{delay:i*0.1+0.3,duration:0.8}}
                    style={{background:c.color+'cc'}}/>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">🌙 This Week's Forecast</p>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => {
              const emoji = ['😊','😴','🤩','😸','😊','🎉','😌'][i];
              const mood  = ['Great','Rest','Excited','Playful','Good','Party','Calm'][i];
              return (
                <div key={d} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-bold text-slate-400 w-8">{d}</span>
                  <span className="text-lg">{emoji}</span>
                  <span className="text-sm font-bold text-slate-700 flex-1">{mood}</span>
                  <div className="w-20 bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{width:`${60+i*5}%`,background:GRAD}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
