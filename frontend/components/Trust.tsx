import React from 'react';
import { motion } from 'framer-motion';

export const Trust: React.FC = () => {
  return (
    <section className="py-24 border-y border-white/5 bg-surface/20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-mono text-gray-600 mb-12 tracking-[0.2em] uppercase">Secured by Zero-Knowledge Cryptography</p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {['Aleo Network', 'zk-SNARKs', 'Circom', 'Ethereum Bridged'].map((tech, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, opacity: 1 }}
              className="text-xl md:text-2xl font-display font-medium text-white/80 cursor-default transition-colors duration-300"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};