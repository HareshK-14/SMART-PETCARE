import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Zap, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

const MOODS = [
  { id: 'happy',      emoji: '😄', label: 'Happy',      color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Your pet is in a great mood! Active, playful, and social.' },
  { id: 'stressed',   emoji: '😰', label: 'Stressed',   color: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200',   desc: 'Signs of anxiety detected. Consider a calm environment.' },
  { id: 'tired',      emoji: '😴', label: 'Tired',      color: '#6366f1', bg: 'bg-indigo-50',  border: 'border-indigo-200',  desc: 'Low energy levels. Adequate rest and hydration needed.' },
  { id: 'sick',       emoji: '🤒', label: 'Unwell',     color: '#ef4444', bg: 'bg-rose-50',    border: 'border-rose-200',    desc: 'Possible illness detected. Recommend vet consultation.' },
  { id: 'aggressive', emoji: '😤', label: 'Agitated',   color: '#dc2626', bg: 'bg-red-50',     border: 'border-red-200',     desc: 'Territorial or agitated behaviour. Avoid stressors.' },
  { id: 'excited',    emoji: '🤩', label: 'Excited',    color: '#8b5cf6', bg: 'bg-violet-50',  border: 'border-violet-200',  desc: 'High energy and excitement! Great time for exercise.' },
];

const BEHAVIORS = ['Tail wagging', 'Eating normally', 'Playing', 'Sleeping more than usual', 'Growling', 'Hiding', 'Whimpering', 'Pacing', 'Licking paws', 'Not eating'];

const HISTORY = [
  { date: '2026-05-07', mood: 'happy',    score: 88 },
  { date: '2026-05-06', mood: 'excited',  score: 92 },
  { date: '2026-05-05', mood: 'tired',    score: 64 },
  { date: '2026-05-04', mood: 'stressed', score: 51 },
  { date: '2026-05-03', mood: 'happy',    score: 85 },
  { date: '2026-05-02', mood: 'sick',     score: 38 },
  { date: '2026-05-01', mood: 'happy',    score: 79 },
];

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

export default function AIMoodDetectionTab() {
  const [selected, setSelected]     = useState([]);
  const [result, setResult]         = useState(null);
  const [scanning, setScanning]     = useState(false);
  const [activeTab, setActiveTab]   = useState('scan');

  const runScan = () => {
    if (selected.length === 0) return;
    setScanning(true);
    setTimeout(() => {
      const positive = ['Tail wagging','Eating normally','Playing','Excited'];
      const neg      = ['Growling','Hiding','Whimpering','Not eating'];
      const negCount = selected.filter(b => neg.includes(b)).length;
      const posCount = selected.filter(b => positive.includes(b)).length;
      let mood;
      if (negCount >= 2)           mood = MOODS.find(m => m.id === 'sick');
      else if (negCount === 1 && posCount === 0) mood = MOODS.find(m => m.id === 'stressed');
      else if (posCount >= 2)      mood = MOODS.find(m => m.id === 'happy');
      else if (selected.includes('Pacing')) mood = MOODS.find(m => m.id === 'aggressive');
      else                         mood = MOODS.find(m => m.id === 'tired');
      setResult({ ...mood, score: Math.floor(Math.random()*25 + (mood.id==='happy'?75:40)) });
      setScanning(false);
    }, 2000);
  };

  const toggle = (b) => setSelected(p => p.includes(b) ? p.filter(x=>x!==b) : [...p,b]);
  const avgScore = Math.round(HISTORY.reduce((a,h)=>a+h.score,0)/HISTORY.length);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#8b5cf6,#14b8a6)'}}>
        <div className="absolute -right-8 -top-8 opacity-10"><Brain className="w-40 h-40"/></div>
        <div className="relative">
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🧠 AI Mood Analysis</span>
          <h2 className="text-2xl font-black mt-2">Pet Mood Detection</h2>
          <p className="text-violet-200 text-sm mt-1">AI-powered emotional health analysis through behavioral pattern recognition.</p>
          <div className="flex gap-6 mt-4">
            {[['Weekly Avg', `${avgScore}%`], ['Mood Logs', HISTORY.length], ['Status', 'Active']].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-violet-200">{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{k:'scan',label:'🔍 Mood Scan'},{k:'history',label:'📈 History'},{k:'guide',label:'💡 Behaviour Guide'}].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${activeTab===t.k?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-violet-300'}`}
            style={activeTab===t.k?{background:GRAD}:{}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Scan Tab */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-extrabold text-slate-800 mb-1">Select Observed Behaviours</h3>
            <p className="text-xs text-slate-400 mb-4">Tick all behaviours your pet is showing right now</p>
            <div className="space-y-2">
              {BEHAVIORS.map(b => (
                <button key={b} onClick={() => toggle(b)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-semibold text-left transition-all ${selected.includes(b)?'bg-violet-50 border-violet-300 text-violet-800':'bg-slate-50 border-slate-200 text-slate-700 hover:border-violet-200'}`}>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 ${selected.includes(b)?'bg-violet-500 border-violet-500':'border-slate-300'}`}>
                    {selected.includes(b) && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                  {b}
                </button>
              ))}
            </div>
            <button onClick={runScan} disabled={scanning || selected.length===0}
              className="w-full mt-4 py-3 text-white font-bold rounded-xl disabled:opacity-50 transition hover:opacity-90"
              style={{background:GRAD}}>
              {scanning ? '🧠 Analysing...' : '🔍 Run AI Mood Scan'}
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {result && (
                <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                  className={`rounded-2xl border-2 p-6 ${result.bg} ${result.border}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{result.emoji}</div>
                    <div>
                      <p className="text-2xl font-extrabold" style={{color:result.color}}>{result.label}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{result.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600"><span>Mood Score</span><span style={{color:result.color}}>{result.score}%</span></div>
                    <div className="w-full bg-white/60 rounded-full h-3">
                      <motion.div initial={{width:0}} animate={{width:`${result.score}%`}} transition={{duration:1}}
                        className="h-3 rounded-full" style={{background:result.color}}/>
                    </div>
                  </div>
                  <button onClick={() => {setResult(null);setSelected([]);}}
                    className="mt-4 w-full py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition">
                    Run New Scan
                  </button>
                </motion.div>
              )}
              {!result && !scanning && (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                  <div className="text-4xl mb-3">🐾</div>
                  <p className="font-bold">Select behaviours & run scan</p>
                  <p className="text-xs mt-1">AI will analyse the mood pattern</p>
                </div>
              )}
              {scanning && (
                <div className="bg-violet-50 rounded-2xl border border-violet-200 p-8 text-center">
                  <div className="text-4xl mb-3 animate-pulse">🧠</div>
                  <p className="font-extrabold text-violet-800">Analysing behaviour patterns...</p>
                  <p className="text-xs text-violet-400 mt-1">AI processing {selected.length} signals</p>
                </div>
              )}
            </AnimatePresence>

            {/* Mood palette */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="font-extrabold text-slate-800 mb-3 text-sm">🎭 Mood Reference</p>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(m => (
                  <div key={m.id} className={`${m.bg} ${m.border} border rounded-xl p-3 text-center`}>
                    <div className="text-2xl">{m.emoji}</div>
                    <p className="text-xs font-bold mt-1" style={{color:m.color}}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            {[['Best Mood','😄 Happy','#10b981'],['Avg Score',`${avgScore}%`,'#6366f1'],['Total Logs',HISTORY.length,'#14b8a6']].map(([l,v,c]) => (
              <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                <p className="text-xl font-extrabold" style={{color:c}}>{v}</p>
                <p className="text-xs text-slate-500">{l}</p>
              </div>
            ))}
          </div>
          {HISTORY.map((h,i) => {
            const m = MOODS.find(x=>x.id===h.mood);
            return (
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                <div className="text-2xl">{m?.emoji}</div>
                <div className="flex-1">
                  <p className="font-extrabold text-slate-800 text-sm">{m?.label}</p>
                  <p className="text-xs text-slate-400">{h.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold" style={{color:m?.color}}>{h.score}%</p>
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full" style={{width:`${h.score}%`,background:m?.color}}/>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOODS.map(m => (
            <div key={m.id} className={`${m.bg} ${m.border} border-2 rounded-2xl p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{m.emoji}</div>
                <p className="font-extrabold text-lg" style={{color:m.color}}>{m.label}</p>
              </div>
              <p className="text-sm text-slate-600">{m.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
