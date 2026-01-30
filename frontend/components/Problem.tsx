import React from 'react';
import { motion } from 'framer-motion';

export const Problem: React.FC = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
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
            transition={{ duration: 1, delay: 0.2 }}
            className="text-slate-400 max-w-sm text-base leading-relaxed font-light"
          >
            Standard governance models expose voters to coercion and bribery. We fix this at the cryptographic level.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Public Surveillance",
              description: "On-chain voting history creates a permanent profile for targeted harassment and coercion."
            },
            {
              title: "Vote Buying Markets",
              description: "Traceable votes allow bribes to be verified and automated via smart contracts."
            },
            {
              title: "Corporate Capture",
              description: "Whales track wallet associations to pressure delegates and force favorable outcomes."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-slate-900/40 border border-white/[0.05] hover:border-indigo-500/30 backdrop-blur-md"
            >
              <h3 className="text-xl font-display font-semibold text-white mb-3 tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed tracking-wide">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};