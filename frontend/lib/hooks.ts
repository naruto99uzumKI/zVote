// ============================================================================
// zVote Protocol - Custom Hooks (ZeroAudit-Style Pattern)
// ============================================================================
//
// Hooks for voting and proposal creation using direct Leo Wallet API.
// NO mock transactions. NO simulated responses. REAL wallet signing only.
//
// ============================================================================

import { useState, useCallback } from 'react';
import {
    castVote as aleoCastVote,
    mintVotingPower,
    getVotingPowerRecord,
    createProposal as aleoCreateProposal,
    getExplorerTransactionUrl,
    TransactionResult,
    testWalletTransaction, // Import for simulation
    PROGRAM_ID,
} from './aleo';
import { useWallet } from './WalletContext';

// ============================================================================
// Voting Hook
// ============================================================================

// Two-step voting: Mint then Vote
export interface VoteState {
    isVoting: boolean;
    isMinting: boolean; // New state for minting step
    txHash: string | null;
    explorerUrl: string | null;
    error: string | null;
    success: boolean;
    message?: string; // Status message
}

export function useVoting() {
    const { connected, address } = useWallet();
    const [state, setState] = useState<VoteState>({
        isVoting: false,
        isMinting: false,
        txHash: null,
        explorerUrl: null,
        error: null,
        success: false,
    });

    const castVote = useCallback(async (
        proposalId: string,
        voteOption: number,
        weight: number = 1
    ): Promise<TransactionResult> => {
        // Validate inputs
        if (!proposalId) {
            setState(prev => ({ ...prev, error: 'Invalid proposal ID' }));
            return { success: false, error: 'Invalid proposal ID' };
        }

        // Validate wallet connection
        if (!connected || !address) {
            const error = 'Wallet not connected. Please connect Leo Wallet first.';
            setState(prev => ({ ...prev, error }));
            return { success: false, error };
        }

        setState({
            isVoting: true,
            isMinting: false,
            txHash: null,
            explorerUrl: null,
            error: null,
            success: false,
            message: 'Checking voting power...'
        });

        console.log('[zVote] Starting vote process:', { proposalId, voteOption });

        try {
            // STEP 1: Check for existing VotingPower record
            console.log('[zVote] Fetching voting power record...');

            // REAL: Fetch record from wallet
            let record = await getVotingPowerRecord(proposalId);
            console.log('[zVote] Record search result:', record ? 'Found' : 'Not Found');

            if (!record) {
                console.log('[zVote] No record found. Starting MINTING phase...');
                setState(prev => ({
                    ...prev,
                    isMinting: true,
                    message: 'No voting power found. Please sign transaction to MINT voting power.'
                }));

                // REAL: Call mintVotingPower
                const mintResult = await mintVotingPower(proposalId, weight);

                if (!mintResult.success || !mintResult.transactionId) {
                    throw new Error(mintResult.error || 'Minting failed. You must mint power to vote.');
                }

                console.log('[zVote] Mint successful, TX:', mintResult.transactionId);

                const explorerUrl = getExplorerTransactionUrl(mintResult.transactionId);

                setState(prev => ({
                    ...prev,
                    isMinting: false,
                    isVoting: false,
                    message: 'Minting submitted! Please wait for confirmation (~1-2 mins) then click to Vote.',
                    txHash: mintResult.transactionId,
                    explorerUrl,
                    success: true // Mark success so UI shows the TX link
                }));

                return mintResult;
            }

            // STEP 2: Cast Vote using the Record
            console.log('[zVote] Record found. Casting private vote...');
            setState(prev => ({
                ...prev,
                message: 'Voting power confirmed. Please sign vote transaction.'
            }));

            // REAL: Call aleoCastVote
            const result = await aleoCastVote(proposalId, voteOption, weight, record);

            if (result.success && result.transactionId) {
                const explorerUrl = getExplorerTransactionUrl(result.transactionId);

                setState({
                    isVoting: false,
                    isMinting: false,
                    txHash: result.transactionId,
                    explorerUrl,
                    error: null,
                    success: true,
                    message: 'Vote submitted successfully!'
                });

                console.log('[zVote] Vote submitted! TX:', result.transactionId);
                return result;
            } else {
                throw new Error(result.error || 'Vote failed');
            }
        } catch (err: any) {
            console.error('[zVote] Vote process error:', err);
            setState({
                isVoting: false,
                isMinting: false,
                txHash: null,
                explorerUrl: null,
                error: err.message || 'Voting failed',
                success: false
            });
            return { success: false, error: err.message };
        }
    }, [connected, address]);

    const reset = useCallback(() => {
        setState({
            isVoting: false,
            isMinting: false,
            txHash: null,
            explorerUrl: null,
            error: null,
            success: false,
        });
    }, []);

    return {
        ...state,
        castVote,
        reset,
    };
}

// ============================================================================
// Create Proposal Hook
// ============================================================================

interface CreateProposalState {
    isCreating: boolean;
    txHash: string | null;
    explorerUrl: string | null;
    error: string | null;
    success: boolean;
}

export function useCreateProposal() {
    const { connected, address } = useWallet();
    const [state, setState] = useState<CreateProposalState>({
        isCreating: false,
        txHash: null,
        explorerUrl: null,
        error: null,
        success: false,
    });

    const createProposal = useCallback(async (
        optionsCount: number,
        votingDuration: number = 1000 // blocks
    ): Promise<TransactionResult> => {
        // Validate wallet connection
        if (!connected || !address) {
            const error = 'Wallet not connected. Please connect Leo Wallet first.';
            setState(prev => ({ ...prev, error }));
            return { success: false, error };
        }

        setState({
            isCreating: true,
            txHash: null,
            explorerUrl: null,
            error: null,
            success: false,
        });

        console.log('[zVote] Creating proposal:', { optionsCount, votingDuration });

        try {
            // For startBlock, we use a placeholder - in production this would
            // come from Aleo network block height
            const startBlock = 1000000; // Placeholder
            const endBlock = startBlock + votingDuration;

            // Generate a random proposal ID
            // In a real app, this might come from a backend or user input
            const randomId = Math.floor(Math.random() * 1000000000);
            const proposalId = `${randomId}`;

            // Execute REAL create proposal transaction - wallet popup will appear
            // Signature: (proposalId, startBlock, endBlock, optionsCount)
            const result = await aleoCreateProposal(proposalId, startBlock, endBlock, optionsCount);

            if (result.success && result.transactionId) {
                const explorerUrl = getExplorerTransactionUrl(result.transactionId);

                setState({
                    isCreating: false,
                    txHash: result.transactionId,
                    explorerUrl,
                    error: null,
                    success: true,
                });

                console.log('[zVote] Proposal created! TX:', result.transactionId);
                return result;
            } else {
                setState({
                    isCreating: false,
                    txHash: null,
                    explorerUrl: null,
                    error: result.error || 'Proposal creation failed',
                    success: false,
                });
                return result;
            }
        } catch (err: any) {
            console.error('[zVote] Create proposal error:', err);
            const error = err?.message || 'Failed to create proposal';

            setState({
                isCreating: false,
                txHash: null,
                explorerUrl: null,
                error,
                success: false,
            });

            return { success: false, error };
        }
    }, [connected, address]);

    const reset = useCallback(() => {
        setState({
            isCreating: false,
            txHash: null,
            explorerUrl: null,
            error: null,
            success: false,
        });
    }, []);

    return {
        ...state,
        createProposal,
        reset,
        programId: PROGRAM_ID,
    };
}

// Re-export useWallet for convenience
export { useWallet } from './WalletContext';
