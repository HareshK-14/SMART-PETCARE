import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Trash2, ShieldCheck, Stethoscope, ChevronRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const DEFAULT_LOGS = {
  Luna: [
    { date:'2026-01-10', weight:27.2, temp:38.3, heartRate:72 },
    { date:'2026-01-24', weight:27.5, temp:38.5, heartRate:74 },
    { date:'2026-02-07', weight:27.8, temp:38.4, heartRate:71 },
    { date:'2026-02-21', weight:28.0, temp:38.6, heartRate:73 },
    { date:'2026-03-07', weight:28.2, temp:38.4, heartRate:72 },
  ],
  Milo: [
    { date:'2026-01-10', weight:4.2, temp:38.1, heartRate:118 },
    { date:'2026-01-24', weight:4.3, temp:38.3, heartRate:120 },
    { date:'2026-02-07', weight:4.4, temp:38.2, heartRate:119 },
    { date:'2026-02-21', weight:4.5, temp:38.4, heartRate:122 },
    { date:'2026-03-07', weight:4.5, temp:38.3, heartRate:121 },
  ],
};

const METRICS = ['weight', 'temp', 'heartRate'];
const METRIC_LABELS = { weight:'Weight (kg)', temp:'Temperature (°C)', heartRate:'Heart Rate (bpm)' };
const METRIC_COLORS = { weight:'#6366f1', temp:'#ef4444', heartRate:'#14b8a6' };

const HealthTrackerTab = () => {
  const pets = JSON.parse(localStorage.getItem('ownerPets') || 'null') || [{name:'Luna'},{name:'Milo'}];
  const [selPet, setSelPet] = useState(pets[0]?.name || 'Luna');
  const [selMetric, setSelMetric] = useState('weight');
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('healthLogs') || 'null') || DEFAULT_LOGS);
  const [form, setForm] = useState({ date:'', weight:'', temp:'', heartRate:'' });
  const [showForm, setShowForm] = useState(false);

  const petLogs = logs[selPet] || [];
  const color = METRIC_COLORS[selMetric];

  const chartData = {
    labels: petLogs.map(l => l.date),
    datasets: [{
      label: METRIC_LABELS[selMetric],
      data: petLogs.map(l => l[selMetric]),
      borderColor: color,
      backgroundColor: color + '18',
      borderWidth: 2.5,
      pointBackgroundColor: color,
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }],
  };

  const addLog = () => {
    if (!form.date || !form.weight) return;
    const entry = { date:form.date, weight:parseFloat(form.weight)||0, temp:parseFloat(form.temp)||0, heartRate:parseInt(form.heartRate)||0 };
    const updated = { ...logs, [selPet]: [...(logs[selPet]||[]), entry].sort((a,b)=>a.date.localeCompare(b.date)) };
    setLogs(updated); localStorage.setItem('healthLogs', JSON.stringify(updated));
    setForm({ date:'', weight:'', temp:'', heartRate:'' }); setShowForm(false);
  };

  const latest = petLogs[petLogs.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-indigo-500"/> Health Tracker</h2>
          <p className="text-slate-500 text-sm">Monitor weight, temperature and heart rate trends.</p>
        </div>
        <button onClick={() => setShowForm(s=>!s)} className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
          <Plus className="w-4 h-4"/> Log Reading
        </button>
      </div>

      {/* Pet & Metric Selectors */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          {pets.map(p => (
            <button key={p.name} onClick={() => setSelPet(p.name)}
              className={`px-4 py-2 text-sm font-bold transition ${selPet===p.name ? 'text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              style={selPet===p.name ? {background:'linear-gradient(135deg,#6366f1,#14b8a6)'} : {}}>
              {p.name}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          {METRICS.map(m => (
            <button key={m} onClick={() => setSelMetric(m)}
              className={`px-4 py-2 text-sm font-bold transition ${selMetric===m ? 'text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              style={selMetric===m ? {background:METRIC_COLORS[m]} : {}}>
              {METRIC_LABELS[m].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Latest Stats */}
      {latest && (
        <div className="grid grid-cols-3 gap-4">
          {[['Weight', latest.weight+'kg', '#6366f1'], ['Temp', latest.temp+'°C', '#ef4444'], ['Heart Rate', latest.heartRate+' bpm', '#14b8a6']].map(([l,v,c]) => (
            <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wide">{l}</p>
              <p className="text-2xl font-extrabold" style={{color:c}}>{v}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">{selPet}'s {METRIC_LABELS[selMetric]} Trend</h3>
        {petLogs.length < 2 ? (
          <div className="text-center py-12 text-slate-400 text-sm">Log at least 2 readings to see a chart.</div>
        ) : (
          <Line data={chartData} options={{ responsive:true, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false}}, y:{grid:{color:'#f1f5f9'}} } }}/>
        )}
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-slate-800">Add Reading for {selPet}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[['Date','date','date'],['Weight (kg)','weight','number'],['Temp (°C)','temp','number'],['Heart Rate (bpm)','heartRate','number']].map(([l,k,t]) => (
              <div key={k}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={addLog} className="flex-1 py-2.5 text-white font-bold rounded-xl" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Save Reading</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">Cancel</button>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">History Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Weight</th><th className="pb-3 pr-4">Temp</th><th className="pb-3">Heart Rate</th>
            </tr></thead>
            <tbody>
              {[...petLogs].reverse().map((l,i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-4 text-slate-500">{l.date}</td>
                  <td className="py-2.5 pr-4 font-semibold text-indigo-600">{l.weight} kg</td>
                  <td className="py-2.5 pr-4 font-semibold text-rose-500">{l.temp}°C</td>
                  <td className="py-2.5 font-semibold text-teal-600">{l.heartRate} bpm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Notes from Vets */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-500"/> Clinical Notes from Vets
        </h3>
        <div className="space-y-4">
          {(JSON.parse(localStorage.getItem('medicalRecords') || '[]'))
            .filter(r => r.appt?.petName === selPet || r.appt?.pet === selPet)
            .map((r, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-teal-200 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-extrabold text-slate-900 text-base">{r.vet}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{r.date}</p>
                  </div>
                  <span className="bg-teal-100 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified Care</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/60 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Clinical Observation</p>
                    <p className="text-sm text-slate-700 leading-relaxed italic">"{r.note}"</p>
                  </div>
                  {r.advice && (
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Follow-up Advice</p>
                      <p className="text-sm text-indigo-700 font-medium">{r.advice}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          {(JSON.parse(localStorage.getItem('medicalRecords') || '[]')).filter(r => r.appt?.petName === selPet || r.appt?.pet === selPet).length === 0 && (
            <div className="text-center py-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
              <p className="text-slate-400 text-sm font-medium">No clinical notes recorded for {selPet} yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerTab;
