/**
 * zVote Wallet Context - ZeroAudit Pattern
 * 
 * Direct wallet connection without @demox-labs adapter.
 * Eliminates library-level console errors and provides full control.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    connectWallet,
    disconnectWallet,
    getStoredWallet,
    isWalletAvailable,
    type WalletState,
} from './wallet';

interface WalletContextType extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
    connecting: boolean;
    formatAddress: (address: string) => string;
    balance: number | null;
    network: string;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
    children: ReactNode;
}

/**
 * WalletProvider - Custom implementation
 * 
 * Manages wallet state using direct Leo Wallet connection.
 */
export function WalletProvider({ children }: WalletProviderProps) {
    const [wallet, setWallet] = useState<WalletState>(getStoredWallet());
    const [connecting, setConnecting] = useState(false);

    // Auto-reconnect on mount if session exists
    useEffect(() => {
        const stored = getStoredWallet();
        if (stored.connected && stored.address) {
            console.log('[zVote] Restoring wallet session:', stored.address);
            setWallet(stored);
        }
    }, []);

    // Handle wallet connection
    const connect = async () => {
        if (connecting) return;

        setConnecting(true);
        try {
            const result = await connectWallet();
            setWallet(result);
            console.log('[zVote] Wallet connected successfully');
        } catch (error: any) {
            console.error('[zVote] Connection failed:', error);
            // Reset state on error
            setWallet({ connected: false, address: null, walletName: null, network: null });
            throw error;
        } finally {
            setConnecting(false);
        }
    };

    // Handle wallet disconnection
    const disconnect = () => {
        const result = disconnectWallet();
        setWallet(result);
        console.log('[zVote] Wallet disconnected');
    };

    // Format address for display
    const formatAddress = (address: string): string => {
        if (!address) return '';
        if (address.length <= 16) return address;
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    };

    const value: WalletContextType = {
        ...wallet,
        connect,
        disconnect,
        connecting,
        formatAddress,
        balance: null, // Will be implemented later when fetching from network
        network: wallet.network || 'testnet', // Use actual connected network
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

/**
 * useWallet hook
 * 
 * Access wallet state and functions from any component.
 */
export function useWallet(): WalletContextType {
    const context = useContext(WalletContext);

    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }

    return context;
}

// Export wallet utilities
export { isWalletAvailable };
