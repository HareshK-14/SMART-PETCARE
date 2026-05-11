import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, PawPrint } from 'lucide-react';
import axios from 'axios';

// Dynamic host: works on PC (localhost) and phone (network IP) automatically
const getAPI = () => `http://${window.location.hostname}:8081/api/auth`;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus]   = useState('loading');
  const [message, setMessage] = useState('');
  const hasFetched = useRef(false);

  // Automatically verify on page load as requested
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please use the link from your email.');
        return;
      }

      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const res = await axios.get(`${getAPI()}/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Invalid or expired link'
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#e8f5e9 100%)' }}>

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-sm w-full text-center relative overflow-hidden"
        >

          {/* ── Loading ── */}
          {status === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                className="flex justify-center mb-6">
                <Loader2 className="w-16 h-16 text-indigo-400" />
              </motion.div>
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">Verifying…</h2>
              <p className="text-slate-400 text-sm">Please wait a moment while we verify your email.</p>
            </>
          )}

          {/* ── Success ── */}
          {status === 'success' && (
            <>
              {/* Confetti */}
              {['#6366f1','#14b8a6','#f59e0b','#10b981','#ec4899'].map((c, i) => (
                <motion.div key={i}
                  className="absolute w-3 h-3 rounded-full pointer-events-none"
                  style={{ background: c, top: `${10 + i * 14}%`, left: `${5 + i * 18}%` }}
                  animate={{ y: [-40, 40], opacity: [1, 0], scale: [1, 0.4] }}
                  transition={{ duration: 1.6, delay: i * 0.1 }} />
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 14 }}
                className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-green-50">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Email Verified! 🎉</h2>
              <p className="text-slate-500 text-sm mb-6">{message}</p>

              <Link to="/login"
                className="block w-full py-4 font-bold text-white rounded-xl text-center shadow-lg active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                Sign In Now →
              </Link>
            </>
          )}

          {/* ── Error ── */}
          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center ring-8 ring-rose-50">
                  <XCircle className="w-12 h-12 text-rose-500" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Verification Failed</h2>
              <p className="text-slate-500 text-sm mb-6">{message}</p>

              <div className="flex flex-col gap-3">
                <Link to="/register"
                  className="block py-3.5 font-bold text-white rounded-xl text-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }}>
                  Register Again
                </Link>
                <Link to="/login" className="block py-3 font-semibold text-indigo-600 text-sm">
                  Go to Login
                </Link>
              </div>
            </>
          )}

          {/* Branding */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <PawPrint className="w-4 h-4" />
            <span>SmartPetCare Platform</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
