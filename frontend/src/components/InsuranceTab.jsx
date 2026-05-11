import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Clock, ChevronRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Basic Paw',
    price: 299,
    period: '/month',
    color: '#6366f1',
    badge: 'Popular',
    features: ['Annual wellness exam', 'Basic vaccinations', 'Flea & tick treatment', 'Emergency helpline'],
  },
  {
    name: 'Premium Shield',
    price: 799,
    period: '/month',
    color: '#14b8a6',
    badge: 'Best Value',
    features: ['All Basic features', 'Dental cleaning', 'X-rays & lab tests', 'Surgery coverage (up to ₹30,000)', '24/7 vet chat support'],
  },
  {
    name: 'Elite Guard',
    price: 1499,
    period: '/month',
    color: '#f59e0b',
    badge: null,
    features: ['All Premium features', 'Cancer treatment', 'Specialist consultations', 'Unlimited hospitalization', 'Prescription coverage'],
  },
];

const InsuranceTab = () => {
  const [activePlan, setActivePlan] = useState(() => localStorage.getItem('insurancePlan') || null);
  const [claims, setClaims] = useState(() => JSON.parse(localStorage.getItem('insuranceClaims') || '[]'));
  const [showClaim, setShowClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({pet:'',amount:'',reason:''});

  const selectPlan = (name) => {
    setActivePlan(name);
    localStorage.setItem('insurancePlan', name);
  };

  const submitClaim = () => {
    if (!claimForm.pet || !claimForm.amount) return;
    const newClaim = { id:'CLM-'+Date.now(), ...claimForm, status:'PENDING', date: new Date().toLocaleDateString() };
    const updated = [newClaim, ...claims];
    setClaims(updated);
    localStorage.setItem('insuranceClaims', JSON.stringify(updated));
    setClaimForm({pet:'',amount:'',reason:''});
    setShowClaim(false);
  };

  const statusColor = { PENDING:'bg-amber-100 text-amber-700', APPROVED:'bg-green-100 text-green-700', REJECTED:'bg-rose-100 text-rose-700' };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2"><Shield className="w-6 h-6 text-indigo-500"/>Pet Insurance</h2>
        <p className="text-slate-500 text-sm mt-1">Protect your pets with comprehensive health coverage.</p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map(plan => {
          const isActive = activePlan === plan.name;
          return (
            <motion.div key={plan.name} whileHover={{y:-5}}
              className={`relative bg-white rounded-3xl border-2 p-6 flex flex-col shadow-sm transition-all ${isActive ? 'border-indigo-500 shadow-indigo-100' : 'border-slate-100'}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-md"
                  style={{background:`linear-gradient(135deg,${plan.color},#6366f1)`}}>{plan.badge}</span>
              )}
              {isActive && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white"/></div>}
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{plan.name}</h3>
              <div className="mb-4"><span className="text-3xl font-extrabold" style={{color:plan.color}}>₹{plan.price}</span><span className="text-slate-400 text-sm">{plan.period}</span></div>
              <ul className="space-y-2 flex-1 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:plan.color}}/>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => selectPlan(plan.name)} className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${isActive ? 'bg-green-50 text-green-700 border-2 border-green-300' : 'text-white'}`}
                style={isActive ? {} : {background:`linear-gradient(135deg,${plan.color},#6366f1)`}}>
                {isActive ? '✓ Active Plan' : 'Subscribe'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Active Plan Banner */}
      {activePlan && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-extrabold text-indigo-800">Active Plan: {activePlan}</p>
            <p className="text-indigo-600 text-sm">Your pets are protected. Renews automatically each month.</p>
          </div>
          <button onClick={() => setShowClaim(true)} className="px-4 py-2.5 text-white font-bold rounded-xl text-sm" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
            File a Claim
          </button>
        </div>
      )}

      {/* Claims */}
      {claims.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-800 mb-4">My Claims</h3>
          <div className="space-y-3">
            {claims.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{c.id} — {c.pet}</p>
                  <p className="text-slate-500">{c.reason || 'General claim'} • {c.date}</p>
                </div>
                <p className="font-extrabold text-slate-800">₹{Number(c.amount).toLocaleString()}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowClaim(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-extrabold text-slate-900">File Insurance Claim</h3>
              <button onClick={() => setShowClaim(false)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 shadow-sm">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[['Pet Name *','pet','text'],['Claim Amount (₹) *','amount','number'],['Reason','reason','text']].map(([l,k,t]) => (
                <div key={k}><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</label>
                  <input type={t} value={claimForm[k]} onChange={e=>setClaimForm({...claimForm,[k]:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/></div>
              ))}
              <button onClick={submitClaim} className="w-full py-3 text-white font-bold rounded-xl shadow-lg" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Submit Claim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceTab;
