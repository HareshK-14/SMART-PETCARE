import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, PawPrint, HeartPulse, Calendar, ShoppingBag,
  ShoppingCart, Package, Syringe, FileText, HelpCircle, MessageSquare,
  User, LogOut, Bell, ChevronRight, Plus, Clock, ShieldAlert,
  TrendingUp, Star, Activity, Award, Bone, Navigation, Dna, Mic, Gamepad2, X,
  Stethoscope, ScanLine, Video, MapPin, AlarmClock, Pill,
  Brain, Utensils, AlertCircle, Scissors, Sparkles, Camera, Droplets, Heart
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import DashboardAIChat from '../components/DashboardAIChat';
import NotificationsPanel from '../components/NotificationsPanel';
import HealthTrackerTab from '../components/HealthTrackerTab';
import ActivityTrackerTab from '../components/ActivityTrackerTab';
import MemoriesTab from '../components/MemoriesTab';
import RewardsTab from '../components/RewardsTab';
import PlaydatesTab from '../components/PlaydatesTab';
import SmartCollarTab from '../components/SmartCollarTab';
import DNATab from '../components/DNATab';
import AITranslatorTab from '../components/AITranslatorTab';
import DigitalTwinTab from '../components/DigitalTwinTab';
import WishlistTab from '../components/WishlistTab';
import InsuranceTab from '../components/InsuranceTab';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import EmergencySOSTab from '../components/EmergencySOSTab';
import PetHealthPassportTab from '../components/PetHealthPassportTab';
import CommunityFeedTab from '../components/CommunityFeedTab';
import SubscriptionTab from '../components/SubscriptionTab';
import AIMoodDetectionTab from '../components/AIMoodDetectionTab';
import PetDietPlannerTab from '../components/PetDietPlannerTab';
import LostPetAlertTab from '../components/LostPetAlertTab';
import AIGroomingTab from '../components/AIGroomingTab';
import NearbyServicesTab from '../components/NearbyServicesTab';
import VirtualPetCompanionTab from '../components/VirtualPetCompanionTab';
import PetHoroscopeTab from '../components/PetHoroscopeTab';
import PetChallengesTab from '../components/PetChallengesTab';
import PetLocationDiscoveryTab from '../components/PetLocationDiscoveryTab';
import SmartWeightTab from '../components/SmartWeightTab';
import PetJournalTab from '../components/PetJournalTab';
import PetMemoryGalleryTab from '../components/PetMemoryGalleryTab';
import SmartHydrationTab from '../components/SmartHydrationTab';
import WellnessCoachTab from '../components/WellnessCoachTab';
import Marketplace from './Marketplace';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// ── Sidebar nav config ───────────────────────────────────────────────────────
const MAIN_MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'pets', label: 'Pet Profiles', icon: PawPrint },
  { key: 'ai-scan', label: 'AI Health Scan', icon: ScanLine },
  { key: 'health', label: 'Health Monitoring', icon: HeartPulse },
  { key: 'reminders', label: 'Smart Reminders', icon: AlarmClock },
  { key: 'dna', label: 'DNA & Genetics', icon: Dna },
  { key: 'aitranslator', label: 'AI Translator', icon: Mic },
  { key: 'digitaltwin', label: 'Digital Twin', icon: Gamepad2 },
  { key: 'activity', label: 'Activity & Walks', icon: Activity },
  { key: 'smartcollar', label: 'SmartCollar™', icon: Navigation },
  { key: 'playdates', label: 'Park Buddies', icon: Bone },
  { key: 'memories', label: 'Memory Lane', icon: Star },
  { key: 'rewards', label: 'Paw Points', icon: Award },
  { key: 'appointments', label: 'Appointments', icon: Calendar },
  { key: 'shop', label: 'Shop', icon: ShoppingBag },
  { key: 'wishlist', label: 'Wishlist', icon: HeartPulse },
  { key: 'cart', label: 'Cart', icon: ShoppingCart },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'vaccinations', label: 'Vaccinations', icon: Syringe },
  { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { key: 'insurance', label: 'Pet Insurance', icon: ShieldAlert },
  { key: 'emergency', label: 'Emergency SOS', icon: ShieldAlert },
  { key: 'passport', label: 'Health Passport', icon: FileText },
  { key: 'community', label: 'Community', icon: MessageSquare },
  { key: 'subscription', label: 'Subscriptions', icon: Package },
  { key: 'moodai', label: 'AI Mood Analysis', icon: Brain },
  { key: 'dietplanner', label: 'Diet Planner', icon: Utensils },
  { key: 'lostpet', label: 'Lost Pet Alert', icon: AlertCircle },
  { key: 'grooming', label: 'AI Grooming', icon: Scissors },
  { key: 'services',   label: 'Nearby Services',    icon: MapPin },
  { key: 'companion',  label: 'Virtual Companion',  icon: Star },
  { key: 'horoscope',  label: 'Cosmic Wellness',    icon: Sparkles },
  { key: 'challenges', label: 'Daily Challenges',   icon: Award },
  { key: 'explore',    label: 'Explore Places',     icon: Navigation },
  { key: 'weight',     label: 'Weight Manager',      icon: TrendingUp },
  { key: 'journal',    label: 'Pet Journal',          icon: FileText },
  { key: 'gallery',    label: 'Memory Gallery',       icon: Camera },
  { key: 'hydration',  label: 'Hydration Tracker',    icon: Droplets },
  { key: 'wellness',   label: 'Wellness Coach',       icon: Heart },
];

const ACCOUNT_MENU = [
  { key: 'help', label: 'Get Help', icon: HelpCircle },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'profile', label: 'Profile', icon: User },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, onLogout }) => (
  <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-xl shadow-slate-200/50 flex-shrink-0 z-10">
    {/* Logo */}
    <div className="px-5 py-5 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }}>
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-extrabold text-base leading-none"
            style={{ background: 'linear-gradient(90deg,#6366f1,#14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SmartPetCare
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Owner Portal</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">Main Menu</p>
      {MAIN_MENU.map(({ key, label, icon: Icon, link }) => {
        const isActive = active === key;
        return link ? (
          <Link key={key} to={link}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            style={isActive ? { background: 'linear-gradient(90deg,#6366f1,#14b8a6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' } : {}}>
            <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} style={{ width: 18, height: 18 }} />
            <span className="flex-1">{label}</span>
            {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
          </Link>
        ) : (
          <button key={key} onClick={() => setActive(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            style={isActive ? { background: 'linear-gradient(90deg,#6366f1,#14b8a6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' } : {}}>
            <Icon className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} style={{ width: 18, height: 18 }} />
            <span className="flex-1 text-left">{label}</span>
            {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
          </button>
        );
      })}

      <div className="pt-4 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">Account</p>
      </div>
      {ACCOUNT_MENU.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button key={key} onClick={() => setActive(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            style={isActive ? { background: 'linear-gradient(90deg,#6366f1,#14b8a6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' } : {}}>
            <Icon className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} style={{ width: 18, height: 18 }} />
            <span className="flex-1 text-left">{label}</span>
          </button>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="px-3 pb-5 border-t border-slate-100 pt-3">
      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all group">
        <LogOut style={{ width: 18, height: 18 }} className="flex-shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

// ── Section title component ──────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, label, gradient, badge }) => (
  <h2 className="text-lg font-bold flex items-center mb-4 gap-2.5">
    <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: gradient.replace('text', 'bg').replace('90deg', '135deg') + '22' }}>
      <Icon style={{ width: 16, height: 16, color: gradient.includes('6366f1') ? '#6366f1' : gradient.includes('10b981') ? '#10b981' : gradient.includes('9333ea') ? '#9333ea' : gradient.includes('0ea5e9') ? '#0ea5e9' : '#f43f5e' }} />
    </span>
    <span className="text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>{label}</span>
    {badge && <span className="ml-1 text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100">{badge}</span>}
  </h2>
);

// ── Content panels ───────────────────────────────────────────────────────────
const DashboardHome = ({ setActive }) => {
  const pets = [
    { id: 1, name: 'Luna', species: 'Dog', breed: 'Golden Retriever', age: 3, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop' },
    { id: 2, name: 'Milo', species: 'Cat', breed: 'Siamese', age: 2, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop' },
  ];
  const appt = [{ id: 1, vet: 'Dr. Priya Sharma', pet: 'Luna', date: '2026-04-10', time: '10:30 AM', status: 'CONFIRMED' }];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Pets', value: '2', icon: PawPrint, color: '#6366f1', key: 'pets' },
          { label: 'Appointments', value: '1', icon: Calendar, color: '#14b8a6', key: 'appointments' },
          { label: 'Prescriptions', value: '2', icon: FileText, color: '#9333ea', key: 'prescriptions' },
          { label: 'Health Score', value: '92%', icon: Activity, color: '#10b981', key: 'health' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} onClick={() => setActive(s.key)}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer group hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.color + '18' }}>
              <s.icon style={{ width: 20, height: 20, color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pet Profiles */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <SectionTitle icon={PawPrint} label="My Pets" badge="2 registered"
              gradient="linear-gradient(90deg,#6366f1,#14b8a6)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map(pet => (
                <motion.div whileHover={{ y: -4 }} key={pet.id} onClick={() => setActive('pets')}
                  className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer group hover:border-indigo-200 transition-all shadow-sm">
                  <img src={pet.image} alt={pet.name} className="w-20 h-20 rounded-xl object-cover shadow-md flex-shrink-0" />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">{pet.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{pet.breed} • {pet.age} yrs</p>
                    <span className="mt-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full w-max border border-indigo-100">Health Profile</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }} />
            <SectionTitle icon={TrendingUp} label="Activity & Weight Analytics"
              gradient="linear-gradient(90deg,#14b8a6,#6366f1)" />
            <div className="h-56 w-full">
              <Line options={{ maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom' } } }}
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    { label: 'Luna (Weight kg)', data: [12.5, 12.8, 13.0, 12.9, 13.1, 13.4], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', tension: 0.4, fill: true },
                    { label: 'Milo (Weight kg)', data: [4.2, 4.3, 4.3, 4.4, 4.4, 4.5], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', tension: 0.4, fill: true },
                  ]
                }}
              />
            </div>
          </div>

          {/* Orders + Prescriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border-t-4 border-emerald-500 border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-emerald-200 transition-all" onClick={() => setActive('orders')}>
              <SectionTitle icon={ShoppingBag} label="Recent Orders" gradient="linear-gradient(90deg,#10b981,#059669)" />
              <ul className="space-y-3">
                {[['Premium Royal Canin', '₹3,740'], ['Flea Collar', '₹1,080']].map(([name, price]) => (
                  <li key={name} className="flex justify-between items-center text-sm py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">{name}</span>
                    <span className="text-emerald-600 font-bold">{price}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-3 text-emerald-600 font-semibold text-xs hover:underline">View All Orders →</button>
            </div>

            <div className="bg-white rounded-2xl border-t-4 border-purple-500 border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-purple-200 transition-all font-sans" onClick={() => setActive('prescriptions')}>
              <SectionTitle icon={FileText} label="Recent Prescriptions" gradient="linear-gradient(90deg,#9333ea,#6366f1)" />
              <div className="space-y-2">
                {(JSON.parse(localStorage.getItem('allPrescriptions') || '[]')).slice(0, 2).map((rx, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{rx.medication}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">FOR {rx.patient}</p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">NEW</span>
                  </div>
                ))}
                {(JSON.parse(localStorage.getItem('allPrescriptions') || '[]')).length === 0 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-slate-400 font-medium italic">No prescriptions found.</p>
                  </div>
                )}
              </div>
              <button className="mt-3 text-purple-600 font-bold text-[10px] uppercase tracking-wider hover:underline">Manage All Rx →</button>
            </div>
          </div>
        </div>

        {/* Right sidebar col */}
        <div className="space-y-4">
          {/* Appointments */}
          <div className="bg-white rounded-2xl border-t-4 border-sky-400 border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-sky-200 transition-all" onClick={() => setActive('appointments')}>
            <SectionTitle icon={Clock} label="Appointments" gradient="linear-gradient(90deg,#0ea5e9,#6366f1)" />
            {appt.map(a => (
              <div key={a.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 relative group-hover:bg-white transition-colors">
                <span className="absolute top-3 right-3 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{a.status}</span>
                <p className="font-bold text-slate-900 text-sm">{a.vet}</p>
                <p className="text-slate-500 text-xs mb-1.5">For {a.pet}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  <Calendar style={{ width: 13, height: 13 }} /> {a.date}
                  <span className="mx-1">•</span>
                  <Clock style={{ width: 13, height: 13 }} /> {a.time}
                </div>
              </div>
            ))}
            <button onClick={() => setActive('appointments')} className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white rounded-xl transition hover:shadow-lg"
              style={{ background: 'linear-gradient(90deg,#6366f1,#14b8a6)' }}>
              <Plus style={{ width: 14, height: 14 }} /> Book Appointment
            </button>
          </div>

          {/* Action needed */}
          <div className="bg-white rounded-2xl border-t-4 border-rose-500 border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-rose-200 transition-all" onClick={() => setActive('appointments')}>
            <SectionTitle icon={ShieldAlert} label="Action Needed" gradient="linear-gradient(90deg,#f43f5e,#f97316)" />
            <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl border border-rose-100 flex items-start gap-3">
              <Syringe style={{ width: 18, height: 18 }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Luna's Rabies Vaccine Overdue</p>
                <p className="text-xs mt-0.5">Please schedule an appointment with your vet immediately.</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            style={{ background: 'linear-gradient(135deg,#6366f1 0%,#14b8a6 100%)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-300 fill-current" />
              <p className="text-white font-bold text-sm">Health Score</p>
            </div>
            <p className="text-4xl font-black text-white mb-1">92%</p>
            <p className="text-white/70 text-xs">Both pets are in great health! Keep it up 🐾</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Health Score Ring (SVG circular progress) ─────────────────────────────────
const HealthRing = ({ score = 92, size = 56, color = '#6366f1' }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fontSize="11" fontWeight="800" fill={color}>{score}%</text>
    </svg>
  );
};

// ── AI Disease Scan Tab ────────────────────────────────────────────────────────
const AIDiseaseScanTab = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImgSrc(ev.target.result);
    reader.readAsDataURL(file);
    setResults(null);
  };

  const runScan = () => {
    if (!imgSrc) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResults({
        overall: 'Low Risk',
        overallColor: '#10b981',
        checks: [
          { label: 'Skin Infection', score: 12, color: '#10b981', icon: '🔬', verdict: 'Clear' },
          { label: 'Eye Condition', score: 8, color: '#10b981', icon: '👁️', verdict: 'Healthy' },
          { label: 'Coat & Fur Quality', score: 74, color: '#f59e0b', icon: '✨', verdict: 'Monitor' },
          { label: 'Visible Lesions', score: 5, color: '#10b981', icon: '🩹', verdict: 'Clear' },
        ],
        symptoms: ['Slight coat dullness detected', 'No visible redness or swelling', 'Eyes appear clear'],
        recommendation: 'Your pet looks healthy! Consider a coat supplement. Schedule a routine checkup within 3 months.',
      });
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><ScanLine className="w-6 h-6"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">AI Health Scan</h2>
          <p className="text-sm text-slate-500">Upload a clear photo of your pet to detect visible health issues.</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-8 text-center hover:border-indigo-400 transition-all">
        {imgSrc ? (
          <div className="flex flex-col items-center gap-4">
            <img src={imgSrc} alt="Pet" className="w-48 h-48 object-cover rounded-2xl shadow-lg" />
            <div className="flex gap-3">
              <label className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition">
                Change Photo<input type="file" accept="image/*" className="hidden" onChange={handleFile}/>
              </label>
              <button onClick={runScan} disabled={scanning}
                className="px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
                style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
                {scanning ? '🔬 Scanning...' : '🚀 Run AI Scan'}
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
              <ScanLine className="w-10 h-10 text-white"/>
            </div>
            <div>
              <p className="font-bold text-slate-700">Click to upload pet photo</p>
              <p className="text-sm text-slate-400 mt-1">JPG, PNG or WEBP • Max 10MB</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          </label>
        )}
      </div>

      {/* Scanning Animation */}
      {scanning && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4">
          <div className="text-4xl animate-pulse">🔬</div>
          <p className="font-bold text-slate-700">AI is analyzing your pet's health...</p>
          <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full animate-pulse" style={{width:'70%'}}/></div>
          <p className="text-xs text-slate-400">Checking skin, eyes, coat, and visible symptoms</p>
        </div>
      )}

      {/* Results */}
      {results && !scanning && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="text-3xl">🐾</div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Overall Assessment</p>
                <p className="text-2xl font-black" style={{color: results.overallColor}}>{results.overall}</p>
              </div>
            </div>
            <div className="space-y-3">
              {results.checks.map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-lg w-7">{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-700">{c.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background: c.color + '20', color: c.color}}>{c.verdict}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 rounded-full transition-all duration-700" style={{width:`${c.score}%`, background: c.color}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detected Symptoms</p>
              <ul className="space-y-2">
                {results.symptoms.map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm text-slate-700"><span className="text-green-500">✓</span>{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5" style={{background:'linear-gradient(135deg,#eef2ff,#f0fdfa)'}}>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">💡 AI Recommendation</p>
              <p className="text-sm text-slate-700 leading-relaxed">{results.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Pet Profiles Tab ─────────────────────────────────────────────────────────
const PetProfilesTab = () => {
  const defaultPets = [
    { id:1, name:'Luna', species:'Dog', breed:'Golden Retriever', age:3, weight:'28 kg', gender:'Female', image:'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop', nextVet:'2026-04-10', healthScore: 92, vaccStatus: 'Up to Date', lastCheckup: '2026-03-10' },
    { id:2, name:'Milo', species:'Cat', breed:'Siamese', age:2, weight:'4.5 kg', gender:'Male', image:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop', nextVet:'2026-08-15', healthScore: 78, vaccStatus: 'Overdue', lastCheckup: '2026-01-22' },
  ];
  const [pets, setPets] = useState(()=>JSON.parse(localStorage.getItem('ownerPets')||'null')||defaultPets);
  const [modal, setModal] = useState(null);
  const [logPet, setLogPet] = useState(null);
  const [form, setForm] = useState({name:'',species:'Dog',breed:'',age:'',weight:'',gender:'Male',image:'',nextVet:''});
  const [logText, setLogText] = useState('');

  const savePets = p=>{setPets(p);localStorage.setItem('ownerPets',JSON.stringify(p));};
  const openAdd = ()=>{setForm({name:'',species:'Dog',breed:'',age:'',weight:'',gender:'Male',image:'',nextVet:''});setModal('add');};
  const openEdit = p=>{setForm({...p});setModal(p);};
  const submit = ()=>{
    if(!form.name?.trim()) return;
    if(modal==='add') savePets([...pets,{...form,id:Date.now()}]);
    else savePets(pets.map(x=>x.id===modal.id?{...modal,...form}:x));
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-extrabold text-slate-800">My Pets</h2><p className="text-sm text-slate-500">Manage health profiles for your furry friends.</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
          <Plus className="w-5 h-5"/> Add New Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pets.map(pet=>(
          <motion.div key={pet.id} whileHover={{y:-5}} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img src={pet.image||`https://ui-avatars.com/api/?name=${encodeURIComponent(pet.name)}&size=400&background=6366f1&color=fff`}
                alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e=>{e.target.onerror=null;e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(pet.name)}&size=400&background=6366f1&color=fff`;}}/>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-slate-700 shadow-sm">{pet.species}</div>
              {/* Vaccination badge */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm ${pet.vaccStatus === 'Overdue' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                💉 {pet.vaccStatus || 'Unknown'}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div><h3 className="text-xl font-extrabold text-slate-900">{pet.name}</h3><p className="text-slate-500 text-sm">{pet.breed}</p></div>
                <HealthRing score={pet.healthScore || 85} size={52} color={pet.healthScore >= 80 ? '#10b981' : pet.healthScore >= 60 ? '#f59e0b' : '#ef4444'} />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100"><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Age</p><p className="font-bold text-slate-700">{pet.age} Yrs</p></div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100"><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Weight</p><p className="font-bold text-slate-700">{pet.weight}</p></div>
              </div>
              <div className="py-2 px-3 bg-slate-50 text-slate-600 rounded-xl flex items-center gap-2 text-xs font-bold border border-slate-100 mb-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0"/> Last Checkup: {pet.lastCheckup || 'Not set'}
              </div>
              <div className="py-2 px-3 bg-indigo-50 text-indigo-700 rounded-xl flex items-center gap-2 text-xs font-bold border border-indigo-100/50 mb-3">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0"/> Next Vet: {pet.nextVet||'Not set'}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button onClick={()=>openEdit(pet)} className="py-2.5 bg-white border-2 border-slate-100 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 font-bold rounded-xl text-sm transition">Edit Details</button>
                <button onClick={()=>{setLogText('');setLogPet(pet);}} className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl text-sm transition">Health Log</button>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div whileHover={{y:-5}} onClick={openAdd} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition min-h-[280px]">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}><Plus className="w-7 h-7 text-white"/></div>
          <p className="font-bold text-slate-500 text-sm">Add New Pet</p>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setModal(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
                <h3 className="text-lg font-extrabold text-slate-900">{modal==='add'?'Add New Pet':'Edit Pet Details'}</h3>
                <button onClick={()=>setModal(null)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 transition shadow-sm"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[['Pet Name *','name','text'],['Breed','breed','text'],['Age (years)','age','number'],['Weight (e.g. 28 kg)','weight','text']].map(([l,k,t])=>(
                    <div key={k}>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</label>
                      <input type={t} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}
                        className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Species</label>
                    <select value={form.species||'Dog'} onChange={e=>setForm({...form,species:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      {['Dog','Cat','Bird','Rabbit','Fish','Other'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                    <select value={form.gender||'Male'} onChange={e=>setForm({...form,gender:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <option>Male</option><option>Female</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Next Vet Visit Date</label>
                    <input type="date" value={form.nextVet||''} onChange={e=>setForm({...form,nextVet:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Photo URL (optional)</label>
                    <input type="url" value={form.image||''} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..." className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={submit} className="flex-1 py-3 text-white font-bold rounded-xl shadow-lg" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>{modal==='add'?'Add Pet':'Save Changes'}</button>
                  <button onClick={()=>setModal(null)} className="px-5 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Health Log Modal */}
      <AnimatePresence>
        {logPet&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLogPet(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-extrabold text-slate-900">Health Log — {logPet.name}</h3>
                <button onClick={()=>setLogPet(null)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 transition shadow-sm"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {(JSON.parse(localStorage.getItem(`healthLog_${logPet.id}`)||'[]')).map((e,i)=>(
                    <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-sm"><p className="font-semibold text-slate-800">{e.note}</p><p className="text-xs text-slate-400 mt-0.5">{e.date}</p></div>
                  ))}
                  {JSON.parse(localStorage.getItem(`healthLog_${logPet.id}`)||'[]').length===0&&<p className="text-slate-400 text-sm text-center py-4">No health notes yet.</p>}
                </div>
                <textarea value={logText} onChange={e=>setLogText(e.target.value)} rows={3} placeholder="Add health note..." className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"/>
                <button onClick={()=>{
                  if(!logText.trim()) return;
                  const key=`healthLog_${logPet.id}`;
                  const prev=JSON.parse(localStorage.getItem(key)||'[]');
                  localStorage.setItem(key,JSON.stringify([{note:logText,date:new Date().toLocaleDateString()},...prev]));
                  setLogText(''); setLogPet({...logPet});
                }} className="w-full py-2.5 text-white font-bold rounded-xl" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Add Note</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// (old fragment removed)

// ── Health Monitoring Tab ─────────────────────────────────────────────────────
const HealthTab = () => {
  const metrics = [
    { date: '2026-03-20', pet: 'Luna', weight: 13.4, heartRate: 72, temp: 38.5, notes: 'Post walk check' },
    { date: '2026-03-10', pet: 'Milo', weight: 4.5, heartRate: 120, temp: 38.2, notes: 'Monthly check' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Luna Weight','13.4 kg','#6366f1'],['Milo Weight','4.5 kg','#f59e0b'],['Avg Heart Rate','96 bpm','#ef4444'],['Avg Temp','38.4°C','#10b981']].map(([l,v,c])=>(
          <div key={l} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">{l}</p>
            <p className="text-2xl font-extrabold" style={{color:c}}>{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">Health Metrics Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Pet</th><th className="pb-3 pr-4">Weight</th><th className="pb-3 pr-4">Heart Rate</th><th className="pb-3 pr-4">Temp</th><th className="pb-3">Notes</th>
            </tr></thead>
            <tbody>{metrics.map((m,i)=>(
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 pr-4 text-slate-500">{m.date}</td>
                <td className="py-3 pr-4 font-semibold text-slate-800">{m.pet}</td>
                <td className="py-3 pr-4">{m.weight} kg</td>
                <td className="py-3 pr-4">{m.heartRate} bpm</td>
                <td className="py-3 pr-4">{m.temp}°C</td>
                <td className="py-3 text-slate-500">{m.notes}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Appointments Tab ──────────────────────────────────────────────────────────
const VETS_LIST = [
  { id:1, name:'Dr. Priya Sharma', specialty:'General & Vaccinations', rate:600, available:true, slots:['10:00 AM','11:00 AM','2:00 PM','4:00 PM'], avatar:'🩺' },
  { id:2, name:'Dr. Ramesh Nair', specialty:'Surgery & Internal Medicine', rate:800, available:true, slots:['9:00 AM','12:00 PM','3:00 PM','5:00 PM'], avatar:'⚕️' },
  { id:3, name:'Dr. Sneha Agarwal', specialty:'Dermatology & Nutrition', rate:550, available:false, slots:[], avatar:'🌿' },
  { id:4, name:'Dr. Karthik Nair', specialty:'Orthopedics & Rehab', rate:750, available:true, slots:['10:30 AM','1:30 PM','3:30 PM'], avatar:'🦴' },
];

const AppointmentsTab = () => {
  const [appts, setAppts] = useState(()=>JSON.parse(localStorage.getItem('ownerAppts')||'null')||[
    { id:1, vet:'Dr. Priya Sharma', pet:'Luna', date:'2026-04-10', time:'10:30 AM', status:'CONFIRMED', reason:'Annual checkup', rate:600 },
    { id:2, vet:'Dr. Ramesh Nair', pet:'Milo', date:'2026-04-20', time:'2:00 PM', status:'PENDING', reason:'Vaccination', rate:800 },
  ]);
  const [showBook, setShowBook] = useState(false);
  const [step, setStep] = useState(1);
  const [selVet, setSelVet] = useState(null);
  const [form, setForm] = useState({pet:'',date:'',time:'',reason:''});
  const [done, setDone] = useState(false);
  const pets = JSON.parse(localStorage.getItem('ownerPets')||'null')||[{name:'Luna'},{name:'Milo'}];
  const sc = {CONFIRMED:'bg-green-100 text-green-700',PENDING:'bg-yellow-100 text-yellow-700',CANCELLED:'bg-red-100 text-red-700',REJECTED:'bg-red-100 text-red-700'};

  const saveAppts = a=>{setAppts(a);localStorage.setItem('ownerAppts',JSON.stringify(a));};
  const cancel = id=>saveAppts(appts.map(a=>a.id===id?{...a,status:'CANCELLED'}:a));
  const submit = ()=>{
    if(!form.pet||!form.date||!form.time) return;
    const newA={id:Date.now(),vet:selVet.name,pet:form.pet,date:form.date,time:form.time,reason:form.reason||'General checkup',status:'PENDING',rate:selVet.rate};
    saveAppts([...appts,newA]);
    setDone(true); setTimeout(()=>{setShowBook(false);setDone(false);setStep(1);setSelVet(null);setForm({pet:'',date:'',time:'',reason:''});},2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={()=>{setShowBook(true);setStep(1);setSelVet(null);}} className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl shadow-lg text-sm" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
          <Plus className="w-4 h-4"/>Book Appointment
        </button>
      </div>

      {appts.length===0&&<div className="text-center py-16 text-slate-400">No appointments yet. Book your first!</div>}
      {appts.map(a=>(
        <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-extrabold text-slate-900">{a.vet}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc[a.status]||'bg-slate-100 text-slate-600'}`}>{a.status}</span>
            </div>
            <p className="text-sm text-slate-500">For <strong>{a.pet}</strong> • {a.reason}</p>
            {a.rate&&<p className="text-xs text-emerald-600 font-bold mt-0.5">Consultation fee: ₹{a.rate}</p>}
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-indigo-600">
            <span>📅 {a.date}</span><span>🕐 {a.time}</span>
          </div>
          <div className="flex items-center gap-2">
            {a.status==='CONFIRMED' && (
              <button onClick={() => window.open('/telehealth','_blank')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow transition hover:-translate-y-0.5"
                style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
                <Video className="w-4 h-4"/> Join Call
              </button>
            )}
            {a.status==='PENDING'&&<button onClick={()=>cancel(a.id)} className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-xl text-sm hover:bg-rose-100 transition">Cancel</button>}
          </div>
        </div>
      ))}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBook&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowBook(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh]">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
                <div><h3 className="text-lg font-extrabold text-slate-900">Book Appointment</h3><p className="text-xs text-slate-400">Step {step} of 2</p></div>
                <button onClick={()=>setShowBook(false)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 transition shadow-sm"><X className="w-5 h-5"/></button>
              </div>

              {done?(
                <div className="p-10 flex flex-col items-center gap-4">
                  <div className="text-5xl">✅</div>
                  <p className="font-extrabold text-slate-800 text-xl">Appointment Requested!</p>
                  <p className="text-slate-500 text-sm text-center">Your appointment is pending vet approval. You will be notified once confirmed.</p>
                </div>
              ):step===1?(
                <div className="p-6 overflow-y-auto space-y-3">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Select a Veterinarian</p>
                  {VETS_LIST.map(v=>(
                    <button key={v.id} onClick={()=>{if(v.available){setSelVet(v);setStep(2);}}} disabled={!v.available}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition ${selVet?.id===v.id?'border-indigo-500 bg-indigo-50':v.available?'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30':'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{v.avatar}</span>
                        <div className="flex-1">
                          <p className="font-extrabold text-slate-900 text-sm">{v.name}</p>
                          <p className="text-xs text-slate-500">{v.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-emerald-600">₹{v.rate}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.available?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{v.available?'Available':'Unavailable'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ):(
                <div className="p-6 overflow-y-auto space-y-4">
                  <div className="flex items-center gap-3 mb-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <span className="text-xl">{selVet.avatar}</span>
                    <div><p className="font-bold text-slate-900 text-sm">{selVet.name}</p><p className="text-xs text-slate-500">Consultation ₹{selVet.rate}</p></div>
                    <button onClick={()=>setStep(1)} className="ml-auto text-xs text-indigo-500 font-bold hover:underline">Change</button>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Pet</label>
                    <select value={form.pet} onChange={e=>setForm({...form,pet:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="">-- Choose pet --</option>
                      {pets.map(p=><option key={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date</label>
                    <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e=>setForm({...form,date:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Available Time Slots</label>
                    <div className="mt-2 flex flex-wrap gap-2">{selVet.slots.map(s=>(
                      <button key={s} onClick={()=>setForm({...form,time:s})} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition ${form.time===s?'border-indigo-500 bg-indigo-50 text-indigo-700':'border-slate-200 hover:border-indigo-300 text-slate-600'}`}>{s}</button>
                    ))}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reason (optional)</label>
                    <input value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="e.g. Vaccination, Checkup..." className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                  </div>
                  <button onClick={submit} disabled={!form.pet||!form.date||!form.time} className="w-full py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Request Appointment</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GPS Vet Finder */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-rose-500"/>
          <div>
            <h3 className="font-extrabold text-slate-800">Nearby Vet Clinics</h3>
            <p className="text-xs text-slate-400">Find emergency and regular vet clinics near you</p>
          </div>
        </div>
        <div className="relative">
          <iframe
            title="Nearby Vets"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.2,12.9,80.3,13.0&layer=mapnik"
            className="w-full h-64 border-0"
            allowFullScreen />
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name:'PawCare Clinic', dist:'0.8 km', open:'Open', color:'#10b981', emergency: false },
            { name:'VetFirst Emergency', dist:'1.2 km', open:'24/7', color:'#ef4444', emergency: true },
            { name:'Animal Wellness Center', dist:'2.0 km', open:'Open', color:'#6366f1', emergency: false },
          ].map(v => (
            <div key={v.name} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: v.color + '20'}}>
                {v.emergency ? '🚨' : '🏥'}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                <p className="text-xs text-slate-400">{v.dist} away</p>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 inline-block" style={{background: v.color + '20', color: v.color}}>{v.open}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Smart Reminders Tab ───────────────────────────────────────────────────────
const SmartRemindersTab = () => {
  const DEFAULT_REMINDERS = [
    { id:1, type:'Vaccination', pet:'Luna', msg:"Luna's Rabies booster is due", date:'2026-05-20', icon:'💉', color:'#ef4444', done:false },
    { id:2, type:'Appointment', pet:'Milo', msg:"Milo's dental checkup upcoming", date:'2026-05-25', icon:'🩺', color:'#6366f1', done:false },
    { id:3, type:'Medicine', pet:'Luna', msg:'Heartgard monthly dose due', date:'2026-05-15', icon:'💊', color:'#f59e0b', done:false },
    { id:4, type:'Food', pet:'Both', msg:'Switch to senior formula next week', date:'2026-05-18', icon:'🍽️', color:'#10b981', done:false },
  ];
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem('petReminders')||'null') || DEFAULT_REMINDERS);
  const [form, setForm] = useState({type:'Vaccination',pet:'',msg:'',date:''});
  const [adding, setAdding] = useState(false);

  const save = r => { setReminders(r); localStorage.setItem('petReminders', JSON.stringify(r)); };
  const toggle = id => save(reminders.map(r => r.id===id ? {...r,done:!r.done} : r));
  const remove = id => save(reminders.filter(r => r.id!==id));
  const addReminder = () => {
    if(!form.pet.trim()||!form.msg.trim()||!form.date) return;
    const icons = {Vaccination:'💉', Appointment:'🩺', Medicine:'💊', Food:'🍽️'};
    const colors = {Vaccination:'#ef4444', Appointment:'#6366f1', Medicine:'#f59e0b', Food:'#10b981'};
    save([...reminders, {...form, id:Date.now(), icon:icons[form.type], color:colors[form.type], done:false}]);
    setForm({type:'Vaccination',pet:'',msg:'',date:''}); setAdding(false);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><AlarmClock className="w-6 h-6"/></div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Smart Reminders</h2>
            <p className="text-sm text-slate-500">Stay on top of your pet's care schedule.</p>
          </div>
        </div>
        <button onClick={()=>setAdding(v=>!v)}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl shadow-md transition hover:-translate-y-0.5"
          style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
          <Plus className="w-4 h-4"/> Add Reminder
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 space-y-3">
          <p className="font-bold text-slate-700 text-sm">New Reminder</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
                {['Vaccination','Appointment','Medicine','Food'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Pet Name</label>
              <input value={form.pet} onChange={e=>setForm({...form,pet:e.target.value})} placeholder="e.g. Luna" className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"/>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Reminder Message</label>
              <input value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="e.g. Luna's annual vaccine due" className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Due Date</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"/>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={addReminder} className="flex-1 py-2.5 text-white font-bold rounded-xl shadow" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Save Reminder</button>
            <button onClick={()=>setAdding(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">Cancel</button>
          </div>
        </div>
      )}

      {reminders.length === 0 && <div className="text-center py-16 text-slate-400"><AlarmClock className="w-12 h-12 mx-auto mb-3 text-slate-200"/><p className="font-bold">No reminders set. Add one to stay on track!</p></div>}

      <AnimatePresence>
        {reminders.map(r => (
          <motion.div key={r.id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-50}}
            className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 transition-all ${r.done ? 'opacity-50 border-slate-100' : 'border-slate-100'}`}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background: r.color + '18'}}>{r.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-extrabold uppercase tracking-widest" style={{color: r.color}}>{r.type}</span>
                <span className="text-xs text-slate-400">• {r.pet}</span>
              </div>
              <p className={`font-bold text-slate-800 text-sm ${r.done ? 'line-through text-slate-400' : ''}`}>{r.msg}</p>
              <p className="text-xs text-slate-400 mt-1">📅 Due: {r.date}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>toggle(r.id)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition text-white text-sm ${r.done ? 'bg-slate-200 text-slate-400' : 'bg-emerald-500 hover:bg-emerald-600'}`}>{r.done ? '↩' : '✓'}</button>
              <button onClick={()=>remove(r.id)} className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center text-sm transition">✕</button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Cart Tab ──────────────────────────────────────────────────────────────────
const PRODUCT_IMAGES = {
  'Royal Canin Dog Food 3kg': 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=120&h=120&fit=crop',
  'Cat Flea Collar': 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=120&h=120&fit=crop',
};
const CartTab = ({ onCheckoutDone }) => {
  const [items, setItems] = useState(()=>JSON.parse(localStorage.getItem('cartItems')||'null')||[
    { id:1, name:'Royal Canin Dog Food 3kg', price:1870, qty:2, image:'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=120&h=120&fit=crop' },
    { id:2, name:'Cat Flea Collar', price:540, qty:1, image:'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=120&h=120&fit=crop' },
  ]);
  const [checkout, setCheckout] = useState(false);
  const [coForm, setCoForm] = useState({address:'',payment:'COD'});
  const [placed, setPlaced] = useState(false);
  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = total>2000?0:80;
  const tax = Math.round(total*0.05);
  const saveItems = it=>{setItems(it);localStorage.setItem('cartItems',JSON.stringify(it));};

  const placeOrder = ()=>{
    if(!coForm.address.trim()) return;
    const id='ORD-'+Math.floor(1000+Math.random()*9000);
    const prev=JSON.parse(localStorage.getItem('ownerOrders')||'[]');
    const newOrder={id,date:new Date().toLocaleDateString('en-CA'),items:items.map(i=>`${i.name} × ${i.qty}`).join(', '),total:total+shipping+tax,status:'PLACED',shipping:`₹${shipping}`,tax:`₹${tax}`,tracking:'Pending',orderedItems:[...items]};
    localStorage.setItem('ownerOrders',JSON.stringify([newOrder,...prev]));
    saveItems([]);
    setPlaced(true);
    setTimeout(()=>{setCheckout(false);setPlaced(false);if(onCheckoutDone) onCheckoutDone();},2000);
  };

  return (
    <div className="space-y-4">
      {items.length===0?<div className="text-center py-20 text-slate-400"><p className="text-4xl mb-3">🛒</p><p className="font-bold">Your cart is empty.</p></div>:
      <>
        {items.map(item=>(
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
            <img src={item.image||PRODUCT_IMAGES[item.name]||'https://placehold.co/80x80/e2e8f0/6366f1?text=🛒'}
              alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={e=>{e.target.onerror=null;e.target.src='https://placehold.co/80x80/e2e8f0/6366f1?text=🛒';}}/>
            <div className="flex-1">
              <p className="font-bold text-slate-800">{item.name}</p>
              <p className="text-indigo-600 font-extrabold">₹{item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>saveItems(items.map(i=>i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} className="w-8 h-8 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200">-</button>
              <span className="font-bold w-6 text-center">{item.qty}</span>
              <button onClick={()=>saveItems(items.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i))} className="w-8 h-8 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200">+</button>
            </div>
            <p className="font-extrabold text-slate-800 w-20 text-right">₹{(item.price*item.qty).toLocaleString()}</p>
            <button onClick={()=>saveItems(items.filter(i=>i.id!==item.id))} className="text-rose-400 hover:text-rose-600 ml-2">✕</button>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="space-y-2 mb-4 text-sm text-slate-500">
            <div className="flex justify-between"><p>Subtotal</p><p>₹{total.toLocaleString()}</p></div>
            <div className="flex justify-between"><p>Shipping{total>2000?' (Free)':''}</p><p>₹{shipping}</p></div>
            <div className="flex justify-between"><p>GST (5%)</p><p>₹{tax}</p></div>
            <div className="flex justify-between font-extrabold text-slate-900 text-base border-t border-slate-100 pt-2 mt-2">
              <p>Total</p><p>₹{(total+shipping+tax).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={()=>setCheckout(true)} className="w-full py-3 text-white font-bold rounded-xl shadow-lg text-sm" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Proceed to Checkout</button>
        </div>
      </>
      }

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkout&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{if(!placed)setCheckout(false);}} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-extrabold text-slate-900">Checkout</h3>
                {!placed&&<button onClick={()=>setCheckout(false)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 transition shadow-sm"><X className="w-5 h-5"/></button>}
              </div>
              {placed?(
                <div className="p-10 flex flex-col items-center gap-4">
                  <div className="text-5xl">🎉</div>
                  <p className="font-extrabold text-slate-800 text-xl">Order Placed!</p>
                  <p className="text-slate-500 text-sm text-center">Check the Orders tab to track your order.</p>
                </div>
              ):(
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                    {items.map(i=>(<div key={i.id} className="flex justify-between"><p className="text-slate-600">{i.name} × {i.qty}</p><p className="font-bold">₹{(i.price*i.qty).toLocaleString()}</p></div>))}
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900">
                      <p>Total (incl. tax & shipping)</p><p>₹{(total+shipping+tax).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Delivery Address *</label>
                    <textarea value={coForm.address} onChange={e=>setCoForm({...coForm,address:e.target.value})} rows={3} placeholder="Enter your full delivery address..." className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Payment Method</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {['COD','Card'].map(m=>(
                        <button key={m} onClick={()=>setCoForm({...coForm,payment:m})} className={`py-2.5 rounded-xl font-bold text-sm border-2 transition ${coForm.payment===m?'border-indigo-500 bg-indigo-50 text-indigo-700':'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{m==='COD'?'💵 Cash on Delivery':'💳 Pay by Card'}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={placeOrder} disabled={!coForm.address.trim()} className="w-full py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Place Order ₹{(total+shipping+tax).toLocaleString()}</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Orders Tab ────────────────────────────────────────────────────────────────
const DEFAULT_ORDERS = [
  { id:'ORD-2841', date:'2026-03-15', items:'Royal Canin × 2, Flea Collar × 1', total:4280, status:'DELIVERED', shipping:'₹150', tax:'₹380', tracking:'JD-99382181' },
  { id:'ORD-2799', date:'2026-03-02', items:'Dental Chews × 3', total:1290, status:'SHIPPED', shipping:'₹80', tax:'₹110', tracking:'JD-99381002' },
  { id:'ORD-2755', date:'2026-02-18', items:'Shampoo × 1', total:450, status:'DELIVERED', shipping:'₹50', tax:'₹40', tracking:'JD-99370001' },
];
const OrdersTab = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const lsOrders = JSON.parse(localStorage.getItem('ownerOrders')||'[]');
  const orders = [...lsOrders, ...DEFAULT_ORDERS.filter(d=>!lsOrders.find(l=>l.id===d.id))];
  const sc = { DELIVERED:'bg-green-100 text-green-700', SHIPPED:'bg-blue-100 text-blue-700', PLACED:'bg-amber-100 text-amber-700', CANCELLED:'bg-red-100 text-red-700' };

  return (
    <div className="space-y-4">
      {orders.map(o=>(
        <div key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-extrabold text-slate-900">{o.id}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc[o.status]}`}>{o.status}</span>
            </div>
            <p className="text-sm text-slate-500">{o.items}</p>
            <p className="text-xs text-slate-400 mt-0.5">{o.date}</p>
          </div>
          <p className="font-extrabold text-indigo-600 text-lg">₹{o.total.toLocaleString()}</p>
          <button onClick={() => setSelectedOrder(o)} className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-100 transition">View Details</button>
        </div>
      ))}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b-0 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-t-3xl">
                <div>
                  <h3 className="text-lg font-extrabold text-white drop-shadow-sm">Order Details</h3>
                  <p className="text-sm text-indigo-100 font-medium tracking-wide">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                    <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${sc[selectedOrder.status]}`}>{selectedOrder.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Order Date</p>
                    <p className="text-sm font-bold text-slate-800">{selectedOrder.date}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items.split(', ').map((item, idx) => {
                      const [name, qty] = item.split(' × ');
                      return (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <p className="font-semibold text-slate-700">{name}</p>
                          <p className="text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-lg">x{qty}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500"><p>Subtotal</p><p>₹{(selectedOrder.total - parseInt(selectedOrder.shipping.replace('₹','')) - parseInt(selectedOrder.tax.replace('₹',''))).toLocaleString()}</p></div>
                  <div className="flex justify-between text-sm text-slate-500"><p>Shipping</p><p>{selectedOrder.shipping}</p></div>
                  <div className="flex justify-between text-sm text-slate-500"><p>Tax</p><p>{selectedOrder.tax}</p></div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <p className="font-bold text-slate-700">Total Amount</p>
                    <p className="text-2xl font-extrabold text-indigo-600">₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                <OrderTrackingTimeline status={selectedOrder.status} trackingId={selectedOrder.tracking} date={selectedOrder.date} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Vaccinations Tab ──────────────────────────────────────────────────────────
const VaccinationsTab = () => {
  const vax = [
    { pet:'Luna', vaccine:'Rabies', date:'2025-04-01', nextDue:'2026-04-01', status:'OVERDUE' },
    { pet:'Luna', vaccine:'DHPP', date:'2025-06-15', nextDue:'2026-06-15', status:'UPCOMING' },
    { pet:'Milo', vaccine:'FVRCP', date:'2025-08-10', nextDue:'2026-08-10', status:'OK' },
  ];
  const sc = { OVERDUE:'bg-rose-100 text-rose-700', UPCOMING:'bg-yellow-100 text-yellow-700', OK:'bg-green-100 text-green-700' };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-extrabold text-slate-800 mb-4">Vaccination Records</h3>
      <div className="space-y-3">
        {vax.map((v,i)=>(
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-slate-900">{v.vaccine}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc[v.status]}`}>{v.status}</span>
              </div>
              <p className="text-sm text-slate-500">For <strong>{v.pet}</strong></p>
            </div>
            <div className="text-sm text-slate-500 space-y-0.5">
              <p>Last: {v.date}</p>
              <p>Next due: <strong className="text-slate-800">{v.nextDue}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Prescriptions Tab ─────────────────────────────────────────────────────────
const PrescriptionsTab = ({ setActive }) => {
  const [prescriptions, setPrescriptions] = useState(() => {
    const all = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
    const demo = [
      { id: 1, patient: 'Luna', medicine: 'Heartgard Plus', dosage: '1 chew/month', duration: 6, refills: 2, expires: '2026-08-01', vet: 'Dr. Priya Sharma' },
      { id: 2, patient: 'Milo', medicine: 'Revolution (Selamectin)', dosage: '1 tube/month', duration: 3, refills: 1, expires: '2026-06-15', vet: 'Dr. Ramesh Nair' },
    ];
    return all.length > 0 ? all : demo;
  });

  const downloadPDF = async (r) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 215, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('SmartPetCare — Prescription', 20, 18);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text(r.medication || r.medicine, 20, 44);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`For ${r.patient || r.pet} • Prescribed by ${r.vet}`, 20, 52);
    doc.setDrawColor(220, 220, 230); doc.line(20, 58, 190, 58);
    doc.setTextColor(30, 30, 30);
    const details = [
      ['Patient (Pet)', r.patient || r.pet],
      ['Prescribed by', r.vet],
      ['Dosage', r.dosage],
      ['Duration', r.duration + (typeof r.duration === 'number' ? ' months' : '')],
      ['Refills Remaining', String(r.refills || 2)],
      ['Expiry Date', r.expires || r.date],
      ['Generated On', new Date().toLocaleDateString()],
    ];
    let y = 68;
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
      doc.text(label + ':', 20, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
      doc.text(String(value), 90, y);
      y += 11;
    });
    doc.setFillColor(240, 240, 255);
    doc.rect(15, y + 5, 180, 18, 'F');
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(80, 80, 100);
    doc.text('This prescription is digitally generated by SmartPetCare. Please carry it when visiting the clinic.', 20, y + 14);
    doc.save(`Prescription_${(r.medication || r.medicine).replace(/\s+/g, '_')}.pdf`);
  };

  const addToCartAndShop = (rx) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const newItem = {
      id: Date.now(),
      name: rx.medication || rx.medicine,
      price: 1200 + Math.floor(Math.random() * 800),
      qty: 1,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
    };
    localStorage.setItem('cartItems', JSON.stringify([newItem, ...cart]));
    setActive('cart');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">My Prescriptions</h2>
          <p className="text-sm text-slate-500">Digital records from your veterinarian.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prescriptions.map((r, i) => (
          <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 relative group overflow-hidden hover:border-indigo-200 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-[80px] -mr-6 -mt-6 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-black text-slate-900 text-xl tracking-tight">{r.medication || r.medicine}</p>
                <p className="text-sm text-slate-500 font-semibold flex items-center gap-1.5 uppercase tracking-wide">
                  <PawPrint className="w-4 h-4 text-slate-300" /> FOR {r.patient || r.pet}
                </p>
              </div>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">Verified Rx</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Dosage</p>
                <p className="font-extrabold text-slate-800">{r.dosage}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Expiry/Date</p>
                <p className="font-extrabold text-slate-800">{r.expires || r.date}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Prescribed by</p>
                <p className="text-sm font-extrabold text-indigo-600 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" /> {r.vet}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => addToCartAndShop(r)} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all">
                <ShoppingCart className="w-4 h-4" /> Order in Shop
              </button>
              <button onClick={() => downloadPDF(r)} className="flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-all">
                <FileText className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
        {prescriptions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-800">No Prescriptions Yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Any digital prescriptions issued by your vet will appear here for easy ordering.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// ── Help Tab ──────────────────────────────────────────────────────────────────
const HelpTab = () => {
  const [form, setForm] = useState({subject:'',description:''});
  const tickets = [{ id:'TKT-001', subject:'Cannot book appointment', status:'OPEN', date:'2026-03-18' }];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">Submit a Support Ticket</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Subject</label>
            <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Describe the issue briefly" className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4} placeholder="Provide more details..." className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
          </div>
          <button className="w-full py-3 text-white font-bold rounded-xl" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Submit Ticket</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">My Tickets</h3>
        {tickets.map(t=>(
          <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <p className="font-bold text-slate-800">{t.subject}</p>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{t.status}</span>
            </div>
            <p className="text-xs text-slate-400">{t.id} • {t.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Messages Tab ──────────────────────────────────────────────────────────────
const MessagesTab = () => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { from:'Dr. Priya Sharma', text:"Luna's follow-up is scheduled for April 10.", time:'10:32 AM', me:false },
    { from:'Me', text:'Thank you, Doctor! Will be there.', time:'10:35 AM', me:true },
  ]);
  const send = () => { if(msg.trim()){setMessages([...messages,{from:'Me',text:msg,time:'Now',me:true}]);setMsg('');} };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col" style={{height:'70vh'}}>
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="font-extrabold text-slate-900">Dr. Priya Sharma</p>
        <p className="text-xs text-green-500 font-semibold">● Online</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((m,i)=>(
          <div key={i} className={`flex ${m.me?'justify-end':'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.me?'text-white':'bg-slate-100 text-slate-800'}`} style={m.me?{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}:{}}>
              {!m.me&&<p className="text-xs font-bold mb-1 text-indigo-600">{m.from}</p>}
              <p>{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.me?'text-white/60':'text-slate-400'}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 px-6 py-4 flex gap-3">
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message..." className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
        <button onClick={send} className="px-5 py-2.5 text-white font-bold rounded-xl text-sm" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Send</button>
      </div>
    </div>
  );
};

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const getStored = () => JSON.parse(localStorage.getItem('currentUser') || '{}');
  const token = localStorage.getItem('token');
  const apiBase = `http://${window.location.hostname}:8081/api`;
  const authCfg = { headers: { Authorization: `Bearer ${token}` } };

  // Initialize from localStorage cache so fields never appear empty on re-open
  const cached = getStored();
  const [form, setForm] = useState({
    fullName: cached.fullName || cached.name || cached.email?.split('@')[0] || '',
    email:    cached.email    || '',
    phone:    cached.phone    || '',
    city:     cached.city     || '',
    address:  cached.address  || '',
  });
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch from backend (fresh data) on every mount
  useEffect(() => {
    axios.get(`${apiBase}/users/profile`, authCfg)
      .then(res => {
        const me = res.data;
        const updated = {
          fullName: me.fullName || '',
          email:    me.email    || '',
          phone:    me.phone    || '',
          city:     me.city     || '',
          address:  me.address  || '',
        };
        setForm(updated);
        // Persist all fields to localStorage so next open is instant
        const fresh = getStored();
        localStorage.setItem('currentUser', JSON.stringify({ ...fresh, ...updated, name: me.fullName || fresh.name }));
      })
      .catch(() => { /* silently use cached data already in state */ })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`${apiBase}/users/profile`, {
        fullName: form.fullName,
        phone:    form.phone,
        city:     form.city,
        address:  form.address,
      }, authCfg);
      // Update localStorage cache with saved values
      const fresh = getStored();
      localStorage.setItem('currentUser', JSON.stringify({
        ...fresh,
        name:     form.fullName,
        fullName: form.fullName,
        phone:    form.phone,
        city:     form.city,
        address:  form.address,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Profile save failed:', e?.response?.data || e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white flex-shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
            {(form.fullName || form.email || 'U')[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{form.fullName || form.email}</h3>
            <p className="text-sm text-slate-500">{form.email}</p>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest mt-1 inline-block">{getStored().role}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['Full Name','fullName','text'],['Email','email','email'],['Phone','phone','tel'],['City','city','text'],['Address','address','text']].map(([l,k,t])=>(
            <div key={k} className={k==='address'?'sm:col-span-2':''}>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{l}</label>
              <input
                type={t}
                value={form[k]}
                onChange={e => setForm({...form, [k]: e.target.value})}
                disabled={k === 'email'}
                placeholder={`Enter ${l.toLowerCase()}`}
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 text-white font-bold rounded-xl shadow-lg text-sm flex items-center gap-2 disabled:opacity-60 transition"
            style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}
          >
            {saving && <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>}
            Save Changes
          </button>
          {saved && <p className="text-green-600 font-bold text-sm animate-pulse">✓ Saved successfully!</p>}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
        <h3 className="font-extrabold text-rose-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all your data. This action cannot be undone.</p>
        <button className="px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl text-sm border border-rose-200 hover:bg-rose-100 transition">Delete Account</button>
      </div>
    </div>
  );
};


// ── Main Dashboard ────────────────────────────────────────────────────────────
const OwnerDashboard = () => {
  const [active, setActive] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const renderContent = () => {
    if (active === 'dashboard') return <DashboardHome setActive={setActive} />;
    if (active === 'pets') return <PetProfilesTab />;
    if (active === 'ai-scan') return <AIDiseaseScanTab />;
    if (active === 'health') return <HealthTrackerTab />;
    if (active === 'reminders') return <SmartRemindersTab />;
    if (active === 'dna') return <DNATab />;
    if (active === 'aitranslator') return <AITranslatorTab />;
    if (active === 'digitaltwin') return <DigitalTwinTab />;
    if (active === 'activity') return <ActivityTrackerTab />;
    if (active === 'smartcollar') return <SmartCollarTab />;
    if (active === 'playdates') return <PlaydatesTab />;
    if (active === 'memories') return <MemoriesTab />;
    if (active === 'rewards') return <RewardsTab />;
    if (active === 'appointments') return <AppointmentsTab />;
    if (active === 'wishlist') return <WishlistTab />;
    if (active === 'insurance') return <InsuranceTab />;
    if (active === 'notifications') return <NotificationsPanel />;
    if (active === 'cart') return <CartTab />;
    if (active === 'orders') return <OrdersTab />;
    if (active === 'vaccinations') return <VaccinationsTab />;
    if (active === 'prescriptions') return <PrescriptionsTab setActive={setActive} />;
    if (active === 'shop') return <Marketplace insideDashboard={true} />;
    if (active === 'help') return <HelpTab />;
    if (active === 'messages') return <MessagesTab />;
    if (active === 'profile') return <ProfileTab />;
    if (active === 'emergency') return <EmergencySOSTab />;
    if (active === 'passport') return <PetHealthPassportTab />;
    if (active === 'community') return <CommunityFeedTab />;
    if (active === 'subscription') return <SubscriptionTab />;
    if (active === 'moodai') return <AIMoodDetectionTab />;
    if (active === 'dietplanner') return <PetDietPlannerTab />;
    if (active === 'lostpet') return <LostPetAlertTab />;
    if (active === 'grooming') return <AIGroomingTab />;
    if (active === 'services') return <NearbyServicesTab />;
    if (active === 'companion')  return <VirtualPetCompanionTab />;
    if (active === 'horoscope')  return <PetHoroscopeTab />;
    if (active === 'challenges') return <PetChallengesTab />;
    if (active === 'explore')    return <PetLocationDiscoveryTab />;
    if (active === 'weight')     return <SmartWeightTab />;
    if (active === 'journal')    return <PetJournalTab />;
    if (active === 'gallery')    return <PetMemoryGalleryTab />;
    if (active === 'hydration')  return <SmartHydrationTab />;
    if (active === 'wellness')   return <WellnessCoachTab />;
    return null;
  };

  const activeLabel = [...MAIN_MENU, ...ACCOUNT_MENU, {key:'notifications',label:'Notifications'}].find(m => m.key === active)?.label || 'Dashboard';
  const { dark, toggle } = useTheme();

  return (
    <div className={`flex min-h-screen ${dark ? 'dark bg-slate-900' : 'bg-slate-50'}`} style={{ paddingTop: 0 }}>
      {/* Left Sidebar */}
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">🐾 Pet Owner Portal</p>
            <h1 className="text-2xl font-extrabold tracking-tight"
              style={{ background: 'linear-gradient(90deg,#6366f1,#14b8a6,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {activeLabel}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition" title="Toggle Dark Mode">
              {dark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setActive('notifications')} className="relative p-2 rounded-xl hover:bg-slate-100 transition">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <Link to="/shop" className="p-2 rounded-xl hover:bg-slate-100 transition">
              <ShoppingCart className="w-5 h-5 text-slate-500" />
            </Link>
            <button
              onClick={() => setActive('profile')}
              title="View Profile"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 hover:scale-110 transition-transform shadow-md cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }}>
              {(JSON.parse(localStorage.getItem('currentUser') || '{}').name || 'U')[0].toUpperCase()}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Chatbot Floating Widget */}
      <DashboardAIChat mode="owner" />
    </div>
  );
};

export default OwnerDashboard;
