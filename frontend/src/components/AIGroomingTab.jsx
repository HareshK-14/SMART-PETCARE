import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, Bath, CheckCircle, Calendar, Star, Sparkles, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#8b5cf6,#14b8a6)';

const BREED_PROFILES = {
  'Golden Retriever': { coat:'Long, dense double coat', freq:'Every 6-8 weeks', bath:'Monthly', brushing:'3-4x per week', nail:'Monthly', ear:'Weekly', tools:['Slicker brush','Dematting comb','Grooming scissors'] },
  'Persian Cat':      { coat:'Long silky coat, prone to matting', freq:'Every 4 weeks',   bath:'Every 2 weeks', brushing:'Daily',          nail:'Every 2 weeks', ear:'Weekly', tools:['Wide-tooth comb','De-shedding tool','Cat-specific shampoo'] },
  'Labrador':         { coat:'Short dense coat',      freq:'Every 8-12 weeks', bath:'Every 6 weeks', brushing:'2x per week',    nail:'Monthly', ear:'Bi-weekly', tools:['Rubber curry brush','Shedding blade','Gentle shampoo'] },
  'Poodle':           { coat:'Curly hypoallergenic coat', freq:'Every 4-6 weeks', bath:'Every 3 weeks', brushing:'Daily',       nail:'Every 2-3 weeks', ear:'Weekly', tools:['Slicker brush','Clippers','Ear cleaning solution'] },
  'Other':            { coat:'Varies by breed',       freq:'Every 6-8 weeks', bath:'Monthly',      brushing:'2-3x per week',  nail:'Monthly', ear:'Monthly', tools:['Basic brush','Dog shampoo','Nail clippers'] },
};

const UPCOMING = [
  { task:'Bath & Dry',       due:'May 10, 2026', done:false, emoji:'🛁' },
  { task:'Nail Trimming',    due:'May 15, 2026', done:false, emoji:'✂️' },
  { task:'Ear Cleaning',     due:'May 12, 2026', done:false, emoji:'👂' },
  { task:'Brushing Session', due:'Today',        done:true,  emoji:'🪮' },
  { task:'Professional Groom', due:'May 25, 2026', done:false, emoji:'💈' },
];

export default function AIGroomingTab() {
  const [breed, setBreed]       = useState('Golden Retriever');
  const [tab, setTab]           = useState('suggestions');
  const [reminders, setReminders] = useState(UPCOMING);
  const [aiTip, setAiTip]       = useState('');
  const [loading, setLoading]   = useState(false);

  const profile = BREED_PROFILES[breed] || BREED_PROFILES['Other'];

  const getTip = () => {
    setLoading(true);
    const tips = [
      `For ${breed}s, always brush BEFORE bathing to remove tangles. Never use human shampoo as it disrupts the pH balance.`,
      `${breed}s should have their ears checked weekly for redness or odour. Use a vet-approved ear cleaner with a cotton ball.`,
      `During shedding season, increase brushing frequency for your ${breed} to 5-6x per week to manage loose fur.`,
      `Professional grooming for ${breed}s every ${profile.freq} ensures a healthy coat. Book in advance for festive seasons.`,
    ];
    setTimeout(() => {
      setAiTip(tips[Math.floor(Math.random()*tips.length)]);
      setLoading(false);
    }, 1200);
  };

  const toggleDone = (i) => setReminders(p => p.map((r,idx) => idx===i ? {...r,done:!r.done} : r));

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-8 -top-8 opacity-10"><Scissors className="w-40 h-40"/></div>
        <div className="relative">
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">✂️ AI Grooming</span>
          <h2 className="text-2xl font-black mt-2">AI Grooming Suggestions</h2>
          <p className="text-violet-200 text-sm mt-1">Personalised grooming schedules, coat care tips, and hygiene reminders.</p>
        </div>
      </div>

      {/* Breed selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-bold text-slate-600">Pet Breed:</span>
        {Object.keys(BREED_PROFILES).map(b => (
          <button key={b} onClick={() => setBreed(b)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition ${breed===b?'text-white border-transparent':'bg-slate-50 border-slate-200 text-slate-600 hover:border-violet-300'}`}
            style={breed===b?{background:GRAD}:{}}>
            {b}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{k:'suggestions',label:'💡 AI Suggestions'},{k:'schedule',label:'📅 Schedule'},{k:'reminders',label:'🔔 Reminders'}].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${tab===t.k?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-violet-300'}`}
            style={tab===t.k?{background:GRAD}:{}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      {tab === 'suggestions' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Grooming Freq', profile.freq,     Scissors, '#8b5cf6'],
              ['Bath Interval', profile.bath,      Bath,     '#6366f1'],
              ['Brushing',      profile.brushing,  Sparkles, '#14b8a6'],
              ['Nail Trim',     profile.nail,      Star,     '#f59e0b'],
            ].map(([l,v,Icon,c]) => (
              <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{background:c+'18'}}>
                  <Icon className="w-4 h-4" style={{color:c}}/>
                </div>
                <p className="font-extrabold text-slate-900 text-sm">{v}</p>
                <p className="text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="font-extrabold text-slate-800 mb-3">🐾 Coat Profile</p>
              <p className="text-sm text-slate-600 mb-4">{profile.coat}</p>
              <p className="font-bold text-slate-700 text-xs mb-2 uppercase tracking-widest">Recommended Tools</p>
              {profile.tools.map((t,i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-violet-500">✦</span>
                  <span className="text-sm text-slate-600">{t}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="font-extrabold text-slate-800 mb-1">🤖 AI Grooming Tip</p>
              <p className="text-xs text-slate-400 mb-4">Get a personalised tip for your {breed}</p>
              {aiTip ? (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed mb-3">{aiTip}</div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4 text-center text-slate-400 text-sm mb-3">Click below to get an AI tip</div>
              )}
              <button onClick={getTip} disabled={loading}
                className="w-full py-2.5 text-white font-bold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2"
                style={{background:GRAD}}>
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/> Generating...</> : '✨ Get AI Tip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule */}
      {tab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📅 Monthly Grooming Calendar</p>
          <div className="space-y-3">
            {[
              { week:'Week 1', tasks:['Full brushing session','Ear inspection'] },
              { week:'Week 2', tasks:['Nail trimming','Paw pad check'] },
              { week:'Week 3', tasks:['Bath & blow dry','Coat conditioning'] },
              { week:'Week 4', tasks:['Professional grooming','Full health check'] },
            ].map((w,i) => (
              <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-16 text-xs font-extrabold text-violet-600 flex-shrink-0 pt-0.5">{w.week}</div>
                <div className="flex flex-wrap gap-2">
                  {w.tasks.map(t => (
                    <span key={t} className="text-xs font-bold bg-white border border-violet-200 text-violet-700 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders */}
      {tab === 'reminders' && (
        <div className="space-y-3">
          {reminders.map((r,i) => (
            <motion.div key={i} layout
              className={`bg-white rounded-2xl border-2 shadow-sm p-4 flex items-center gap-4 transition-opacity ${r.done?'opacity-60':'opacity-100'}`}
              style={{borderColor: r.done ? '#d1fae5' : '#e9d5ff'}}>
              <div className="text-2xl">{r.emoji}</div>
              <div className="flex-1">
                <p className={`font-extrabold text-sm ${r.done?'text-slate-400 line-through':'text-slate-800'}`}>{r.task}</p>
                <p className="text-xs text-slate-400">Due: {r.due}</p>
              </div>
              <button onClick={() => toggleDone(i)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${r.done?'bg-emerald-500 border-emerald-500':'border-slate-200 hover:border-violet-400'}`}>
                {r.done && <CheckCircle className="w-4 h-4 text-white"/>}
              </button>
            </motion.div>
          ))}
          <div className="text-center text-xs text-slate-400 pt-2">
            {reminders.filter(r=>r.done).length}/{reminders.length} tasks completed
          </div>
        </div>
      )}
    </div>
  );
}
