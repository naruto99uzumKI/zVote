// ============================================================================
// Create Proposal Component - REAL Transaction Signing
// ============================================================================
//
// Creates proposals via direct Leo Wallet API (ZeroAudit-style pattern).
// NO mock transactions, NO simulated proofs.
//
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../lib/WalletContext';
import { useCreateProposal } from '../lib/hooks';

interface CreateProposalProps {
    onSuccess: (proposalId: string) => void;
    onCancel: () => void;
}

export const CreateProposal: React.FC<CreateProposalProps> = ({ onSuccess, onCancel }) => {
    const { connected } = useWallet();
    const { isCreating, txHash, explorerUrl, error, success, createProposal, reset } = useCreateProposal();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        options: ['', ''],
        votingDuration: 1000, // blocks
    });

    const addOption = () => {
        if (formData.options.length < 5) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, '']
            }));
        }
    };

    const removeOption = (index: number) => {
        if (formData.options.length > 2) {
            setFormData(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        }
    };

    const updateOption = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? value : opt)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!connected) {
            return;
        }

        const validOptions = formData.options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
            return;
        }

        try {
            // REAL transaction - opens Leo Wallet popup
            const result = await createProposal(validOptions.length, formData.votingDuration);

            if (result.success && result.transactionId) {
                // Return the transaction ID as proposal ID
                onSuccess(result.transactionId);
            }
        } catch (err) {
            console.error('Failed to create proposal:', err);
        }
    };

    const validOptions = formData.options.filter(opt => opt.trim());
    const isFormValid = formData.title.trim() && formData.description.trim() && validOptions.length >= 2;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-semibold text-white">Create Proposal</h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {success && txHash ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Proposal Created!</h3>
                            <p className="text-sm text-slate-400 mb-4">
                                Your proposal has been submitted to the Aleo network.
                            </p>
                            <code className="block text-xs text-indigo-400 font-mono break-all mb-4 p-2 bg-black/30 rounded">
                                TX: {txHash}
                            </code>
                            {explorerUrl && (
                                <a
                                    href={explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-400 hover:text-indigo-300"
                                >
                                    View on Aleo Explorer →
                                </a>
                            )}
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter proposal title"
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe your proposal"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
                                />
                            </div>

                            {/* Options */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Voting Options ({formData.options.length}/5)
                                </label>
                                <div className="space-y-2">
                                    {formData.options.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={e => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                                            />
                                            {formData.options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    className="p-2 text-red-400 hover:text-red-300"
                                                >
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {formData.options.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add Option
                                    </button>
                                )}
                            </div>

                            {/* Voting Duration */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Voting Duration (blocks)
                                </label>
                                <input
                                    type="number"
                                    value={formData.votingDuration}
                                    onChange={e => setFormData(prev => ({ ...prev, votingDuration: parseInt(e.target.value) || 1000 }))}
                                    min={100}
                                    max={100000}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50"
                                />
                                <p className="mt-1 text-xs text-slate-500">~{Math.round(formData.votingDuration * 2 / 60)} minutes</p>
                            </div>

                            {/* Program ID info */}
                            <div className="p-3 bg-black/20 rounded-lg">
                                <p className="text-xs text-slate-400">
                                    Program: <span className="text-indigo-400 font-mono">zvote_protocol_v15.aleo</span>
                                </p>
                            </div>

                            {/* Error display */}
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* Wallet connection warning */}
                            {!connected && (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400">
                                    Please connect your Leo Wallet to create a proposal
                                </div>
                            )}

                            {/* Submit button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={!connected || !isFormValid || isCreating}
                                className="w-full py-4 bg-electric-gradient rounded-xl font-display font-medium text-white shadow-glow-indigo disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Waiting for Wallet Approval...
                                    </span>
                                ) : (
                                    'Create Proposal'
                                )}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
