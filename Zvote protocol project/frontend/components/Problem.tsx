import React from 'react';
import { motion } from 'framer-motion';
import { Eye, DollarSign, Fingerprint } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const iconContainerVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, rotate: 5, transition: { duration: 0.4, ease: "easeOut" } }
};

const ProblemCard = ({ icon: Icon, title, description }: any) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="rest"
      className="group relative p-8 rounded-2xl bg-slate-900/40 border border-white/[0.05] hover:border-indigo-500/30 overflow-hidden backdrop-blur-md transition-all duration-500"
    >
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        <motion.div 
          variants={iconContainerVariants}
          className="w-14 h-14 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:text-indigo-300 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)] transition-colors duration-500"
        >
          <Icon className="w-7 h-7" strokeWidth={1.5} />
        </motion.div>
        <h3 className="text-xl font-display font-semibold text-white mb-3 tracking-tight group-hover:text-indigo-100 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed tracking-wide group-hover:text-slate-300 transition-colors">{description}</p>
      </div>
    </motion.div>
  );
};

export const Problem: React.FC = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
             className="max-w-2xl"
           >
              <span className="text-indigo-500 font-semibold tracking-widest text-xs uppercase mb-4 block">The Vulnerability</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter leading-[1.1]">
                Transparency became an <br />
                <span className="text-slate-600">attack vector.</span>
              </h2>
           </motion.div>
           <motion.p 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
             className="text-slate-400 max-w-sm text-base leading-relaxed font-light"
           >
             Standard governance models expose voters to coercion and bribery. We fix this at the cryptographic level.
           </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.15 }}
          className="grid md:grid-cols-3 gap-8"
        >
           <ProblemCard 
             icon={Eye}
             title="Public Surveillance"
             description="On-chain voting history creates a permanent profile for targeted harassment and coercion."
           />
           <ProblemCard 
             icon={DollarSign}
             title="Vote Buying Markets"
             description="Traceable votes allow bribes to be verified and automated via smart contracts."
           />
           <ProblemCard 
             icon={Fingerprint}
             title="Corporate Capture"
             description="Whales track wallet associations to pressure delegates and force favorable outcomes."
           />
        </motion.div>
      </div>
    </section>
  );
};