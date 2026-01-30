import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { HowItWorks } from './components/HowItWorks';
import { Comparison } from './components/Comparison';
import { Trust } from './components/Trust';
import { FinalCTA } from './components/FinalCTA';
import { WalletButton } from './components/WalletButton';
import { VotingCard } from './components/VotingCard';
import { CreateProposal } from './components/CreateProposal';
import { useWallet } from './lib/WalletContext';

// Demo proposal for showcase
const DEMO_PROPOSAL = {
  proposalId: '1field',
  title: 'Treasury Allocation Q1 2026',
  description: 'Decide how to allocate the DAO treasury funds for Q1 2026',
  options: ['Development', 'Marketing', 'Community Rewards'],
  startBlock: 1000000,
  endBlock: 1050000,
  currentBlock: 1025000,
  tallies: [
    { option_id: 0, votes: 145000, percentage: 48.3 },
    { option_id: 1, votes: 98000, percentage: 32.7 },
    { option_id: 2, votes: 57000, percentage: 19.0 },
  ],
  isActive: true
};

import { WalletTest } from './components/WalletTest';

const App: React.FC = () => {
  // HIDDEN TEST ROUTE
  const [isTestMode, setIsTestMode] = useState(false);

  React.useEffect(() => {
    if (window.location.hash === '#test-wallet') {
      setIsTestMode(true);
    }
  }, []);

  const [showDApp, setShowDApp] = useState(false);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const { connected } = useWallet();

  // Test Mode View
  if (isTestMode) {
    return <WalletTest />;
  }

  // Landing page view
  if (!showDApp) {
    return (
      <div className="min-h-screen bg-bg text-white relative selection:bg-indigo-500/30">
        {/* Background gradient effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent opacity-50" />
          <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] bg-gradient-radial from-purple-500/10 via-transparent to-transparent opacity-50" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar onLaunchApp={() => setShowDApp(true)} />
          <Hero onLaunchApp={() => setShowDApp(true)} />
          <Problem />
          <Solution />
          <HowItWorks />
          <Comparison />
          <Trust />
          <FinalCTA onLaunchApp={() => setShowDApp(true)} />
        </div>
      </div>
    );
  }

  // DApp view
  return (
    <div className="min-h-screen bg-bg text-white relative selection:bg-indigo-500/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent opacity-30" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] bg-gradient-radial from-purple-500/10 via-transparent to-transparent opacity-30" />
      </div>

      {/* DApp Header */}
      <header className="relative z-50 border-b border-white/5 bg-surface/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setShowDApp(false)}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-electric-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="font-display font-semibold text-white group-hover:text-indigo-400 transition-colors">
                zVote
              </span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink active>Proposals</NavLink>
              <NavLink>My Votes</NavLink>
              <NavLink>Governance</NavLink>
            </nav>

            {/* Wallet */}
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              Active Proposals
            </h1>
            <p className="text-slate-400">
              Vote privately on governance proposals
            </p>
          </div>

          {connected && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateProposal(true)}
              className="px-5 py-2.5 bg-electric-gradient rounded-xl text-sm font-medium text-white shadow-glow-indigo flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Proposal
            </motion.button>
          )}
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demo Proposal */}
          <VotingCard
            {...DEMO_PROPOSAL}
          />

          {/* Empty state for second slot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface/30 backdrop-blur-xl border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              More Proposals Coming
            </h3>
            <p className="text-sm text-slate-500 text-center max-w-xs">
              New governance proposals will appear here as they are created by DAO admins.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatCard
            label="Total Proposals"
            value="1"
            icon={<DocumentIcon />}
          />
          <StatCard
            label="Total Votes Cast"
            value="300,000"
            icon={<VoteIcon />}
          />
          <StatCard
            label="Privacy Guaranteed"
            value="100%"
            icon={<ShieldIcon />}
            highlight
          />
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">
                Your Vote is Completely Private
              </h3>
              <p className="text-sm text-slate-400">
                zVote uses zero-knowledge proofs to ensure your vote is never revealed.
                Even you cannot prove how you voted — making bribery impossible.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Create Proposal Modal */}
      <AnimatePresence>
        {showCreateProposal && (
          <CreateProposal
            onCancel={() => setShowCreateProposal(false)}
            onSuccess={(proposalId) => {
              setShowCreateProposal(false);
              // In production, would refresh proposals list
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const NavLink: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active }) => (
  <button className={`text-sm font-medium transition-colors ${active
    ? 'text-white'
    : 'text-slate-400 hover:text-white'
    }`}>
    {children}
  </button>
);

const StatCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}> = ({ label, value, icon, highlight }) => (
  <div className={`p-5 rounded-xl border ${highlight
    ? 'bg-indigo-500/10 border-indigo-500/20'
    : 'bg-surface/50 border-white/5'
    }`}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400'
        }`}>
        {icon}
      </div>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
    <p className={`text-2xl font-display font-bold ${highlight ? 'text-indigo-400' : 'text-white'}`}>
      {value}
    </p>
  </div>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const VoteIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export default App;