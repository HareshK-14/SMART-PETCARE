import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Droplet, ListChecks, ArrowRight, ShieldAlert, Award, ChevronDown, CheckCircle, FileDown, X, Info, User } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MOCK_DNA_DATA = {
  breedMix: {
    labels: ['Siberian Husky', 'Alaskan Malamute', 'German Shepherd', 'Supermutt (Unknown)'],
    datasets: [{
      data: [54, 26, 12, 8],
      backgroundColor: ['#6366f1', '#14b8a6', '#f59e0b', '#cbd5e1'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  },
  healthTraits: [
    { trait: 'MDR1 Medication Sensitivity', status: 'Clear', color: 'text-emerald-500 bg-emerald-100', icon: ShieldAlert },
    { trait: 'Degenerative Myelopathy', status: '1 Variant (Carrier)', color: 'text-amber-500 bg-amber-100', icon: Dna },
    { trait: 'Exercise Induced Collapse', status: 'Clear', color: 'text-emerald-500 bg-emerald-100', icon: ShieldAlert },
    { trait: 'Progressive Retinal Atrophy', status: 'Clear', color: 'text-emerald-500 bg-emerald-100', icon: ShieldAlert },
    { trait: 'Hyperuricosuria', status: 'Clear', color: 'text-emerald-500 bg-emerald-100', icon: ShieldAlert },
    { trait: 'Von Willebrand Disease I', status: 'Clear', color: 'text-emerald-500 bg-emerald-100', icon: ShieldAlert },
  ],
  familyTree: {
    parents: [
      { name: 'Cooper', breed: 'Siberian Husky', relation: 'Father' },
      { name: 'Sasha', breed: 'Alaskan Malamute Mix', relation: 'Mother' }
    ],
    grandparents: [
      { name: 'Max', breed: 'Husky' }, { name: 'Bella', breed: 'Husky' },
      { name: 'Rocky', breed: 'Malamute' }, { name: 'Daisy', breed: 'German Shepherd' }
    ]
  }
};

const DNATab = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    }, 2000);
  };
  return (
    <div className="space-y-6 flex flex-col pt-2">
      
      {/* Premium Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-indigo-900 border border-indigo-800 p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=800&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/90 to-transparent" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-400/30 mb-4 shadow-inner">
               <Dna className="w-4 h-4"/> Verified DNA Profile
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Luna's Genetic Blueprint
            </h2>
            <p className="text-indigo-200 text-lg mb-6 leading-relaxed">
              We decoded Luna's genome to uncover her precise breed mix, traits, and potential health risks. Knowledge is a longer, happier life.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className={`px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2 ${
                  downloadDone ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-900 hover:bg-indigo-50'
                }`}>
                {downloading ? (
                  <>Generating... <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Dna className="w-4 h-4"/></motion.div></>
                ) : downloadDone ? (
                  <>Report Ready! <CheckCircle className="w-4 h-4" /></>
                ) : (
                  <>Download PDF Report <FileDown className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-48 h-48 md:w-64 md:h-64 relative animate-[spin_60s_linear_infinite]">
               <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500/20 border-t-indigo-400 border-r-teal-400 border-b-amber-400 border-l-rose-400" />
               <div className="absolute inset-4 rounded-full border border-indigo-500/30" />
               <div className="absolute inset-8 rounded-full border-[4px] border-dashed border-indigo-400/40 animate-[spin_40s_linear_infinite_reverse]" />
            </div>
            <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop" alt="Luna" className="absolute w-32 h-32 md:w-44 md:h-44 object-cover rounded-full border-4 border-slate-900 shadow-2xl z-20 self-center" style={{ top: '50%', transform: 'translateY(-50%)', right: '12%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Breed Composition Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Award className="w-6 h-6 text-indigo-500"/> Breed Discovery</h3>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">99.9% Accuracy</span>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center gap-8 justify-center pb-4">
            <div className="w-48 h-48 relative">
              <Doughnut data={MOCK_DNA_DATA.breedMix} options={{ cutout: '75%', plugins: { legend: { display: false }, tooltip: { bodyFont: { size: 14, weight: 'bold' } } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-3xl font-black text-slate-900">54%</span>
                 <span className="text-xs text-slate-500 font-bold uppercase">Husky</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              {MOCK_DNA_DATA.breedMix.labels.map((label, idx) => (
                <div 
                  key={label} 
                  onClick={() => setSelectedBreed({ label, percentage: MOCK_DNA_DATA.breedMix.datasets[0].data[idx] })}
                  className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: MOCK_DNA_DATA.breedMix.datasets[0].backgroundColor[idx] }} />
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition">{label}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{MOCK_DNA_DATA.breedMix.datasets[0].data[idx]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Risks List */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><ListChecks className="w-6 h-6 text-teal-500"/> 240+ Health Risks</h3>
             <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100 px-3 py-1 rounded-lg">All Clear Mostly</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2" style={{ maxHeight: showAllResults ? 'none' : '400px' }}>
             {MOCK_DNA_DATA.healthTraits.slice(0, showAllResults ? undefined : 4).map((trait, idx) => (
               <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition group cursor-help" title="Click for details">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${trait.color}`}>
                     <trait.icon className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-[200px] sm:max-w-[250px]">{trait.trait}</p>
                     <p className="text-xs text-slate-500 font-medium">Genetic Marker Test</p>
                   </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-lg border shadow-sm ${trait.status === 'Clear' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {trait.status}
                    </span>
                 </div>
               </div>
             ))}
             <button 
               onClick={() => setShowAllResults(!showAllResults)}
               className="w-full flex items-center gap-2 justify-center py-3 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition mt-2">
                {showAllResults ? 'View Less' : 'View All Results'} <ChevronDown className={`w-4 h-4 transition-transform ${showAllResults ? 'rotate-180' : ''}`} />
             </button>
          </div>
        </div>

      </div>

      {/* Trait breakdown (Ancestry tree tease) */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center p-3 text-indigo-500">
               <Droplet className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Maternal Haplotype</h3>
              <p className="text-slate-600 max-w-md">Luna's maternal ancestors date back to the first domesticated dogs in ancient Eurasia.</p>
            </div>
         </div>
         <button 
            onClick={() => setShowFamilyTree(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex-shrink-0">
            Explore Family Tree
         </button>
      </div>

      {/* Family Tree Modal */}
      <AnimatePresence>
        {showFamilyTree && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFamilyTree(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
               <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-500"/> Luna's Ancestry Report</h3>
                  <button onClick={() => setShowFamilyTree(false)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 transition shadow-sm"><X className="w-5 h-5"/></button>
               </div>
               <div className="p-8">
                  <div className="flex flex-col items-center gap-8 relative">
                     {/* Luna */}
                     <div className="z-10 group cursor-default">
                        <div className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow-xl overflow-hidden mb-2 mx-auto">
                           <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop" alt="Luna" />
                        </div>
                        <p className="font-extrabold text-slate-800 text-center">Luna</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold text-center">Husky Mix</p>
                     </div>

                     {/* Parents */}
                     <div className="grid grid-cols-2 gap-24 relative w-full pt-8 border-t border-indigo-100">
                        {MOCK_DNA_DATA.familyTree.parents.map(p => (
                          <div key={p.name} className="flex flex-col items-center">
                             <div className="w-16 h-16 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center mb-2 shadow-sm">
                                <User className="w-8 h-8 text-indigo-400" />
                             </div>
                             <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase">{p.breed} • {p.relation}</p>
                          </div>
                        ))}
                     </div>

                     <div className="text-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100 max-w-sm mt-4">
                        <p className="text-xs text-indigo-800 font-medium italic">"Luna's ancestors were high-energy working dogs originating from Siberia and Alaska, contributing to her athletic build and thick coat."</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Breed Detail Info Modal */}
      <AnimatePresence>
        {selectedBreed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBreed(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">🐕</div>
                   <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{selectedBreed.label}</h3>
                      <p className="text-sm text-indigo-600 font-bold">{selectedBreed.percentage}% Genetic Match</p>
                   </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                   The {selectedBreed.label} is known for being {selectedBreed.label.includes('Husky') ? 'independent, athletic and vocal.' : 'loyal, energetic and deeply bonded to family.'} Genetic markers suggest Luna inherited her coat texture and endurance from this lineage.
                </p>
                <button onClick={() => setSelectedBreed(null)} className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">Close Details</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DNATab;
