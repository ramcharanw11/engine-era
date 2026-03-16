import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-900 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mt-48"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Brand & Mission */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-8 group">
              <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">🏎️</span>
              <span className="text-white font-display font-bold text-2xl tracking-tight uppercase">
                Engine<span className="text-primary italic">Era</span>
              </span>
            </Link>
            <p className="text-brand-300 text-lg leading-relaxed mb-10 max-w-md font-medium">
              Redefining automotive journalism with deep-dive reviews, breaking news, and exclusive insights into the future of mobility.
            </p>
            <div className="flex gap-4">
              {['𝕏', 'f', 'in', 'ig'].map(social => (
                <button key={social} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-display font-bold text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-brand-400 hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors">Home Hub</Link></li>
                <li><Link to="/search" className="text-brand-400 hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors">Search Archive</Link></li>
                <li><Link to="/login" className="text-brand-400 hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors">Admin Access</Link></li>
              </ul>
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-white font-display font-bold text-xs uppercase tracking-[0.2em] mb-8">Categories</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {['Electric Cars', 'SUVs', 'Sports Cars', 'Luxury Cars', 'Concept Cars', 'Car Launches'].map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/category/${cat}`}
                      className="text-brand-400 hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-brand-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 ENGINE ERA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-brand-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
