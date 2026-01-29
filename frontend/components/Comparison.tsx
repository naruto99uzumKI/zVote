import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export const Comparison: React.FC = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
           <motion.span 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-indigo-500 font-semibold tracking-widest text-xs uppercase mb-4 block"
           >
             Why Switch?
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter"
           >
             The Upgrade You Need
           </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-stretch">
           {/* Legacy */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
             className="p-10 rounded-3xl bg-slate-900/20 border border-white/5 backdrop-blur-sm flex flex-col"
           >
              <h3 className="text-xl font-display text-slate-500 mb-8 pb-6 border-b border-white/5 tracking-tight">Standard Governance</h3>
              <ul className="space-y-6 flex-1">
                {[
                  "Public voting records",
                  "Traceable wallet history",
                  "Vulnerable to bribery",
                  "Social pressure conformism"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className="flex items-center gap-4 text-slate-500 font-light"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 text-red-500/60" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
           </motion.div>

           {/* zVote - Premium Highlight */}
           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
             whileHover={{ scale: 1.01 }}
             className="relative p-10 rounded-3xl bg-[#0B0F19] border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden group"
           >
              {/* Animated Glow Border */}
              <div className="absolute inset-0 border border-indigo-500/20 rounded-3xl"></div>
              
              {/* Continuous subtle shimmer */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-50"></div>
              
              <h3 className="relative z-10 text-xl font-display text-white mb-8 pb-6 border-b border-white/10 flex items-center gap-3 tracking-tight">
                zVote Protocol
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded shadow-glow-indigo tracking-wider">PRO</span>
              </h3>
              <ul className="relative z-10 space-y-6 flex-1">
                {[
                  "100% Private voting",
                  "Zero wallet traceability",
                  "Mathematically bribe-resistant",
                  "Vote without fear"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.7 }}
                    className="flex items-center gap-4 text-slate-200 font-light tracking-wide"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                       <motion.div
                         initial={{ scale: 0 }}
                         whileInView={{ scale: 1 }}
                         viewport={{ once: true }}
                         transition={{ type: "spring", delay: i * 0.1 + 0.8 }}
                       >
                         <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} />
                       </motion.div>
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
           </motion.div>
        </div>
      </div>
    </section>
  );
};