import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Scale, Calendar, AlertTriangle, CheckCircle, RefreshCw, Plus } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#f59e0b,#ef4444)';

const BREED_PLANS = {
  'Golden Retriever': { calories: 1400, protein: '28%', fat: '16%', carbs: '45%', meals: 2, tips: ['Rich in Omega-3 for coat health','Glucosamine supplements recommended','Avoid high-fat treats'] },
  'Persian Cat':      { calories: 280,  protein: '35%', fat: '22%', carbs: '30%', meals: 3, tips: ['High-protein wet food recommended','Fresh water always available','Hairball control formula'] },
  'Labrador':         { calories: 1600, protein: '30%', fat: '14%', carbs: '46%', meals: 2, tips: ['Watch portion size — prone to obesity','Add joint supplements','Regular exercise required'] },
  'Poodle':           { calories: 900,  protein: '26%', fat: '14%', carbs: '48%', meals: 2, tips: ['Small breed formula preferred','Dental chews daily','Balanced omega fatty acids'] },
  'Other':            { calories: 800,  protein: '26%', fat: '15%', carbs: '48%', meals: 2, tips: ['Consult vet for specific breed needs','Fresh meals preferred','Avoid processed ingredients'] },
};

const MEAL_SCHEDULE = [
  { time: '7:00 AM',  meal: 'Morning Meal',   emoji: '🌅', note: 'Main protein portion' },
  { time: '1:00 PM',  meal: 'Midday Snack',   emoji: '🍎', note: 'Fruits or veggies (light)' },
  { time: '7:00 PM',  meal: 'Evening Meal',   emoji: '🌙', note: 'Balanced carbs + protein' },
];

export default function PetDietPlannerTab() {
  const [form, setForm]     = useState({ name:'Buddy', breed:'Golden Retriever', age:3, weight:25, condition:'Healthy' });
  const [plan, setPlan]     = useState(null);
  const [gen, setGen]       = useState(false);
  const [tab, setTab]       = useState('planner');

  const generate = () => {
    setGen(true);
    setTimeout(() => {
      const base = BREED_PLANS[form.breed] || BREED_PLANS['Other'];
      const ageAdj = form.age < 1 ? 1.3 : form.age > 8 ? 0.85 : 1;
      const condAdj = form.condition === 'Overweight' ? 0.8 : form.condition === 'Underweight' ? 1.2 : 1;
      setPlan({ ...base, calories: Math.round(base.calories * ageAdj * condAdj) });
      setGen(false);
    }, 1800);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-8 -top-8 opacity-10"><Utensils className="w-40 h-40"/></div>
        <div className="relative">
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🥗 AI Nutrition</span>
          <h2 className="text-2xl font-black mt-2">Pet Diet Planner</h2>
          <p className="text-orange-200 text-sm mt-1">AI-generated personalized meal plans for your pet's breed, age, and health condition.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{k:'planner',label:'🥗 Diet Planner'},{k:'schedule',label:'📅 Meal Schedule'},{k:'nutrition',label:'📊 Nutrition Tips'}].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${tab===t.k?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-amber-300'}`}
            style={tab===t.k?{background:GRAD}:{}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'planner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-extrabold text-slate-800 mb-4">Pet Details</h3>
            <div className="space-y-3">
              {[
                { label:'Pet Name',     key:'name',      type:'text' },
                { label:'Age (years)',  key:'age',       type:'number' },
                { label:'Weight (kg)', key:'weight',    type:'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 outline-none"/>
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Breed</label>
                <select value={form.breed} onChange={e => setForm(p=>({...p,breed:e.target.value}))}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 outline-none">
                  {Object.keys(BREED_PLANS).map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Condition</label>
                <select value={form.condition} onChange={e => setForm(p=>({...p,condition:e.target.value}))}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 outline-none">
                  {['Healthy','Overweight','Underweight','Diabetic','Post-Surgery','Senior'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={generate} disabled={gen}
              className="w-full mt-5 py-3 text-white font-bold rounded-xl disabled:opacity-60 transition hover:opacity-90"
              style={{background:GRAD}}>
              {gen ? '🤖 Generating...' : '🥗 Generate AI Diet Plan'}
            </button>
          </div>

          {/* Result */}
          <AnimatePresence>
            {plan ? (
              <motion.div key="plan" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
                className="space-y-4">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-amber-600"/>
                    <p className="font-extrabold text-amber-800">AI Diet Plan for {form.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      ['Daily Calories', `${plan.calories} kcal`, '#f59e0b'],
                      ['Meals/Day',      plan.meals,              '#6366f1'],
                      ['Protein',        plan.protein,            '#10b981'],
                      ['Fat',            plan.fat,                '#ef4444'],
                    ].map(([l,v,c]) => (
                      <div key={l} className="bg-white rounded-xl p-3 border border-amber-100 text-center">
                        <p className="text-xl font-extrabold" style={{color:c}}>{v}</p>
                        <p className="text-xs text-slate-500">{l}</p>
                      </div>
                    ))}
                  </div>
                  {/* Macro bar */}
                  <div className="space-y-2">
                    {[['Protein',plan.protein,'#10b981'],['Fat',plan.fat,'#ef4444'],['Carbs',plan.carbs,'#6366f1']].map(([l,v,c]) => (
                      <div key={l} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 w-14">{l}</span>
                        <div className="flex-1 bg-white rounded-full h-2">
                          <div className="h-2 rounded-full" style={{width:v, background:c}}/>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <p className="font-extrabold text-slate-800 mb-3 text-sm">💡 AI Recommendations</p>
                  {plan.tips.map((t,i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span className="text-amber-500 mt-0.5">✦</span>
                      <p className="text-sm text-slate-600">{t}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPlan(null)} className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5"/> Regenerate Plan
                </button>
              </motion.div>
            ) : !gen ? (
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 text-center text-slate-400 flex flex-col items-center justify-center">
                <div className="text-5xl mb-3">🥗</div>
                <p className="font-bold">Fill in pet details & generate</p>
                <p className="text-xs mt-1">AI creates a personalized meal plan</p>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 text-center">
                <div className="text-5xl mb-3 animate-spin">🤖</div>
                <p className="font-extrabold text-amber-800">AI generating your pet's diet...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {tab === 'schedule' && (
        <div className="space-y-3">
          {MEAL_SCHEDULE.map((m,i) => (
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="text-3xl w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">{m.emoji}</div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-800">{m.meal}</p>
                <p className="text-xs text-slate-400">{m.note}</p>
              </div>
              <span className="font-bold text-amber-600 text-sm bg-amber-50 px-3 py-1 rounded-full">{m.time}</span>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'nutrition' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon:'🥩', title:'Protein Sources',   tips:['Chicken (boiled)', 'Salmon', 'Eggs', 'Lean beef'] },
            { icon:'🥦', title:'Safe Vegetables',    tips:['Carrots', 'Broccoli', 'Spinach', 'Sweet potato'] },
            { icon:'🍎', title:'Safe Fruits',        tips:['Blueberries', 'Watermelon (seedless)', 'Banana', 'Apple (no seeds)'] },
            { icon:'❌', title:'Foods to Avoid',     tips:['Chocolate', 'Onion & Garlic', 'Grapes & Raisins', 'Xylitol'] },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.icon}</span>
                <p className="font-extrabold text-slate-800">{c.title}</p>
              </div>
              {c.tips.map((t,i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-amber-500 text-xs">●</span>
                  <span className="text-sm text-slate-600">{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
