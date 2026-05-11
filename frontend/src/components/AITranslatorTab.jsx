import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Activity, Sparkles, Volume2, History, X, CheckCircle2, Clock } from 'lucide-react';

const EMOTION_POOL = [
  { emotion: 'Excited / Playful', confidence: '92%', detail: 'High pitch variations indicate an invitation to play. Your pet is feeling energetic!', suggestions: ['"Give me that toy!"', '"Let\'s go outside!"', '"I missed you!"'], color: 'from-emerald-500 to-teal-500' },
  { emotion: 'Anxious / Alert', confidence: '88%', detail: 'Short, sharp vocalizations suggest alertness or mild anxiety. Check the surroundings.', suggestions: ['"Who\'s there?"', '"I\'m a bit nervous."', '"Check the door!"'], color: 'from-amber-500 to-orange-500' },
  { emotion: 'Hungry / Demanding', confidence: '95%', detail: 'Rhythmic, insistent tones usually signals a request for food or attention.', suggestions: ['"Where is my dinner?"', '"Treat please!"', '"I\'m starving!"'], color: 'from-blue-500 to-indigo-500' },
  { emotion: 'Content / Relaxed', confidence: '98%', detail: 'Soft, steady purring or low-frequency sounds indicate deep relaxation and comfort.', suggestions: ['"I love you."', '"Everything is perfect."', '"Don\'t stop petting me!"'], color: 'from-rose-500 to-pink-500' }
];

const AITranslatorTab = () => {
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [time, setTime] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [historyLog, setHistoryLog] = useState([
    { id: 1, emotion: 'Anxious / Alert', time: 'Yesterday', confidence: '88%' },
    { id: 2, emotion: 'Content / Relaxed', time: 'Oct 12', confidence: '98%' }
  ]);

  // Timer for recording
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleMicClick = () => {
    if (!recording && !analyzing) {
      setRecording(true);
      setResult(null);
    } else if (recording) {
      setRecording(false);
      setAnalyzing(true);
      
      // Simulate 3s AI Analysis
      setTimeout(() => {
        const randomResult = EMOTION_POOL[Math.floor(Math.random() * EMOTION_POOL.length)];
        setAnalyzing(false);
        setResult(randomResult);
        
        // Add to History
        const newEntry = {
          id: Date.now(),
          emotion: randomResult.emotion,
          time: 'Just now',
          confidence: randomResult.confidence
        };
        setHistoryLog([newEntry, ...historyLog]);
      }, 3000);
    }
  };

  const playSuggestion = (index) => {
    setPlayingId(index);
    setTimeout(() => setPlayingId(null), 2000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pt-2 pb-12">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 mix-blend-screen" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-violet-500/30 mb-3 shadow-inner">
               <Sparkles className="w-4 h-4"/> Neural Voice Engine
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Pet Emotion Translator</h2>
            <p className="text-slate-400 text-sm max-w-md">Record your pet's barks, whines, or meows. Our AI analyzes pitch and frequency to decode their exact mood.</p>
          </div>
          
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-lg relative">
             <Volume2 className={`w-10 h-10 ${recording ? 'text-rose-500' : 'text-slate-500'}`} />
             {recording && (
               <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-rose-500/30 rounded-full" />
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Main Recording Interface */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          
          <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[250px]">
            <AnimatePresence mode="wait">
              {!recording && !analyzing && !result ? (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center mt-4">
                  <div className="w-32 h-32 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center mb-6">
                     <Mic className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase">Ready to listen</h3>
                  <p className="text-slate-500 mt-2 text-sm max-w-xs font-medium">Tap the mic to start recording your pet's vocalizations.</p>
                </motion.div>
              ) : recording ? (
                <motion.div key="recording" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center w-full">
                  <div className="flex items-end justify-center gap-1 h-32 w-full max-w-xs mb-6">
                    {/* Animated Audio Waveform */}
                    {Array.from({length: 15}).map((_, i) => (
                      <motion.div 
                        key={i} 
                        className="w-3 rounded-t-full bg-gradient-to-t from-violet-500 to-fuchsia-500"
                        animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                        transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-rose-500 tracking-widest font-mono drop-shadow-sm">{formatTime(time)}</h3>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-2 animate-pulse">Capturing Live Decibels...</p>
                </motion.div>
              ) : analyzing ? (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                  <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-violet-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Processing Spectrogram</h3>
                  <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-widest max-w-xs">AI Neural Analysis Active</p>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm">
                     <Activity className="w-10 h-10" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Emotion Decoded</p>
                  <h3 className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${result.color} mb-3 tracking-tighter uppercase`}>{result.emotion}</h3>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-600 border border-slate-100 uppercase tracking-widest shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-500"/> {result.confidence} Confidence
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pb-4">
            <button 
              onClick={handleMicClick}
              disabled={analyzing}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 ${recording ? 'bg-rose-50 text-rose-500 border-4 border-rose-200' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-violet-500/30'}`}
            >
              {recording ? (
                <div className="flex items-center justify-center gap-1">
                   <div className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce" />
                   <div className="w-1.5 h-12 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                   <div className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              ) : <Mic className="w-10 h-10" />}
            </button>
          </div>
        </div>

        {/* Results & History Panel */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex-1">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Sparkles className="w-6 h-6 text-violet-500"/> Decoding Intelligence
            </h3>
            
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                  <p className="text-xs text-slate-600 leading-relaxed font-bold uppercase tracking-wide">{result.detail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Neural Suggested Responses</p>
                  <div className="space-y-3">
                    {result.suggestions.map((phrase, i) => (
                      <button key={i} onClick={() => playSuggestion(i)} className={`w-full group bg-white hover:bg-violet-50 px-5 py-4 rounded-2xl text-xs font-black text-left flex items-center justify-between border-2 transition-all active:scale-95 ${playingId === i ? 'border-violet-400 bg-violet-50 ring-4 ring-violet-100' : 'border-slate-50'}`}>
                        <span className="uppercase tracking-tight text-slate-700">{phrase}</span>
                        {playingId === i ? <div className="flex gap-0.5"><div className="w-1 h-4 bg-violet-500 animate-bounce" /><div className="w-1 h-4 bg-violet-600 animate-bounce [animation-delay:0.1s]" /></div> : <Play className="w-4 h-4 text-violet-400 group-hover:scale-125" />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                  <Volume2 className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] max-w-[200px]">Recording sound data required</p>
              </div>
            )}
          </div>

          <div className="bg-slate-950 rounded-[2rem] p-8 shadow-sm border border-white/5 text-white overflow-hidden relative">
            <History className="absolute -top-4 -right-4 w-24 h-24 opacity-5" />
            <h3 className="text-[10px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.3em]">
               Neural Analytics Log
            </h3>
            <div className="space-y-4">
              {historyLog.slice(0, 2).map((log, i) => (
                <div key={log.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-200">{log.emotion}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{log.confidence} Confident</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-600">{log.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHistory(true)} className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-indigo-400 transition-all uppercase tracking-[0.2em] border border-white/10 shadow-lg active:scale-95">
               View Full Neural Log
            </button>
          </div>

        </div>

      </div>

      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20">
                
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                   <div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                       <Clock className="w-7 h-7 text-indigo-400" /> Translation Vault
                     </h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Full Neural Timeline Log</p>
                   </div>
                   <button onClick={() => setShowHistory(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition active:scale-90">
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-6">
                   {historyLog.map((log) => (
                     <div key={log.id} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex items-center justify-between group hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                             <Volume2 className="w-6 h-6 text-indigo-500" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.time}</p>
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{log.emotion}</h4>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="bg-white px-3 py-1 rounded-full text-[9px] font-black text-emerald-500 border border-emerald-100 shadow-sm uppercase tracking-widest whitespace-nowrap">
                              {log.confidence} MATCH
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Recordings: {historyLog.length}</p>
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Data Secured via Neural Chain
                   </p>
                </div>

             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AITranslatorTab;
