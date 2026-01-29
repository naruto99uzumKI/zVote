import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { HowItWorks } from './components/HowItWorks';
import { Comparison } from './components/Comparison';
import { Trust } from './components/Trust';
import { FinalCTA } from './components/FinalCTA';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-white relative selection:bg-indigo-500/30">
      
      {/* Global Noise Overlay for Texture */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      {/* Global Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-grid opacity-30"></div>
         {/* Top Spotlight/Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-radial from-indigo-900/20 via-transparent to-transparent blur-[120px] opacity-40"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <main className="flex flex-col">
          <Hero />
          <Problem />
          <Solution />
          <HowItWorks />
          <Comparison />
          <Trust />
          <FinalCTA />
        </main>
        
        <footer className="py-12 border-t border-white/[0.05] bg-bg/80 relative backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium tracking-wide">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
              All Systems Operational
            </p>
            <div className="flex gap-8 mt-6 md:mt-0">
               <a href="#" className="hover:text-indigo-400 transition-colors">TWITTER</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">DISCORD</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">GITHUB</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">DOCS</a>
            </div>
            <p className="mt-6 md:mt-0 text-slate-600">© 2024 ZVOTE PROTOCOL</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;