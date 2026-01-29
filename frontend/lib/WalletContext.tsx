// ============================================================================
// zVote Protocol - Wallet Context (ZeroAudit-Style Pattern)
// ============================================================================
//
// React context for wallet state management using direct Leo Wallet API.
// NO mock wallets. NO adapter packages. Direct window.leoWallet integration.
//
// ============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    WalletState,
    connectWallet as aleoConnect,
    disconnectWallet as aleoDisconnect,
    getStoredWallet,
    isWalletAvailable,
    LEO_WALLET_URL,
} from './aleo';

interface WalletContextType {
    // Wallet state
    connected: boolean;
    address: string | null;
    walletName: string | null;
    connecting: boolean;
    error: string | null;

    // Wallet detection
    walletInstalled: boolean;
    installUrl: string;

    // Actions
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
    children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
    const [state, setState] = useState<WalletState>({
        connected: false,
        address: null,
        walletName: null,
    });
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletInstalled, setWalletInstalled] = useState(false);

    // Check for stored wallet on mount and detect wallet availability
    useEffect(() => {
        // Delay check to allow wallet extension to inject
        const checkWallet = () => {
            const installed = isWalletAvailable();
            setWalletInstalled(installed);
            console.log('[zVote] Wallet installed:', installed);

            // Restore stored wallet state
            const stored = getStoredWallet();
            if (stored.connected && stored.address) {
                console.log('[zVote] Restoring stored wallet:', stored.address);
                setState(stored);
            }
        };

        const timeout = setTimeout(checkWallet, 300);
        return () => clearTimeout(timeout);
    }, []);

    // Connect wallet
    const connect = useCallback(async () => {
        setError(null);
        setConnecting(true);

        try {
            const walletState = await aleoConnect();
            setState(walletState);
            console.log('[zVote] Wallet connected:', walletState.address);
        } catch (err: any) {
            console.error('[zVote] Connection error:', err);
            const errorMessage = err?.message || 'Failed to connect wallet';
            setError(errorMessage);

            // If no wallet found, update installed state
            if (errorMessage.includes('No Aleo wallet found')) {
                setWalletInstalled(false);
            }
        } finally {
            setConnecting(false);
        }
    }, []);

    // Disconnect wallet
    const disconnect = useCallback(async () => {
        try {
            const newState = await aleoDisconnect();
            setState(newState);
            setError(null);
            console.log('[zVote] Wallet disconnected');
        } catch (err: any) {
            console.error('[zVote] Disconnect error:', err);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: WalletContextType = {
        connected: state.connected,
        address: state.address,
        walletName: state.walletName,
        connecting,
        error,
        walletInstalled,
        installUrl: LEO_WALLET_URL,
        connect,
        disconnect,
        clearError,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet(): WalletContextType {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
