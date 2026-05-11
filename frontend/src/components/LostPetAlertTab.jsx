import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Phone, Upload, CheckCircle, Bell, Radio, Search } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#ef4444,#f59e0b)';

const DEMO_ALERTS = [
  { id:1,  pet:'Max',     breed:'Labrador', area:'Anna Nagar, Chennai',   time:'2 hours ago', contact:'+91-9876543210', reward:'₹5,000', status:'lost',  img:'🐕' },
  { id:2,  pet:'Kitty',  breed:'Persian Cat', area:'T.Nagar, Chennai',   time:'1 day ago',   contact:'+91-9123456789', reward:'₹2,000', status:'found', img:'🐱' },
  { id:3,  pet:'Bruno',  breed:'Rottweiler', area:'Velachery, Chennai',   time:'3 hours ago', contact:'+91-9001234567', reward:'₹3,000', status:'lost',  img:'🐕' },
];

export default function LostPetAlertTab() {
  const [tab, setTab]         = useState('alerts');
  const [alerts, setAlerts]   = useState(DEMO_ALERTS);
  const [form, setForm]       = useState({ pet:'', breed:'', area:'', contact:'', reward:'', notes:'', status:'lost' });
  const [posting, setPosting] = useState(false);
  const [toast, setToast]     = useState('');

  const post = () => {
    if (!form.pet || !form.area) return;
    setPosting(true);
    setTimeout(() => {
      setAlerts(p => [{
        id: Date.now(), pet: form.pet, breed: form.breed, area: form.area,
        time: 'Just now', contact: form.contact, reward: form.reward || 'No reward',
        status: form.status, img: '🐾',
      }, ...p]);
      setForm({ pet:'', breed:'', area:'', contact:'', reward:'', notes:'', status:'lost' });
      setToast('🚨 Alert broadcast to nearby users!');
      setTimeout(() => setToast(''), 4000);
      setPosting(false);
      setTab('alerts');
    }, 1500);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold shadow-2xl text-sm flex items-center gap-2"
            style={{background:'linear-gradient(135deg,#10b981,#14b8a6)'}}>
            <CheckCircle className="w-4 h-4"/> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-8 -top-8 opacity-10"><AlertTriangle className="w-40 h-40"/></div>
        <div className="relative">
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🚨 Lost Pet Radar</span>
          <h2 className="text-2xl font-black mt-2">Lost Pet Alert System</h2>
          <p className="text-orange-200 text-sm mt-1">Broadcast lost pet alerts to the entire community with location and contact details.</p>
          <div className="flex gap-6 mt-4">
            {[['Active Alerts',alerts.filter(a=>a.status==='lost').length],['Found',alerts.filter(a=>a.status==='found').length],['Coverage','5 km']].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-orange-200">{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{k:'alerts',label:'🚨 Active Alerts'},{k:'post',label:'📢 Post Alert'},{k:'map',label:'🗺️ Alert Map'}].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${tab===t.k?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-rose-300'}`}
            style={tab===t.k?{background:GRAD}:{}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      {tab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((a, i) => (
            <motion.div key={a.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${a.status==='lost'?'border-rose-200':'border-emerald-200'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${a.status==='lost'?'bg-rose-50':'bg-emerald-50'}`}>
                  {a.img}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-extrabold text-slate-900">{a.pet}</p>
                    <span className="text-xs font-bold text-slate-500">{a.breed}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status==='lost'?'bg-rose-100 text-rose-700 animate-pulse':'bg-emerald-100 text-emerald-700'}`}>
                      {a.status === 'lost' ? '🔴 LOST' : '✅ FOUND'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {a.area}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time} · Reward: {a.reward}</p>
                </div>
              </div>
              {a.status === 'lost' && (
                <div className="flex gap-2 mt-4">
                  <a href={`tel:${a.contact}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-white text-xs font-bold rounded-xl"
                    style={{background: GRAD}}>
                    <Phone className="w-3 h-3"/> Call Owner
                  </a>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition">
                    <CheckCircle className="w-3 h-3"/> I Found This Pet
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition">
                    <Radio className="w-3 h-3"/> Share Alert
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Alert */}
      {tab === 'post' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-800 mb-5">📢 Broadcast a Lost/Found Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['Pet Name','pet','text'],['Breed','breed','text'],['Last Seen Area','area','text'],['Contact Number','contact','tel'],['Reward Amount','reward','text']].map(([l,k,t]) => (
              <div key={k}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 outline-none"/>
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alert Type</label>
              <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}
                className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
                <option value="lost">Lost Pet</option>
                <option value="found">Found Pet</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Additional Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} rows={3}
              placeholder="Describe distinctive features, collar color, last seen details..."
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 outline-none resize-none"/>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
              <Upload className="w-4 h-4"/> Add Photo
            </button>
            <button onClick={post} disabled={posting || !form.pet || !form.area}
              className="flex-1 py-2.5 text-white font-bold rounded-xl disabled:opacity-50 transition hover:opacity-90"
              style={{background: GRAD}}>
              {posting ? '📡 Broadcasting...' : '🚨 Broadcast Alert Now'}
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      {tab === 'map' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="font-extrabold text-slate-800">🗺️ Lost Pet Alert Map</p>
            <p className="text-xs text-slate-400">Showing all active alerts within 5km radius</p>
          </div>
          <iframe title="Lost Pet Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.2,12.9,80.3,13.0&layer=mapnik"
            className="w-full h-72 border-0" allowFullScreen/>
          <div className="p-4 bg-rose-50 flex items-center gap-3">
            <Bell className="w-4 h-4 text-rose-600"/>
            <p className="text-sm font-bold text-rose-800">{alerts.filter(a=>a.status==='lost').length} active lost pet alerts in your area</p>
          </div>
        </div>
      )}
    </div>
  );
}
