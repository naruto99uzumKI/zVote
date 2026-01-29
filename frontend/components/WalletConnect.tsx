// ============================================================================
// Wallet Connect Component - REAL Leo Wallet Only
// ============================================================================
//
// Uses direct window.leoWallet API (ZeroAudit-style pattern).
// Shows install prompt if Leo Wallet not detected.
//
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../lib/WalletContext';

interface WalletConnectProps {
    className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ className = '' }) => {
    const {
        connected,
        address,
        walletName,
        connecting,
        error,
        walletInstalled,
        installUrl,
        connect,
        disconnect,
        clearError,
    } = useWallet();

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
    };

    // Show install prompt if wallet not available
    if (!walletInstalled && !connected) {
        return (
            <div className={`relative ${className}`}>
                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(installUrl, '_blank')}
                    className="relative px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-sm shadow-lg border border-white/10 overflow-hidden group"
                >
                    <span className="relative flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Install Leo Wallet
                    </span>
                </motion.button>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-full mt-2 left-0 right-0 text-xs text-amber-400 text-center whitespace-nowrap"
                >
                    Required to use zVote
                </motion.p>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <AnimatePresence mode="wait">
                {connected && address ? (
                    <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3"
                    >
                        {/* Address display */}
                        <div className="px-4 py-2 bg-surface/50 backdrop-blur-sm border border-white/10 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-mono text-white">
                                    {formatAddress(address)}
                                </span>
                            </div>
                            {walletName && (
                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                    {walletName}
                                </span>
                            )}
                        </div>

                        {/* Disconnect button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={disconnect}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Disconnect"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.button
                        key="disconnected"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={connect}
                        disabled={connecting}
                        className="relative px-6 py-3 bg-electric-gradient text-white rounded-xl font-medium text-sm shadow-glow-indigo border border-white/10 overflow-hidden group disabled:opacity-50 disabled:cursor-wait"
                    >
                        <span className="relative flex items-center gap-2">
                            {connecting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <WalletIcon />
                                    Connect Leo Wallet
                                </>
                            )}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Error display */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-0 right-0 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                    <p className="text-xs text-red-400 text-center">{error}</p>
                    <button
                        onClick={clearError}
                        className="absolute top-1 right-1 text-red-400 hover:text-red-300"
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

const WalletIcon: React.FC = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
);
