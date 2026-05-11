import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, RefreshCw, Sparkles, CheckCircle, Clock, Apple, Moon } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#10b981,#6366f1,#14b8a6)';

const ROUTINE_TEMPLATES = {
  Puppy: {
    morning: [
      { time:'6:30 AM', activity:'🌅 Wake-up gentle stretch & potty break',   duration:'10 min', done:false },
      { time:'7:00 AM', activity:'🍗 Breakfast — puppy formula kibble',        duration:'15 min', done:false },
      { time:'8:00 AM', activity:'🐾 Short morning walk (bladder training)',    duration:'15 min', done:false },
      { time:'9:00 AM', activity:'🎓 Training session — basic commands',       duration:'10 min', done:false },
    ],
    afternoon: [
      { time:'12:00 PM', activity:'🍗 Lunch — half portion',                   duration:'10 min', done:false },
      { time:'1:00 PM',  activity:'😴 Mandatory nap time',                     duration:'90 min', done:false },
      { time:'3:00 PM',  activity:'🎾 Interactive play & socialization',        duration:'20 min', done:false },
    ],
    evening: [
      { time:'6:00 PM', activity:'🍗 Dinner — puppy formula kibble',           duration:'15 min', done:false },
      { time:'7:00 PM', activity:'🚶 Evening walk & potty',                    duration:'20 min', done:false },
      { time:'8:30 PM', activity:'🤗 Cuddle & wind-down time',                 duration:'30 min', done:false },
      { time:'9:30 PM', activity:'🌙 Bedtime — crate or bed',                  duration:'-',      done:false },
    ],
  },
  Adult: {
    morning: [
      { time:'6:00 AM', activity:'☀️ Wake-up & morning potty',                 duration:'10 min', done:false },
      { time:'6:30 AM', activity:'🏃 Energetic morning run or walk',            duration:'30 min', done:false },
      { time:'7:30 AM', activity:'🍗 Breakfast — adult formula',                duration:'15 min', done:false },
      { time:'8:00 AM', activity:'🎓 Advanced training drill',                  duration:'15 min', done:false },
    ],
    afternoon: [
      { time:'12:30 PM', activity:'💧 Hydration check & water refill',         duration:'5 min',  done:false },
      { time:'2:00 PM',  activity:'😴 Afternoon nap',                           duration:'60 min', done:false },
      { time:'4:00 PM',  activity:'🎾 Fetch / agility or play',                duration:'30 min', done:false },
    ],
    evening: [
      { time:'6:00 PM', activity:'🍗 Dinner — measured portion',               duration:'15 min', done:false },
      { time:'7:00 PM', activity:'🚶 Evening walk & socialization',             duration:'30 min', done:false },
      { time:'9:00 PM', activity:'🛁 Grooming check & brushing',               duration:'15 min', done:false },
      { time:'10:00 PM', activity:'🌙 Bedtime',                                duration:'-',      done:false },
    ],
  },
  Senior: {
    morning: [
      { time:'7:00 AM', activity:'🌅 Gentle wake-up & slow stretch',           duration:'10 min', done:false },
      { time:'7:30 AM', activity:'🍗 Breakfast — senior formula (low fat)',    duration:'20 min', done:false },
      { time:'8:30 AM', activity:'🦮 Slow leisure walk — joint-friendly',      duration:'20 min', done:false },
    ],
    afternoon: [
      { time:'1:00 PM', activity:'🍗 Light lunch — half portion',              duration:'10 min', done:false },
      { time:'2:00 PM', activity:'😴 Extended rest period',                    duration:'120 min',done:false },
      { time:'4:30 PM', activity:'🎾 Gentle indoor play',                      duration:'15 min', done:false },
    ],
    evening: [
      { time:'6:00 PM', activity:'🍗 Dinner — measured & warm',               duration:'20 min', done:false },
      { time:'7:00 PM', activity:'🚶 Short stroll — bladder health',           duration:'15 min', done:false },
      { time:'8:00 PM', activity:'💊 Evening supplements & joint care',        duration:'5 min',  done:false },
      { time:'8:30 PM', activity:'🌙 Early bedtime — senior sleep priority',   duration:'-',      done:false },
    ],
  },
};

const AI_TIPS = [
  'Consistency in routine reduces anxiety by up to 60% in pets — same time every day is key!',
  'Post-meal play raises risk of bloat. Always wait 30+ minutes before exercise.',
  'Senior pets need 20% more rest and 30% gentler activities than adults.',
  'Mental stimulation (training, puzzles) is as important as physical exercise for cognitive health.',
  'Morning routines set the tone — a calm start creates a calm day.',
];

export default function WellnessCoachTab() {
  const [lifeStage, setLifeStage]   = useState('Adult');
  const [routine, setRoutine]       = useState(() => JSON.parse(JSON.stringify(ROUTINE_TEMPLATES['Adult'])));
  const [loading, setLoading]       = useState(false);
  const [aiInsight, setAiInsight]   = useState('');
  const [toast, setToast]           = useState('');

  const allTasks    = [...routine.morning, ...routine.afternoon, ...routine.evening];
  const doneTasks   = allTasks.filter(t=>t.done);
  const pct         = Math.round((doneTasks.length/allTasks.length)*100);

  const changeStage = (stage) => {
    setLifeStage(stage);
    setRoutine(JSON.parse(JSON.stringify(ROUTINE_TEMPLATES[stage])));
    setAiInsight('');
  };

  const toggle = (section, idx) => {
    setRoutine(r => ({
      ...r,
      [section]: r[section].map((t,i) => i===idx ? {...t, done:!t.done} : t),
    }));
  };

  const generateInsight = () => {
    setLoading(true);
    setTimeout(() => {
      const tip = AI_TIPS[Math.floor(Math.random()*AI_TIPS.length)];
      setAiInsight(`[${lifeStage} Pet] ${tip}`);
      setLoading(false);
    }, 1500);
  };

  const SECTION_CFG = {
    morning:   { label:'🌅 Morning',   bg:'bg-amber-50',   border:'border-amber-200',   badge:'text-amber-700 bg-amber-100'  },
    afternoon: { label:'☀️ Afternoon', bg:'bg-indigo-50',  border:'border-indigo-200',  badge:'text-indigo-700 bg-indigo-100' },
    evening:   { label:'🌙 Evening',   bg:'bg-violet-50',  border:'border-violet-200',  badge:'text-violet-700 bg-violet-100' },
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl"
            style={{background:GRAD}}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[120px]">🌿</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🌿 Wellness Coach</span>
        <h2 className="text-2xl font-black mt-2">AI Smart Wellness Coach</h2>
        <p className="text-green-100 text-sm mt-1">Personalized daily wellness routines and lifestyle plans powered by AI.</p>
        <div className="flex gap-6 mt-4">
          {[['Life Stage',lifeStage],['Tasks Done',`${doneTasks.length}/${allTasks.length}`],['Progress',`${pct}%`],['Streak','7 days 🔥']].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-green-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Life stage + progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">🐾 Pet Life Stage</p>
          <div className="flex gap-2 mb-4">
            {['Puppy','Adult','Senior'].map(s => (
              <button key={s} onClick={()=>changeStage(s)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${lifeStage===s?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'}`}
                style={lifeStage===s?{background:GRAD}:{}}>
                {s==='Puppy'?'🐶':s==='Adult'?'🦮':'🐕‍🦺'} {s}
              </button>
            ))}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-1">
            <motion.div className="h-3 rounded-full" style={{background:GRAD}} initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8}}/>
          </div>
          <p className="text-xs text-slate-500 text-right font-bold">{pct}% of today's plan complete</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">🤖 AI Wellness Insight</p>
          {aiInsight ? (
            <p className="text-sm text-slate-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3 leading-relaxed">{aiInsight}</p>
          ) : (
            <p className="text-sm text-slate-400 bg-slate-50 rounded-xl p-3 mb-3 text-center">Generate a personalised AI wellness tip for your pet's life stage</p>
          )}
          <button onClick={generateInsight} disabled={loading}
            className="w-full py-2.5 text-white font-bold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            style={{background:GRAD}}>
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/>Analysing...</> : '✨ Generate AI Insight'}
          </button>
        </div>
      </div>

      {/* Routine sections */}
      {Object.entries(routine).map(([section, tasks]) => {
        const cfg = SECTION_CFG[section];
        const done = tasks.filter(t=>t.done).length;
        return (
          <div key={section} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden`}>
            <div className={`px-5 py-3 flex items-center gap-3 border-b ${cfg.bg} ${cfg.border}`}>
              <p className="font-extrabold text-slate-800">{cfg.label}</p>
              <span className={`ml-auto text-xs font-bold px-3 py-0.5 rounded-full ${cfg.badge}`}>{done}/{tasks.length} done</span>
            </div>
            <div className="divide-y divide-slate-50">
              {tasks.map((t, idx) => (
                <div key={idx} className={`flex items-center gap-4 px-5 py-3 transition-all ${t.done?'bg-slate-50 opacity-70':''}`}>
                  <button onClick={()=>toggle(section,idx)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${t.done?'bg-emerald-500 border-emerald-500':'border-slate-200 hover:border-emerald-400'}`}>
                    {t.done && <CheckCircle className="w-4 h-4 text-white"/>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${t.done?'line-through text-slate-400':'text-slate-800'}`}>{t.activity}</p>
                    <p className="text-xs text-slate-400">{t.time} · {t.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
