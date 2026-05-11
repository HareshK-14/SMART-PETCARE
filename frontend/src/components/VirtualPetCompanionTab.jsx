import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Zap, Coffee, Moon, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7,#14b8a6)';

const MOODS = [
  { id:'happy',    emoji:'😄', label:'Happy',     color:'#10b981', bg:'bg-emerald-50', border:'border-emerald-200', tip:'Your pet is full of energy! Perfect time for a walk or playtime.' },
  { id:'sleepy',   emoji:'😴', label:'Sleepy',    color:'#6366f1', bg:'bg-indigo-50',  border:'border-indigo-200',  tip:'Shhh... let your pet rest. Avoid loud noises and bright lights.' },
  { id:'hungry',   emoji:'🤤', label:'Hungry',    color:'#f59e0b', bg:'bg-amber-50',   border:'border-amber-200',   tip:'Time to fill the bowl! Check water too – hydration is crucial.' },
  { id:'excited',  emoji:'🤩', label:'Excited',   color:'#ef4444', bg:'bg-rose-50',    border:'border-rose-200',    tip:'Channel that energy! Try agility training or a new toy today.' },
  { id:'stressed', emoji:'😰', label:'Stressed',  color:'#8b5cf6', bg:'bg-violet-50',  border:'border-violet-200',  tip:'Create a calm space. Soft music and gentle petting help reduce anxiety.' },
  { id:'playful',  emoji:'😸', label:'Playful',   color:'#14b8a6', bg:'bg-teal-50',    border:'border-teal-200',    tip:'Grab a toy! Interactive play strengthens your bond and burns calories.' },
];

const REACTIONS = [
  { label:'Feed',    icon:'🍗', effect:'fed',     msg:'Yummy! That was delicious! 🍗' },
  { label:'Pet',     icon:'🤲', effect:'petted',  msg:'Purring with joy! 💕' },
  { label:'Play',    icon:'🎾', effect:'played',  msg:'Fetch! Fetch! Let\'s go again! 🎾' },
  { label:'Walk',    icon:'🦮', effect:'walked',  msg:'Best walk ever! I love you! 🦮' },
  { label:'Cuddle',  icon:'🤗', effect:'cuddled', msg:'This is my favourite spot! 🥰' },
  { label:'Treat',   icon:'🦴', effect:'treated', msg:'TREAT!! You\'re the best hooman! 🦴' },
];

const XP_PER_ACTION = 20;

export default function VirtualPetCompanionTab() {
  const [mood, setMood]           = useState(MOODS[0]);
  const [reaction, setReaction]   = useState('');
  const [xp, setXp]               = useState(120);
  const [level, setLevel]         = useState(3);
  const [hearts, setHearts]       = useState(87);
  const [bounce, setBounce]       = useState(false);
  const [aiTip, setAiTip]         = useState('');
  const [loadingTip, setLoadingTip] = useState(false);
  const [streak, setStreak]       = useState(7);
  const [log, setLog]             = useState([
    { time:'8:30 AM', action:'Fed breakfast 🍗' },
    { time:'10:00 AM', action:'Morning walk 🦮' },
  ]);

  const maxXP = level * 100;
  const xpPct = Math.min((xp / maxXP) * 100, 100);

  const doReaction = (r) => {
    setReaction(r.msg);
    setBounce(true);
    setXp(p => Math.min(p + XP_PER_ACTION, maxXP));
    setHearts(p => Math.min(p + 2, 100));
    setLog(p => [{ time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), action: r.label + ' ' + r.icon }, ...p.slice(0,4)]);
    setTimeout(() => setBounce(false), 800);
    setTimeout(() => setReaction(''), 3000);
    if (xp + XP_PER_ACTION >= maxXP) { setLevel(l => l + 1); setXp(0); }
  };

  const getTip = () => {
    setLoadingTip(true);
    const tips = [
      `For a ${mood.label.toLowerCase()} pet, try 15 minutes of gentle play before meals.`,
      `Mood: ${mood.label}. Pro tip: regular routines reduce pet anxiety by up to 60%.`,
      `Your companion seems ${mood.label.toLowerCase()}. Ensure 8–10 hours of rest tonight.`,
      `A ${mood.label.toLowerCase()} pet benefits most from owner proximity and calm voice tones.`,
    ];
    setTimeout(() => { setAiTip(tips[Math.floor(Math.random() * tips.length)]); setLoadingTip(false); }, 1400);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[120px]">🐾</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">✨ Virtual Companion</span>
        <h2 className="text-2xl font-black mt-2">Meet Your Virtual Pet Companion</h2>
        <p className="text-indigo-200 text-sm mt-1">React, interact, and bond with your AI-powered pet companion.</p>
        <div className="flex gap-6 mt-4">
          {[['Level', level],['XP', `${xp}/${maxXP}`],['Streak', `${streak} days`],['Hearts', `${hearts}%`]].map(([l,v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Companion card */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          {/* Pet emoji with bounce */}
          <motion.div
            animate={bounce ? { scale:[1,1.4,0.9,1.2,1], rotate:[0,10,-10,5,0] } : {}}
            transition={{ duration: 0.6 }}
            className="text-[80px] mb-2 select-none cursor-pointer"
            onClick={() => doReaction(REACTIONS[2])}>
            🐶
          </motion.div>

          {/* XP bar */}
          <div className="w-full mb-3">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Level {level}</span><span>{xp}/{maxXP} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <motion.div className="h-2.5 rounded-full" style={{ background: GRAD }}
                animate={{ width: `${xpPct}%` }} transition={{ duration: 0.6 }} />
            </div>
          </div>

          {/* Heart meter */}
          <div className="w-full mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>❤️ Happiness</span><span>{hearts}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <motion.div className="h-2 rounded-full bg-rose-400"
                animate={{ width: `${hearts}%` }} transition={{ duration: 0.6 }} />
            </div>
          </div>

          {/* Mood display */}
          <div className={`w-full text-center py-2 rounded-xl border-2 text-sm font-bold ${mood.bg} ${mood.border}`}
            style={{ color: mood.color }}>
            {mood.emoji} Feeling {mood.label}
          </div>

          {/* Reaction bubble */}
          <AnimatePresence>
            {reaction && (
              <motion.div initial={{ opacity:0, y:10, scale:0.8 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10 }}
                className="mt-3 px-4 py-2 rounded-2xl text-white text-sm font-bold text-center shadow-lg"
                style={{ background: GRAD }}>
                {reaction}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panels */}
        <div className="md:col-span-2 space-y-4">
          {/* Mood selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">🎭 Set Your Pet's Mood</p>
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map(m => (
                <button key={m.id} onClick={() => { setMood(m); setBounce(true); setTimeout(()=>setBounce(false),800); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all hover:scale-105 ${mood.id===m.id ? `${m.bg} ${m.border}` : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-2xl">{m.emoji}</div>
                  <div className={`text-xs font-bold mt-0.5 ${mood.id===m.id ? '' : 'text-slate-600'}`} style={mood.id===m.id?{color:m.color}:{}}>{m.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100">💡 {mood.tip}</p>
          </div>

          {/* Interaction buttons */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">🎮 Interact with Your Pet</p>
            <div className="grid grid-cols-3 gap-2">
              {REACTIONS.map(r => (
                <button key={r.effect} onClick={() => doReaction(r)}
                  className="flex flex-col items-center gap-1 p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all hover:scale-105 active:scale-95">
                  <span className="text-2xl">{r.icon}</span>
                  <span className="text-xs font-bold text-slate-700">{r.label}</span>
                  <span className="text-[10px] text-indigo-500 font-bold">+{XP_PER_ACTION} XP</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tip */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-2">🤖 AI Companion Tip</p>
            {aiTip ? (
              <p className="text-sm text-slate-600 bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-3">{aiTip}</p>
            ) : (
              <p className="text-sm text-slate-400 bg-slate-50 rounded-xl p-3 mb-3 text-center">Click below for a personalized AI tip based on your pet's mood</p>
            )}
            <button onClick={getTip} disabled={loadingTip}
              className="w-full py-2.5 text-white font-bold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: GRAD }}>
              {loadingTip ? <><RefreshCw className="w-4 h-4 animate-spin"/>Generating...</> : '✨ Get AI Tip'}
            </button>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">📋 Today's Activity Log</p>
        <div className="space-y-2">
          {log.map((l, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl text-sm">
              <span className="text-xs text-slate-400 w-16 flex-shrink-0">{l.time}</span>
              <span className="font-bold text-slate-700">{l.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
