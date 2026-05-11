import React from 'react';
import { Heart, Github, Twitter, Instagram, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-xl flex items-center justify-center">
                <PawPrint className="text-white h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl text-white">
                SmartPet<span className="text-teal-400">Care</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              The premier ecosystem for pet health, e-commerce, and community engagement — built on Spring Boot & React.
            </p>
            <div className="flex space-x-3">
              {[Twitter, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Features</h3>
            <ul className="space-y-3 text-sm">
              {[['Find a Vet', '/vets'], ['Pet Marketplace', '/shop'], ['AI Assistant', '/ai-assistant'], ['Community Forum', '/community']].map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="hover:text-indigo-400 transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              {[['FAQ', '/faq'], ['Contact Us', '/contact'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="hover:text-indigo-400 transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Newsletter</h3>
            <p className="text-sm text-slate-500 mb-4">Get the latest pet care tips, vet insights, and platform updates.</p>
            <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2.5 w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button type="submit" className="py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-rose-500 fill-current mx-1" /> for Pet Lovers &copy; {new Date().getFullYear()} SmartPetCare
          </p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
