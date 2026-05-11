import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus, Scale, Target, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

const BREED_IDEAL = {
  'Labrador Retriever': { min:25, max:36, unit:'kg' },
  'Siberian Husky':     { min:16, max:27, unit:'kg' },
  'Golden Retriever':   { min:25, max:34, unit:'kg' },
  'Persian Cat':        { min:3,  max:5.5,unit:'kg' },
  'Poodle (Standard)':  { min:18, max:32, unit:'kg' },
  'Beagle':             { min:8,  max:14, unit:'kg' },
};

const HISTORY = [
  { date:'Nov 25', weight:30.2 },
  { date:'Dec 10', weight:30.8 },
  { date:'Dec 25', weight:31.5 },
  { date:'Jan 08', weight:31.2 },
  { date:'Jan 22', weight:31.8 },
  { date:'Feb 05', weight:32.1 },
  { date:'Feb 20', weight:31.9 },
  { date:'Mar 06', weight:32.0 },
  { date:'Mar 20', weight:31.6 },
  { date:'Apr 03', weight:31.2 },
  { date:'Apr 17', weight:30.8 },
  { date:'May 01', weight:30.5 },
];

export default function SmartWeightTab() {
  const [breed, setBreed]       = useState('Labrador Retriever');
  const [current, setCurrent]   = useState(30.5);
  const [logInput, setLogInput] = useState('');
  const [history, setHistory]   = useState(HISTORY);
  const [toast, setToast]       = useState('');

  const ideal = BREED_IDEAL[breed];
  const status = current < ideal.min ? 'underweight' : current > ideal.max ? 'overweight' : 'healthy';
  const statusCfg = {
    healthy:     { label:'Healthy Weight ✅', color:'#10b981', bg:'bg-emerald-50', border:'border-emerald-200', tip:'Your pet is within the ideal weight range. Maintain current diet and exercise.' },
    underweight: { label:'Underweight ⚠️',   color:'#f59e0b', bg:'bg-amber-50',   border:'border-amber-200',   tip:'Your pet may need more calories. Consult your vet for a nutritional plan.' },
    overweight:  { label:'Overweight 🔴',    color:'#ef4444', bg:'bg-rose-50',    border:'border-rose-200',    tip:'Reduce treats and increase exercise. A vet-prescribed diet is recommended.' },
  }[status];

  const bmi = ((current / ((ideal.min + ideal.max) / 2)) * 100).toFixed(0);

  const logWeight = () => {
    const w = parseFloat(logInput);
    if (isNaN(w) || w <= 0) return;
    const today = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'});
    setHistory(p => [...p, { date: today, weight: w }]);
    setCurrent(w);
    setLogInput('');
    setToast(`✅ Weight ${w} kg logged successfully!`);
    setTimeout(()=>setToast(''),3000);
  };

  const chartData = {
    labels: history.map(h => h.date),
    datasets: [{
      label: 'Weight (kg)',
      data:  history.map(h => h.weight),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
    }, {
      label: 'Ideal Max',
      data: history.map(() => ideal.max),
      borderColor: '#10b98150',
      borderDash: [6, 3],
      backgroundColor: 'transparent',
      pointRadius: 0,
    }, {
      label: 'Ideal Min',
      data: history.map(() => ideal.min),
      borderColor: '#ef444450',
      borderDash: [6, 3],
      backgroundColor: 'transparent',
      pointRadius: 0,
    }],
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode:'index', intersect:false } },
    scales: {
      y: { grid: { color:'#f1f5f9' }, ticks: { font:{size:11} } },
      x: { grid: { display:false }, ticks: { font:{size:11} } },
    },
  };

  const last    = history[history.length-1];
  const prev    = history[history.length-2];
  const change  = last && prev ? (last.weight - prev.weight).toFixed(1) : 0;
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? (status==='overweight'?'#ef4444':'#10b981') : change < 0 ? (status==='underweight'?'#ef4444':'#10b981') : '#6366f1';

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
        <div className="absolute -right-6 -top-6 opacity-10 text-[100px]">⚖️</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">⚖️ Weight Management</span>
        <h2 className="text-2xl font-black mt-2">Smart Weight Management</h2>
        <p className="text-indigo-200 text-sm mt-1">Track your pet's weight, compare against breed ideals, and get AI fitness tips.</p>
        <div className="flex gap-6 mt-4">
          {[['Current', `${current} kg`],['Ideal Range', `${ideal.min}–${ideal.max} kg`],['Status', statusCfg.label.split(' ')[0]],['Trend', `${change > 0 ? '+' : ''}${change} kg`]].map(([l,v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Breed selector + status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">🐾 Breed Selection</p>
          <select value={breed} onChange={e => setBreed(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 outline-none mb-4">
            {Object.keys(BREED_IDEAL).map(b => <option key={b}>{b}</option>)}
          </select>
          <div className={`p-4 rounded-xl border-2 ${statusCfg.bg} ${statusCfg.border}`}>
            <p className="font-extrabold text-sm" style={{color:statusCfg.color}}>{statusCfg.label}</p>
            <p className="text-xs text-slate-600 mt-1">{statusCfg.tip}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📊 Weight Stats</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Current Weight',`${current} kg`,'#6366f1'],
              ['Ideal Range',`${ideal.min}–${ideal.max} kg`,'#10b981'],
              ['Trend',`${change>0?'+':''}${change} kg`,'#f59e0b'],
              ['BMI Score',`${bmi}%`,'#14b8a6'],
            ].map(([l,v,c]) => (
              <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs font-bold text-slate-400">{l}</p>
                <p className="font-extrabold text-base mt-0.5" style={{color:c}}>{v}</p>
              </div>
            ))}
          </div>

          {/* Log new weight */}
          <div className="flex gap-2 mt-4">
            <input value={logInput} onChange={e=>setLogInput(e.target.value)} type="number" step="0.1"
              placeholder="Enter weight (kg)"
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              onKeyDown={e=>e.key==='Enter'&&logWeight()}/>
            <button onClick={logWeight}
              className="px-4 py-2 text-white font-bold rounded-xl text-sm"
              style={{background:GRAD}}>
              Log
            </button>
          </div>
        </div>
      </div>

      {/* Weight chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">📈 Weight History Chart</p>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-500 inline-block"/>Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block border-dashed"/>Max Ideal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-400 inline-block"/>Min Ideal</span>
          </div>
        </div>
        <Line data={chartData} options={chartOpts} height={90}/>
      </div>

      {/* Fitness tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">💪 AI Fitness Recommendations</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon:'🚶', title:'Daily Walks',   tip: status==='overweight'?'3 walks/day, 20 min each':'2 walks/day is ideal', color:'#10b981' },
            { icon:'🍗', title:'Diet Plan',      tip: status==='overweight'?'Reduce treats, high-fibre meals':'Maintain balanced diet', color:'#f59e0b' },
            { icon:'🎾', title:'Active Play',    tip: status==='underweight'?'Light play, avoid over-exertion':'15 min play sessions daily', color:'#6366f1' },
          ].map(r => (
            <div key={r.title} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-2xl mb-1">{r.icon}</div>
              <p className="font-extrabold text-slate-800 text-sm">{r.title}</p>
              <p className="text-xs text-slate-500 mt-1">{r.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
