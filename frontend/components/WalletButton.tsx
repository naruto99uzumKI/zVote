// ============================================================================
// Wallet Button Component - AXIS Pattern Implementation
// ============================================================================
//
// Based on AXIS WalletButton component
// Shows wallet connection status, address, balance, and network
//
// ============================================================================

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../lib/WalletContext';

interface WalletButtonProps {
    className?: string;
}

export const WalletButton: FC<WalletButtonProps> = ({ className = '' }) => {
    const {
        connected,
        address,
        connecting,
        connect,
        disconnect,
        formatAddress,
        balance,
        network,
    } = useWallet();

    const [showDropdown, setShowDropdown] = useState(false);

    // Detect if wallet is installed
    const walletDetected = typeof window !== 'undefined' &&
        ((window as any).leoWallet || (window as any).leo || (window as any).aleo);

    // Install wallet if not detected
    if (!walletDetected && !connected) {
        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://leo.app/', '_blank')}
                className={`px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-sm shadow-lg border border-white/10 ${className}`}
            >
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Install Leo Wallet
                </span>
            </motion.button>
        );
    }

    // ========================================================================
    // IMPORTANT: WalletNotSelectedError is expected in development
    // ========================================================================
    // When Leo Wallet extension is not installed, the @demox-labs library
    // logs "WalletNotSelectedError" to the console. This is NORMAL behavior
    // and happens in ALL Aleo dApps (including AXIS reference implementation).
    // 
    // This error is logged by the library BEFORE reaching our catch block,
    // so we cannot suppress it from within our code.
    //
    // To remove this error:
    // 1. Install Leo Wallet extension: https://leo.app/
    // 2. Or ignore it - it only appears in development console
    // ========================================================================
    const handleConnect = async () => {
        try {
            // Call connect from the wallet adapter hook
            if (connect) {
                await connect();
            }
        } catch (error: any) {
            // WalletNotSelectedError is EXPECTED when Leo Wallet is not installed
            // Don't log it - it's not actually an error, just means wallet isn't available
            const isWalletNotFound =
                error?.name === 'WalletNotSelectedError' ||
                error?.constructor?.name === 'WalletNotSelectedError' ||
                error?.message?.includes('WalletNotSelected') ||
                error?.toString().includes('WalletNotSelected');

            if (isWalletNotFound) {
                // Silently ignore - this is expected behavior
                return;
            }

            // Only log actual unexpected errors
            console.error('[Wallet] Unexpected connection error:', error);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <AnimatePresence mode="wait">
                {connected && address ? (
                    <div className="relative">
                        {/* Connected State - AXIS Pattern */}
                        <motion.button
                            key="connected"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="px-4 py-2.5 bg-surface/50 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-surface/70 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {/* Status Indicator */}
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

                                {/* Address */}
                                <span className="text-sm font-mono text-white">
                                    {formatAddress(address)}
                                </span>

                                {/* Dropdown Icon */}
                                <svg
                                    className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </div>
                        </motion.button>

                        {/* Dropdown - AXIS Pattern */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-64 bg-surface/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    {/* Connected Address */}
                                    <div className="p-4 border-b border-white/5">
                                        <div className="text-xs text-slate-500 mb-1">Connected Address</div>
                                        <div className="text-sm font-mono text-white break-all">{address}</div>
                                    </div>

                                    {/* Balance */}
                                    <div className="p-4 border-b border-white/5">
                                        <div className="text-xs text-slate-500 mb-1">Balance</div>
                                        <div className="text-sm text-white">
                                            {balance !== null ? `${balance} Aleo Credits` : 'Loading...'}
                                        </div>
                                    </div>

                                    {/* Network */}
                                    <div className="p-4 border-b border-white/5">
                                        <div className="text-xs text-slate-500 mb-1">Network</div>
                                        <div className="text-sm text-white capitalize">{network}</div>
                                    </div>

                                    {/* Disconnect Button */}
                                    <button
                                        onClick={() => {
                                            disconnect();
                                            setShowDropdown(false);
                                        }}
                                        className="w-full p-4 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        Disconnect Wallet
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    /* Disconnected State */
                    <motion.button
                        key="disconnected"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConnect}
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
                                    Connect Wallet
                                </>
                            )}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

const WalletIcon: FC = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
);
