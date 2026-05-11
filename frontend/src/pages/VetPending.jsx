import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Mail, PawPrint, ArrowRight } from 'lucide-react';

export default function VetPending() {
    return (
        <div className="min-h-screen py-10 px-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#fefce8 0%,#fffbeb 50%,#f0f9ff 100%)' }}>

            {/* Paw watermarks */}
            {[{ top: '15%', left: '8%' }, { top: '70%', left: '4%' }, { top: '40%', right: '6%' }, { top: '80%', right: '10%' }].map((pos, i) => (
                <PawPrint key={i} className="absolute text-amber-200 w-8 h-8 pointer-events-none" style={pos} />
            ))}

            <div className="max-w-md w-full relative">
                <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
                    ← Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center"
                >
                    {/* Hourglass icon */}
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)' }}
                    >
                        <span className="text-4xl">⏳</span>
                    </motion.div>

                    <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Profile Under Review</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Your vet profile has been submitted and is waiting for admin approval.
                    </p>

                    {/* Processing time badge */}
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-2.5 rounded-xl mb-6">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span><strong>Processing time:</strong> Usually takes 24–48 hours</span>
                    </div>

                    <p className="text-slate-400 text-sm mb-6">
                        You will be able to log in once approved. We'll notify you via email.
                    </p>

                    {/* Steps */}
                    <div className="text-left space-y-3 mb-8 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        {[
                            { done: true, label: 'Profile submitted successfully' },
                            { done: false, label: 'Admin reviewing your documents' },
                            { done: false, label: 'You receive approval email' },
                            { done: false, label: 'Login and start accepting appointments' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${s.done ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400'
                                    }`}>
                                    {s.done ? '✓' : i + 1}
                                </div>
                                <p className={`text-sm ${s.done ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6 text-sm text-amber-600 font-semibold">
                        <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
                        Pending Review
                    </div>

                    <Link to="/login"
                        className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-white rounded-xl shadow-lg transition hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 8px 24px rgba(245,158,11,0.35)' }}>
                        ✓ Go to Login <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
