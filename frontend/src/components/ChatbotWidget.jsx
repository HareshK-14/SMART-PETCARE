import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! I'm the PetCare AI Assistant! Ask me any questions about health, diet, or training." }
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: response.data.message }]);
    } catch (error) {
       console.error("AI Error", error);
       setMessages(prev => [...prev, { 
           id: Date.now(), sender: 'bot', 
           text: "Sorry, I am currently unable to reach the AI servers. Ensure the backend OpenRouter key is configured." 
       }]);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-accent text-white rounded-full shadow-2xl hover:bg-orange-600 transition-transform ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110'}`}
      >
        <Bot className="w-8 h-8" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">1</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center shadow-md z-10">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Smart AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-sm' 
                      : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                     <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center shadow-sm">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span className="ml-2 text-xs font-medium text-slate-500">AI is thinking...</span>
                     </div>
                  </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..." 
                  disabled={isLoading}
                  className="w-full bg-slate-100 py-3 pl-4 pr-12 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition text-slate-700 font-medium"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="absolute right-2 p-1.5 bg-primary text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
