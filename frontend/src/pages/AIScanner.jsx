import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ScanLine, AlertTriangle, ShieldCheck, FileSearch, ArrowRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIScanner = () => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startScan(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      startScan(URL.createObjectURL(e.target.files[0]));
    }
  };

  const startScan = (imgUrl) => {
    setFile(imgUrl);
    setScanning(true);
    setResult(null);
    
    // Simulate 3.5s AI scan
    setTimeout(() => {
      setScanning(false);
      setResult({
        condition: 'Hot Spot (Acute Moist Dermatitis)',
        probability: '94%',
        urgency: 'Moderate - See Vet within 48h',
        description: 'A superficial skin infection often caused by allergies or insect bites leading to intense scratching and chewing.',
        action: 'Schedule a dermatology consultation'
      });
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border border-indigo-500/30 mb-4">
            <ScanLine className="w-5 h-5" /> Beta AI Vision
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">AI Dermatologist Scanner</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Upload a photo of your pet's skin condition, tick bite, or eye issue. Our advanced computer vision model will analyze it in seconds.</p>
        </div>

        {/* Main Interface */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {!file ? (
              // Upload State
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-slate-600 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/80 transition group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('ai-upload').click()}
              >
                <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                  <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop Image Here</h3>
                <p className="text-slate-400 mb-8">PNG, JPG, JPEG up to 10MB</p>
                
                <label className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1 transition cursor-pointer flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Browse Files
                </label>
                <input id="ai-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </motion.div>

            ) : (
              
              // Scanning & Result State
              <motion.div 
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-square max-h-[400px]">
                  <img src={file} alt="Scan Upload" className="w-full h-full object-cover" />
                  
                  {scanning && (
                    <>
                      {/* Dark Overlay mask */}
                      <div className="absolute inset-0 bg-indigo-900/40 mix-blend-color-burn" />
                      
                      {/* Scanning Laser Line */}
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-10"
                      />

                      {/* Scanning Box Outline */}
                      <div className="absolute inset-8 border-2 border-dashed border-cyan-400/50 rounded-xl" />

                      {/* HUD Overlays */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                         <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-cyan-500/30 text-cyan-400 font-mono text-xs animate-pulse">Running neural network...</div>
                         <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-cyan-500/30 text-cyan-400 font-mono text-xs animate-pulse" style={{animationDelay: '0.5s'}}>Analyzing dermatology dataset...</div>
                      </div>
                    </>
                  )}

                  {/* Result Bounding Box */}
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring" }}
                      className="absolute inset-[15%] border-[3px] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] rounded-2xl flex items-end justify-center pb-4"
                    >
                      <div className="bg-emerald-500 text-white font-bold text-xs uppercase px-3 py-1 rounded shadow-lg translate-y-8">Target Identified</div>
                    </motion.div>
                  )}
                </div>

                {/* Status/Result Panel */}
                <div className="flex flex-col justify-center">
                  {scanning ? (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-extrabold text-white">Analyzing Image</h3>
                      <p className="text-slate-400">Our computer vision model is comparing 1.2 million veterinary dermatological images to find a match.</p>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "easeInOut" }} className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                      </div>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit">
                        <ShieldCheck className="w-5 h-5"/> <span className="font-bold">Scan Complete</span>
                      </div>
                      
                      <div>
                        <h2 className="text-3xl font-black text-white mb-2">{result.condition}</h2>
                        <div className="flex items-center gap-3">
                          <span className="bg-slate-700 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold font-mono border border-cyan-500/20">{result.probability} Match</span>
                          <span className="flex items-center gap-1 text-rose-400 text-sm font-bold"><AlertTriangle className="w-4 h-4"/> {result.urgency}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5">
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">{result.description}</p>
                        <hr className="border-white/5 mb-4"/>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Recommended Action</p>
                        <p className="text-indigo-300 font-medium">{result.action}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button onClick={() => navigate('/emergency')} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-2">
                          <AlertTriangle className="w-5 h-5"/> Find Nearest Vet
                        </button>
                        <button onClick={() => navigate('/telehealth')} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] transition flex items-center justify-center gap-2">
                          <FileSearch className="w-5 h-5"/> Consult Online
                        </button>
                      </div>
                      
                      <button onClick={() => setFile(null)} className="w-full py-3 text-slate-500 font-bold hover:text-white transition mt-2">
                         Scan Another Image
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className="mt-8 text-center text-xs text-slate-600">
           <AlertTriangle className="w-4 h-4 inline-block mr-1 -mt-0.5" /> 
           Disclaimer: This AI tool is in Beta. It does not replace professional veterinary medical advice. Always consult a veterinarian for diagnosis.
        </div>
      </div>
    </div>
  );
};

export default AIScanner;
