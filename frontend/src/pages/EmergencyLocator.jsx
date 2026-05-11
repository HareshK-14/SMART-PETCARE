import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, AlertTriangle, Navigation, Star, PhoneCall } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EMERGENCY_CLINICS = [
  {
    id: 1,
    name: 'City Pet ER Hospital',
    address: '124 Main Street, Downtown',
    phone: '+91 98765 43210',
    distance: '2.4 km',
    open247: true,
    rating: 4.8,
    lat: 13.0827,
    lng: 80.2707
  },
  {
    id: 2,
    name: 'Apollo Vet Specialty Center',
    address: '45 Anna Salai, Mount Road',
    phone: '+91 87654 32109',
    distance: '4.1 km',
    open247: true,
    rating: 4.6,
    lat: 13.0604,
    lng: 80.2644
  },
  {
    id: 3,
    name: 'PetCare Trauma Clinic',
    address: '89 OMR Express Highway',
    phone: '+91 76543 21098',
    distance: '6.8 km',
    open247: false,
    hours: 'Closes at 11:30 PM',
    rating: 4.5,
    lat: 12.9692,
    lng: 80.2464
  }
];

const EmergencyLocator = () => {
  const [activeClinic, setActiveClinic] = useState(EMERGENCY_CLINICS[0].id);

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-sm border border-rose-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Emergency Vet Locator</h1>
            <p className="text-lg text-slate-600">Find 24/7 veterinary hospitals and trauma centers near your current location immediately.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] mb-8">
            
            {/* Sidebar List */}
            <div className="lg:col-span-1 flex flex-col space-y-4 overflow-y-auto pr-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span className="font-bold text-slate-700">Chennai, Tamil Nadu</span>
                </div>
                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">Change</button>
              </div>

              {EMERGENCY_CLINICS.map(clinic => (
                <div 
                  key={clinic.id} 
                  onClick={() => setActiveClinic(clinic.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    activeClinic === clinic.id 
                      ? 'border-rose-500 bg-white shadow-xl shadow-rose-500/10 scale-[1.02]' 
                      : 'border-slate-100 bg-white/60 hover:bg-white hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{clinic.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                      <Star className="w-3 h-3 text-amber-500 fill-current"/>
                      <span className="text-xs font-bold text-amber-700">{clinic.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-3 flex items-start gap-1.5 leading-snug">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {clinic.address}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{clinic.distance} away</span>
                    {clinic.open247 ? (
                      <span className="text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 24/7 Open
                      </span>
                    ) : (
                      <span className="text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 rounded-md">
                        {clinic.hours}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20">
                      <PhoneCall className="w-4 h-4" /> Call Now
                    </button>
                    <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-xl text-sm transition flex items-center justify-center gap-1.5">
                      <Navigation className="w-4 h-4" /> Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Area */}
            <div className="lg:col-span-2 bg-slate-200 rounded-3xl overflow-hidden shadow-inner border-[6px] border-white relative group">
              {/* Fake Map Implementation For Prototype */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=800&fit=crop')",
                  transform: activeClinic === 1 ? 'scale(1.1) translate(2%, 5%)' : activeClinic === 2 ? 'scale(1.1) translate(-5%, -5%)' : 'scale(1.1) translate(5%, -10%)',
                  opacity: 0.8
                }}
              />
              
              {/* Map UI Overlay layer */}
              <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
              
              {/* Simulated Map Pins */}
              {EMERGENCY_CLINICS.map((clinic, index) => {
                const isActive = activeClinic === clinic.id;
                // Hardcoded relative positions for visual fake map
                const positions = [
                  { top: '40%', left: '50%' },
                  { top: '60%', left: '30%' },
                  { top: '25%', left: '70%' },
                ];
                
                return (
                  <motion.div
                    key={clinic.id}
                    className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
                    style={positions[index]}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      zIndex: isActive ? 40 : 10
                    }}
                    onClick={() => setActiveClinic(clinic.id)}
                  >
                    <div className="relative group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border-2 border-rose-600'}`}>
                        <AlertTriangle className="w-5 h-5"/>
                      </div>
                      <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mx-auto ${isActive ? 'border-t-rose-600' : 'border-t-rose-600'}`}></div>
                      
                      {isActive && (
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-xl w-max border border-slate-100 pointer-events-none z-50">
                          <p className="font-bold text-slate-900 text-sm leading-none">{clinic.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{clinic.distance} • {clinic.phone}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* User Location Pin */}
              <div className="absolute top-[45%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-indigo-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-0 right-0 w-6 h-6 bg-indigo-500 rounded-full opacity-30 animate-ping"></div>
              </div>
            </div>

          </div>

          {/* Quick Pet First Aid Info Card */}
          <div className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <AlertTriangle className="w-64 h-64 -mb-10 -mr-10" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h3 className="text-2xl font-extrabold mb-3">Does your pet need immediate care?</h3>
              <p className="text-rose-100 font-medium text-lg leading-relaxed mb-6">
                If your pet is having difficulty breathing, has ingested a toxin, is bleeding heavily, or cannot walk, proceed to the nearest emergency clinic immediately. Do not wait.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-rose-600 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-rose-50 transition">Call Animal Poison Control</button>
                <button className="bg-rose-800/40 backdrop-blur-md text-white border border-rose-400 font-bold px-6 py-3 rounded-xl hover:bg-rose-800/60 transition">View First Aid Guide</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmergencyLocator;
