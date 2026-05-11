import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, PawPrint, AlertCircle } from 'lucide-react';
import axios from 'axios';

const getAPI = () => `http://${window.location.hostname}:8081/api/auth`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call real Spring Boot /api/auth/signin
      const res = await axios.post(`${getAPI()}/signin`, {
        email: formData.email,
        password: formData.password,
      });

      const { token, id, email, role } = res.data;

      // Fetch the user's profile to get their real name
      let name = email.split('@')[0]; // fallback
      try {
        const profileRes = await axios.get(`http://${window.location.hostname}:8081/api/admin/users`);
        const me = profileRes.data.find(u => u.id === id);
        if (me && me.name) name = me.name;
      } catch (_) {}

      // Store JWT and user info
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('role', role);
      localStorage.setItem('currentUser', JSON.stringify({ id, email, role, name }));

      // Route based on role
      if (role === 'ADMIN') navigate('/admin-dashboard');
      else if (role === 'VET') navigate('/vet-portal');
      else navigate('/dashboard');

    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || '';

      if (status === 401 || msg.toLowerCase().includes('disabled') || msg.toLowerCase().includes('verified')) {
        setError('EMAIL_NOT_VERIFIED');
      } else if (status === 401) {
        setError('Incorrect email or password. Please try again.');
      } else if (!err.response) {
        setError('Cannot connect to server. Please make sure the backend is running on port 8080.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email) return;
    setResending(true);
    setResendStatus('');
    try {
      await axios.post(`${getAPI()}/resend-verification`, { email: formData.email });
      setResendStatus('success');
    } catch (err) {
      setResendStatus('error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&h=1200&fit=crop"
          alt="Happy dog at vet"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/60 to-teal-900/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <PawPrint className="text-white h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl">SmartPet<span className="text-teal-300">Care</span></span>
          </div>
          <div>
            <blockquote className="text-2xl font-light leading-relaxed italic mb-4">
              "SmartPetCare completely changed how I manage my three cats' health. A must-have for every pet parent."
            </blockquote>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face" alt="User" className="w-11 h-11 rounded-full border-2 border-white/50" />
              <div>
                <p className="font-semibold">Priya Sharma</p>
                <p className="text-sm text-white/70">Bengal Cat Owner, Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl shadow-xl shadow-indigo-500/30 mb-4">
              <PawPrint className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your pet care dashboard</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-8 border border-slate-100">

            {/* Error — generic */}
            {error && error !== 'EMAIL_NOT_VERIFIED' && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Error — email not verified */}
            {error === 'EMAIL_NOT_VERIFIED' && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 mb-5">
                <div className="flex items-start gap-3 mb-2">
                  <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Email not verified</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Check your inbox for <span className="font-semibold">{formData.email}</span> and click the verification link before signing in.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Link to="/check-email"
                    className="text-xs font-semibold text-amber-700 underline hover:text-amber-900">
                    Search instructions →
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-xs font-bold text-amber-800 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend Verification'}
                  </button>
                </div>
                {resendStatus === 'success' && (
                  <p className="text-[10px] text-green-700 font-bold mt-2 text-center">✅ New email sent! Please check your inbox.</p>
                )}
                {resendStatus === 'error' && (
                  <p className="text-[10px] text-rose-700 font-bold mt-2 text-center">❌ Failed to resend. Please try again.</p>
                )}
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => { setError(''); setFormData({ ...formData, email: e.target.value }); }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => { setError(''); setFormData({ ...formData, password: e.target.value }); }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70"
              >
                {loading
                  ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  : <>Sign In <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">Create one free</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
