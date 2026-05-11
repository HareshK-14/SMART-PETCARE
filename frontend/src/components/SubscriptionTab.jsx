import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, Zap, RefreshCw, Truck, Bell, Star } from 'lucide-react';

const PLANS = [
  {
    id: 'basic', name: 'Basic Care', price: 299, period: 'month', badge: null,
    color: '#6366f1', features: [
      '✅ Monthly premium pet food delivery',
      '✅ Basic health supplement',
      '✅ Vaccination reminders',
      '❌ Grooming service',
      '❌ Emergency vet priority',
    ],
  },
  {
    id: 'pro', name: 'Pro Health', price: 599, period: 'month', badge: '⭐ Most Popular',
    color: '#14b8a6', features: [
      '✅ Monthly premium pet food delivery',
      '✅ Advanced health supplements',
      '✅ Vaccination + Medicine refill',
      '✅ Monthly grooming session',
      '❌ Emergency vet priority',
    ],
  },
  {
    id: 'elite', name: 'Elite VetCare', price: 999, period: 'month', badge: '👑 Best Value',
    color: '#f59e0b', features: [
      '✅ Premium pet food + treats delivery',
      '✅ Full supplement pack',
      '✅ Vaccination + Medicine refill',
      '✅ 2x Monthly grooming sessions',
      '✅ 24/7 Emergency vet priority access',
    ],
  },
];

const ACTIVE_SUB = {
  plan: 'Pro Health', nextDelivery: '2026-05-15', renewsOn: '2026-06-01',
  status: 'active', ordersLeft: 2,
};

export default function SubscriptionTab() {
  const [selected, setSelected] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  const subscribe = (plan) => {
    setSelected(plan);
    setTimeout(() => setSubscribed(true), 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 opacity-10"><Package className="w-40 h-40"/></div>
        <div className="relative">
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📦 Smart Subscriptions</span>
          <h2 className="text-2xl font-black mt-2">Automate Your Pet's Care</h2>
          <p className="text-violet-200 text-sm mt-1">Monthly food, medicine refills, grooming & emergency priority — all in one plan.</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2">
        {['plans','my-subscription','deliveries'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition capitalize ${activeTab===t ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={activeTab===t ? {background:'linear-gradient(135deg,#6366f1,#14b8a6)'} : {}}>
            {t==='plans'?'📋 Plans':t==='my-subscription'?'⚡ My Subscription':'🚚 Deliveries'}
          </button>
        ))}
      </div>

      {/* Plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <motion.div key={plan.id} whileHover={{y:-4}}
              className="bg-white rounded-2xl border-2 shadow-sm p-6 flex flex-col gap-4 relative transition-all"
              style={{borderColor: selected?.id===plan.id ? plan.color : '#e2e8f0'}}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full text-white" style={{background: plan.color}}>{plan.badge}</span>
                </div>
              )}
              <div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background: plan.color+'20'}}>
                  <Star className="w-5 h-5" style={{color: plan.color}}/>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black" style={{color: plan.color}}>₹{plan.price}</span>
                  <span className="text-slate-400 text-sm">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-1.5 flex-1">
                {plan.features.map((f,i) => (
                  <li key={i} className="text-sm text-slate-600">{f}</li>
                ))}
              </ul>
              <button onClick={() => subscribe(plan)} disabled={subscribed && selected?.id===plan.id}
                className="w-full py-3 text-white font-bold rounded-xl transition hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                style={{background: plan.color}}>
                {subscribed && selected?.id===plan.id ? <><CheckCircle className="w-4 h-4"/> Subscribed!</> : 'Subscribe Now'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* My Subscription */}
      {activeTab === 'my-subscription' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Current Plan</p>
                <h3 className="text-xl font-extrabold text-slate-900">{ACTIVE_SUB.plan}</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full">● Active</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                ['Next Delivery', ACTIVE_SUB.nextDelivery, Truck],
                ['Renews On',    ACTIVE_SUB.renewsOn,     RefreshCw],
                ['Orders Left',  ACTIVE_SUB.ordersLeft,   Package],
              ].map(([l,v,Icon]) => (
                <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1 text-indigo-400"/>
                  <p className="font-extrabold text-slate-800 text-sm">{v}</p>
                  <p className="text-[10px] text-slate-400">{l}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-sm">Pause Subscription</button>
              <button className="flex-1 py-2.5 text-white font-bold rounded-xl text-sm" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Upgrade Plan</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-indigo-500"/> Upcoming Deliveries</p>
            {['Premium Dog Food (3kg)', 'Joint Care Supplement', 'Flea & Tick Shampoo'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xs font-bold">{i+1}</div>
                <p className="text-sm font-bold text-slate-700 flex-1">{item}</p>
                <span className="text-[10px] text-slate-400">2026-05-15</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliveries History */}
      {activeTab === 'deliveries' && (
        <div className="space-y-3">
          {[
            { id:'DEL-081', item:'Premium Food + Supplements', date:'2026-04-01', status:'Delivered' },
            { id:'DEL-072', item:'Grooming Kit + Flea Treatment', date:'2026-03-01', status:'Delivered' },
            { id:'DEL-063', item:'Premium Food + Joint Care', date:'2026-02-01', status:'Delivered' },
          ].map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-emerald-600"/>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{d.item}</p>
                <p className="text-xs text-slate-400">{d.id} · {d.date}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-full">{d.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
