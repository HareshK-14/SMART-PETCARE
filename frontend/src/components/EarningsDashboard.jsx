import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, Calendar, FileText, Plus, X } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DEFAULT_EARNINGS = [
  { month:'Oct', amount:18500, consultations:24 },
  { month:'Nov', amount:21000, consultations:28 },
  { month:'Dec', amount:15000, consultations:19 },
  { month:'Jan', amount:24000, consultations:31 },
  { month:'Feb', amount:27500, consultations:35 },
  { month:'Mar', amount:22000, consultations:29 },
];

const DEFAULT_RECORDS = [
  { id:'REC-001', date:'2026-03-15', pet:'Max', owner:'John Doe', diagnosis:'Mild skin allergy', prescription:'Antihistamine 5mg', notes:'Follow-up in 2 weeks' },
  { id:'REC-002', date:'2026-03-10', pet:'Luna', owner:'Ananya Sharma', diagnosis:'Annual checkup – healthy', prescription:'None', notes:'Weight stable' },
];

const EarningsDashboard = () => {
  const [earnings] = useState(DEFAULT_EARNINGS);
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('vetRecords') || 'null') || DEFAULT_RECORDS);
  const [showRx, setShowRx] = useState(false);
  const [rxForm, setRxForm] = useState({ pet:'', owner:'', diagnosis:'', prescription:'', notes:'' });

  const total = earnings.reduce((s,e) => s+e.amount, 0);
  const totalConsult = earnings.reduce((s,e) => s+e.consultations, 0);

  const chartData = {
    labels: earnings.map(e => e.month),
    datasets: [{
      label: 'Earnings (₹)',
      data: earnings.map(e => e.amount),
      backgroundColor: earnings.map((_,i) => i===earnings.length-1 ? '#6366f1' : '#e0e7ff'),
      borderRadius: 10,
      borderSkipped: false,
    }],
  };

  const addRecord = () => {
    if (!rxForm.pet || !rxForm.diagnosis) return;
    const rec = { id:'REC-'+Date.now(), date:new Date().toISOString().split('T')[0], ...rxForm };
    const updated = [rec, ...records];
    setRecords(updated);
    localStorage.setItem('vetRecords', JSON.stringify(updated));
    setRxForm({ pet:'', owner:'', diagnosis:'', prescription:'', notes:'' });
    setShowRx(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2"><IndianRupee className="w-6 h-6 text-emerald-500"/> Earnings & Records</h2>
          <p className="text-slate-500 text-sm">Your monthly revenue and patient records.</p>
        </div>
        <button onClick={() => setShowRx(true)} className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl shadow-lg text-sm" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
          <Plus className="w-4 h-4"/> Add Patient Record
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Total Revenue', `₹${total.toLocaleString()}`, '#10b981', TrendingUp],
          ['Total Consultations', totalConsult, '#6366f1', Calendar],
          ['Avg/Month', `₹${Math.round(total/earnings.length).toLocaleString()}`, '#f59e0b', IndianRupee],
          ['Patient Records', records.length, '#14b8a6', FileText],
        ].map(([l,v,c,Icon]) => (
          <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:c+'18'}}>
              <Icon style={{width:20,height:20,color:c}}/>
            </div>
            <div><p className="text-xl font-extrabold text-slate-900">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">Monthly Earnings</h3>
        <Bar data={chartData} options={{ responsive:true, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false}}, y:{grid:{color:'#f1f5f9'}, ticks:{callback:v=>'₹'+v.toLocaleString()}} } }}/>
      </div>

      {/* Patient Records */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">Patient Records</h3>
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-start justify-between mb-2">
                <div><p className="font-bold text-slate-900">{r.pet} <span className="text-slate-400 font-normal text-sm">/ {r.owner}</span></p>
                  <p className="text-xs text-slate-400">{r.date} • {r.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div><p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-0.5">Diagnosis</p><p className="text-slate-700">{r.diagnosis}</p></div>
                <div><p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-0.5">Prescription</p><p className="text-slate-700">{r.prescription||'None'}</p></div>
                <div><p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-0.5">Notes</p><p className="text-slate-700">{r.notes||'—'}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Record Modal */}
      {showRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowRx(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <h3 className="text-lg font-extrabold text-slate-900">Add Patient Record</h3>
              <button onClick={() => setShowRx(false)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {[['Pet Name *','pet','text'],['Owner Name','owner','text'],['Diagnosis *','diagnosis','text'],['Prescription','prescription','text'],['Notes','notes','text']].map(([l,k,t]) => (
                <div key={k}><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</label>
                  <input type={t} value={rxForm[k]} onChange={e=>setRxForm({...rxForm,[k]:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"/>
                </div>
              ))}
              <button onClick={addRecord} className="w-full py-3 text-white font-bold rounded-xl shadow-lg" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>Save Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDashboard;
