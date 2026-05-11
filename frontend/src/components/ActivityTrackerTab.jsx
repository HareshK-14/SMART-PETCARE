import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Flame, Clock, Play, Pause, Square, TrendingUp } from 'lucide-react';

const ActivityTrackerTab = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [walks, setWalks] = useState(() => JSON.parse(localStorage.getItem('petWalks') || '[]'));
  
  const startWalk = () => setIsTracking(true);
  const stopWalk = () => {
    setIsTracking(false);
    const newWalk = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      distance: (Math.random() * 2 + 1).toFixed(1), // Mock distance 1-3km
      duration: Math.floor(Math.random() * 30 + 15), // Mock duration 15-45m
      calories: Math.floor(Math.random() * 100 + 50) // Mock calories
    };
    const updated = [newWalk, ...walks];
    setWalks(updated);
    localStorage.setItem('petWalks', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      
      {/* Daily Goal Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><Activity className="w-32 h-32"/></div>
          <div className="relative z-10">
            <h3 className="text-indigo-100 font-bold mb-1">Daily Activity</h3>
            <p className="text-4xl font-extrabold mb-2">45<span className="text-lg text-indigo-200">/60 min</span></p>
            <div className="w-full bg-indigo-900/40 rounded-full h-2 mt-4">
              <div className="bg-teal-400 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><Flame className="w-32 h-32"/></div>
          <div className="relative z-10">
            <h3 className="text-rose-100 font-bold mb-1">Calories Burned</h3>
            <p className="text-4xl font-extrabold mb-2">320<span className="text-lg text-rose-200"> kcal</span></p>
            <p className="text-sm text-rose-100 mt-4 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> +15% from yesterday</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><MapPin className="w-32 h-32"/></div>
          <div className="relative z-10">
            <h3 className="text-teal-100 font-bold mb-1">Distance Walked</h3>
            <p className="text-4xl font-extrabold mb-2">2.4<span className="text-lg text-teal-200"> km</span></p>
            <div className="w-full bg-teal-900/40 rounded-full h-2 mt-4">
              <div className="bg-white h-2 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracker & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center text-center">
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6 transition-all duration-500 ${isTracking ? 'border-teal-400 bg-teal-50 animate-pulse' : 'border-slate-100 bg-slate-50'}`}>
            {isTracking ? <Activity className="w-12 h-12 text-teal-500" /> : <MapPin className="w-12 h-12 text-slate-300" />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Live GPS Tracker</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Track your pet's walks in real-time. Hit start when you leave the house!</p>
          
          <div className="flex gap-4">
            {!isTracking ? (
              <button onClick={startWalk} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">
                <Play className="w-5 h-5 fill-current" /> Start Walk
              </button>
            ) : (
              <>
                <button className="flex items-center gap-2 bg-amber-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-amber-600 transition">
                  <Pause className="w-5 h-5 fill-current" /> Pause
                </button>
                <button onClick={stopWalk} className="flex items-center gap-2 bg-rose-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:bg-rose-700 transition">
                  <Square className="w-5 h-5 fill-current" /> Finish Tracker
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mock Map View */}
        <div className="bg-slate-200 rounded-3xl h-[400px] border-[6px] border-white shadow-inner relative overflow-hidden group">
           <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=800&fit=crop')",
                  transform: 'scale(1.2) translate(-5%, -5%)',
                  opacity: 0.6
                }}
            />
            {/* SVG Path drawing mock route */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl" viewBox="0 0 400 300" preserveAspectRatio="none">
              <motion.path 
                d="M 50 250 Q 80 200, 150 220 T 250 150 T 350 80" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="6" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isTracking ? 1 : 0.8 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute top-[80px] left-[350px] w-5 h-5 bg-teal-500 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
            
            {!isTracking && (
              <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center">
                <p className="bg-white/90 px-4 py-2 rounded-xl font-bold text-slate-700 shadow-sm">Map offline. Start tracking to view.</p>
              </div>
            )}
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-extrabold text-slate-900 text-lg mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" /> Recent Walks History
        </h3>
        
        {walks.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No walks recorded yet. Go explore!</p>
        ) : (
          <div className="space-y-4">
            {walks.map(w => (
              <div key={w.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                     <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Neighborhood Walk</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{w.date}</p>
                  </div>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="font-extrabold text-slate-900">{w.distance} km</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Distance</p>
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">{w.duration} m</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Time</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-extrabold text-slate-900">{w.calories}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Kcal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ActivityTrackerTab;
