import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/Button';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  // Cinematic Easing
  const ease = [0.16, 1, 0.3, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease } 
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      
      {/* SPOTLIGHT EFFECT - Deeper, more atmospheric */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140%] h-[1000px] pointer-events-none z-0">
         <motion.div 
            animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-blue-900/5 to-transparent blur-[120px] rounded-[100%] transform -translate-y-1/2"
         />
         
         {/* Sharp rays */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[conic-gradient(from_0deg_at_50%_0%,transparent_45%,rgba(99,102,241,0.08)_48%,rgba(99,102,241,0.08)_52%,transparent_55%)] blur-[60px] opacity-60 mix-blend-screen"></div>
      </div>

      <motion.div 
        style={{ opacity, y, scale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Announcement Pill */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl hover:border-indigo-500/50 transition-colors duration-500 cursor-pointer group shadow-lg shadow-indigo-500/5">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 duration-1000"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-300 group-hover:text-indigo-300 transition-colors uppercase">
              zVote Protocol Mainnet Live
            </span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <div className="relative mb-8">
           <motion.h1 
             className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] text-white"
           >
             <motion.span variants={itemVariants} className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
               Governance without
             </motion.span>
             <motion.span variants={itemVariants} className="block text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 via-indigo-400 to-blue-500 relative pb-4">
               corruption.
               <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10 opacity-50"></div>
             </motion.span>
           </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-light tracking-wide"
        >
          zVote makes DAO voting <span className="text-indigo-200 font-medium">private</span>, <span className="text-indigo-200 font-medium">verifiable</span>, and <span className="text-indigo-200 font-medium">bribe-resistant</span>. <br className="hidden md:block"/>Built on Aleo for zero-knowledge integrity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
        >
          <Button icon className="w-full sm:w-auto shadow-glow-indigo">Launch App</Button>
          <Button variant="outline" className="w-full sm:w-auto">Read Whitepaper</Button>
        </motion.div>

        {/* Abstract 3D Element / Floating Graphics */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 2 }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none"
        >
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        </motion.div>

      </motion.div>
    </section>
  );
};