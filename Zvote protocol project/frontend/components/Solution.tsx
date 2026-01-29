import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileCode, CheckCircle2, Terminal, EyeOff } from 'lucide-react';

export const Solution: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900/0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header Centered */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
          >
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">The Architecture</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tighter"
          >
             Order from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Chaos</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            zVote utilizes zk-SNARKs to decouple the voter's identity from their vote.
            We verify eligibility without ever revealing <span className="text-slate-200 italic">who</span> voted for <span className="text-slate-200 italic">what</span>.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
           {/* Visual Side - The 'ZK Verification' Terminal */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
             whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
             className="relative h-[600px] w-full bg-[#0B0F19] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col group perspective-1000"
           >
              {/* Card Header */}
              <div className="h-14 border-b border-white/5 flex items-center px-6 gap-2 bg-slate-900/80 backdrop-blur-md z-20">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700/50"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700/50"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700/50"></div>
                 </div>
                 <div className="ml-auto text-[10px] font-mono text-slate-500 tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    ALEO_VERIFIER_V1
                 </div>
              </div>
              
              {/* Card Body - Abstract ZK Visualization */}
              <div className="flex-1 p-8 relative overflow-hidden bg-[#020617]">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_60%)] transition-all duration-1000"></div>
                 <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-image-radial"></div>

                 {/* Scanning Effect */}
                 <motion.div 
                    animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10"
                 />

                 {/* Central Shield/Lock Animation */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                       {/* Spinning Rings */}
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-0 rounded-full border border-dashed border-indigo-500/20"
                       />
                       <motion.div 
                         animate={{ rotate: -360 }}
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-8 rounded-full border border-dashed border-blue-500/20"
                       />
                       <motion.div 
                         animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                         className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl"
                       />
                       
                       {/* Icon */}
                       <div className="relative z-20 p-6 rounded-2xl bg-[#0B0F19] border border-white/10 shadow-2xl">
                          <ShieldCheck className="w-16 h-16 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" strokeWidth={1} />
                       </div>
                    </div>
                 </div>
                 
                 {/* Floating Verification Badges */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-[20%] left-8 bg-[#0F172A]/90 backdrop-blur-md p-3 pr-6 rounded-lg border border-white/10 shadow-xl z-20 flex items-center gap-3"
                 >
                    <div className="p-2 bg-emerald-500/10 rounded-md">
                       <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                       <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Encrypted Input</div>
                       <div className="text-[10px] font-mono text-emerald-400/80">0x8a7...3f1</div>
                    </div>
                 </motion.div>

                 <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute bottom-[20%] right-8 bg-[#0F172A]/90 backdrop-blur-md p-3 pr-6 rounded-lg border border-white/10 shadow-xl z-20 flex items-center gap-3"
                 >
                    <div className="p-2 bg-indigo-500/10 rounded-md">
                       <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                       <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Proof Verified</div>
                       <div className="text-[10px] font-mono text-indigo-400/80">Valid Snark</div>
                    </div>
                 </motion.div>
              </div>
           </motion.div>

           {/* Features List */}
           <div className="space-y-12">
              {[
                { 
                  title: "Private Inputs", 
                  desc: "Your vote is encrypted client-side. No one, not even the protocol admins, can see your choice.",
                  icon: EyeOff 
                },
                { 
                  title: "Zero-Knowledge Proofs", 
                  desc: "Generate a cryptographic proof of eligibility without revealing your wallet address or token balance.",
                  icon: FileCode 
                },
                { 
                  title: "Public Outputs", 
                  desc: "Only the final tally is revealed on-chain. Individual receipts are mathematically impossible to generate.",
                  icon: Terminal 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-6 group"
                >
                   <div className="relative shrink-0">
                     <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <div className="relative w-16 h-16 rounded-2xl bg-slate-800/30 border border-white/10 flex items-center justify-center group-hover:bg-slate-800/50 group-hover:border-indigo-500/40 transition-all duration-500">
                        <item.icon className="w-7 h-7 text-slate-400 group-hover:text-indigo-400 transition-colors duration-500" strokeWidth={1.5} />
                     </div>
                   </div>
                   <div className="pt-2">
                      <h3 className="text-xl font-display font-semibold text-white mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm font-light tracking-wide">{item.desc}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};