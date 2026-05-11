import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, CheckCircle, Upload, ArrowLeft, ArrowRight, FileText, User, Stethoscope } from 'lucide-react';
import axios from 'axios';

const SPECIALIZATIONS = [
    'General Practice', 'Surgery', 'Dermatology', 'Cardiology',
    'Dentistry', 'Orthopedics', 'Oncology', 'Ophthalmology',
    'Neurology', 'Exotic Animals', 'Feline Specialist', 'Canine Specialist'
];

// ─── Field helper ─────────────────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {children}
    </div>
);

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white transition-all text-sm";

// ─── Step 1: Professional Info ────────────────────────────────────────────────
const Step1 = ({ data, setData, onNext }) => {
    const set = k => e => setData(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        if (!data.qualification || !data.specialization || !data.clinic || !data.experience || !data.license) return;
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Qualification" required>
                <input className={inputCls} placeholder="e.g., BVSc, MVSc" required
                    value={data.qualification} onChange={set('qualification')} />
            </Field>

            <Field label="Specialization" required>
                <select className={inputCls} required value={data.specialization} onChange={set('specialization')}>
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </Field>

            <Field label="Hospital / Clinic Name" required>
                <input className={inputCls} placeholder="Enter hospital or clinic name" required
                    value={data.clinic} onChange={set('clinic')} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Experience" required>
                    <input className={inputCls} type="number" min="0" max="50" placeholder="Years" required
                        value={data.experience} onChange={set('experience')} />
                </Field>
                <Field label="License Number" required>
                    <input className={inputCls} placeholder="License #" required
                        value={data.license} onChange={set('license')} />
                </Field>
            </div>

            <Field label="Consultation Fee (₹)">
                <input className={inputCls} type="number" min="0" placeholder="Enter fee amount"
                    value={data.fee} onChange={set('fee')} />
            </Field>

            <Field label="Location / City" required>
                <input className={inputCls} placeholder="e.g., Chennai, Tamil Nadu" required
                    value={data.location} onChange={set('location')} />
            </Field>

            <Field label="Professional Bio">
                <div className="relative">
                    <textarea className={inputCls + ' resize-none h-28'} maxLength={500}
                        placeholder="Tell us about yourself and your experience (max 500 characters)"
                        value={data.bio} onChange={set('bio')} />
                    <span className="absolute bottom-2 right-3 text-xs text-slate-400">{data.bio.length}/500</span>
                </div>
            </Field>

            <button type="submit"
                className="w-full py-3.5 font-bold text-white rounded-xl shadow-lg transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 8px 24px rgba(245,158,11,0.4)' }}>
                ✓ Save &amp; Continue <ArrowRight className="w-5 h-5" />
            </button>
        </form>
    );
};

// ─── File upload field ────────────────────────────────────────────────────────
const FileField = ({ label, required, file, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <label className={`flex items-center justify-center w-full h-16 rounded-xl border-2 border-dashed cursor-pointer transition-all ${file ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/50'
            }`}>
            <input type="file" className="hidden" accept=".pdf,image/*" onChange={onChange} />
            {file ? (
                <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                    <span className="truncate max-w-xs">{file.name}</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Upload className="w-5 h-5" />
                    <span>Upload PDF / Image</span>
                </div>
            )}
        </label>
    </div>
);

// ─── Step 2: Document Upload ──────────────────────────────────────────────────
const Step2 = ({ files, setFiles, onBack, onSubmit, loading }) => {
    const set = k => e => setFiles(p => ({ ...p, [k]: e.target.files[0] }));

    const handleSubmit = e => {
        e.preventDefault();
        if (!files.degree || !files.medReg || !files.idProof) return;
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <FileField label="Degree Certificate" required file={files.degree} onChange={set('degree')} />
            <FileField label="Medical Registration Certificate" required file={files.medReg} onChange={set('medReg')} />
            <FileField label="Identity Proof (Aadhaar / Passport)" required file={files.idProof} onChange={set('idProof')} />

            <p className="text-xs text-slate-400 text-center">Your documents will be verified by our admin team.<br />You'll be notified once approved.</p>

            <div className="flex gap-3">
                <button type="button" onClick={onBack}
                    className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" disabled={loading}
                    className="flex-1 py-3 font-bold text-white rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 8px 24px rgba(245,158,11,0.35)' }}>
                    {loading
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><CheckCircle className="w-5 h-5" /> Complete Registration</>}
                </button>
            </div>
        </form>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function VetProfileCreate() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        qualification: '', specialization: '', clinic: '', experience: '',
        license: '', fee: '', location: '', bio: ''
    });
    const [files, setFiles] = useState({ degree: null, medReg: null, idProof: null });

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in as a Vet to submit your profile.');
            setLoading(false);
            return;
        }

        try {
            // Build multipart form data to send to /api/vets/setup-profile
            const formData = new FormData();
            formData.append('specialization', data.specialization);
            formData.append('experienceYears', data.experience || '0');
            formData.append('clinicName', data.clinic);
            formData.append('clinicAddress', data.location || '');
            formData.append('consultationFee', data.fee || '0');

            // Attach the most important document as the verification doc
            const verificationDoc = files.degree || files.medReg || files.idProof;
            if (verificationDoc) {
                formData.append('verificationDoc', verificationDoc);
            }

            await axios.post(
                `http://${window.location.hostname}:8081/api/vets/setup-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setLoading(false);
            navigate('/vet/pending');
        } catch (err) {
            console.error('Vet profile submit failed:', err);
            const msg = err.response?.data?.message || err.response?.data || err.message || 'Submission failed. Please try again.';
            setError(typeof msg === 'string' ? msg : 'Submission failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4" style={{ background: 'linear-gradient(135deg,#fefce8 0%,#fffbeb 50%,#f0f9ff 100%)' }}>
            {/* Paw watermarks */}
            {[{ t: '15%', l: '8%' }, { t: '70%', l: '4%' }, { t: '40%', r: '6%' }, { t: '80%', r: '10%' }].map((pos, i) => (
                <PawPrint key={i} className="absolute text-amber-200 w-8 h-8 pointer-events-none" style={pos} />
            ))}

            <div className="max-w-lg mx-auto relative">
                <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-semibold">
                            ⚠️ {error}
                        </div>
                    )}
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900">
                                {step === 1 ? 'Veterinarian Profile' : 'Upload Documents'}
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Step {step} of 2 • {step === 1 ? 'Basic Information' : 'Verification Documents'}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                                {step === 1
                                    ? 'Fill in your professional details to get started'
                                    : 'Upload required certificates (PDF only, max 5MB each)'}
                            </p>
                        </div>
                        <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                            Step {step}/2
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mb-7 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg,#f59e0b,#d97706)' }}
                            animate={{ width: step === 1 ? '50%' : '100%' }}
                            transition={{ duration: 0.4, ease: 'easeOut' }} />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step}
                            initial={{ opacity: 0, x: step === 2 ? 30 : -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: step === 2 ? -30 : 30 }}
                            transition={{ duration: 0.25 }}>
                            {step === 1
                                ? <Step1 data={data} setData={setData} onNext={() => setStep(2)} />
                                : <Step2 files={files} setFiles={setFiles} onBack={() => setStep(1)} onSubmit={handleSubmit} loading={loading} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
