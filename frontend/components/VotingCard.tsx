// ============================================================================
// Voting Card Component - REAL Transaction Signing
// ============================================================================
//
// Voting via direct Leo Wallet API (ZeroAudit-style pattern).
// NO mock transactions, NO simulated proofs.
//
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../lib/WalletContext';
import { useVoting } from '../lib/hooks';

interface VotingCardProps {
    proposalId: string;
    title: string;
    description: string;
    options: string[];
    startBlock: number;
    endBlock: number;
    currentBlock: number;
    tallies: { option_id: number; votes: number; percentage: number }[];
    isActive: boolean;
}

export const VotingCard: React.FC<VotingCardProps> = ({
    proposalId,
    title,
    description,
    options,
    startBlock,
    endBlock,
    currentBlock,
    tallies,
    isActive
}) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const { connected } = useWallet();
    const { isVoting, isMinting, txHash, explorerUrl, error, success, message, castVote, reset } = useVoting();

    const votingProgress = Math.min(100, Math.max(0, ((currentBlock - startBlock) / (endBlock - startBlock)) * 100));
    const hasVotingStarted = currentBlock >= startBlock;
    const hasVotingEnded = currentBlock > endBlock;
    const canVote = isActive && hasVotingStarted && !hasVotingEnded && connected;

    const handleVote = async () => {
        if (selectedOption === null || !canVote) return;

        try {
            // REAL transaction - opens Leo Wallet popup
            await castVote(proposalId, selectedOption, 1);
        } catch (err) {
            console.error('Vote failed:', err);
        }
    };

    const totalVotes = tallies.reduce((sum, t) => sum + t.votes, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-display font-semibold text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400">
                        {description}
                    </p>
                </div>
                <StatusBadge isActive={isActive} hasEnded={hasVotingEnded} />
            </div>

            {/* Voting progress timeline */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Block {startBlock.toLocaleString()}</span>
                    <span>Block {endBlock.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${votingProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${hasVotingEnded
                            ? 'bg-slate-500'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                            }`}
                    />
                </div>
                <div className="text-center mt-2 text-xs text-slate-500">
                    Current: Block {currentBlock.toLocaleString()}
                </div>
            </div>

            {/* Vote options */}
            <div className="space-y-3 mb-6">
                {options.map((option, index) => {
                    const tally = tallies.find(t => t.option_id === index) || { votes: 0, percentage: 0 };
                    const isSelected = selectedOption === index;

                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: canVote ? 1.01 : 1 }}
                            whileTap={{ scale: canVote ? 0.99 : 1 }}
                            onClick={() => canVote && setSelectedOption(index)}
                            disabled={!canVote || isVoting}
                            className={`relative w-full p-4 rounded-xl text-left transition-all duration-300 overflow-hidden ${isSelected
                                ? 'bg-indigo-500/20 border-2 border-indigo-500/50'
                                : 'bg-white/5 border border-white/10 hover:border-white/20'
                                } ${!canVote || isVoting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                        >
                            {/* Progress bar background */}
                            <div
                                className={`absolute inset-0 transition-all duration-500 ${isSelected ? 'bg-indigo-500/10' : 'bg-white/5'
                                    }`}
                                style={{ width: `${tally.percentage}%` }}
                            />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                        ? 'border-indigo-500 bg-indigo-500'
                                        : 'border-slate-500'
                                        }`}>
                                        {isSelected && (
                                            <motion.svg
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-3 h-3 text-white"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </motion.svg>
                                        )}
                                    </div>
                                    <span className="font-medium text-white">{option}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-slate-400">
                                        {tally.votes.toLocaleString()} votes
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {tally.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Total votes */}
            <div className="text-center text-sm text-slate-400 mb-4">
                Total votes: <span className="text-white font-medium">{totalVotes.toLocaleString()}</span>
            </div>

            {/* Vote button or status */}
            {/* Vote button or status */}
            <AnimatePresence mode="wait">
                {success && txHash ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
                    >
                        <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Status Updated!</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">
                            {message || 'Transaction submitted to Aleo network.'}
                        </p>
                        <code className="text-xs text-indigo-400 font-mono break-all">
                            TX: {txHash}
                        </code>
                        {explorerUrl && (
                            <a
                                href={explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-xs text-indigo-400 hover:text-indigo-300"
                            >
                                View on Aleo Explorer →
                            </a>
                        )}
                    </motion.div>
                ) : !connected ? (
                    <motion.div
                        key="connect"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-400 text-sm p-4 bg-white/5 rounded-xl"
                    >
                        Connect your Leo Wallet to vote
                    </motion.div>
                ) : !hasVotingStarted ? (
                    <motion.div
                        key="notstarted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-400 text-sm"
                    >
                        Voting has not started yet
                    </motion.div>
                ) : hasVotingEnded ? (
                    <motion.div
                        key="ended"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-400 text-sm"
                    >
                        Voting has ended - Results are final
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <motion.button
                            key="vote"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleVote}
                            disabled={selectedOption === null || isVoting || isMinting}
                            className={`w-full py-4 rounded-xl font-display font-medium text-white shadow-glow-indigo disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isMinting ? 'bg-indigo-600' : 'bg-electric-gradient'
                                }`}
                        >
                            {isMinting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Minting Voting Power...
                                </span>
                            ) : isVoting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing Vote...
                                </span>
                            ) : selectedOption === null ? (
                                'Select an option to vote'
                            ) : (
                                'Cast Private Vote'
                            )}
                        </motion.button>
                        {message && !success && (
                            <div className="text-center text-xs text-indigo-300 animate-pulse">
                                {message}
                            </div>
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* Error display */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center"
                >
                    {error}
                </motion.div>
            )}

            {/* Privacy notice */}
            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldIcon />
                    <span>Votes are signed by Leo Wallet and sent to Aleo Network.</span>
                </div>
            </div>
        </motion.div>
    );
};

const StatusBadge: React.FC<{ isActive: boolean; hasEnded: boolean }> = ({ isActive, hasEnded }) => {
    if (hasEnded) {
        return (
            <span className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-medium">
                Closed
            </span>
        );
    }
    if (isActive) {
        return (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active
            </span>
        );
    }
    return (
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Pending
        </span>
    );
};

const ShieldIcon: React.FC = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);
