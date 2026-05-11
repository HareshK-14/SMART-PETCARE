import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquare, ShieldCheck, Activity, Settings, UserCircle, Files, Paperclip, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Teleclinic = () => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Sarah Jenkins', time: '10:02 AM', text: 'Hello! I can see Luna\'s file now. Has she been eating normally today?' },
    { id: 2, sender: 'You', time: '10:03 AM', text: 'Hi Dr. Sarah. Yes, but she seems a bit lethargic after her morning walk.' }
  ]);
  const [input, setInput] = useState('');
  const [callTime, setCallTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCallTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endCall = () => {
    navigate('/dashboard'); // simulate ending call returns to dashboard
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', time: new Date().toLocaleTimeString([], {timeStyle: 'short'}), text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pt-16 font-sans">
      
      {/* Top Bar */}
      <div className="h-16 bg-slate-800/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">E2E Encrypted</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <h1 className="text-white font-extrabold text-lg flex items-center gap-2">
            Dr. Sarah Jenkins <span className="text-slate-400 font-normal text-sm">General Checkup (Luna)</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-white/10 px-4 py-1.5 rounded-lg text-rose-500 font-mono font-bold tracking-widest text-lg">
            {formatTime(callTime)}
          </div>
          <button className="text-slate-400 hover:text-white transition p-2"><Settings className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Video Area */}
        <div className="flex-1 relative bg-black flex flex-col">
          {/* Main Feed (Vet) */}
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&h=900&fit=crop" alt="Vet speaking" 
                  className="w-full h-full object-cover opacity-90" />
             <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
               <p className="text-white font-bold text-sm flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Dr. Sarah Jenkins
               </p>
             </div>
          </div>

          {/* Picture in Picture (User) */}
          <div className="absolute top-6 right-6 w-64 aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-10 cursor-move">
            {videoOn ? (
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop" alt="You and Luna" className="w-full h-full object-cover shadow-inner" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                <UserCircle className="w-12 h-12 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 flex rounded-lg">
              <p className="text-white text-xs font-bold">You (Luna)</p>
            </div>
            {!micOn && (
               <div className="absolute top-2 right-2 bg-rose-500 p-1.5 rounded-full shadow-lg">
                 <MicOff className="w-3 h-3 text-white" />
               </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <button onClick={() => setMicOn(!micOn)} className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'}`}>
              {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button onClick={() => setVideoOn(!videoOn)} className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'}`}>
              {videoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 transition-all">
              <MonitorUp className="w-6 h-6" />
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${chatOpen ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
              <MessageSquare className="w-6 h-6" />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button onClick={endCall} className="w-16 h-14 rounded-xl flex items-center justify-center bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:bg-rose-700 transition">
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Right Sidebar (Chat & Records) */}
        {chatOpen && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-slate-900 border-l border-white/10 flex flex-col flex-shrink-0">
            {/* Sidebar Tabs */}
            <div className="flex bg-slate-800/50 p-2">
              <button className="flex-1 py-2 text-sm font-bold text-white bg-slate-800 rounded-lg shadow-sm border border-white/5">Consultation Chat</button>
              <button className="flex-1 py-2 text-sm font-bold text-slate-400 hover:text-white transition">Patient File</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {messages.map(msg => (
                 <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                   <p className="text-xs text-slate-500 mb-1 font-medium">{msg.sender} • {msg.time}</p>
                   <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${msg.sender === 'You' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-white/5'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
            </div>

            {/* Vitals Summary Pill */}
            <div className="px-4 pb-2">
               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-emerald-400"><Activity className="w-4 h-4"/><span className="text-xs font-bold uppercase tracking-wider">Live Vitals Shared</span></div>
                 <span className="text-xs text-emerald-500/70">from SmartCollar</span>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800/50 border-t border-white/10">
              <form onSubmit={sendMessage} className="flex items-end gap-2">
                <button type="button" className="p-3 text-slate-400 hover:text-white transition bg-slate-800 rounded-xl border border-white/5"><Paperclip className="w-5 h-5"/></button>
                <div className="flex-1 relative">
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); }}} placeholder="Message the vet..." rows={1} className="w-full bg-slate-800 text-white rounded-xl border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 resize-none overflow-hidden" style={{ minHeight: '44px' }} />
                </div>
                <button type="submit" disabled={!input.trim()} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default Teleclinic;
