import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, Menu, X, UserCircle, ShoppingCart, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const isAuthenticated = false;

  const isDarkHero = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/vets' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.telehealth'), path: '/telehealth' },
    { name: t('nav.aiScanner'), path: '/ai-scanner' },
    { name: t('nav.emergency'), path: '/emergency' },
    { name: t('nav.lostFound'), path: '/lost-found' },
    { name: t('nav.community'), path: '/community' },
  ];

  const navBg = scrolled
    ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100'
    : isDarkHero
    ? 'bg-black/10 backdrop-blur-md border-b border-white/5'
    : 'bg-white/95 backdrop-blur-xl border-b border-slate-100';
  
  const textColor = !scrolled && isDarkHero ? 'text-white' : 'text-slate-900';
  const logoColor = !scrolled && isDarkHero ? 'text-white' : 'text-indigo-700';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <PawPrint className="text-white h-5 w-5" />
            </div>
            <span className={`ml-2.5 font-extrabold text-xl tracking-tight ${logoColor} transition-colors`}>
              SmartPet<span className="text-teal-500">Care</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors relative group ${
                  location.pathname === link.path
                    ? 'text-indigo-500'
                    : `${textColor} hover:text-indigo-500`
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-slate-900 hover:text-indigo-700 transition">
                <UserCircle className="w-8 h-8" />
                <span className="font-medium">Dashboard</span>
              </button>
            ) : (
              <>
                {/* Language Dropdown */}
                <div className="relative">
                  <button onClick={() => setLangOpen(!langOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${!scrolled && isDarkHero ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}>
                    <Globe className="w-4 h-4" />
                    <span>{LANGUAGES[language].flag} {language.toUpperCase()}</span>
                  </button>
                  {langOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      {Object.keys(LANGUAGES).map(lang => (
                        <button key={lang} onClick={() => { setLanguage(lang); setLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2 ${language === lang ? 'text-indigo-700 bg-indigo-50/50' : 'text-slate-900'}`}>
                          <span>{LANGUAGES[lang].flag}</span> {LANGUAGES[lang].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/login" className={`text-sm font-semibold transition-colors ${!scrolled && isDarkHero ? 'text-white hover:text-indigo-300' : 'text-slate-900 hover:text-indigo-700'}`}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`transition ${textColor} hover:text-indigo-500 focus:outline-none`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-900 hover:text-indigo-700 hover:bg-indigo-50 transition"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 space-y-2 border-t border-slate-100">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-2.5 text-indigo-600 font-semibold border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 transition">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center py-2.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl shadow-md">Sign Up Free</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
