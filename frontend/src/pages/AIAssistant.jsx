import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your AI Pet Care Assistant. Ask me anything about diet, basic health tips, or behavior training. Note: In medical emergencies, always consult your Vet directly!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');

    // Simulate AI typing delay
    setTimeout(() => {
      const aiReply = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "I'm a simulated AI integration. In the fully integrated app, I would connect to an LLM endpoint (like Gemini or OpenAI) via the Spring Boot backend to provide contextual pet care advice for your specific question!" 
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-dark flex items-center justify-center">
            <Sparkles className="text-accent w-8 h-8 mr-2" /> AI Health Assistant
          </h1>
          <p className="text-slate-500 mt-1">Instant, intelligent insights for your pet's wellbeing.</p>
        </div>

        {/* Chat Interface */}
        <div className="glass-card flex-grow flex flex-col rounded-2xl border border-slate-200 shadow-xl overflow-hidden h-[600px] bg-white">
          
          {/* Message Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary ml-3' : 'bg-secondary mr-3'}`}>
                    {msg.sender === 'user' ? <User className="text-white w-6 h-6" /> : <Bot className="text-white w-6 h-6" />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about dog diets, cat behaviors, training..." 
                className="w-full pl-6 pr-16 py-4 bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary rounded-xl transition shadow-inner font-medium text-slate-700"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-indigo-600 text-white p-2 px-4 rounded-lg transition shadow flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
