import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative py-40 flex items-center justify-center overflow-hidden">
      {/* Background Spotlight */}
      <div className="absolute inset-0 bg-bg z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full opacity-50 pointer-events-none mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-5xl px-6"
      >
        <motion.div
           animate={{ y: [0, -10, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 tracking-tighter text-white drop-shadow-2xl">
            Stop governance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">corruption.</span>
          </h2>
        </motion.div>
        <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
          Join the protocols protecting their future with privacy-first voting infrastructure built on Aleo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button icon className="w-full sm:w-auto px-10 py-4 text-base shadow-glow-blue">Launch zVote</Button>
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors tracking-widest uppercase border-b border-transparent hover:border-slate-400 pb-1">
            Read Documentation
          </a>
        </div>
      </motion.div>
    </section>
  );
};