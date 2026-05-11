import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckEmail() {
  const [email, setEmail] = useState('');
  const [verifyState, setVerifyState] = useState('idle'); // idle | verifying | done
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pending = localStorage.getItem('pendingVerificationEmail');
    if (pending) setEmail(pending);
  }, []);

  // Demo: "Click to simulate email verification link"
  const handleSimulateVerify = () => {
    setVerifyState('verifying');
    setTimeout(() => {
      // Mark verified in localStorage
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (users[email]) {
        users[email].verified = true;
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
      localStorage.removeItem('pendingVerificationEmail');
      setVerifyState('done');
    }, 2000);
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md">

        <AnimatePresence mode="wait">
          {verifyState === 'done' ? (
            /* ── Verified! ── */
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-400/30"
              >
                <CheckCircle className="w-12 h-12 text-teal-500" strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Email Verified! 🎉</h2>
              <p className="text-slate-500 mb-2 text-sm">
                <span className="font-semibold text-indigo-600">{email}</span> is now verified.
              </p>
              <p className="text-slate-400 text-sm mb-8">You can now sign in to your SmartPetCare account.</p>
              <Link
                to="/login"
                className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:opacity-90 transition"
              >
                Proceed to Sign In <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

          ) : verifyState === 'verifying' ? (
            /* ── Verifying… ── */
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-indigo-100"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ borderTopColor: '#6366f1' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Verifying your email...</h2>
              <p className="text-slate-400 text-sm">Please wait while we confirm your address.</p>
            </motion.div>

          ) : (
            /* ── Idle — check inbox ── */
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Mail className="w-10 h-10 text-indigo-600" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Check your email</h2>
              {email && (
                <p className="text-sm text-slate-500 mb-1">
                  We sent a verification link to
                </p>
              )}
              {email && (
                <p className="font-bold text-indigo-600 mb-4 text-base">{email}</p>
              )}
              <p className="text-slate-500 text-sm mb-8">
                Click the link in your inbox to verify your account. Once verified you can sign in.
              </p>

              {/* Demo button — simulates clicking the email link */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-start gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-semibold text-amber-800">Demo Mode — Simulate email click</p>
                </div>
                <p className="text-xs text-amber-700 mb-3">
                  In production, click the link in the email. For this demo, click the button below to simulate verifying your email:
                </p>
                <button
                  onClick={handleSimulateVerify}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-md shadow-amber-500/30"
                >
                  ✅ Simulate: Click verification link in email
                </button>
              </div>

              <button
                onClick={handleResend}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition mb-4"
              >
                <RefreshCw className={`w-4 h-4 ${resent ? 'animate-spin text-teal-500' : ''}`} />
                {resent ? 'Resent! Check your inbox.' : "Didn't receive it? Resend email"}
              </button>

              <Link to="/login" className="text-sm text-slate-400 hover:text-indigo-600 transition">
                ← Back to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
