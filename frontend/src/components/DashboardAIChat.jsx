import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, RotateCcw, X, MessageSquare } from 'lucide-react';

/* ── Smart local AI responses ────────────────────────────────────────────── */
const PET_AI = (msg, mode) => {
  const m = msg.toLowerCase();
  if (m.includes('vaccine') || m.includes('vaccin')) return '💉 Vaccinations are vital! Dogs need Rabies, DHPP annually. Cats need FVRCP. Always consult your vet.';
  if (m.includes('food') || m.includes('diet') || m.includes('eat')) return '🍗 High-quality protein should be the first ingredient. Avoid onions, garlic, chocolate, and grapes. Feed 2-3 small meals daily.';
  if (m.includes('weight') || m.includes('obese')) return '⚖️ Healthy weight matters! You should feel (not see) their ribs. Increase exercise gradually and opt for low-calorie treats!';
  if (m.includes('scratch') || m.includes('itch')) return '🔬 Itching could be allergies, fleas, or skin infection. Check for flea dirt, change to a hypoallergenic diet, and see your vet.';
  if (m.includes('vomit') || m.includes('sick')) return '🏥 If vomiting lasts more than 24 hours or has blood, visit the vet immediately. Otherwise, withhold food for 12 hours.';
  if (m.includes('train') || m.includes('behav')) return '🐕 Positive reinforcement works best! Reward immediately. Keep sessions short (5–10 min) and be consistent.';
  if (m.includes('flea') || m.includes('tick') || m.includes('worm')) return '🦟 Use monthly preventatives year-round. Check between toes, ears, and armpits for ticks after walks.';
  if (m.includes('dental') || m.includes('teeth')) return '🦷 Brush your pet\'s teeth 3x per week! Use pet-safe toothpaste. Dental chews also help prevent tartar.';
  if (m.includes('appoint') || m.includes('book')) return '📅 Book appointments 48 hours in advance. Annual wellness exams are recommended for all pets.';
  if (m.includes('emergency') || m.includes('urgent')) return '🚨 Emergency signs: difficulty breathing, seizures, pale gums, collapse. Go to an emergency vet immediately!';
  
  if (mode === 'vet') {
    if (m.includes('prescription') || m.includes('medic') || m.includes('dose')) return '💊 Always confirm weight before prescribing. Use mg/kg dosing guides. Document all prescriptions with duration.';
    if (m.includes('patient') || m.includes('record')) return '📋 Access patient history from the Patients tab. Ensure vaccination status is current before procedures.';
    if (m.includes('schedule') || m.includes('slot')) return '📆 Manage your slots in Today\'s Schedule. Block buffer times between complex procedures.';
  }
  return `🐾 As a pet care AI, I can help with nutrition, training, health, vaccinations, and emergencies. Ask me anything!`;
};

const QUICK = ['💉 Vaccines', '🍗 Diet tips', '🚨 Emergency', '🦷 Dental'];
const VET_QUICK = ['💊 Dosage', '📋 Patient tips', '🦟 Parasites', '🏥 Triage'];

/* ── Component ───────────────────────────────────────────────────────────── */
const DashboardAIChat = ({ mode = 'owner' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'ai',
      text: mode === 'vet'
        ? "👋 Doctor! I'm your AI assistant for patient queries and clinical tips."
        : "👋 Hi! I'm PetCare AI. I can answer questions about your pet's health and diet. How can I help?",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => { 
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, isOpen]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    const userMsg = { id: Date.now(), from: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'ai', text: PET_AI(q, mode) }]);
      setLoading(false);
    }, 900);
  };

  const reset = () => setMessages([{
    id: 1, from: 'ai',
    text: mode === 'vet' ? "👋 Doctor! I'm your AI assistant. How can I help?"
      : "👋 Hi! I'm PetCare AI. How can I help you today?",
  }]);

  const quick = mode === 'vet' ? VET_QUICK : QUICK;

  return (
    <>
      {/* ── Chat Window Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            style={{
              width: 340, height: 500,
              background: 'linear-gradient(160deg,#1e1b4b 0%,#312e81 40%,#0f766e 100%)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0 relative overflow-hidden bg-white/5 border-b border-white/10">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {[['#f472b6','12%','10%'],['#60a5fa','80%','20%'],['#34d399','50%','60%']].map(([c,x,y],i)=>(
                  <motion.div key={i} className="absolute w-16 h-16 rounded-full blur-2xl"
                    style={{background:c, left:x, top:y}}
                    animate={{scale:[1,1.4,1],opacity:[0.5,1,0.5]}}
                    transition={{duration:3+i,repeat:Infinity,ease:'easeInOut'}} />
                ))}
              </div>

              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-xl relative z-10"
                style={{ background: 'linear-gradient(135deg,#818cf8,#34d399,#f472b6)' }}>
                🤖
              </div>

              <div className="flex-1 relative z-10">
                <p className="font-extrabold text-white text-sm tracking-wide">PetCare AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-emerald-300 text-[10px] uppercase tracking-wider font-bold">Online</p>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                <button onClick={reset} title="Reset Chat"
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Close"
                  className="p-1.5 text-white/60 hover:text-white hover:bg-rose-500/20 rounded-xl transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{ background: 'rgba(15,23,42,0.4)' }}>
              {messages.map(m => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'ai' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#818cf8,#34d399)' }}>🤖</div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    m.from === 'user' ? 'text-white rounded-tr-sm' : 'text-slate-100 rounded-tl-sm'
                  }`}
                  style={m.from === 'user'
                    ? { background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }
                    : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1) border-l-2 border-l-emerald-400' }
                  }>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#818cf8,#34d399)' }}>🤖</div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {[0,1,2].map(i=>(
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, delay: i*0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} className="h-1" />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0 bg-white/5">
              {quick.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="whitespace-nowrap text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/50 transition flex-shrink-0">
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 pb-4 flex-shrink-0 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-emerald-400 focus:bg-white/15 transition" />
                <button onClick={() => send()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }} disabled={loading}>
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Action Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6,#f472b6)', boxShadow: '0 8px 30px rgba(99,102,241,0.5)' }}
          >
            {/* Ambient pulse */}
            <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-20 transition duration-500" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-white/30 border-t-white/80 border-r-white/80" />
            
            <div className="relative z-10 text-3xl drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
              🤖
            </div>
            
            {/* Notification Badge */}
            <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#1e1b4b] shadow-sm transform translate-x-[-10%] translate-y-[10%]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardAIChat;
