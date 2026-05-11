import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MapPin, BatteryMedium, Wifi, Moon, ThermometerSun, ShieldCheck, Navigation, X } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const SmartCollarTab = () => {
  const [pulse, setPulse] = useState(82);
  const [temp, setTemp] = useState(38.5);
  const [chartData, setChartData] = useState(Array.from({length: 20}, () => 80 + Math.random() * 10));
  const [radius, setRadius] = useState(50);
  const [isEditingBounds, setIsEditingBounds] = useState(false);

  // Simulate real-time data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      const newPulse = Math.floor(80 + Math.random() * 15);
      setPulse(newPulse);
      setTemp(+(38.2 + Math.random() * 0.6).toFixed(1));
      setChartData(prev => [...prev.slice(1), newPulse]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Bar Status */}
      <div className="bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">SmartCollar Pro</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-300"></span>
              <span className="text-emerald-400 text-sm font-bold tracking-widest uppercase">Connected • Luna</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
           <div className="flex flex-col items-center gap-1">
             <Wifi className="w-6 h-6 text-indigo-400" />
             <span className="text-[10px] font-bold uppercase">Signal</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <BatteryMedium className="w-6 h-6 text-emerald-400" />
             <span className="text-[10px] font-bold uppercase">84%</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <ShieldCheck className="w-6 h-6 text-sky-400" />
             <span className="text-[10px] font-bold uppercase">Safe Zone</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Real-time Vitals */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Live Vitals</h3>
              <p className="text-sm text-slate-500">Updating every 2 seconds via Bluetooth</p>
            </div>
            <div className="bg-rose-50 px-3 py-1 rounded-full border border-rose-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500 animate-pulse"/>
              <span className="text-rose-600 font-extrabold text-lg">{pulse} BPM</span>
            </div>
          </div>

          <div className="h-48 w-full mb-6">
             <Line 
                options={{ maintainAspectRatio: false, animation: { duration: 0 }, scales: { y: { min: 60, max: 120, display: false }, x: { display: false } }, plugins: { legend: { display: false }, tooltip: { enabled: false } }, elements: { point: { radius: 0 } } }}
                data={{
                  labels: Array.from({length: 20}, (_,i) => i),
                  datasets: [{
                    data: chartData,
                    borderColor: '#f43f5e',
                    backgroundColor: 'rgba(244,63,94,0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                  }]
                }}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><ThermometerSun className="w-5 h-5"/></div>
               <div><p className="text-xs text-slate-400 font-bold uppercase">Body Temp</p><p className="text-xl font-extrabold text-slate-900">{temp}°C</p></div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500"><Moon className="w-5 h-5"/></div>
               <div><p className="text-xs text-slate-400 font-bold uppercase">Deep Sleep</p><p className="text-xl font-extrabold text-slate-900">4h 12m</p></div>
            </div>
          </div>
        </div>

        {/* GPS Geofencing Map */}
        <div className="bg-slate-900 rounded-3xl p-2 shadow-2xl relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop')" }} />
          
          <div className="absolute inset-x-0 top-0 p-6 z-10 flex justify-between items-start">
             <div>
                <h3 className="text-white font-extrabold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-400"/> GPS Safe Zone</h3>
                <p className="text-slate-400 text-sm">Geofencing Active • {radius}m Radius</p>
             </div>
             <button onClick={() => setIsEditingBounds(true)} className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition active:scale-95 shadow-lg border border-white/10">Edit Bounds</button>
          </div>

          {/* Radar UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Safe zone circle */}
            <motion.div 
               animate={{ width: radius * 4, height: radius * 4 }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
               className="rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.2)_inset]"
            >
               <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-[ping_3s_linear_infinite]" />
               
               {/* Pet Location indicator */}
               <motion.div 
                 initial={{ x: 0, y: 0 }}
                 animate={{ x: [0, 20, 10, -15, 0], y: [0, -10, 20, 5, 0] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute z-20"
               >
                 <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-[0_0_15px_rgba(99,102,241,1)]" />
                 <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-white whitespace-nowrap shadow-xl flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-indigo-400"/> Luna
                 </div>
               </motion.div>
            </motion.div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isEditingBounds && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingBounds(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }} 
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-8 border border-white/20"
            >
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-indigo-500" /> Edit Safe Zone
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Adjust Geofence Radius</p>
                  </div>
                  <button onClick={() => setIsEditingBounds(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl transition active:scale-90 text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Radius</label>
                      <span className="text-2xl font-black text-indigo-600 tracking-tighter">{radius}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={radius} 
                      onChange={(e) => setRadius(Number(e.target.value))} 
                      className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-all" 
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-300 mt-2 px-1">
                      <span>10m</span>
                      <span>50m</span>
                      <span>100m</span>
                    </div>
                  </div>
                  <button onClick={() => setIsEditingBounds(false)} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
                     Save Bounds
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SmartCollarTab;
