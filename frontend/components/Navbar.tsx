import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { WalletButton } from './WalletButton';

interface NavbarProps {
  onLaunchApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchApp }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-[#020617]/70 backdrop-blur-xl border-b border-white/[0.03] py-4'
        : 'bg-transparent py-8'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all duration-500 shadow-lg shadow-indigo-500/5">
            <ShieldCheck className="w-5 h-5 fill-current" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">zVote</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Protocol', 'Security', 'Governance'].map((item) => (
            <a key={item} href="#" className="text-sm text-slate-400 hover:text-white transition-colors font-medium tracking-wide relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-400 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <WalletButton />
        </div>
      </div>
    </motion.nav>
  );
};