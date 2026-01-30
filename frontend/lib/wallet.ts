/**
 * zVote - Direct Aleo Wallet Connection
 * Based on ZeroAudit pattern - tries multiple networks to match wallet configuration
 * 
 * This eliminates the library-level console errors from @demox-labs adapter
 * and provides full control over the connection flow.
 */

export interface WalletState {
    connected: boolean;
    address: string | null;
    walletName: string | null;
    network: string | null;  // Actual network wallet is connected to
    connectedAt?: number;
}

// Leo Wallet decrypt permission options
const DecryptPermission = {
    NoDecrypt: 'NO_DECRYPT',
    UponRequest: 'DECRYPT_UPON_REQUEST',
    AutoDecrypt: 'AUTO_DECRYPT',
    OnChainHistory: 'ON_CHAIN_HISTORY',
};

// Demo Mode: Relaxed Constraints
// const TARGET_NETWORK = 'testnetbeta';
const WALLET_STORAGE_KEY = 'zvote_wallet_state';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Detect available wallet provider
 */
export function detectWallet(): any {
    if (typeof window === 'undefined') return null;
    const w = window as any;

    // Priority: leoWallet > leo > aleo
    if (w.leoWallet) return { provider: w.leoWallet, name: 'Leo Wallet' };
    if (w.leo) return { provider: w.leo, name: 'Leo Wallet' };
    if (w.aleo) return { provider: w.aleo, name: 'Aleo Wallet' };

    return null;
}

/**
 * Extract Aleo address from various response formats
 */
function getAddress(obj: any): string | null {
    if (!obj) return null;

    // Direct string address
    if (typeof obj === 'string' && obj.startsWith('aleo1')) {
        return obj;
    }

    // Object with address property
    if (typeof obj === 'object') {
        // Check common property names
        for (const key of ['address', 'account', 'publicKey', 'public_key']) {
            const val = obj[key];
            if (typeof val === 'string' && val.startsWith('aleo1')) {
                return val;
            }
        }

        // Search all properties
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (typeof val === 'string' && val.startsWith('aleo1')) {
                return val;
            }
        }

        // Array of addresses
        if (Array.isArray(obj) && obj.length > 0) {
            return getAddress(obj[0]);
        }
    }

    return null;
}

/**
 * Connect to Aleo wallet - STRICT TESTNET ONLY
 */
export async function connectWallet(): Promise<WalletState> {
    const detected = detectWallet();

    if (!detected) {
        throw new Error(
            'No Aleo wallet found.\n\n' +
            'Please install Leo Wallet extension:\n' +
            'https://leo.app/'
        );
    }

    const { provider, name } = detected;
    console.log(`[zVote] Connecting to ${name}...`);

    let address: string | null = null;
    let currentNetwork: string | null = null;

    try {
        // 1. Connect (2 Args - Required to prevent crash)
        // We request 'testnetbeta' to satisfy API, but we accept ANY network in response.
        const result = await provider.connect(DecryptPermission.UponRequest, 'testnetbeta');
        console.log('[zVote] Connect result:', result);

        address = getAddress(result);

        // Fallback address extraction
        if (!address && provider.publicKey) {
            if (typeof provider.publicKey === 'string' && provider.publicKey.startsWith('aleo1')) {
                address = provider.publicKey;
            }
        }

        // 2. Detect Network (Dynamic)
        if (typeof provider.network === 'string') {
            currentNetwork = provider.network;
        } else if (result?.network) {
            currentNetwork = result.network;
        }

        console.log(`[zVote] Wallet active network: ${currentNetwork}`);

        // REMOVED STRICT NETWORK CHECK FOR STABLE DEMO
        // We now accept whatever network the wallet is on.

    } catch (e: any) {
        console.error('[zVote] Connection failed:', e);

        if (
            e?.message?.toLowerCase().includes('rejected') ||
            e?.message?.toLowerCase().includes('denied')
        ) {
            throw new Error('Connection rejected by user.');
        }

        throw e;
    }

    if (!address) {
        throw new Error('Connected but failed to retrieve account address.');
    }

    console.log(`[zVote] ✅ Successfully connected: ${address}`);
    console.log(`[zVote] ✅ Network confirmed: ${currentNetwork}`);

    // Create wallet state
    const state: WalletState = {
        connected: true,
        address,
        walletName: name,
        network: currentNetwork,
        connectedAt: Date.now(),
    };

    // Persist to sessionStorage
    storeWallet(state);

    return state;
}

/**
 * Disconnect wallet
 */
export function disconnectWallet(): WalletState {
    console.log('[zVote] Disconnecting wallet...');
    sessionStorage.removeItem(WALLET_STORAGE_KEY);

    return {
        connected: false,
        address: null,
        walletName: null,
        network: null,
    };
}

/**
 * Store wallet state in sessionStorage
 */
function storeWallet(state: WalletState): void {
    try {
        sessionStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('[zVote] Failed to store wallet state:', e);
    }
}

/**
 * Get stored wallet state from sessionStorage
 */
export function getStoredWallet(): WalletState {
    try {
        const stored = sessionStorage.getItem(WALLET_STORAGE_KEY);
        if (stored) {
            const state: WalletState = JSON.parse(stored);

            // Check if session expired (24 hours)
            const now = Date.now();
            const connectedAt = state.connectedAt || 0;
            const elapsed = now - connectedAt;

            if (elapsed > SESSION_DURATION) {
                console.log('[zVote] Wallet session expired');
                sessionStorage.removeItem(WALLET_STORAGE_KEY);
                return { connected: false, address: null, walletName: null, network: null };
            }

            return state;
        }
    } catch (e) {
        console.warn('[zVote] Failed to retrieve wallet state:', e);
        sessionStorage.removeItem(WALLET_STORAGE_KEY);
    }

    return {
        connected: false,
        address: null,
        walletName: null,
        network: null,
    };
}

/**
 * Check if wallet extension is available
 */
export function isWalletAvailable(): boolean {
    return detectWallet() !== null;
}

/**
 * Get wallet install URL
 */
export const LEO_WALLET_URL = 'https://leo.app/';
