import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ number, title, text }: { number: string, title: string, text: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    }}
    className="group relative h-full"
  >
    {/* Connector Line (Desktop) */}
    <div className="hidden lg:block absolute top-12 -right-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-10 opacity-50" />

    <div className="h-full p-8 rounded-2xl bg-[#0B0F19]/50 border border-white/[0.05] hover:border-indigo-500/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/10">
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
           <span className="font-display text-5xl font-bold text-slate-800 mb-0 group-hover:text-indigo-500/20 transition-colors duration-500 select-none tracking-tighter">{number}</span>
           <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-colors duration-500"></div>
        </div>
        
        <h3 className="text-xl font-display font-semibold text-white mb-4 group-hover:text-indigo-200 transition-colors duration-300 tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed tracking-wide font-light">{text}</p>
      </div>
    </div>
  </motion.div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
       {/* Background Noise/Grid */}
       <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-6 relative">
         <div className="mb-24 max-w-2xl">
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-indigo-500 font-semibold tracking-widest text-xs uppercase mb-4 block"
           >
             The Process
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tighter"
           >
             How zVote Works
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-slate-400 text-lg font-light tracking-wide"
           >
             The lifecycle of a private governance proposal, designed for maximum integrity.
           </motion.p>
         </div>

         <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-50px" }}
           transition={{ staggerChildren: 0.2 }}
           className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
         >
            <StepCard 
              number="01"
              title="Create Proposal"
              text="Governors submit proposals on-chain. Eligibility criteria (snapshot block, token holdings) are immutably defined."
            />
            <StepCard 
              number="02"
              title="Private Voting"
              text="Users generate a local ZK-proof confirming they hold tokens, then submit the vote + proof. No wallet address is linked."
            />
            <StepCard 
              number="03"
              title="Verification"
              text="The smart contract verifies the ZK-proof. If valid, the vote is counted. Double-voting is mathematically impossible."
            />
            <StepCard 
              number="04"
              title="Public Tally"
              text="Once the voting period ends, the final results are available. The distribution is public, but individual votes remain hidden."
            />
         </motion.div>
       </div>
    </section>
  );
};