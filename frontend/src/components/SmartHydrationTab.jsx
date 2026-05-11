import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const GRAD = 'linear-gradient(135deg,#14b8a6,#3b82f6)';

const BREED_TARGET = {
  'Labrador Retriever': 2400,
  'Siberian Husky':     1800,
  'Golden Retriever':   2000,
  'Persian Cat':        200,
  'Poodle (Standard)': 1700,
  'Beagle':             900,
};

const LOG_TIMES = ['6:30 AM','8:00 AM','10:30 AM','12:00 PM','2:00 PM','4:30 PM','7:00 PM'];

const TIPS = [
  'Fresh water should be available 24/7 — refill & clean the bowl every morning.',
  'Add a water fountain — pets are more attracted to flowing water.',
  'Wet food can contribute up to 70% of daily hydration needs.',
  'Watch for signs of dehydration: dry gums, lethargy, sunken eyes.',
  'In summer, increase daily target by 15–20% to compensate for panting.',
  'Exercise increases hydration needs — offer water every 20 minutes of activity.',
];

export default function SmartHydrationTab() {
  const [breed, setBreed]     = useState('Labrador Retriever');
  const [petName]             = useState('Bruno');
  const [logs, setLogs]       = useState([
    { time:'6:30 AM', ml:150 },
    { time:'8:00 AM', ml:200 },
    { time:'10:30 AM',ml:100 },
    { time:'12:00 PM',ml:250 },
  ]);
  const [input, setInput]     = useState('');
  const [time, setTime]       = useState(LOG_TIMES[4]);
  const [toast, setToast]     = useState('');
  const [tipIdx]              = useState(Math.floor(Math.random()*TIPS.length));

  const target  = BREED_TARGET[breed] || 1500;
  const current = logs.reduce((s,l) => s+l.ml, 0);
  const pct     = Math.min(Math.round((current/target)*100), 100);
  const status  = pct >= 100 ? 'great' : pct >= 70 ? 'good' : pct >= 40 ? 'low' : 'critical';
  const statusCfg = {
    great:    { label:'Optimal Hydration ✅', color:'#10b981', bg:'bg-emerald-50', border:'border-emerald-200' },
    good:     { label:'On Track 👍',          color:'#6366f1', bg:'bg-indigo-50',  border:'border-indigo-200'  },
    low:      { label:'Needs More Water ⚠️',  color:'#f59e0b', bg:'bg-amber-50',   border:'border-amber-200'   },
    critical: { label:'Dehydration Risk 🚨',  color:'#ef4444', bg:'bg-rose-50',    border:'border-rose-200'    },
  }[status];

  const logWater = () => {
    const ml = parseInt(input);
    if (isNaN(ml) || ml <= 0) return;
    setLogs(p => [...p, { time, ml }]);
    setInput('');
    setToast(`✅ +${ml}ml logged at ${time}!`);
    setTimeout(()=>setToast(''),3000);
  };

  const reset = () => { setLogs([]); setToast('🔄 Log reset for a new day!'); setTimeout(()=>setToast(''),2500); };

  const chartData = {
    labels: logs.map(l => l.time),
    datasets: [{
      label: 'Water (ml)',
      data: logs.reduce((acc, l) => [...acc, (acc[acc.length-1]||0) + l.ml], []),
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20,184,166,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#14b8a6',
    }, {
      label: 'Daily Target',
      data: logs.map(()=>target),
      borderColor: '#3b82f650',
      borderDash: [6,3],
      backgroundColor: 'transparent',
      pointRadius: 0,
    }],
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend:{ display:false } },
    scales: { y:{ min:0, max:target+200, grid:{color:'#f1f5f9'}, ticks:{font:{size:10}} }, x:{ grid:{display:false}, ticks:{font:{size:10}} } },
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl"
            style={{background:'linear-gradient(135deg,#14b8a6,#3b82f6)'}}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[120px]">💧</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">💧 Hydration Tracker</span>
        <h2 className="text-2xl font-black mt-2">Smart Water Intake Tracker</h2>
        <p className="text-teal-100 text-sm mt-1">Monitor {petName}'s hydration levels and ensure optimal daily water intake.</p>
        <div className="flex gap-6 mt-4">
          {[['Today',`${current}ml`],['Target',`${target}ml`],['Progress',`${pct}%`],['Status',statusCfg.label.split(' ')[0]]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Progress ring + logger */}
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">💧 Hydration Progress</p>
            <select value={breed} onChange={e=>setBreed(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none mb-4">
              {Object.keys(BREED_TARGET).map(b=><option key={b}>{b}</option>)}
            </select>

            {/* Big progress bar */}
            <div className="relative mb-3">
              <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                <motion.div className="h-6 rounded-full flex items-center justify-end pr-2" style={{background:GRAD}}
                  initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1}}>
                  {pct>15 && <span className="text-white text-xs font-extrabold">{pct}%</span>}
                </motion.div>
              </div>
              {pct<=15 && <span className="absolute right-2 top-0.5 text-xs font-extrabold text-slate-400">{pct}%</span>}
            </div>
            <p className="text-sm font-bold text-center" style={{color:statusCfg.color}}>{current}ml / {target}ml · {statusCfg.label}</p>
            <div className={`mt-3 p-3 rounded-xl border ${statusCfg.bg} ${statusCfg.border}`}>
              <p className="text-xs font-bold" style={{color:statusCfg.color}}>
                {pct>=100 ? '🎉 Daily target reached! Great job keeping Bruno hydrated.' : `💡 ${target-current}ml more needed to reach today's goal.`}
              </p>
            </div>
          </div>

          {/* Log water */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">➕ Log Water Intake</p>
            <div className="flex gap-2 mb-3">
              <input type="number" value={input} onChange={e=>setInput(e.target.value)} placeholder="Amount (ml)"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none"
                onKeyDown={e=>e.key==='Enter'&&logWater()}/>
              <select value={time} onChange={e=>setTime(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none">
                {LOG_TIMES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Quick add buttons */}
            <div className="flex gap-2 flex-wrap mb-3">
              {[50,100,150,200,250].map(ml=>(
                <button key={ml} onClick={()=>{setInput(String(ml));}}
                  className="px-3 py-1.5 text-xs font-bold bg-teal-50 border border-teal-200 text-teal-700 rounded-xl hover:bg-teal-100 transition">
                  +{ml}ml
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={logWater} className="flex-1 py-2.5 text-white font-bold rounded-xl text-sm" style={{background:GRAD}}>
                💧 Log Water
              </button>
              <button onClick={reset} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-bold transition">
                <RefreshCw className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>

        {/* Chart + log */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">📈 Intake Timeline</p>
            {logs.length > 1 ? (
              <Line data={chartData} options={chartOpts} height={120}/>
            ) : (
              <div className="h-28 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">Log 2+ entries to see chart</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">📋 Today's Log</p>
            {logs.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {[...logs].reverse().map((l,i)=>(
                  <div key={i} className="flex items-center gap-3 p-2 bg-teal-50 rounded-xl border border-teal-100">
                    <Droplets className="w-4 h-4 text-teal-500 flex-shrink-0"/>
                    <span className="text-xs font-bold text-teal-700">{l.ml}ml</span>
                    <span className="text-xs text-slate-400">{l.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">No logs yet today. Start tracking!</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Tip */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">🤖 Hydration Tip of the Day</p>
        <p className="text-sm text-slate-600 bg-teal-50 border border-teal-200 rounded-xl p-4 leading-relaxed">💡 {TIPS[tipIdx]}</p>
      </div>
    </div>
  );
}
