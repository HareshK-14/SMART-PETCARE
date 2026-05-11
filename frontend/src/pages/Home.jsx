import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Stethoscope, ShoppingBag, Sparkles, Star, Heart, Activity, Calendar, Users, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const Home = () => {
  const [count, setCount] = useState({ vets: 0, pets: 0, users: 0 });

  useEffect(() => {
    const targets = { vets: 500, pets: 12000, users: 48000 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        vets: Math.floor(targets.vets * progress),
        pets: Math.floor(targets.pets * progress),
        users: Math.floor(targets.users * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Stethoscope className="w-7 h-7 text-indigo-500" />,
      color: 'from-indigo-50 to-blue-50',
      border: 'border-indigo-100',
      title: "Veterinary Care",
      desc: "Book appointments with top-rated local veterinarians instantly. All medical records in one secure place.",
      img: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop"
    },
    {
      icon: <ShoppingBag className="w-7 h-7 text-emerald-500" />,
      color: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-100',
      title: "Pet Marketplace",
      desc: "Order premium food, toys, and accessories. Delivered to your doorstep with zero hassle.",
      img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
    },
    {
      icon: <Sparkles className="w-7 h-7 text-amber-500" />,
      color: 'from-amber-50 to-orange-50',
      border: 'border-amber-100',
      title: "AI Pet Assistant",
      desc: "24/7 intelligent answers to training, diet, and health queries — powered by advanced AI.",
      img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop"
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-purple-500" />,
      color: 'from-purple-50 to-pink-50',
      border: 'border-purple-100',
      title: "Secure & Private",
      desc: "Enterprise-grade security protecting your pet's records, payment data, and personal information.",
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop"
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Golden Retriever Owner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      quote: "SmartPetCare transformed how I manage Buddy's health. Booking vets at midnight has never been easier!",
      stars: 5
    },
    {
      name: "Arjun Patel",
      role: "Cat Parent of 3",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "The AI assistant gave me peace of mind at 2 AM when Mochi stopped eating. Absolutely brilliant app.",
      stars: 5
    },
    {
      name: "Dr. Sarah Collins",
      role: "Veterinarian, 12 yrs exp.",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      quote: "As a vet, the appointment management and prescription upload features have streamlined my entire practice.",
      stars: 5
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6">
                🐾 India's #1 Smart Pet Care Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Your Pet Deserves<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-400">
                  World-Class Care
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
                Connect with expert veterinarians, track health in real-time, shop premium supplies, and get AI-powered advice — all in one beautiful platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/shop" className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-2xl font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  Explore Shop
                  <ShoppingBag className="w-5 h-5" />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm">
                {['No credit card required', 'Verified Vets only', 'Fully encrypted data'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-teal-400" />{t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — Hero image collage */}
            <motion.div
              className="relative hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main large card */}
              <div className="relative w-full max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"
                    alt="Happy dog at vet"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>



                {/* Floating card — AI */}
                <motion.div
                  className="absolute -right-12 bottom-8 bg-white rounded-2xl p-4 shadow-2xl w-48"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <p className="text-xs font-semibold text-slate-700">AI Assistant</p>
                  </div>
                  <p className="text-xs text-slate-500">"Your dog's weight is trending healthy. Schedule a booster shot this month."</p>
                </motion.div>

                {/* Floating card — rating */}
                <motion.div
                  className="absolute -bottom-6 left-4 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl p-3 shadow-2xl text-white flex items-center gap-3 w-44"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 fill-current text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Platform Rating</p>
                    <p className="font-bold text-lg leading-none">4.9 / 5</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="block">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-slate-50 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: count.users.toLocaleString() + '+', label: 'Happy Pet Owners', icon: <Users className="w-6 h-6 text-indigo-500" /> },
              { value: count.pets.toLocaleString() + '+', label: 'Pets Under Care', icon: <Heart className="w-6 h-6 text-pink-500" /> },
              { value: count.vets + '+', label: 'Verified Veterinarians', icon: <Stethoscope className="w-6 h-6 text-teal-500" /> },
            ].map((stat, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center mb-1">{stat.icon}</div>
                <p className="text-4xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT FEATURE ROWS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <span className="text-indigo-500 font-semibold text-sm uppercase tracking-widest">Platform Features</span>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Everything your pet needs,<br />all in one place</h2>
          </motion.div>

          <div className="space-y-24">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp()} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                    <img src={f.img} alt={f.title} className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} mb-6`}>
                    {f.icon}
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">{f.desc}</p>
                  <Link to="/register" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                    Learn More <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PET GALLERY STRIP ── */}
      <section className="py-16 bg-slate-50 overflow-hidden">
        <div className="flex gap-4 animate-[scroll_30s_linear_infinite]" style={{ width: 'max-content' }}>
          {[
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=200&fit=crop',
          ].map((src, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
              <img src={src} alt="pet" className="w-64 h-44 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Loved by Pet Owners</span>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Real stories, real happy pets</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=600&fit=crop"
            alt="pets"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp()}>
            <span className="text-4xl mb-4 block">🐾</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Start giving your pet<br />the care they deserve today.
            </h2>
            <p className="text-indigo-100 text-xl mb-10 leading-relaxed">
              Join over 48,000 pet owners already using SmartPetCare to keep their companions healthy, happy, and loved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="group flex items-center justify-center gap-2 px-10 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all duration-300">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/40 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Browse Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
