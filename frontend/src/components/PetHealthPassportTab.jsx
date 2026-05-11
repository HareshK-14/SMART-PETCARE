import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, QrCode, Syringe, FileText, Star, User, Calendar } from 'lucide-react';

const CHAIN_HASH = () => Array.from({length:32}, () => Math.floor(Math.random()*16).toString(16)).join('');

const VACCINATION_RECORDS = [
  { name: 'Rabies (Defensor)',    date: '2026-05-02', exp: '2027-05-02', status: 'Valid',    vet: 'Dr. Sharma',   hash: '0xA1B2C3D4E5' },
  { name: 'DHPP Combo (5-in-1)', date: '2026-03-15', exp: '2027-03-15', status: 'Valid',    vet: 'Dr. Patel',    hash: '0xF6G7H8I9J0' },
  { name: 'Bordetella',          date: '2025-12-01', exp: '2026-12-01', status: 'Overdue',  vet: 'Dr. Meena',    hash: '0xK1L2M3N4O5' },
  { name: 'Leptospirosis',       date: '2026-02-20', exp: '2027-02-20', status: 'Valid',    vet: 'Dr. Raj',      hash: '0xP6Q7R8S9T0' },
];

const statusStyle = {
  Valid:    'bg-emerald-100 text-emerald-700',
  Overdue:  'bg-rose-100 text-rose-700',
  'Due Soon': 'bg-amber-100 text-amber-700',
};

function QRBlock({ petName }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 flex flex-col items-center gap-3">
      <div className="w-28 h-28 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div className="grid grid-cols-5 gap-0.5 p-2">
          {Array.from({length:25}).map((_,i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{background: Math.random()>0.4 ? 'white' : 'transparent'}}/>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">🐾</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="font-extrabold text-slate-900 text-sm">{petName}</p>
        <p className="text-[10px] text-slate-400">Scan to verify identity</p>
      </div>
      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
        <Shield className="w-3 h-3 text-emerald-600"/>
        <span className="text-[10px] font-bold text-emerald-700">Blockchain Secured</span>
      </div>
    </div>
  );
}

export default function PetHealthPassportTab() {
  const pet = JSON.parse(localStorage.getItem('myPets') || '[{"name":"Buddy","species":"Dog","breed":"Golden Retriever","age":3}]')[0] || {};
  const owner = JSON.parse(localStorage.getItem('currentUser') || '{"name":"Pet Owner"}');
  const [activeSection, setActiveSection] = useState('passport');
  const [generating, setGenerating] = useState(false);
  const [blockchainCert, setBlockchainCert] = useState(null);

  const generateCert = () => {
    setGenerating(true);
    setTimeout(() => {
      setBlockchainCert({
        hash: '0x' + CHAIN_HASH().toUpperCase(),
        issued: new Date().toLocaleDateString(),
        block: Math.floor(Math.random()*999999 + 100000),
      });
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-8 opacity-10"><Shield className="w-40 h-40"/></div>
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🌐 Digital Passport</span>
          <h2 className="text-2xl font-black mt-2">Pet Health Passport</h2>
          <p className="text-indigo-200 text-sm mt-1">Blockchain-secured vaccination records, QR identity & health certificates.</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 flex-wrap">
        {[
          {k:'passport', label:'📋 Passport'},
          {k:'vaccinations', label:'💉 Vaccinations'},
          {k:'blockchain', label:'🔒 Blockchain Cert'},
          {k:'reports', label:'📄 Reports'},
        ].map(t => (
          <button key={t.k} onClick={() => setActiveSection(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${activeSection===t.k ? 'text-white border-transparent shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={activeSection===t.k ? {background:'linear-gradient(135deg,#6366f1,#14b8a6)'} : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Passport View */}
      {activeSection === 'passport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>🐾</div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{pet.name || 'Buddy'}</h3>
                <p className="text-sm text-slate-500">{pet.breed || 'Golden Retriever'} • {pet.age || 3} years</p>
              </div>
            </div>
            {[
              ['Species',   pet.species || 'Dog'],
              ['Breed',     pet.breed || 'Golden Retriever'],
              ['Age',       `${pet.age || 3} years`],
              ['Owner',     owner.name || 'Pet Owner'],
              ['Chip ID',   'PET-2026-' + Math.floor(Math.random()*90000+10000)],
              ['Issued',    new Date().toLocaleDateString()],
            ].map(([l,v]) => (
              <div key={l} className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{l}</span>
                <span className="font-bold text-slate-800 text-sm">{v}</span>
              </div>
            ))}
            <button onClick={() => alert('Passport PDF downloading...')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-white font-bold rounded-xl mt-2"
              style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
              <Download className="w-4 h-4"/> Download PDF Passport
            </button>
          </div>
          <QRBlock petName={pet.name || 'Buddy'}/>
        </div>
      )}

      {/* Vaccinations */}
      {activeSection === 'vaccinations' && (
        <div className="space-y-3">
          {VACCINATION_RECORDS.map((v, i) => (
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Syringe className="w-5 h-5"/>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-800">{v.name}</p>
                <p className="text-xs text-slate-400">Date: {v.date} • Expires: {v.exp} • Vet: {v.vet}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="w-3 h-3 text-emerald-500"/>
                  <span className="text-[10px] font-bold text-emerald-600">{v.hash}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyle[v.status]}`}>{v.status}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Blockchain Cert */}
      {activeSection === 'blockchain' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5"/></div>
              <div>
                <p className="font-extrabold">Blockchain Vaccination Certificate</p>
                <p className="text-xs text-indigo-300">Tamper-proof · Decentralized · Permanent</p>
              </div>
            </div>

            {blockchainCert ? (
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-[10px] text-indigo-300 uppercase tracking-widest mb-1">Transaction Hash</p>
                  <p className="font-mono text-xs text-emerald-400 break-all">{blockchainCert.hash}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-[10px] text-indigo-300 uppercase mb-1">Block #</p>
                    <p className="font-bold">{blockchainCert.block}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-[10px] text-indigo-300 uppercase mb-1">Issued</p>
                    <p className="font-bold">{blockchainCert.issued}</p>
                  </div>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400"/>
                  <span className="text-sm font-bold text-emerald-300">Certificate Successfully Anchored on Blockchain</span>
                </div>
                <button onClick={() => alert('Downloading blockchain certificate...')}
                  className="w-full py-2.5 bg-white text-indigo-900 font-bold rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-4 h-4"/> Download Blockchain Certificate
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-indigo-200 text-sm">Generate a cryptographically-secured vaccination certificate anchored to the blockchain for tamper-proof verification.</p>
                <button onClick={generateCert} disabled={generating}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2">
                  {generating ? '⛓️ Anchoring to blockchain...' : '🔒 Generate Blockchain Certificate'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-3">How Blockchain Verification Works</p>
            {[
              { step:'1', desc:'Vaccination data is hashed using SHA-256 encryption' },
              { step:'2', desc:'Hash is submitted to the distributed ledger network' },
              { step:'3', desc:'Block is mined and confirmed by network validators' },
              { step:'4', desc:'Certificate is permanently immutable and publicly verifiable' },
            ].map(s => (
              <div key={s.step} className="flex gap-3 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
                  {s.step}
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports */}
      {activeSection === 'reports' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Full Health Report',        icon: '🏥', desc: 'Complete health history, vitals & treatments' },
            { title: 'Vaccination Certificate',   icon: '💉', desc: 'Official vaccination record for travel/boarding' },
            { title: 'Lab Results Summary',       icon: '🔬', desc: 'Bloodwork, urinalysis & diagnostic reports' },
            { title: 'Prescription History',      icon: '💊', desc: 'All prescribed medications and dosages' },
          ].map(r => (
            <div key={r.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{r.icon}</div>
                <div>
                  <p className="font-extrabold text-slate-800 text-sm">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.desc}</p>
                </div>
              </div>
              <button onClick={() => alert(`Generating ${r.title} PDF...`)}
                className="flex items-center justify-center gap-2 py-2 text-white font-bold rounded-xl text-sm"
                style={{background:'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
                <Download className="w-3.5 h-3.5"/> Export PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
