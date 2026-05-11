import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileText, Users, Clock, CheckCircle,
  LogOut, PawPrint, Bell, ShoppingCart, Stethoscope, Activity,
  Star, MapPin, TrendingUp, ChevronRight, AlertTriangle, X,
  History, ShieldCheck, Edit3, Save, RefreshCw,
  CalendarClock, ToggleLeft, ToggleRight, Award, ThumbsUp,
  Pill, Microscope, Video, ListTodo, MessageCircleQuestion,
  Plus, Trash2, ExternalLink, FileCheck2, CheckSquare, Square,
  MessageSquare, Send, Paperclip, Brain, Zap, Shield
} from 'lucide-react';
import axios from 'axios';
import DashboardAIChat from '../components/DashboardAIChat';
import EarningsDashboard from '../components/EarningsDashboard';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GRAD     = 'linear-gradient(135deg,#14b8a6,#6366f1)';
const GRADRED  = 'linear-gradient(135deg,#ef4444,#f97316)';
const GRADGREEN = 'linear-gradient(135deg,#10b981,#059669)';

const SIDEBAR = [
  { key: 'dashboard',    label: 'Dashboard',         icon: LayoutDashboard },
  { key: 'schedule',     label: "Today's Schedule",  icon: Calendar },
  { key: 'patients',     label: 'Patients',           icon: Users },
  { key: 'earnings',     label: 'Earnings & Records', icon: Activity },
  { key: 'prescriptions',label: 'Prescriptions',     icon: FileText },
  { key: 'availability', label: 'Availability',       icon: CalendarClock },
  { key: 'pharmacy',     label: 'Pharmacy/Inventory', icon: Pill },
  { key: 'lab',          label: 'Lab & Certificates', icon: Microscope },
  { key: 'teleconsult',  label: 'Teleconsult Hub',    icon: Video },
  { key: 'tasks',        label: 'Task Manager',       icon: ListTodo },
  { key: 'forum',        label: 'Pet Q&A Forum',      icon: MessageCircleQuestion },
  { key: 'reviews',      label: 'Reviews & Ratings',  icon: Star },
  { key: 'messages',     label: 'Messages',            icon: MessageSquare },
  { key: 'diagnostics',  label: 'AI Diagnostics',      icon: Microscope },
  { key: 'emergency-queue', label: 'Emergency Queue',  icon: AlertTriangle },
  { key: 'clients',      label: 'Client Management',   icon: Users },
  { key: 'clinic-ops',   label: 'Clinic Operations',   icon: Activity },
  { key: 'performance',  label: 'Vet Performance',      icon: TrendingUp },
  { key: 'profile',      label: 'My Profile',           icon: Stethoscope },
];

// ── Vet Sidebar ───────────────────────────────────────────────────────────────
const VetSidebar = ({ active, setActive, vet, onLogout }) => (
  <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-xl shadow-slate-200/50 flex-shrink-0">
    <div className="px-5 py-5 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-extrabold text-base leading-none"
            style={{ background: 'linear-gradient(90deg,#14b8a6,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Vet Portal
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">{vet?.name || 'Veterinarian'}</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">Menu</p>
      {SIDEBAR.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button key={key} onClick={() => setActive(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
              }`}
            style={isActive ? { background: 'linear-gradient(90deg,#14b8a6,#6366f1)', boxShadow: '0 4px 14px rgba(20,184,166,0.35)' } : {}}>
            <Icon className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} style={{ width: 18, height: 18 }} />
            <span className="flex-1 text-left">{label}</span>
            {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
          </button>
        );
      })}
    </nav>

    <div className="px-3 pb-5 border-t border-slate-100 pt-3">
      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all">
        <LogOut style={{ width: 18, height: 18 }} />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

// ── Profile Panel (Editable) ──────────────────────────────────────────────────
const VetProfilePanel = ({ vet, onProfileUpdated }) => {
  const token = localStorage.getItem('token');
  const apiBase = `http://${window.location.hostname}:8081/api`;
  const authCfg = { headers: { Authorization: `Bearer ${token}` } };

  const SPECS = [
    'General Practice','Surgery','Dermatology','Cardiology','Dentistry',
    'Orthopedics','Oncology','Ophthalmology','Neurology','Exotic Animals',
    'Feline Specialist','Canine Specialist'
  ];

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [form, setForm] = useState({
    specialization:  '',
    clinicName:      '',
    clinicAddress:   '',
    experienceYears: '',
    consultationFee: '',
  });

  useEffect(() => {
    if (vet) setForm({
      specialization:  vet.specialization || '',
      clinicName:      vet.clinic         || vet.clinicName     || '',
      clinicAddress:   vet.location       || vet.clinicAddress  || '',
      experienceYears: vet.experience     || vet.experienceYears|| '',
      consultationFee: vet.fee            || vet.consultationFee|| '',
    });
  }, [vet]);

  if (!vet) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">Profile Not Found</h2>
      <p className="text-slate-400 text-sm mb-6">Your vet profile hasn't been submitted yet.</p>
      <Link to="/vet/profile/create"
        className="px-6 py-3 font-bold text-white rounded-xl shadow-lg"
        style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
        Set Up Profile
      </Link>
    </div>
  );

  const doSave = async (resubmit = false) => {
    setSaving(true); setError('');
    try {
      await axios.put(`${apiBase}/vets/profile`, {
        specialization:  form.specialization,
        clinicName:      form.clinicName,
        clinicAddress:   form.clinicAddress,
        experienceYears: Number(form.experienceYears) || 0,
        consultationFee: Number(form.consultationFee) || 0,
        resubmit,
      }, authCfg);
      setSaved(true); setEditing(false);
      setTimeout(() => setSaved(false), 3000);
      if (onProfileUpdated) onProfileUpdated();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:bg-white transition-all';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-24" style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }} />
        <div className="px-6 pb-6 -mt-12">
          <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg mb-4 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
            {(vet.name || 'V')[0]}
          </div>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{vet.name || 'Dr. Unknown'}</h2>
              <p className="text-teal-600 font-semibold">{vet.specialization}</p>
              <p className="text-slate-500 text-sm">{vet.clinic || vet.clinicName}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                vet.status === 'approved'  ? 'bg-green-100 text-green-700'
                : vet.status === 'rejected' ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700'
              }`}>
                {vet.status === 'approved' ? '✓ Verified & Active' : vet.status === 'rejected' ? '✗ Rejected' : '⏳ Pending Approval'}
              </span>
              <button
                onClick={() => setEditing(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
              >
                <Edit3 className="w-3.5 h-3.5" /> {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-semibold">⚠️ {error}</div>}
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">✅ Profile updated and re-submitted for admin review!</div>}

      {/* Edit form */}
      {editing ? (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-sm p-6 space-y-4">
          <div>
            <p className="font-extrabold text-slate-900 mb-0.5">Edit Your Profile</p>
            <p className="text-xs text-slate-500 mb-4">Update your details and click <strong>Save & Re-submit</strong> to send for admin approval again.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Specialization</label>
            <select value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className={inputCls}>
              <option value="">Select specialization</option>
              {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Clinic Name</label>
              <input className={inputCls} value={form.clinicName} onChange={e => setForm({...form, clinicName: e.target.value})} placeholder="Clinic name" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Location / City</label>
              <input className={inputCls} value={form.clinicAddress} onChange={e => setForm({...form, clinicAddress: e.target.value})} placeholder="e.g. Chennai, TN" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Experience (years)</label>
              <input className={inputCls} type="number" min="0" max="50" value={form.experienceYears} onChange={e => setForm({...form, experienceYears: e.target.value})} placeholder="Years" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Consultation Fee (₹)</label>
              <input className={inputCls} type="number" min="0" value={form.consultationFee} onChange={e => setForm({...form, consultationFee: e.target.value})} placeholder="Fee amount" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => doSave(true)}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-bold rounded-xl shadow-lg text-sm disabled:opacity-60 transition"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}
            >
              {saving ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <RefreshCw className="w-4 h-4" />}
              Save & Re-submit for Approval
            </button>
            <button
              onClick={() => doSave(false)}
              disabled={saving}
              className="px-5 py-3 font-bold rounded-xl text-sm border-2 border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-60 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Only
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Qualification',    vet.qualification],
            ['Experience',       `${vet.experience || vet.experienceYears || 0} years`],
            ['License Number',   vet.license],
            ['Consultation Fee', `₹${vet.fee || vet.consultationFee || 0}`],
            ['Location',         vet.location || vet.clinicAddress],
            ['Contact Email',    vet.email],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-slate-800 font-semibold text-sm">{value || '—'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bio */}
      {vet.bio && !editing && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Professional Bio</p>
          <p className="text-slate-700 text-sm leading-relaxed">{vet.bio}</p>
        </div>
      )}

      {/* Status banner */}
      {vet.status !== 'approved' && (
        <div className={`border rounded-xl p-4 flex gap-3 ${vet.status === 'rejected' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${vet.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`} />
          <div>
            <p className={`text-sm font-bold ${vet.status === 'rejected' ? 'text-rose-800' : 'text-amber-800'}`}>
              {vet.status === 'rejected' ? 'Profile Rejected by Admin' : 'Awaiting Admin Approval'}
            </p>
            <p className={`text-xs mt-0.5 ${vet.status === 'rejected' ? 'text-rose-700' : 'text-amber-700'}`}>
              {vet.status === 'rejected'
                ? 'Your profile was rejected. Please click "Edit Profile", update your details, and re-submit.'
                : "Your profile is under review. You'll be notified once approved."}
            </p>
            {vet.status === 'rejected' && (
              <button onClick={() => setEditing(true)} className="mt-2 text-xs font-bold text-rose-700 underline hover:text-rose-900">
                Edit & Re-submit →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Appointment Requests Panel ────────────────────────────────────────────────
const AppointmentRequestsPanel = () => {
  const [appts, setAppts] = useState(() => JSON.parse(localStorage.getItem('ownerAppts') || '[]'));
  const pending = appts.filter(a => a.status === 'PENDING');
  const respond = (id, status) => {
    const updated = appts.map(a => a.id === id ? { ...a, status } : a);
    setAppts(updated);
    localStorage.setItem('ownerAppts', JSON.stringify(updated));
  };
  if (pending.length === 0) return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
      <p className="text-green-700 font-bold">✅ No pending appointment requests</p>
      <p className="text-green-600 text-sm mt-1">All requests have been handled.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {pending.map(a => (
        <div key={a.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">PENDING</span>
              <p className="font-extrabold text-slate-900 text-sm">{a.pet} — Owner request</p>
            </div>
            <p className="text-sm text-slate-500">Reason: <strong>{a.reason}</strong></p>
            <p className="text-xs text-slate-400 mt-0.5">📅 {a.date} at {a.time} • Fee: ₹{a.rate}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => respond(a.id, 'CONFIRMED')} className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition">✅ Approve</button>
            <button onClick={() => respond(a.id, 'REJECTED')} className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-100 transition">❌ Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Complete Appointment Modal ────────────────────────────────────────────────
const CompleteAppointmentModal = ({ appt, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [advice, setAdvice] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-teal-50">
          <h3 className="font-extrabold text-slate-900 flex items-center gap-2 pt-1"><CheckCircle className="w-5 h-5 text-teal-600"/> Complete Appt: {appt.petName || appt.pet}</h3>
          <button onClick={onClose} className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-700 transition shadow-sm"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Clinical Notes *</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Luna is healthy, rabies shot administered." className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Owner Advice</label>
            <textarea value={advice} onChange={e => setAdvice(e.target.value)} rows={2} placeholder="e.g. Keep Luna hydrated for 24h." className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none" />
          </div>
          <button onClick={() => onSave({ note, advice })} disabled={!note.trim()} className="w-full py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>Save & Mark Completed</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Patient Record Modal ──────────────────────────────────────────────────────
const PatientRecordModal = ({ patient, onClose }) => {
  const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
  const rx = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
  
  const petHistory = [
    ...records.filter(r => r.appt?.petName === patient.name || r.pet === patient.name)
      .map(r => ({ ...r, type: 'CLINICAL', icon: Stethoscope, color: '#14b8a6' })),
    ...rx.filter(r => r.patient === patient.name)
      .map(r => ({ ...r, type: 'MEDICATION', icon: FileText, color: '#9333ea' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header section with Pet Info */}
        <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 relative">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center flex-shrink-0 shadow-inner">
               <PawPrint className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{patient.name}'s History</h3>
                <span className="bg-teal-100 text-teal-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">Verified Care</span>
              </div>
              <p className="text-slate-500 font-bold text-sm tracking-wide mt-0.5">{patient.species} • {patient.breed} • {patient.age} years old</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 transition-all hover:rotate-90">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Scrollable Timeline Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          <div className="flex items-center gap-3 mb-2 px-2">
            <History className="w-5 h-5 text-indigo-500"/>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Medical Care Timeline</p>
          </div>

          {petHistory.map((item, idx) => (
            <div key={idx} className="relative pl-8 border-l-2 border-slate-100 pb-8 last:pb-0">
              <div className="absolute top-0 left-[-11px] w-5 h-5 rounded-full border-4 border-white shadow-md flex items-center justify-center p-0.5" style={{ background: item.color }}>
                 <item.icon className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-black tracking-tighter uppercase mb-1" style={{ color: item.color }}>{item.type}</p>
                    <p className="text-base font-black text-slate-900 tracking-tight">{item.medication || (item.vet + "'s Observation")}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">{item.date}</p>
                </div>

                <div className="space-y-2">
                  {item.note && (
                    <div className="bg-white/60 p-3 rounded-2xl border border-slate-100/50">
                       <p className="text-sm text-slate-600 leading-relaxed italic">"{item.note}"</p>
                    </div>
                  )}
                  {item.dosage && (
                    <div className="flex gap-3">
                      <div className="bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/30 flex-1">
                        <p className="text-[8px] text-indigo-400 font-black uppercase mb-0.5">Dosage</p>
                        <p className="text-xs font-bold text-indigo-700">{item.dosage}</p>
                      </div>
                      <div className="bg-teal-50/50 px-3 py-2 rounded-xl border border-teal-100/30 flex-1">
                        <p className="text-[8px] text-teal-400 font-black uppercase mb-0.5">Duration</p>
                        <p className="text-xs font-bold text-teal-700">{item.duration}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-200/40">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500">{item.vet[0]}</div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Approved by {item.vet}</p>
                </div>
              </div>
            </div>
          ))}

          {petHistory.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
               <History className="w-16 h-16 text-slate-200 mx-auto mb-4 opacity-40 capitalize" />
               <h4 className="text-lg font-black text-slate-800 tracking-tight">Vault Empty</h4>
               <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">No clinical records found. Complete an appointment to start building {patient.name}'s medical vault.</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-3">
           <button onClick={onClose} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all">Close Record Portfolio</button>
           <button className="flex-shrink-0 w-16 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-95">
             <ShieldCheck className="w-7 h-7" />
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Dashboard Home ────────────────────────────────────────────────────────────
const DashHome = ({ vet, onCompleteAppt, setActive }) => {
  const appointments = [
    { id: 1, time: '09:00 AM', petName: 'Max', species: 'Dog', owner: 'John Doe', reason: 'Annual checkup' },
    { id: 2, time: '10:30 AM', petName: 'Luna', species: 'Cat', owner: 'Jane Smith', reason: 'Vaccination' },
    { id: 3, time: '01:00 PM', petName: 'Charlie', species: 'Dog', owner: 'Emily Davis', reason: 'Skin infection' },
  ];

  const monthlyData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [
      { label: 'Patients Seen', data: [68, 82, 74, 91, 88, 97], backgroundColor: 'rgba(20,184,166,0.7)', borderRadius: 8 },
      { label: 'New Patients', data: [12, 19, 14, 22, 18, 25], backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 8 },
    ]
  };
  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  const criticalPets = [
    { name: 'Rocky', species: 'Dog', owner: 'Rajan A.', condition: 'Post-op fever monitoring', urgency: 'high' },
    { name: 'Whiskers', species: 'Cat', owner: 'Priya S.', condition: 'Suspected kidney issue', urgency: 'medium' },
  ];

  const diseases = [
    { name: 'Skin Infection', count: 14, color: '#ef4444' },
    { name: 'Vaccination Visit', count: 22, color: '#10b981' },
    { name: 'Digestive Issues', count: 9, color: '#f59e0b' },
    { name: 'Injury / Fracture', count: 5, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Appts", value: '8', icon: Calendar, color: '#14b8a6', target: 'schedule' },
          { label: 'Total Patients', value: '452', icon: Users, color: '#6366f1', target: 'patients' },
          { label: 'Prescriptions', value: '124', icon: FileText, color: '#f59e0b', target: 'prescriptions' },
          { label: 'Rating', value: `${vet?.rating || 4.8}★`, icon: Star, color: '#10b981', target: 'reviews' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} onClick={() => setActive(s.target)}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-indigo-200 transition-all">
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

      {/* AI Health Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg"><TrendingUp className="w-4 h-4 text-teal-600"/></div>
            <h3 className="font-extrabold text-slate-800">Monthly Patient Analytics</h3>
            <span className="ml-auto text-[10px] font-bold bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full border border-teal-200">AI Insights</span>
          </div>
          <div className="h-44"><Bar data={monthlyData} options={chartOpts} /></div>
        </div>

        {/* Common Diseases */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg"><Activity className="w-4 h-4 text-purple-600"/></div>
            <h3 className="font-extrabold text-slate-800 text-sm">Common Cases (May)</h3>
          </div>
          <div className="space-y-3">
            {diseases.map(d => (
              <div key={d.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">{d.name}</span>
                  <span className="text-xs font-extrabold" style={{color: d.color}}>{d.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${(d.count/22)*100}%`, background: d.color}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Pets Alert */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-rose-100 rounded-lg"><AlertTriangle className="w-4 h-4 text-rose-600"/></div>
          <h3 className="font-extrabold text-slate-800">Critical Patients — Needs Attention</h3>
          <span className="ml-auto text-xs font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">{criticalPets.length} alerts</span>
        </div>
        <div className="space-y-2">
          {criticalPets.map(p => (
            <div key={p.name} className={`flex items-center gap-4 p-3 rounded-xl border ${p.urgency === 'high' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${p.urgency === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}>{p.urgency === 'high' ? '🚨' : '⚠️'}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{p.name} <span className="font-normal text-slate-500">({p.species})</span> — {p.owner}</p>
                <p className="text-xs text-slate-500">{p.condition}</p>
              </div>
              <button onClick={() => setActive('patients')} className="text-xs font-bold text-indigo-600 hover:underline">View →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center">
              <Clock style={{ width: 16, height: 16, color: '#14b8a6' }} />
            </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#14b8a6,#6366f1)' }}>
              Today's Schedule
            </span>
          </h2>
          <button onClick={() => setActive('schedule')} className="text-teal-600 text-xs font-bold hover:underline">View Full Calendar</button>
        </div>
        <div className="space-y-3">
          {appointments.map(apt => (
            <div key={apt.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-teal-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 text-teal-700 font-bold px-3 py-1.5 rounded-lg text-sm flex-shrink-0">{apt.time}</div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{apt.petName} <span className="font-normal text-slate-400">({apt.species})</span></p>
                  <p className="text-slate-500 text-xs">Owner: {apt.owner} • {apt.reason}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition">Reschedule</button>
                <button onClick={() => onCompleteAppt(apt)} className="px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1 transition shadow-sm hover:shadow-md"
                  style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
                  <CheckCircle style={{ width: 14, height: 14 }} /> Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Appointment Requests */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
            <Bell style={{ width: 16, height: 16, color: '#f59e0b' }}/>
          </span>
          <h2 className="text-lg font-bold text-slate-800">Appointment Requests</h2>
          <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending Action</span>
        </div>
        <AppointmentRequestsPanel/>
      </div>
    </div>
  );
};

// ── Schedule Panel ────────────────────────────────────────────────────────────
const VetSchedulePanel = ({ vet, onCompleteAppt }) => {
  const appointments = [
    { id: 1, time: '09:00 AM', petName: 'Max', species: 'Dog', owner: 'John Doe', reason: 'Annual checkup' },
    { id: 2, time: '10:30 AM', petName: 'Luna', species: 'Cat', owner: 'Jane Smith', reason: 'Vaccination' },
    { id: 3, time: '01:00 PM', petName: 'Charlie', species: 'Dog', owner: 'Emily Davis', reason: 'Skin infection' },
    { id: 4, time: '03:15 PM', petName: 'Bella', species: 'Dog', owner: 'Mike Tyson', reason: 'Follow-up' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-teal-500" /> Today's Schedule
      </h2>
      <div className="space-y-4">
        {appointments.map(apt => (
          <div key={apt.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-teal-300 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 text-teal-800 font-extrabold px-4 py-2 rounded-xl text-lg flex-shrink-0">{apt.time}</div>
              <div>
                <p className="font-extrabold text-slate-900 text-lg">{apt.petName} <span className="font-medium text-slate-500 text-sm">({apt.species})</span></p>
                <p className="text-slate-600 text-sm mt-0.5">Owner: <span className="font-bold">{apt.owner}</span> • {apt.reason}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border-2 border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition">Reschedule</button>
              <button onClick={() => onCompleteAppt(apt)} className="px-4 py-2 rounded-xl text-white font-bold flex items-center gap-2 transition hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)', boxShadow: '0 4px 14px rgba(20,184,166,0.35)' }}>
                <CheckCircle className="w-5 h-5" /> Mark Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Patients Panel ────────────────────────────────────────────────────────────
const VetPatientsPanel = ({ vet }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const patients = [
    { id: 1, name: 'Luna', species: 'Dog', breed: 'Golden Retriever', age: 3, owner: 'John Doe', lastVisit: '2026-03-10' },
    { id: 2, name: 'Milo', species: 'Cat', breed: 'Siamese', age: 2, owner: 'Jane Smith', lastVisit: '2026-02-15' },
    { id: 3, name: 'Max', species: 'Dog', breed: 'Husky Mix', age: 4, owner: 'Mike Tyson', lastVisit: '2026-03-22' },
    { id: 4, name: 'Charlie', species: 'Dog', breed: 'Beagle', age: 1, owner: 'Emily Davis', lastVisit: '2026-01-05' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" /> Patient Directory
        </h2>
        <input type="text" placeholder="Search patients..." className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-4 rounded-tl-xl">Patient Name</th>
              <th className="px-5 py-4">Species & Breed</th>
              <th className="px-5 py-4">Owner</th>
              <th className="px-5 py-4">Last Visit</th>
              <th className="px-5 py-4 rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-extrabold text-slate-900">{p.name} <span className="text-xs text-slate-400 font-normal">({p.age} y)</span></td>
                <td className="px-5 py-4 text-slate-600 font-medium">{p.species} — {p.breed}</td>
                <td className="px-5 py-4 text-slate-600">{p.owner}</td>
                <td className="px-5 py-4 text-slate-500">{p.lastVisit}</td>
                <td className="px-5 py-4">
                  <button onClick={() => setSelectedPatient(p)} className="text-indigo-600 font-bold hover:underline transition-all active:scale-95">View Record</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedPatient && (
          <PatientRecordModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Prescriptions Panel ───────────────────────────────────────────────────────
const VetPrescriptionsPanel = ({ vet }) => {
  const [form, setForm] = useState({ patient: '', medication: '', dosage: '', duration: '' });
  const [prescriptions, setPrescriptions] = useState(() => {
    const all = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
    const demo = [
      { id: 1, patient: 'Luna', medication: 'Heartgard Plus', dosage: '1 chew/month', duration: '6 months', date: '2026-03-25' },
      { id: 2, patient: 'Milo', medication: 'Revolution', dosage: '1 tube/month', duration: '3 months', date: '2026-03-20' },
    ];
    return all.length > 0 ? all : demo;
  });

  // AI Suggestion state
  const [symptoms, setSymptoms] = useState('');
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAI, setShowAI] = useState(false);

  const AI_DB = {
    skin: { medicine: 'Apoquel 16mg', dosage: '1 tablet twice daily', care: 'Use hypoallergenic shampoo. Avoid grass exposure. Follow up in 2 weeks.' },
    itch: { medicine: 'Apoquel 16mg', dosage: '1 tablet twice daily', care: 'Use hypoallergenic shampoo. Avoid grass exposure. Follow up in 2 weeks.' },
    vomit: { medicine: 'Metronidazole 250mg', dosage: '1 tablet every 12 hrs', care: 'Bland diet (boiled chicken + rice) for 3 days. Ensure hydration. Stop if symptoms worsen.' },
    digest: { medicine: 'Metronidazole 250mg', dosage: '1 tablet every 12 hrs', care: 'Bland diet (boiled chicken + rice) for 3 days. Ensure hydration.' },
    fever: { medicine: 'Meloxicam 1mg/kg', dosage: 'Once daily with food', care: 'Monitor temperature every 6 hrs. Increase water intake. Recheck in 48 hours.' },
    eye: { medicine: 'Tobramycin Eye Drops', dosage: '1-2 drops 3x/day', care: 'Keep eye area clean. Avoid bright light. Recheck in 1 week.' },
    ear: { medicine: 'Otomax Ear Drops', dosage: '4 drops into ear canal twice daily', care: 'Clean ear gently before applying. Avoid water in ear.' },
    parasite: { medicine: 'Drontal Plus', dosage: 'Single dose by weight', care: 'Repeat deworming in 2 weeks. Sanitize living area.' },
    worm: { medicine: 'Drontal Plus', dosage: 'Single dose by weight', care: 'Repeat deworming in 2 weeks. Sanitize living area.' },
    default: { medicine: 'Amoxicillin 250mg', dosage: '1 capsule every 12 hrs for 7 days', care: 'Rest and hydration recommended. Monitor closely. Return if no improvement in 3 days.' },
  };

  const runAISuggest = () => {
    if (!symptoms.trim()) return;
    setAiSuggesting(true);
    setAiResult(null);
    setTimeout(() => {
      const lower = symptoms.toLowerCase();
      const key = Object.keys(AI_DB).find(k => lower.includes(k)) || 'default';
      setAiResult(AI_DB[key]);
      setAiSuggesting(false);
    }, 1500);
  };

  const applyAISuggestion = () => {
    if (!aiResult) return;
    setForm(f => ({ ...f, medication: aiResult.medicine, dosage: aiResult.dosage }));
    setShowAI(false);
    setAiResult(null);
    setSymptoms('');
  };

  const addPrescription = () => {
    if (!form.patient || !form.medication) return;
    const newRx = { id: Date.now(), ...form, date: new Date().toLocaleDateString('en-CA'), vet: vet?.name || 'Dr. Sharma' };
    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    localStorage.setItem('allPrescriptions', JSON.stringify(updated.filter(r => !r.id.toString().startsWith('1')))); // Don't persist demo in global
    localStorage.setItem('allPrescriptions', JSON.stringify([newRx, ...JSON.parse(localStorage.getItem('allPrescriptions') || '[]')]));
    setForm({ patient: '', medication: '', dosage: '', duration: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        {/* AI Suggest Block */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-5">
          <button onClick={() => setShowAI(v => !v)} className="w-full flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-indigo-600"/>
            <span className="font-extrabold text-indigo-800">AI Prescription Assist</span>
            <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">{showAI ? 'Hide' : 'Try AI'}</span>
          </button>
          <p className="text-xs text-indigo-500 mb-3">Enter symptoms → AI suggests medicine & dosage</p>
          <AnimatePresence>
            {showAI && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-3">
                <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
                  rows={3} placeholder="e.g. scratching, red skin, fever, vomiting..."
                  className="w-full border border-indigo-200 bg-white rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none resize-none"/>
                <button onClick={runAISuggest} disabled={aiSuggesting || !symptoms.trim()}
                  className="w-full py-2 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{background:'linear-gradient(135deg,#6366f1,#9333ea)'}}>
                  <Zap className="w-4 h-4"/> {aiSuggesting ? 'Analyzing...' : 'Get AI Suggestion'}
                </button>
                {aiResult && (
                  <div className="bg-white rounded-xl border border-indigo-200 p-4 space-y-2">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI Recommendation</p>
                    <p className="font-bold text-slate-800">💊 {aiResult.medicine}</p>
                    <p className="text-sm text-slate-600">Dosage: {aiResult.dosage}</p>
                    <p className="text-xs text-slate-500 italic">{aiResult.care}</p>
                    <button onClick={applyAISuggestion} className="w-full mt-2 py-2 text-white font-bold rounded-lg text-sm" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
                      Apply to Prescription
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-max">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" /> Write Prescription
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Patient Name</label>
              <input value={form.patient} onChange={e=>setForm({...form, patient: e.target.value})} placeholder="e.g. Luna" className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Medication</label>
              <input value={form.medication} onChange={e=>setForm({...form, medication: e.target.value})} placeholder="e.g. Heartgard Plus" className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Dosage Instructions</label>
              <input value={form.dosage} onChange={e=>setForm({...form, dosage: e.target.value})} placeholder="e.g. 1 chew/month" className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
              <input value={form.duration} onChange={e=>setForm({...form, duration: e.target.value})} placeholder="e.g. 6 months" className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
            </div>
            <button onClick={addPrescription} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition hover:-translate-y-0.5">
              Issue Prescription
            </button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800 mb-2 px-2">Recent Prescriptions</h2>
        {prescriptions.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-purple-100 text-purple-700 font-extrabold text-xs px-2 py-0.5 rounded-full">Rx</span>
                <p className="font-extrabold text-slate-900 text-lg">{p.medication}</p>
              </div>
              <p className="text-slate-500 text-sm">Patient: <strong className="text-slate-700">{p.patient}</strong></p>
              <div className="flex gap-4 mt-2 text-xs text-slate-400 font-bold uppercase">
                <span>Dosage: {p.dosage}</span>
                <span>Duration: {p.duration}</span>
                <span>Date: {p.date}</span>
              </div>
            </div>
            <button onClick={() => window.print()} className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-100 transition">Print PDF</button>
          </div>
        ))}
        {prescriptions.length === 0 && <p className="text-slate-400 text-center py-10">No prescriptions issued yet.</p>}
      </div>
    </div>
  );
};

// ── Availability Panel ────────────────────────────────────────────────────────
const VetAvailabilityPanel = () => {
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const defaultSlots = () => DAYS.reduce((acc, d) => ({
    ...acc,
    [d]: { enabled: d !== 'Sunday', start: '09:00', end: '18:00' }
  }), {});

  const [slots, setSlots] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vetAvailability')) || defaultSlots(); }
    catch { return defaultSlots(); }
  });
  const [saved,       setSaved]       = useState(false);
  const [breakOn,     setBreakOn]     = useState(false);
  const [breakStart,  setBreakStart]  = useState('13:00');
  const [breakEnd,    setBreakEnd]    = useState('14:00');
  const [maxAppts,    setMaxAppts]    = useState(() => parseInt(localStorage.getItem('vetMaxAppts') || '10'));
  const [onlineConsult, setOnlineConsult] = useState(() => localStorage.getItem('vetOnlineConsult') === 'true');

  const toggle  = (day) => setSlots(s => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }));
  const setTime = (day, field, val) => setSlots(s => ({ ...s, [day]: { ...s[day], [field]: val } }));

  const handleSave = () => {
    localStorage.setItem('vetAvailability',  JSON.stringify(slots));
    localStorage.setItem('vetMaxAppts',      String(maxAppts));
    localStorage.setItem('vetOnlineConsult', String(onlineConsult));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inp = 'px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-700';
  const enabledCount = Object.values(slots).filter(s => s.enabled).length;

  return (
    <div className="max-w-2xl space-y-5">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2">
          <CalendarClock className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-bold text-teal-700">{enabledCount} active days/week</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold text-indigo-700">Max {maxAppts} appts/day</span>
        </div>
        {onlineConsult && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-700">Online consultations ON</span>
          </div>
        )}
      </div>

      {/* Day rows */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="font-extrabold text-slate-900">Weekly Schedule</p>
          <p className="text-xs text-slate-400 mt-0.5">Toggle days on/off and set your working hours.</p>
        </div>
        <div className="divide-y divide-slate-50">
          {DAYS.map(day => (
            <div key={day} className={`flex items-center gap-4 px-5 py-3.5 transition ${slots[day].enabled ? '' : 'opacity-50'}`}>
              <button onClick={() => toggle(day)} className="flex-shrink-0">
                {slots[day].enabled
                  ? <ToggleRight className="w-8 h-8 text-teal-500" />
                  : <ToggleLeft  className="w-8 h-8 text-slate-300" />}
              </button>
              <p className="w-24 font-bold text-slate-800 text-sm flex-shrink-0">{day}</p>
              {slots[day].enabled ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 font-semibold">From</span>
                  <input type="time" value={slots[day].start} onChange={e => setTime(day,'start',e.target.value)} className={inp} />
                  <span className="text-xs text-slate-500 font-semibold">To</span>
                  <input type="time" value={slots[day].end}   onChange={e => setTime(day,'end',e.target.value)}   className={inp} />
                </div>
              ) : (
                <span className="text-sm text-slate-400 italic">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <p className="font-extrabold text-slate-900">Appointment Settings</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">Max appointments per day</p>
            <p className="text-xs text-slate-400 mt-0.5">Bookings beyond this limit will be blocked.</p>
          </div>
          <input type="number" min={1} max={30} value={maxAppts}
            onChange={e => setMaxAppts(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-center font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-800">Accept online / video consultations</p>
            <p className="text-xs text-slate-400 mt-0.5">Allow pet owners to book virtual appointments.</p>
          </div>
          <button onClick={() => setOnlineConsult(v => !v)}>
            {onlineConsult ? <ToggleRight className="w-9 h-9 text-teal-500" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
          </button>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-800">Lunch break</p>
            <p className="text-xs text-slate-400 mt-0.5">Block a daily time period for your break.</p>
          </div>
          <button onClick={() => setBreakOn(v => !v)}>
            {breakOn ? <ToggleRight className="w-9 h-9 text-teal-500" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
          </button>
        </div>
        {breakOn && (
          <div className="flex items-center gap-3 pl-2">
            <span className="text-xs text-slate-500 font-semibold">Break from</span>
            <input type="time" value={breakStart} onChange={e => setBreakStart(e.target.value)} className={inp} />
            <span className="text-xs text-slate-500 font-semibold">to</span>
            <input type="time" value={breakEnd}   onChange={e => setBreakEnd(e.target.value)}   className={inp} />
          </div>
        )}
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-bold">✅ Availability saved!</div>}
      <button onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-lg text-sm transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
        <Save className="w-4 h-4" /> Save Availability
      </button>
    </div>
  );
};

// ── Reviews & Ratings Panel ─────────────────────────────────────────────────────
const VetReviewsPanel = () => {
  const [REVIEWS, setReviews] = useState(() => {
    const saved = localStorage.getItem('vetReviews');
    if (saved) return JSON.parse(saved);
    return [
      { id:1, owner:'Priya S.',   pet:'Bruno',    rating:5, date:'2026-05-01', comment:'Dr. was extremely gentle with Bruno. Clear diagnosis, no unnecessary tests. Highly recommend!' },
      { id:2, owner:'Karthik M.', pet:'Whiskers', rating:5, date:'2026-04-28', comment:'Our cat had a severe allergic reaction. The vet handled it swiftly. Very professional.' },
      { id:3, owner:'Meena R.',   pet:'Max',      rating:4, date:'2026-04-20', comment:'Great experience overall. The consultation was detailed. Waiting time was a bit long.' },
      { id:4, owner:'Arjun T.',   pet:'Bella',    rating:5, date:'2026-04-15', comment:'Best vet visit we have had! Bella was calm throughout. Thank you for your patience!' },
      { id:5, owner:'Divya K.',   pet:'Rocky',    rating:3, date:'2026-04-08', comment:'Good doctor but the clinic was a little crowded. Treatment worked perfectly though.' },
    ];
  });

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    localStorage.setItem('vetReviews', JSON.stringify(REVIEWS));
  }, [REVIEWS]);

  const submitReply = (id) => {
    if (!replyText.trim()) return;
    setReviews(revs => revs.map(r => r.id === id ? { ...r, reply: replyText } : r));
    setReplyingTo(null);
    setReplyText('');
    alert('Reply posted successfully!');
  };

  const avg   = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const dist  = [5,4,3,2,1].map(n => ({ star: n, count: REVIEWS.filter(r => r.rating === n).length }));
  const posP  = Math.round((REVIEWS.filter(r => r.rating >= 4).length / REVIEWS.length) * 100);

  const Stars = ({ filled }) => (
    <div className="flex">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'}`} />
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex gap-8 flex-wrap items-center">
          <div className="flex flex-col items-center">
            <p className="text-6xl font-black text-slate-900 leading-none">{avg}</p>
            <Stars filled={Math.round(avg)} />
            <p className="text-xs text-slate-400 mt-1">{REVIEWS.length} verified reviews</p>
          </div>
          <div className="flex-1 min-w-[180px] space-y-2">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                <span className="text-xs font-bold text-slate-500 w-3">{star}</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / REVIEWS.length) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {Number(avg) >= 4.5 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-700">Top Rated</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
              <ThumbsUp className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold text-teal-700">{posP}% positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {REVIEWS.map(r => (
          <motion.div key={r.id} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold flex-shrink-0 text-sm"
                  style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
                  {r.owner[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{r.owner}</p>
                  <p className="text-xs text-slate-400">Pet: {r.pet} · {new Date(r.date).toLocaleDateString('en-IN',{ day:'numeric',month:'short',year:'numeric' })}</p>
                </div>
              </div>
              <Stars filled={r.rating} />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic mb-4">"{r.comment}"</p>
            
            {r.reply ? (
              <div className="mt-4 p-4 bg-slate-50 border-l-4 border-teal-500 rounded-r-xl">
                <p className="text-xs font-bold text-slate-900 mb-1">Your Reply:</p>
                <p className="text-sm text-slate-600">{r.reply}</p>
              </div>
            ) : replyingTo === r.id ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <textarea 
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)} 
                  rows={2} 
                  placeholder="Type your public reply here..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none mb-3 resize-none" 
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setReplyingTo(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5">Cancel</button>
                  <button onClick={() => submitReply(r.id)} className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-lg transition shadow-sm">Post Reply</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end mt-2">
                <button onClick={() => { setReplyingTo(r.id); setReplyText(''); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                  <MessageCircleQuestion className="w-3 h-3"/> Reply
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-700 font-semibold">
        📌 Reviews are submitted by verified pet owners after confirmed appointments.
      </div>
    </div>
  );
};

// ── 1. Pharmacy & Inventory Panel ───────────────────────────────────────────────
const PharmacyPanel = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Rabies Vaccine (Defensor)', stock: 12, min: 10, category: 'Vaccine' },
    { id: 2, name: 'Amoxicillin 250mg', stock: 45, min: 20, category: 'Antibiotic' },
    { id: 3, name: 'Flea & Tick Spray (Frontline)', stock: 4, min: 10, category: 'Parasite Control' },
    { id: 4, name: 'Surgical Gloves (Box)', stock: 2, min: 5, category: 'Supply' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', stock: '', min: '' });

  const toggleStock = (id, amt) => {
    setInventory(inv => inv.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + amt) } : i));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.stock || !newItem.min) return;
    setInventory([{
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      stock: parseInt(newItem.stock, 10),
      min: parseInt(newItem.min, 10)
    }, ...inventory]);
    setNewItem({ name: '', category: '', stock: '', min: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex-1 flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-lg"><Pill className="w-6 h-6"/></div>
          <div><p className="text-xl font-bold text-slate-800">{inventory.length}</p><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Items</p></div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex-1 flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle className="w-6 h-6"/></div>
          <div><p className="text-xl font-bold text-slate-800">{inventory.filter(i => i.stock < i.min).length}</p><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Low Stock Alerts</p></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <p className="font-extrabold text-slate-900">Inventory Management</p>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-sm text-white font-bold bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg shadow-sm transition">
            {showAdd ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} {showAdd ? 'Cancel' : 'Add Item'}
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="px-5 py-4 border-b border-slate-100 bg-white"
              onSubmit={handleAddItem}
            >
              <div className="grid grid-cols-5 gap-3 items-end">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Item Name</label>
                  <input required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Paracetamol 50mg" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Category</label>
                  <input required value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} placeholder="e.g. Painkiller" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Init. Stock</label>
                  <input required type="number" min="0" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} placeholder="0" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Min. Alert</label>
                  <div className="flex gap-2">
                    <input required type="number" min="0" value={newItem.min} onChange={e => setNewItem({...newItem, min: e.target.value})} placeholder="0" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    <button type="submit" className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 shadow-sm"><CheckCircle className="w-5 h-5"/></button>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-xs text-slate-500 uppercase tracking-widest">
              <th className="px-5 py-3 font-bold border-b border-slate-100">Item Name</th>
              <th className="px-5 py-3 font-bold border-b border-slate-100">Category</th>
              <th className="px-5 py-3 font-bold border-b border-slate-100 text-center">Stock</th>
              <th className="px-5 py-3 font-bold border-b border-slate-100 text-center">Status</th>
              <th className="px-5 py-3 font-bold border-b border-slate-100 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm bg-white">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                <td className="px-5 py-4 font-bold text-slate-800">{item.name}</td>
                <td className="px-5 py-4 text-slate-500">{item.category}</td>
                <td className="px-5 py-4 text-center font-bold">{item.stock}</td>
                <td className="px-5 py-4 text-center">
                  {item.stock < item.min 
                    ? <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-full border border-rose-200">Low Stock</span>
                    : <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Healthy</span>}
                </td>
                <td className="px-5 py-4 flex justify-end gap-2">
                  <button onClick={() => toggleStock(item.id, -1)} className="p-1 text-slate-400 hover:text-slate-600 border border-slate-200 rounded shadow-sm hover:bg-white"><Activity className="w-4 h-4"/></button>
                  <button onClick={() => toggleStock(item.id, 1)} className="p-1 text-slate-400 hover:text-teal-600 border border-slate-200 rounded shadow-sm hover:bg-white"><Plus className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── 2. Lab Reports & Certificates Panel ───────────────────────────────────────
const LabReportsPanel = () => {
  const [certs, setCerts] = useState([
    { id: 101, type: 'Rabies Vaccination', pet: 'Max', owner: 'John D.', date: '2026-05-02' },
    { id: 102, type: 'Fit to Travel', pet: 'Bella', owner: 'Sarah M.', date: '2026-04-28' },
  ]);
  const [showIssue, setShowIssue] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newCert, setNewCert] = useState({ type: '', pet: '', owner: '' });

  const handleIssue = (e) => {
    e.preventDefault();
    if (!newCert.type || !newCert.pet || !newCert.owner) return;
    setCerts([{
      id: Date.now(),
      type: newCert.type,
      pet: newCert.pet,
      owner: newCert.owner,
      date: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
    }, ...certs]);
    setNewCert({ type: '', pet: '', owner: '' });
    setShowIssue(false);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    alert("Lab report uploaded successfully and attached to patient record!");
    setShowUpload(false);
  };

  const viewPdf = (type, pet) => {
    alert(`Opening PDF: ${type}_${pet}.pdf`);
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setShowIssue(true); setShowUpload(false); }} className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-500 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-left">
          <FileCheck2 className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="font-extrabold text-lg">Issue Certificate</h3>
          <p className="text-sm opacity-80">Generate a new health or vaccination certificate</p>
        </button>
        <button onClick={() => { setShowUpload(true); setShowIssue(false); }} className="flex-1 bg-white border border-slate-200 text-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 text-left">
          <Microscope className="w-8 h-8 mb-2 text-indigo-500" />
          <h3 className="font-extrabold text-lg">Upload Lab Report</h3>
          <p className="text-sm text-slate-500">Attach bloodwork or scans to a patient record</p>
        </button>
      </div>

      <AnimatePresence>
        {showIssue && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl border border-teal-200 shadow-md p-6 relative">
            <button onClick={() => setShowIssue(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X className="w-5 h-5"/></button>
            <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-teal-600"/> Issue New Certificate</h4>
            <form onSubmit={handleIssue} className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Certificate Type</label>
                <select required value={newCert.type} onChange={e => setNewCert({...newCert, type: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="">Select type...</option>
                  <option value="Rabies Vaccination">Rabies Vaccination</option>
                  <option value="Fit to Travel">Fit to Travel</option>
                  <option value="General Health">General Health</option>
                  <option value="Spay/Neuter">Spay/Neuter</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Pet Name</label>
                <input required value={newCert.pet} onChange={e => setNewCert({...newCert, pet: e.target.value})} placeholder="e.g. Luna" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Owner Name</label>
                <input required value={newCert.owner} onChange={e => setNewCert({...newCert, owner: e.target.value})} placeholder="e.g. Mark T." className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="col-span-3 flex justify-end mt-2">
                <button type="submit" className="bg-teal-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-teal-700 transition shadow-sm">Generate & Save</button>
              </div>
            </form>
          </motion.div>
        )}

        {showUpload && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 relative">
            <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X className="w-5 h-5"/></button>
            <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Microscope className="w-5 h-5 text-indigo-600"/> Upload Lab Report</h4>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Patient Name</label>
                  <input required placeholder="Search patient..." className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Report File (PDF/IMG)</label>
                  <input required type="file" accept=".pdf,image/*" className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm">Upload File</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5">
        <p className="font-extrabold text-slate-900 mb-4">Recently Issued Certificates</p>
        <div className="space-y-3">
          {certs.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-lg text-teal-700"><FileCheck2 className="w-5 h-5"/></div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{c.type}</p>
                  <p className="text-xs text-slate-500">Pet: {c.pet} (Owner: {c.owner}) • {c.date}</p>
                  {/* Blockchain Badge */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield className="w-3 h-3 text-emerald-600"/>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Blockchain Verified #{(c.id % 9999).toString(16).toUpperCase().padStart(6,'0')}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => viewPdf(c.type, c.pet)} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1"><ExternalLink className="w-3 h-3"/> View PDF</button>
            </div>
          ))}
          {certs.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No certificates issued yet.</p>}
        </div>
      </div>

      {/* Medical Timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-indigo-500"/>
          <p className="font-extrabold text-slate-900">Medical Timeline</p>
        </div>
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100">
          {[
            { date:'2026-05-02', event:'Rabies Vaccination', pet:'Max', type:'vaccine', color:'#10b981' },
            { date:'2026-04-28', event:'Fit-to-Travel Certificate issued', pet:'Bella', type:'cert', color:'#6366f1' },
            { date:'2026-04-15', event:'Bloodwork Lab Report uploaded', pet:'Milo', type:'lab', color:'#f59e0b' },
            { date:'2026-03-20', event:'General Health Certificate', pet:'Luna', type:'cert', color:'#14b8a6' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start relative">
              <div className="absolute -left-6 w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{background: item.color}}/>
              <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-800 text-sm">{item.event}</p>
                  <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5"/>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Pet: {item.pet} • {item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vaccination History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-900 mb-4">💉 Vaccination History</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 text-left">
              <th className="pb-3 pr-4">Pet</th><th className="pb-3 pr-4">Vaccine</th><th className="pb-3 pr-4">Date</th><th className="pb-3">Status</th>
            </tr></thead>
            <tbody>
              {[
                {pet:'Max', vaccine:'Rabies (Defensor)', date:'2026-05-02', status:'Valid'},
                {pet:'Luna', vaccine:'DHPP Combo', date:'2026-03-20', status:'Valid'},
                {pet:'Milo', vaccine:'FVRCP', date:'2026-02-10', status:'Due Soon'},
                {pet:'Bella', vaccine:'Bordetella', date:'2025-12-01', status:'Overdue'},
              ].map((v, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-4 font-bold text-slate-800">{v.pet}</td>
                  <td className="py-3 pr-4 text-slate-600">{v.vaccine}</td>
                  <td className="py-3 pr-4 text-slate-500">{v.date}</td>
                  <td className="py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ v.status==='Valid'?'bg-emerald-100 text-emerald-700': v.status==='Due Soon'?'bg-amber-100 text-amber-700':'bg-rose-100 text-rose-700'}`}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── 3. Teleconsult Hub Panel ──────────────────────────────────────────────────
const TeleconsultPanel = () => {
  const navigate = useNavigate();
  const [liveNotes, setLiveNotes] = useState('');
  const [inCall, setInCall] = useState(false);
  const [rxGenerated, setRxGenerated] = useState(false);

  const generateRx = () => {
    const note = liveNotes.trim();
    if (!note) return;
    const rx = { id: Date.now(), patient: 'Charlie', medication: 'Apoquel 16mg', dosage: '1 tablet twice daily', duration: '14 days', date: new Date().toLocaleDateString('en-CA'), vet: 'Dr. Sharma' };
    const prev = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
    localStorage.setItem('allPrescriptions', JSON.stringify([rx, ...prev]));
    setRxGenerated(true);
    setTimeout(() => setRxGenerated(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Hero card */}
      <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 opacity-10"><Video className="w-48 h-48"/></div>
        <div className="relative z-10">
          <span className="bg-indigo-800 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Virtual Clinic</span>
          <h2 className="text-2xl font-black mt-3">Ready for your next call?</h2>
          <p className="text-indigo-200 text-sm mt-1 max-w-sm">Manage your upcoming online video consultations. Ensure your camera and microphone are connected.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => { navigate('/telehealth'); setInCall(true); }} className="bg-white text-indigo-900 font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-indigo-50 transition flex items-center gap-2">
              <Video className="w-4 h-4" /> Start Walk-in Call
            </button>
            <button onClick={() => setInCall(v => !v)} className="border border-indigo-400 text-indigo-100 font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-800 transition text-sm">
              {inCall ? '⏹ End Session' : '📋 Open Notes Panel'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Consultation Panel */}
      <AnimatePresence>
        {inCall && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"/>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Live Session — Charlie (Golden Retriever)</span>
            </div>

            {/* Mock video frame */}
            <div className="bg-slate-900 rounded-2xl h-40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 30% 50%,#6366f1,transparent)'}}/>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-2">E</div>
                <p className="text-white text-sm font-bold">Emily R. (Owner)</p>
                <p className="text-slate-400 text-xs">Connected • HD</p>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs">🎤</div>
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs">📷</div>
              </div>
            </div>

            {/* Live Notes */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">📝 Live Consultation Notes</label>
              <textarea value={liveNotes} onChange={e => setLiveNotes(e.target.value)}
                rows={4} placeholder="Type your clinical notes during the call... (symptoms, observations, treatment plan)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-300 outline-none resize-none bg-slate-50"/>
            </div>

            <div className="flex gap-3">
              <button onClick={generateRx} disabled={!liveNotes.trim()}
                className="flex-1 py-2.5 text-white font-bold rounded-xl shadow transition hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{background:'linear-gradient(135deg,#6366f1,#9333ea)'}}>
                📋 Generate Prescription from Notes
              </button>
            </div>
            {rxGenerated && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-bold">
                ✅ Prescription generated and saved for Charlie!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-900 mb-4">Upcoming Video Appointments (Today)</p>
        <div className="flex items-center gap-4 p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 font-bold rounded-xl flex items-center justify-center flex-shrink-0">11:30</div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm">Video Consult: Charlie (Golden Retriever)</p>
            <p className="text-xs text-slate-500">Owner: Emily R. • Follow-up on skin allergy</p>
          </div>
          <button onClick={() => navigate('/telehealth')} className="bg-indigo-600 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition animate-pulse">Join Call</button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6 pb-2">No other video appointments scheduled today.</p>
      </div>
    </div>
  );
};

// ── Messages Panel (Realtime Chat) ────────────────────────────────────────────
const VetMessagesPanel = () => {
  const DEFAULT_CONVOS = [
    { id:1, name:'Priya S.', pet:'Bruno', avatar:'P', unread:2, last:'Is it okay to give him extra food?', time:'2m ago' },
    { id:2, name:'Emily R.', pet:'Charlie', avatar:'E', unread:0, last:'Thank you doctor!', time:'1h ago' },
    { id:3, name:'Rajan A.', pet:'Rocky', avatar:'R', unread:1, last:'He is still limping...', time:'3h ago' },
  ];
  const [convos] = useState(DEFAULT_CONVOS);
  const [active, setActive] = useState(DEFAULT_CONVOS[0]);
  const [msgs, setMsgs] = useState([
    { id:1, from:'owner', text:"Hi Doctor, Bruno has been scratching a lot since yesterday.", time:'10:02 AM' },
    { id:2, from:'vet', text:"Hello! That could be an allergic reaction. Is there any redness on the skin?", time:'10:05 AM' },
    { id:3, from:'owner', text:"Yes, his belly looks red and irritated.", time:'10:07 AM' },
    { id:4, from:'owner', text:"Is it okay to give him extra food during this time?", time:'10:09 AM' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), from: 'vet', text: input, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) };
    setMsgs(m => [...m, newMsg]);
    setInput('');
    // Simulate owner typing
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { id: Date.now()+1, from: 'owner', text: 'Thank you doctor! 🙏', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    }, 2000);
  };

  const shareFile = () => {
    setMsgs(m => [...m, { id: Date.now(), from: 'vet', text: '📎 Lab_Report_Bruno.pdf (attached)', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
  };

  return (
    <div className="flex h-[600px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <p className="font-extrabold text-slate-900">Messages</p>
          <p className="text-xs text-slate-400">Pet owner conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convos.map(c => (
            <button key={c.id} onClick={() => setActive(c)}
              className={`w-full flex items-start gap-3 p-4 text-left border-b border-slate-50 transition ${active.id===c.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-slate-50'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-slate-800 text-sm truncate">{c.name}</p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{c.last}</p>
                <p className="text-[10px] text-teal-600 font-bold">Pet: {c.pet}</p>
              </div>
              {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>{active.avatar}</div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{active.name}</p>
            <p className="text-xs text-emerald-500 font-semibold">● Online • Pet: {active.pet}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.from==='vet' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                m.from==='vet' ? 'text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
              }`} style={m.from==='vet' ? {background:'linear-gradient(135deg,#14b8a6,#6366f1)'} : {}}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from==='vet' ? 'text-white/70' : 'text-slate-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <button onClick={shareFile} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition" title="Share file">
            <Paperclip className="w-5 h-5"/>
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
            placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none"/>
          <button onClick={send} disabled={!input.trim()}
            className="p-2.5 rounded-xl text-white disabled:opacity-50 transition hover:opacity-90"
            style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
            <Send className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── 4. Task Manager Panel ─────────────────────────────────────────────────────
const TaskManagerPanel = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('vetDailyTasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: 'Call diagnostic lab for Bella’s bloodwork results', done: false },
      { id: 2, text: 'Reorder surgical gloves and syringes', done: true },
      { id: 3, text: 'Follow up with Max’s owner regarding post-surgery diet', done: false },
      { id: 4, text: 'Update clinic holiday hours on profile', done: false },
    ];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('vetDailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask, done: false }, ...tasks]);
    setNewTask('');
  };
  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const delTask = (id) => setTasks(ts => ts.filter(t => t.id !== id));

  return (
    <div className="max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl"><ListTodo className="w-6 h-6"/></div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Daily To-Do List</h2>
          <p className="text-xs text-slate-500">Track your clinical and administrative tasks</p>
        </div>
      </div>
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a new task..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
        <button type="submit" className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition shadow-sm flex items-center"><Plus className="w-5 h-5"/></button>
      </form>
      <div className="space-y-2">
        {tasks.map(t => (
          <div key={t.id} className={`flex items-start gap-3 p-3 rounded-xl border transition ${t.done ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-amber-200 shadow-sm'}`}>
            <button onClick={() => toggleTask(t.id)} className={`mt-0.5 ${t.done ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}>
              {t.done ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
            </button>
            <p className={`flex-1 text-sm ${t.done ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}`}>{t.text}</p>
            <button onClick={() => delTask(t.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition focus:opacity-100"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-center text-sm text-slate-400 py-4">All caught up! No tasks pending.</p>}
      </div>
    </div>
  );
};

// ── 5. Pet Q&A Forum Panel ────────────────────────────────────────────────────
const VetForumPanel = () => {
  const [repPoints, setRepPoints] = useState(240);
  const [questions, setQuestions] = useState([
    { id: 1, title: 'Is it normal for my 8-week old puppy to sleep 18 hours a day?', author: 'NewDogMom', time: '2 hours ago', tags: ['Puppy', 'Behavior'] },
    { id: 2, title: 'What is the best diet for a cat with early-stage kidney disease?', author: 'FelineLover99', time: '5 hours ago', tags: ['Cat', 'Diet', 'Kidney'] },
  ]);
  const [answering, setAnswering] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const submitAnswer = (id) => {
    if (!answerText.trim()) return;
    setQuestions(qs => qs.filter(q => q.id !== id));
    setRepPoints(r => r + 10);
    setAnswering(null);
    setAnswerText('');
    alert("Answer posted successfully! You earned +10 Rep Points.");
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><MessageCircleQuestion className="w-6 h-6"/> Community Q&A</h2>
          <p className="text-sky-100 text-sm mt-1">Answer public questions to earn reputation badges and attract new clients.</p>
        </div>
        <div className="text-center bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30 transform transition hover:scale-105">
          <p className="text-2xl font-black">{repPoints}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Rep points</p>
        </div>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {questions.map(q => (
            <motion.div key={q.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
              <h3 className="font-extrabold text-slate-900 text-lg mb-1">{q.title}</h3>
              <p className="text-xs text-slate-400 mb-3">Asked by <span className="font-bold text-slate-500">{q.author}</span> • {q.time}</p>
              
              {answering === q.id ? (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} rows={3} placeholder="Write your professional advice here..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none mb-3 resize-none" />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setAnswering(null)} className="text-sm font-bold text-slate-500 hover:text-slate-700 px-4 py-2">Cancel</button>
                    <button onClick={() => submitAnswer(q.id)} className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl transition shadow-sm">Post Answer</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div className="flex gap-2">
                    {q.tags.map(t => <span key={t} className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{t}</span>)}
                  </div>
                  <button onClick={() => { setAnswering(q.id); setAnswerText(''); }} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition">Write Answer</button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {questions.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <MessageCircleQuestion className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="font-bold text-slate-600">You've answered all open questions!</p>
            <p className="text-sm text-slate-400 mt-1">Check back later for more questions from the community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const VetDashboard = () => {
  const [active, setActive] = useState('dashboard');
  const [vetProfile, setVetProfile] = useState(null);
  const [completingAppt, setCompletingAppt] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleCompleteSave = (data) => {
    const record = { id: Date.now(), ...data, appt: completingAppt, date: new Date().toLocaleDateString(), vet: vetProfile?.name || 'Dr. Vet' };
    const prevRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    localStorage.setItem('medicalRecords', JSON.stringify([record, ...prevRecords]));

    // Update appointment status in shared list
    const ownerAppts = JSON.parse(localStorage.getItem('ownerAppts') || '[]');
    const updatedAppts = ownerAppts.map(a => (a.pet === completingAppt.petName || a.pet === completingAppt.pet) ? { ...a, status: 'COMPLETED' } : a);
    localStorage.setItem('ownerAppts', JSON.stringify(updatedAppts));

    setCompletingAppt(null);
  };

  const loadVetProfile = async () => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!token) return;

    try {
      const res = await axios.get(
        `http://${window.location.hostname}:8081/api/vets/my-profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVetProfile(res.data);
    } catch {
      // Fallback: try building from localStorage
      if (currentUser.email) {
        const allVets = JSON.parse(localStorage.getItem('pendingVets') || '[]');
        const mine = allVets.find(v => v.email === currentUser.email);
        if (mine) setVetProfile(mine);
      }
    }
  };

  useEffect(() => {
    loadVetProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const activeLabel = SIDEBAR.find(m => m.key === active)?.label || 'Dashboard';

  // ── Inline Panels ───────────────────────────────────────────────────────────
  const VetDiagnosticsPanel = () => {
    const SYMPTOMS_LIST = ['Lethargy','Vomiting','Diarrhoea','Loss of Appetite','Coughing','Sneezing','Limping','Excessive Thirst','Skin Rash','Eye Discharge','Pale Gums','Rapid Breathing'];
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const DISEASES = [
      { name:'Canine Parvovirus',   symptoms:['Vomiting','Diarrhoea','Lethargy','Loss of Appetite'], risk:'High',   color:'#ef4444' },
      { name:'Kennel Cough',        symptoms:['Coughing','Sneezing','Lethargy'],                      risk:'Medium', color:'#f59e0b' },
      { name:'Diabetes Mellitus',   symptoms:['Excessive Thirst','Lethargy','Loss of Appetite'],      risk:'Medium', color:'#f59e0b' },
      { name:'Skin Allergy',        symptoms:['Skin Rash','Excessive Thirst','Eye Discharge'],        risk:'Low',    color:'#10b981' },
      { name:'Anaemia',             symptoms:['Pale Gums','Lethargy','Rapid Breathing'],              risk:'High',   color:'#ef4444' },
      { name:'Respiratory Infection', symptoms:['Coughing','Rapid Breathing','Sneezing','Lethargy'], risk:'Medium', color:'#f59e0b' },
    ];
    const toggle = s => setSelected(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
    const diagnose = () => {
      setLoading(true);
      setTimeout(() => {
        const scored = DISEASES.map(d => ({ ...d, score: d.symptoms.filter(s => selected.includes(s)).length }));
        const sorted = scored.sort((a,b) => b.score - a.score).filter(d => d.score > 0);
        setResult(sorted.length > 0 ? sorted : [{ name:'No specific disease matched', risk:'Low', color:'#10b981', score:0, symptoms:[] }]);
        setLoading(false);
      }, 1800);
    };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
          <h2 className="text-2xl font-black">🔬 AI Disease Diagnostics</h2>
          <p className="text-indigo-200 text-sm mt-1">Select observed symptoms to get AI-powered differential diagnosis.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">Select Symptoms</p>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOMS_LIST.map(s => (
                <button key={s} onClick={() => toggle(s)}
                  className={`p-3 rounded-xl border-2 text-xs font-bold text-left transition ${selected.includes(s)?'bg-indigo-50 border-indigo-300 text-indigo-800':'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-200'}`}>
                  {selected.includes(s)?'✓ ':''}{s}
                </button>
              ))}
            </div>
            <button onClick={diagnose} disabled={loading||selected.length===0}
              className="w-full mt-4 py-3 text-white font-bold rounded-xl disabled:opacity-50"
              style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
              {loading ? '🧠 Diagnosing...' : '🔬 Run AI Diagnosis'}
            </button>
          </div>
          <div className="space-y-3">
            {result ? result.map((d,i) => (
              <div key={i} className="bg-white rounded-2xl border-2 p-4" style={{borderColor:d.color+'40'}}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-extrabold text-slate-800">{d.name}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:d.color+'18',color:d.color}}>{d.risk} Risk</span>
                </div>
                <p className="text-xs text-slate-400">Matching: {d.score}/{d.symptoms.length} symptoms</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="h-1.5 rounded-full" style={{width:`${d.symptoms.length?Math.round(d.score/d.symptoms.length*100):0}%`,background:d.color}}/>
                </div>
              </div>
            )) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                <div className="text-4xl mb-2">🔬</div>
                <p className="font-bold">Select symptoms & run diagnosis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const VetEmergencyQueuePanel = () => {
    const [queue, setQueue] = useState([
      {
        id:'EM-01', pet:'Bruno',  species:'Dog',  breed:'Labrador Retriever', age:'4 yrs', weight:'32 kg',
        owner:'Priya Sharma',  ownerPhone:'+91-9876543210', ownerEmail:'priya@email.com',
        triage:'Critical', symptom:'Seizure / Collapse',
        history:'No prior seizure history. Vaccinations up to date. On joint supplements.',
        vitals:{ hr:'148 bpm', temp:'39.8°C', rr:'32/min', bp:'High' },
        notes:'Possible epilepsy or toxin ingestion. Bloodwork required immediately.',
        wait:'0 min', vet:'Dr. You', status:'active',
      },
      {
        id:'EM-02', pet:'Rocky',  species:'Dog',  breed:'Siberian Husky',      age:'3 yrs', weight:'28 kg',
        owner:'Rajan Anand',   ownerPhone:'+91-9123456789', ownerEmail:'rajan@email.com',
        triage:'Urgent', symptom:'Laboured Breathing',
        history:'Mild respiratory issues noted in last visit (Apr 2026). No cardiac history.',
        vitals:{ hr:'130 bpm', temp:'39.2°C', rr:'46/min', bp:'Normal' },
        notes:'Suspected pneumonia or pleural effusion. Chest X-ray recommended.',
        wait:'8 min', vet:'Unassigned', status:'waiting',
      },
      {
        id:'EM-03', pet:'Charlie', species:'Dog', breed:'Golden Retriever',    age:'6 yrs', weight:'30 kg',
        owner:'Emily Roberts', ownerPhone:'+91-9001234567', ownerEmail:'emily@email.com',
        triage:'Urgent', symptom:'Severe Vomiting',
        history:'History of food allergies. Changed diet 2 days ago.',
        vitals:{ hr:'115 bpm', temp:'38.9°C', rr:'28/min', bp:'Low' },
        notes:'Possible dietary intoxication or GI obstruction. Ultrasound advised.',
        wait:'15 min', vet:'Dr. You', status:'waiting',
      },
      {
        id:'EM-04', pet:'Luna',   species:'Cat',  breed:'Persian Cat',         age:'2 yrs', weight:'4.2 kg',
        owner:'Meena Kumar',   ownerPhone:'+91-9988776655', ownerEmail:'meena@email.com',
        triage:'Critical', symptom:'Pale Gums / Cold Limbs',
        history:'Indoor cat. No prior illness. Sudden collapse at home.',
        vitals:{ hr:'210 bpm', temp:'36.1°C', rr:'52/min', bp:'Very Low' },
        notes:'Suspected anaemia or internal haemorrhage. Emergency blood transfusion may be required.',
        wait:'3 min', vet:'Dr. You', status:'active',
      },
    ]);

    const [expanded, setExpanded] = useState(null);
    const [noteInput, setNoteInput] = useState('');
    const [toast, setToast] = useState('');

    const admit  = (e, id) => { e.stopPropagation(); setQueue(q => q.map(c => c.id===id ? {...c,status:'admitted'} : c)); showToast('✅ Patient admitted to consultation.'); };
    const resolve = (e, id) => { e.stopPropagation(); setQueue(q => q.map(c => c.id===id ? {...c,status:'resolved'} : c)); setExpanded(null); showToast('✅ Case marked resolved.'); };
    const addNote = (id) => {
      if (!noteInput.trim()) return;
      setQueue(q => q.map(c => c.id===id ? {...c,notes: c.notes + '\n• ' + noteInput} : c));
      setNoteInput('');
      showToast('📝 Note saved.');
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const triColor  = { Critical:'bg-rose-100 text-rose-700',   Urgent:'bg-amber-100 text-amber-700'  };
    const triBorder = { Critical:'#fecaca',                      Urgent:'#fde68a'                      };
    const statBadge = { active:'bg-rose-100 text-rose-700 animate-pulse', waiting:'bg-amber-100 text-amber-700', admitted:'bg-emerald-100 text-emerald-700', resolved:'bg-slate-100 text-slate-500' };

    const expandedCase = queue.find(c => c.id === expanded);

    return (
      <div className="space-y-5 max-w-4xl">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl"
              style={{background:'linear-gradient(135deg,#10b981,#14b8a6)'}}>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#ef4444,#f59e0b)'}}>
          <h2 className="text-2xl font-black">🚨 Emergency Queue</h2>
          <p className="text-orange-200 text-sm mt-1">Click any case card to view full patient details, vitals, and actions.</p>
          <div className="flex gap-6 mt-3">
            {[['Active',queue.filter(c=>c.status==='active').length],['Waiting',queue.filter(c=>c.status==='waiting').length],['Admitted',queue.filter(c=>c.status==='admitted').length],['Resolved',queue.filter(c=>c.status==='resolved').length]].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-orange-200">{l}</p></div>
            ))}
          </div>
        </div>

        {/* Two-column layout when a card is expanded */}
        <div className={`gap-4 ${expandedCase ? 'grid grid-cols-1 lg:grid-cols-2' : 'space-y-3'}`}>
          {/* Queue list */}
          <div className="space-y-3">
            {queue.map((c,i) => {
              const isExpanded = expanded === c.id;
              return (
                <motion.div key={c.id} layout
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                  onClick={() => setExpanded(isExpanded ? null : c.id)}
                  className={`bg-white rounded-2xl border-2 shadow-sm p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${c.status==='resolved'?'opacity-50':''} ${isExpanded?'ring-2 ring-indigo-400':''}`}
                  style={{borderColor: triBorder[c.triage] || '#e2e8f0'}}>
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${c.triage==='Critical'?'bg-rose-100':'bg-amber-100'}`}>
                      {c.triage==='Critical'?'🚨':'⚠️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-extrabold text-slate-900">{c.pet}</span>
                        <span className="text-xs text-slate-400">{c.breed}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${triColor[c.triage]}`}>{c.triage}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statBadge[c.status]}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">👤 {c.owner} · 🩺 {c.symptom}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Case {c.id} · Wait: {c.wait} · Vet: {c.vet}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {c.status !== 'admitted' && c.status !== 'resolved' && (
                        <button onClick={(e) => admit(e, c.id)}
                          className="px-4 py-1.5 text-xs font-extrabold text-white rounded-xl hover:opacity-90 transition active:scale-95"
                          style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
                          Admit
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400">{isExpanded ? '▲ Collapse' : '▼ Details'}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Expanded detail panel */}
          <AnimatePresence>
            {expandedCase && (
              <motion.div key={expandedCase.id}
                initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}
                className="bg-white rounded-2xl border-2 shadow-lg overflow-hidden self-start"
                style={{borderColor: triBorder[expandedCase.triage]}}>

                {/* Detail header */}
                <div className="p-5 text-white relative" style={{background: expandedCase.triage==='Critical' ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'linear-gradient(135deg,#f59e0b,#ef4444)'}}>
                  <button onClick={() => setExpanded(null)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-sm transition">
                    ✕
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{expandedCase.triage==='Critical'?'🚨':'⚠️'}</div>
                    <div>
                      <p className="text-2xl font-black">{expandedCase.pet}</p>
                      <p className="text-sm text-orange-200">{expandedCase.breed} · {expandedCase.age} · {expandedCase.weight}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{expandedCase.triage}</span>
                    <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{expandedCase.status}</span>
                    <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">Wait: {expandedCase.wait}</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Vitals */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">❤️ Live Vitals</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[['Heart Rate', expandedCase.vitals.hr, '#ef4444'],['Temperature', expandedCase.vitals.temp, '#f59e0b'],['Resp. Rate', expandedCase.vitals.rr, '#6366f1'],['Blood Pressure', expandedCase.vitals.bp, '#14b8a6']].map(([l,v,c]) => (
                        <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400">{l}</p>
                          <p className="font-extrabold text-sm mt-0.5" style={{color:c}}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Symptom */}
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                    <p className="text-xs font-extrabold text-rose-500 uppercase tracking-widest mb-1">🩺 Presenting Symptom</p>
                    <p className="font-bold text-rose-800">{expandedCase.symptom}</p>
                  </div>

                  {/* Medical history */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">📋 Medical History</p>
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">{expandedCase.history}</p>
                  </div>

                  {/* Owner contact */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">👤 Owner Contact</p>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 flex-shrink-0">{expandedCase.owner[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm">{expandedCase.owner}</p>
                        <p className="text-xs text-slate-400 truncate">{expandedCase.ownerPhone} · {expandedCase.ownerEmail}</p>
                      </div>
                      <a href={`tel:${expandedCase.ownerPhone}`}
                        className="px-3 py-1.5 text-xs font-bold text-white rounded-lg flex-shrink-0"
                        style={{background:'linear-gradient(135deg,#10b981,#14b8a6)'}}>
                        📞 Call
                      </a>
                    </div>
                  </div>

                  {/* Vet notes */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">🧠 Vet Notes</p>
                    <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-3 whitespace-pre-line">{expandedCase.notes}</p>
                    <div className="flex gap-2 mt-2">
                      <input value={noteInput} onChange={e => setNoteInput(e.target.value)}
                        placeholder="Add note..."
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
                        onKeyDown={e => e.key==='Enter' && addNote(expandedCase.id)}/>
                      <button onClick={() => addNote(expandedCase.id)}
                        className="px-3 py-2 text-xs font-bold text-white rounded-xl"
                        style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    {expandedCase.status !== 'admitted' && expandedCase.status !== 'resolved' && (
                      <button onClick={(e) => admit(e, expandedCase.id)}
                        className="flex-1 py-2.5 text-white text-sm font-extrabold rounded-xl hover:opacity-90 transition"
                        style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
                        🏥 Admit Patient
                      </button>
                    )}
                    {expandedCase.status !== 'resolved' && (
                      <button onClick={(e) => resolve(e, expandedCase.id)}
                        className="flex-1 py-2.5 text-white text-sm font-bold rounded-xl hover:opacity-90 transition"
                        style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>
                        ✅ Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {queue.every(c => c.status === 'resolved') && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-extrabold text-emerald-800">All emergency cases resolved!</p>
          </div>
        )}
      </div>
    );
  };


  const VetClientManagementPanel = () => {
    const CLIENTS = [
      {
        name:'Priya Sharma',   initial:'P', pet:'Bruno',   breed:'Labrador Retriever', species:'Dog',
        age:'4 yrs', weight:'32 kg', color:'bg-indigo-500',
        appts:12, last:'2026-05-05', status:'Active', spend:'₹8,400',
        phone:'+91-9876543210', email:'priya.sharma@email.com', location:'Anna Nagar, Chennai',
        memberSince:'Jan 2024',
        history:[
          { date:'2026-05-05', type:'Routine Checkup',   diagnosis:'Healthy',              cost:'₹800'  },
          { date:'2026-04-10', type:'Vaccination',        diagnosis:'Rabies booster given', cost:'₹650'  },
          { date:'2026-03-18', type:'Skin Issue',         diagnosis:'Mild dermatitis',      cost:'₹1,200'},
          { date:'2026-02-01', type:'Dental Cleaning',   diagnosis:'Completed',            cost:'₹2,000'},
        ],
        vaccines:['Rabies ✅','Distemper ✅','Parvovirus ✅','Bordetella ⏳'],
        allergies:'None known',
        notes:'Friendly dog. Owner is very attentive. Prefers morning slots.',
      },
      {
        name:'Rajan Anand',    initial:'R', pet:'Rocky',   breed:'Siberian Husky',      species:'Dog',
        age:'3 yrs', weight:'28 kg', color:'bg-teal-500',
        appts:7, last:'2026-04-28', status:'Active', spend:'₹4,200',
        phone:'+91-9123456789', email:'rajan.anand@email.com', location:'T.Nagar, Chennai',
        memberSince:'Jun 2024',
        history:[
          { date:'2026-04-28', type:'Respiratory Issue',  diagnosis:'Mild bronchitis',      cost:'₹950'  },
          { date:'2026-03-10', type:'Routine Checkup',   diagnosis:'Healthy',              cost:'₹800'  },
          { date:'2026-01-22', type:'Vaccination',        diagnosis:'All boosters done',    cost:'₹1,200'},
        ],
        vaccines:['Rabies ✅','Distemper ✅','Parvovirus ✅','Leptospira ✅'],
        allergies:'Pollen (mild)',
        notes:'Rocky is energetic. Needs muzzle during examination.',
      },
      {
        name:'Emily Roberts',  initial:'E', pet:'Charlie', breed:'Golden Retriever',    species:'Dog',
        age:'6 yrs', weight:'30 kg', color:'bg-violet-500',
        appts:18, last:'2026-05-01', status:'Premium', spend:'₹14,600',
        phone:'+91-9001234567', email:'emily.roberts@email.com', location:'Velachery, Chennai',
        memberSince:'Mar 2023',
        history:[
          { date:'2026-05-01', type:'Joint Pain Checkup', diagnosis:'Early arthritis',      cost:'₹1,500'},
          { date:'2026-04-12', type:'Blood Test',         diagnosis:'All normal',           cost:'₹2,200'},
          { date:'2026-03-05', type:'Grooming + Checkup', diagnosis:'Healthy coat',         cost:'₹1,800'},
          { date:'2026-02-14', type:'Dental',             diagnosis:'2 extractions',        cost:'₹3,500'},
        ],
        vaccines:['Rabies ✅','Distemper ✅','Parvovirus ✅','Bordetella ✅'],
        allergies:'Beef protein',
        notes:'Loyal client since 2023. Premium plan holder. Prefers Dr. You specifically.',
      },
      {
        name:'Meena Kumar',    initial:'M', pet:'Luna',    breed:'Persian Cat',         species:'Cat',
        age:'2 yrs', weight:'4.2 kg', color:'bg-rose-500',
        appts:5, last:'2026-03-20', status:'Inactive', spend:'₹2,100',
        phone:'+91-9988776655', email:'meena.kumar@email.com', location:'Adyar, Chennai',
        memberSince:'Oct 2024',
        history:[
          { date:'2026-03-20', type:'URI Treatment',      diagnosis:'Feline herpesvirus',   cost:'₹900'  },
          { date:'2026-02-05', type:'Spay Surgery',       diagnosis:'Completed',            cost:'₹4,500'},
          { date:'2025-12-10', type:'Vaccination',        diagnosis:'FVRCP given',          cost:'₹750'  },
        ],
        vaccines:['FVRCP ✅','Rabies ✅','FeLV ⏳'],
        allergies:'None known',
        notes:'Indoor cat. Owner last visited 6 weeks ago. Consider follow-up reminder.',
      },
    ];

    const [search,   setSearch]   = useState('');
    const [selected, setSelected] = useState(null);
    const [toast,    setToast]    = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const statusStyle = {
      Active:   'bg-emerald-100 text-emerald-700',
      Premium:  'bg-violet-100 text-violet-700',
      Inactive: 'bg-slate-100 text-slate-500',
    };

    const vis = CLIENTS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.pet.toLowerCase().includes(search.toLowerCase()) ||
      c.breed.toLowerCase().includes(search.toLowerCase())
    );

    const client = selected ? CLIENTS.find(c => c.name === selected) : null;

    return (
      <div className="space-y-5 max-w-5xl">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl"
              style={{background:GRAD}}>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="rounded-2xl p-6 text-white" style={{background:GRAD}}>
          <h2 className="text-2xl font-black">👥 Client Management</h2>
          <p className="text-teal-100 text-sm mt-1">Click any client card to view full profile, appointment history, and records.</p>
          <div className="flex gap-6 mt-3">
            {[['Total Clients', CLIENTS.length],['Premium', CLIENTS.filter(c=>c.status==='Premium').length],['Inactive', CLIENTS.filter(c=>c.status==='Inactive').length]].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients or pets..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none"/>
        </div>

        {/* Two-column layout */}
        <div className={`gap-4 ${client ? 'grid grid-cols-1 lg:grid-cols-2 items-start' : 'space-y-3'}`}>

          {/* Client list */}
          <div className="space-y-3">
            {vis.map((c, i) => {
              const isSelected = selected === c.name;
              return (
                <motion.div key={c.name}
                  initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                  onClick={() => setSelected(isSelected ? null : c.name)}
                  className={`bg-white rounded-2xl border-2 shadow-sm p-5 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected ? 'ring-2 ring-teal-400' : 'border-slate-100'}`}
                  style={isSelected ? {borderColor:'#14b8a6'} : {}}>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold flex-shrink-0 ${c.color}`}>
                    {c.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400 truncate">{c.pet} ({c.breed}) · {c.appts} appts · Last: {c.last}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-slate-900 text-sm">{c.spend}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[c.status]}`}>{c.status}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{isSelected ? '▲ Collapse' : '▼ Details'}</p>
                  </div>
                </motion.div>
              );
            })}
            {vis.length === 0 && (
              <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400">
                <div className="text-3xl mb-2">🔍</div>
                <p className="font-bold">No clients found</p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {client && (
              <motion.div key={client.name}
                initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
                className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden">

                {/* Client header */}
                <div className="p-5 text-white relative" style={{background:GRAD}}>
                  <button onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-sm transition">
                    ✕
                  </button>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0 ${client.color}`}>
                      {client.initial}
                    </div>
                    <div>
                      <p className="text-xl font-black">{client.name}</p>
                      <p className="text-sm text-teal-100">{client.location} · Member since {client.memberSince}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{client.status}</span>
                    <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">Total Spend: {client.spend}</span>
                    <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full">{client.appts} Appointments</span>
                  </div>
                </div>

                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

                  {/* Pet Profile */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">🐾 Pet Profile</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[['Name', client.pet],['Breed', client.breed],['Species', client.species],['Age', client.age],['Weight', client.weight],['Allergies', client.allergies]].map(([l,v]) => (
                        <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400">{l}</p>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vaccination status */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">💉 Vaccination Status</p>
                    <div className="flex flex-wrap gap-2">
                      {client.vaccines.map(v => (
                        <span key={v} className={`text-xs font-bold px-3 py-1 rounded-full border ${v.includes('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{v}</span>
                      ))}
                    </div>
                  </div>

                  {/* Owner contact */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">📞 Owner Contact</p>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs w-16">Phone</span>
                        <span className="font-bold text-slate-800 text-sm">{client.phone}</span>
                        <a href={`tel:${client.phone}`} className="ml-auto px-2 py-1 text-[10px] font-bold text-white rounded-lg" style={{background:GRAD}}>Call</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs w-16">Email</span>
                        <span className="font-bold text-slate-800 text-xs truncate">{client.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment history */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">📋 Appointment History</p>
                    <div className="space-y-2">
                      {client.history.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-extrabold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm">{h.type}</p>
                            <p className="text-xs text-slate-400">{h.diagnosis} · {h.date}</p>
                          </div>
                          <span className="font-extrabold text-slate-700 text-sm flex-shrink-0">{h.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vet notes */}
                  <div>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">🧠 Vet Notes</p>
                    <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-3">{client.notes}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => showToast(`📅 Booking appointment for ${client.name}...`)}
                      className="flex-1 py-2.5 text-white text-xs font-extrabold rounded-xl hover:opacity-90 transition"
                      style={{background:GRAD}}>
                      📅 Book Appointment
                    </button>
                    <button onClick={() => showToast(`💬 Opening chat with ${client.name}...`)}
                      className="flex-1 py-2.5 bg-white border-2 border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition">
                      💬 Message
                    </button>
                    <button onClick={() => showToast(`📄 Loading ${client.pet}'s records...`)}
                      className="flex-1 py-2.5 bg-white border-2 border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition">
                      📄 Records
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };


  const VetClinicOpsPanel = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => { const t = setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); }, []);
    const SERVICES = [
      { name:'Reception',    status:'online',  staff:2, load:78 },
      { name:'Surgery Room', status:'busy',    staff:3, load:95 },
      { name:'Lab',          status:'online',  staff:1, load:55 },
      { name:'X-Ray Unit',   status:'online',  staff:1, load:40 },
      { name:'ICU',          status:'alert',   staff:2, load:100 },
      { name:'Pharmacy',     status:'online',  staff:1, load:60 },
    ];
    const FEED = [
      { time:'08:15', event:'Emergency admission: Bruno (Seizure)',     type:'emergency' },
      { time:'09:00', event:'Appointment started: Rocky – Dr. You',     type:'appt'      },
      { time:'09:42', event:'Lab results ready for Charlie',            type:'lab'       },
      { time:'10:05', event:'Prescription issued: Luna – Apoquel 16mg', type:'rx'        },
      { time:'10:30', event:'New appointment booked: Charlie 3 PM',     type:'booking'   },
    ];
    const statusCfg = { online:'bg-emerald-100 text-emerald-700', busy:'bg-amber-100 text-amber-700', alert:'bg-rose-100 text-rose-700 animate-pulse' };
    const feedColor  = { emergency:'text-rose-500', appt:'text-indigo-500', lab:'text-teal-500', rx:'text-violet-500', booking:'text-amber-500' };
    return (
      <div className="space-y-5 max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e293b,#0f172a)'}}>
          <div className="absolute right-6 top-6 text-right">
            <p className="text-3xl font-extrabold text-teal-400 font-mono">{time.toLocaleTimeString()}</p>
            <p className="text-xs text-slate-400">{time.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
          </div>
          <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🏥 Live Operations</span>
          <h2 className="text-2xl font-black mt-2">Clinic Operations Board</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time view of all clinic departments, staff, and workflows.</p>
          <div className="flex gap-6 mt-4">
            {[['Rooms Online',SERVICES.filter(s=>s.status==='online').length],['Busy',SERVICES.filter(s=>s.status==='busy').length],['Alert',SERVICES.filter(s=>s.status==='alert').length],['Staff Active',SERVICES.reduce((a,s)=>a+s.staff,0)]].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold text-white">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">🏥 Department Status</p>
            <div className="space-y-3">
              {SERVICES.map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg[s.status]}`}>{s.status}</span>
                      <span className="ml-auto text-xs text-slate-400">{s.staff} staff</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{width:`${s.load}%`,background:s.load>=90?'#ef4444':s.load>=70?'#f59e0b':'#10b981'}}/>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold w-9 text-right" style={{color:s.load>=90?'#ef4444':s.load>=70?'#f59e0b':'#10b981'}}>{s.load}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">📡 Live Activity Feed</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {FEED.map((f,i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold w-12 flex-shrink-0">{f.time}</span>
                  <p className={`text-xs font-bold ${feedColor[f.type]}`}>{f.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VetPerformancePanel = () => {
    const REVIEWS = [
      { name:'Priya S.', rating:5, text:'Dr. was amazing! Bruno is fully recovered.', date:'May 5', sentiment:'positive' },
      { name:'Rajan A.', rating:4, text:'Very professional and caring approach.',    date:'Apr 28', sentiment:'positive' },
      { name:'Emily R.', rating:5, text:'Best vet experience we have ever had!',    date:'May 1', sentiment:'positive' },
      { name:'Meena K.', rating:3, text:'Waiting time was a bit long.',             date:'Mar 20', sentiment:'neutral'  },
    ];
    const avgRating = (REVIEWS.reduce((s,r)=>s+r.rating,0)/REVIEWS.length).toFixed(1);
    const sentCfg = { positive:'bg-emerald-100 text-emerald-700', neutral:'bg-amber-100 text-amber-700', negative:'bg-rose-100 text-rose-700' };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#6366f1,#a855f7)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📊 Vet Analytics</span>
          <h2 className="text-2xl font-black mt-2">Vet Performance Dashboard</h2>
          <p className="text-indigo-200 text-sm mt-1">Track your consultation success, ratings, and revenue analytics.</p>
          <div className="flex gap-6 mt-4">
            {[['Avg Rating',avgRating+'★'],['Total Reviews',REVIEWS.length],['Consultations','452'],['Revenue','₹1.24L']].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-4">⭐ Rating Breakdown</p>
            {[5,4,3,2,1].map(s => {
              const count = REVIEWS.filter(r=>r.rating===s).length;
              const pct = Math.round((count/REVIEWS.length)*100);
              return (
                <div key={s} className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-slate-600 w-4">{s}★</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-amber-400" style={{width:`${pct}%`}}/>
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-6">{count}</span>
                </div>
              );
            })}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-3xl font-extrabold text-amber-500">{avgRating}</p>
              <p className="text-xs text-amber-700 font-bold">Average Rating</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">💬 Recent Reviews</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {REVIEWS.map((r,i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm">{r.name}</span>
                    <span className="text-amber-500 text-xs">{'★'.repeat(r.rating)}</span>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${sentCfg[r.sentiment]}`}>{r.sentiment}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{r.text}"</p>
                  <p className="text-[10px] text-slate-400 mt-1">{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">💰 Monthly Revenue Summary</p>
          <div className="grid grid-cols-4 gap-3">
            {[['Consultations','₹68,400','#6366f1'],['Surgeries','₹42,000','#ef4444'],['Lab Tests','₹8,200','#f59e0b'],['Pharmacy','₹5,800','#10b981']].map(([l,v,c]) => (
              <div key={l} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400">{l}</p>
                <p className="font-extrabold text-lg mt-1" style={{color:c}}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard':     return <DashHome vet={vetProfile} onCompleteAppt={setCompletingAppt} setActive={setActive} />;
      case 'profile':       return <VetProfilePanel vet={vetProfile} onProfileUpdated={loadVetProfile} />;
      case 'schedule':      return <VetSchedulePanel vet={vetProfile} onCompleteAppt={setCompletingAppt} />;
      case 'patients':      return <VetPatientsPanel vet={vetProfile} />;
      case 'prescriptions': return <VetPrescriptionsPanel vet={vetProfile} />;
      case 'earnings':      return <EarningsDashboard />;
      case 'availability':  return <VetAvailabilityPanel />;
      case 'pharmacy':      return <PharmacyPanel />;
      case 'lab':           return <LabReportsPanel />;
      case 'teleconsult':   return <TeleconsultPanel />;
      case 'tasks':         return <TaskManagerPanel />;
      case 'forum':         return <VetForumPanel />;
      case 'reviews':       return <VetReviewsPanel />;
      case 'messages':      return <VetMessagesPanel />;
      case 'diagnostics':   return <VetDiagnosticsPanel />;
      case 'emergency-queue': return <VetEmergencyQueuePanel />;
      case 'clients':       return <VetClientManagementPanel />;
      case 'clinic-ops':    return <VetClinicOpsPanel />;
      case 'performance':   return <VetPerformancePanel />;
      default: return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Stethoscope className="w-12 h-12 text-teal-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">{activeLabel}</h2>
          <p className="text-slate-400 text-sm">This section is coming soon.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <VetSidebar active={active} setActive={setActive} vet={vetProfile} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">🩺 Veterinarian Portal</p>
            <h1 className="text-2xl font-extrabold tracking-tight"
              style={{ background: 'linear-gradient(90deg,#14b8a6,#6366f1,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {activeLabel}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(v => !v)}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5 text-slate-500" />
                {vetProfile && vetProfile.status !== 'approved' && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showNotifs && (
                  <>
                    {/* backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <p className="font-extrabold text-slate-900 text-sm">Notifications</p>
                        <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600 transition">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {/* Approval status notification */}
                        {vetProfile ? (
                          <div
                            className={`flex gap-3 px-4 py-3.5 hover:bg-slate-50 transition cursor-pointer ${
                              vetProfile.status === 'approved' ? 'border-l-4 border-green-400'
                              : vetProfile.status === 'rejected' ? 'border-l-4 border-rose-400'
                              : 'border-l-4 border-amber-400'
                            }`}
                            onClick={() => { setActive('profile'); setShowNotifs(false); }}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                              vetProfile.status === 'approved' ? 'bg-green-50'
                              : vetProfile.status === 'rejected' ? 'bg-rose-50'
                              : 'bg-amber-50'
                            }`}>
                              {vetProfile.status === 'approved' ? '✅' : vetProfile.status === 'rejected' ? '❌' : '⏳'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900">
                                {vetProfile.status === 'approved'
                                  ? 'Profile Approved!'
                                  : vetProfile.status === 'rejected'
                                  ? 'Profile Rejected'
                                  : 'Profile Under Review'}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {vetProfile.status === 'approved'
                                  ? 'Your profile is live. Pet owners can find and book you.'
                                  : vetProfile.status === 'rejected'
                                  ? 'Admin rejected your profile. Click to edit and re-submit.'
                                  : 'Your profile is awaiting admin approval (24–48 hrs).'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3 px-4 py-3.5 border-l-4 border-slate-300">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-lg">📋</div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">No profile yet</p>
                              <p className="text-xs text-slate-500 mt-0.5">Set up your vet profile to start accepting appointments.</p>
                            </div>
                          </div>
                        )}

                        {/* Pending appointments */}
                        {(() => {
                          const ownerAppts = JSON.parse(localStorage.getItem('ownerAppts') || '[]');
                          const pendingAppts = ownerAppts.filter(a => a.status === 'PENDING');
                          return pendingAppts.length > 0 ? (
                            <div
                              className="flex gap-3 px-4 py-3.5 hover:bg-slate-50 transition cursor-pointer border-l-4 border-indigo-400"
                              onClick={() => { setActive('schedule'); setShowNotifs(false); }}
                            >
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">📅</div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{pendingAppts.length} Pending Appointment{pendingAppts.length > 1 ? 's' : ''}</p>
                                <p className="text-xs text-slate-500 mt-0.5">You have appointment requests waiting for your response.</p>
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* System message */}
                        <div className="flex gap-3 px-4 py-3.5 border-l-4 border-teal-300">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-lg flex-shrink-0">🩺</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Welcome to SmartPetCare!</p>
                            <p className="text-xs text-slate-500 mt-0.5">Complete your profile to appear in the Find Vets directory.</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">Notifications are updated in real-time</p>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setActive('profile')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform shadow-md"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#6366f1)' }}>
              {vetProfile?.name?.[0] || 'V'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <motion.div key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}>
            {renderContent()}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {completingAppt && (
          <CompleteAppointmentModal 
            appt={completingAppt} 
            onClose={() => setCompletingAppt(null)} 
            onSave={handleCompleteSave} 
          />
        )}
      </AnimatePresence>

      {/* AI Chatbot — right side */}
      <div className="hidden xl:flex flex-col justify-end p-6 flex-shrink-0 sticky top-0 h-screen">
        <DashboardAIChat mode="vet" />
      </div>
    </div>
  );
};

export default VetDashboard;
