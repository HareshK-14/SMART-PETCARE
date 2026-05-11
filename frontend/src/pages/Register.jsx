import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle, PawPrint, AlertCircle } from 'lucide-react';
import axios from 'axios';

const getAPI = () => `http://${window.location.hostname}:8081/api/auth`;

// Field must be outside Register to prevent re-mount on every keystroke
const Field = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
      <input
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
        {...props}
      />
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'OWNER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      // Call the real Spring Boot backend
      await axios.post(`${getAPI()}/signup`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      // Store email so CheckEmail page can display it
      localStorage.setItem('pendingVerificationEmail', formData.email.toLowerCase());
      navigate('/check-email');

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Is the backend running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Image Panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=1200&fit=crop"
          alt="Dogs in park"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-indigo-900/70 to-slate-900/80" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white h-full">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <PawPrint className="text-white h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl">SmartPet<span className="text-teal-300">Care</span></span>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight mb-6">
              Your pet's health journey starts here.
            </h2>
            <div className="space-y-3">
              {[
                'Real email verification for security',
                'Access verified veterinarians 24/7',
                'Track health metrics with AI insights',
                'Shop premium products at great prices',
              ].map(text => (
                <div key={text} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Create your account</h2>
            <p className="text-slate-500 mt-2">Join 48,000+ pet owners on SmartPetCare</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-8 border border-slate-100">

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" icon={User} type="text" required placeholder="Jane Doe"
                  value={formData.fullName} onChange={update('fullName')} />
                <Field label="Phone Number" icon={Phone} type="tel" placeholder="+91 98765 43210"
                  value={formData.phone} onChange={update('phone')} />
              </div>

              <Field label="Email Address" icon={Mail} type="email" required placeholder="you@example.com"
                value={formData.email} onChange={update('email')} />

              <Field label="Password" icon={Lock} type="password" required placeholder="Min. 8 characters"
                value={formData.password} onChange={update('password')} />

              <Field label="Confirm Password" icon={Lock} type="password" required placeholder="Re-enter password"
                value={formData.confirmPassword} onChange={update('confirmPassword')} />

              {/* Role */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">I am joining as...</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'OWNER', label: '🐶 Pet Owner', desc: 'Manage my pet' },
                    { val: 'VET', label: '🩺 Veterinarian', desc: 'Serve my patients' }
                  ].map(r => (
                    <button key={r.val} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: r.val }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${formData.role === r.val
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}>
                      <p className="font-semibold text-slate-900 text-sm">{r.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 mt-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70"
              >
                {loading
                  ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  : <>Create Account &amp; Send Verification Email <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

            {/* Info note */}
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
              <p className="text-xs text-indigo-600 font-medium">
                📧 A real verification email will be sent to your inbox. You must verify before logging in.
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              By signing up you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">Terms</a> &amp;{' '}
              <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
            </p>
            <div className="mt-3 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">Sign In</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
