import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Shield, Zap, Heart, Activity, CheckCircle, Clock, Navigation } from 'lucide-react';

// ── Triage levels ─────────────────────────────────────────────────────────────
const TRIAGE = {
  normal:   { label: 'Normal',   color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  urgent:   { label: 'Urgent',   color: '#f59e0b', bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-300' },
  critical: { label: 'Critical', color: '#ef4444', bg: 'bg-rose-100',    text: 'text-rose-700',    border: 'border-rose-300' },
};

const SYMPTOMS = [
  { label: 'Not eating / Vomiting',  triage: 'urgent' },
  { label: 'Seizure / Collapse',     triage: 'critical' },
  { label: 'Difficulty breathing',   triage: 'critical' },
  { label: 'Lethargy / Weakness',    triage: 'urgent' },
  { label: 'Excessive scratching',   triage: 'normal' },
  { label: 'Limping / Pain',         triage: 'urgent' },
  { label: 'Bleeding (severe)',       triage: 'critical' },
  { label: 'Eye / Ear discharge',    triage: 'normal' },
  { label: 'Pale gums / Cold limbs', triage: 'critical' },
  { label: 'Bloating / Swelling',    triage: 'urgent' },
];

const NEARBY_CLINICS = [
  { name: 'VetFirst Emergency Hospital', dist: '0.8 km', open: '24/7',  phone: '+91-9876543210', emergency: true,  eta: '4 min', color: '#ef4444' },
  { name: 'PawCare Animal Clinic',       dist: '1.2 km', open: 'Open',  phone: '+91-9123456789', emergency: false, eta: '7 min', color: '#10b981' },
  { name: 'Animal Wellness Center',      dist: '2.0 km', open: 'Open',  phone: '+91-9988776655', emergency: false, eta: '12 min',color: '#6366f1' },
  { name: 'City Pet Hospital',           dist: '3.1 km', open: 'Open',  phone: '+91-9001122334', emergency: true,  eta: '18 min',color: '#f59e0b' },
];

const VITALS = [
  { label: 'Heart Rate',   value: '112 bpm', status: 'High',   color: '#ef4444', icon: Heart },
  { label: 'Temperature',  value: '39.8°C',  status: 'Elevated',color: '#f59e0b', icon: Activity },
  { label: 'Activity',     value: 'Low',     status: 'Alert',  color: '#f59e0b', icon: Zap },
  { label: 'Oxygen Est.',  value: '94%',     status: 'Normal', color: '#10b981', icon: Shield },
];

export default function EmergencySOSTab() {
  const [selected, setSelected]   = useState([]);
  const [triageResult, setTriage] = useState(null);
  const [sosCalled, setSosCalled] = useState(false);
  const [timer, setTimer]         = useState(0);
  const intervalRef               = useRef(null);

  const toggleSymptom = (s) => {
    setSelected(prev =>
      prev.includes(s.label)
        ? prev.filter(x => x !== s.label)
        : [...prev, s.label]
    );
    setTriage(null);
  };

  const runTriage = () => {
    if (selected.length === 0) return;
    const levels = selected.map(sel => {
      const found = SYMPTOMS.find(s => s.label === sel);
      return found?.triage || 'normal';
    });
    if (levels.includes('critical'))      setTriage('critical');
    else if (levels.includes('urgent'))   setTriage('urgent');
    else                                  setTriage('normal');
  };

  const callSOS = () => {
    setSosCalled(true);
    intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const t = TRIAGE[triageResult] || null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 opacity-10"><AlertTriangle className="w-40 h-40"/></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🚨 Emergency SOS</span>
            {sosCalled && <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full"><span className="w-2 h-2 bg-white rounded-full animate-pulse"/> ACTIVE — {timer}s</span>}
          </div>
          <h2 className="text-2xl font-black">Pet Emergency Center</h2>
          <p className="text-rose-100 text-sm mt-1">AI-powered triage, emergency detection, and instant vet connection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Triage Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-800 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500"/> AI Triage — Select Symptoms
            </h3>
            <p className="text-xs text-slate-400 mb-4">Select all observed symptoms to get an AI triage assessment</p>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOMS.map(s => {
                const isSelected = selected.includes(s.label);
                const tc = TRIAGE[s.triage];
                return (
                  <button key={s.label} onClick={() => toggleSymptom(s)}
                    className={`text-left p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      isSelected ? `${tc.bg} ${tc.text} ${tc.border}` : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300'
                    }`}>
                    <span className="mr-2">{s.triage==='critical'?'🔴':s.triage==='urgent'?'🟡':'🟢'}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={runTriage} disabled={selected.length===0}
                className="flex-1 py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition hover:-translate-y-0.5"
                style={{background:'linear-gradient(135deg,#ef4444,#f59e0b)'}}>
                🧠 Run AI Triage
              </button>
              <button onClick={() => { setSelected([]); setTriage(null); }}
                className="px-5 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">
                Reset
              </button>
            </div>

            <AnimatePresence>
              {triageResult && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className={`mt-4 p-5 rounded-2xl border-2 ${t.bg} ${t.border}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{triageResult==='critical'?'🚨':triageResult==='urgent'?'⚠️':'✅'}</div>
                    <div>
                      <p className={`font-extrabold text-xl ${t.text}`}>{t.label} Case</p>
                      <p className={`text-sm ${t.text} opacity-80`}>
                        {triageResult==='critical' ? 'IMMEDIATE veterinary attention required. Call emergency vet NOW.'
                         : triageResult==='urgent' ? 'Visit a vet within the next 2–4 hours. Monitor closely.'
                         : 'Schedule a routine checkup. Continue monitoring at home.'}
                      </p>
                    </div>
                  </div>
                  {triageResult !== 'normal' && (
                    <button onClick={callSOS}
                      className="mt-2 w-full py-3 text-white font-extrabold rounded-xl animate-pulse"
                      style={{background: triageResult==='critical' ? '#ef4444' : '#f59e0b'}}>
                      📞 Activate Emergency SOS
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Collar Vitals */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500"/> Live Vitals (SmartCollar™)
              <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> Live
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VITALS.map(v => (
                <div key={v.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <v.icon className="w-5 h-5 mx-auto mb-1" style={{color: v.color}}/>
                  <p className="text-lg font-extrabold text-slate-900">{v.value}</p>
                  <p className="text-[10px] text-slate-500">{v.label}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{color: v.color, background: v.color+'18'}}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-rose-500"/>
              <p className="font-extrabold text-slate-800">Live Emergency Map</p>
            </div>
            <iframe title="Emergency Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=80.2,12.9,80.3,13.0&layer=mapnik"
              className="w-full h-48 border-0" allowFullScreen/>
          </div>
        </div>

        {/* Nearby Clinics */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500"/> Nearby Vets
            </h3>
            <div className="space-y-3">
              {NEARBY_CLINICS.map(c => (
                <div key={c.name} className={`p-4 rounded-xl border-2 ${c.emergency ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.dist} • ETA {c.eta}</p>
                    </div>
                    {c.emergency && <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full whitespace-nowrap">24/7 ER</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a href={`tel:${c.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-white text-xs font-bold rounded-lg"
                      style={{background: c.color}}>
                      <Phone className="w-3 h-3"/> Call
                    </a>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition">
                      <Navigation className="w-3 h-3"/> Route
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOS Active */}
          {sosCalled && (
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
              className="bg-rose-600 rounded-2xl p-5 text-white text-center">
              <div className="text-4xl mb-2">🚨</div>
              <p className="font-extrabold text-lg">SOS Activated!</p>
              <p className="text-rose-200 text-xs mt-1">Emergency services notified. VetFirst ER alerted.</p>
              <p className="text-white font-extrabold text-xl mt-3">{Math.floor(timer/60).toString().padStart(2,'0')}:{(timer%60).toString().padStart(2,'0')}</p>
              <button onClick={() => { setSosCalled(false); clearInterval(intervalRef.current); setTimer(0); }}
                className="mt-3 px-6 py-2 bg-white text-rose-600 font-bold rounded-xl text-sm">
                Cancel SOS
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
