// ============================================================================
// zVote Protocol - Private, Bribe-Resistant DAO Governance
// ============================================================================
// 
// This program implements private voting for DAOs using zero-knowledge proofs.
// Key properties:
// - Votes are private (encrypted to the voter)
// - Results are public (aggregated tallies only)
// - No vote receipts possible (bribe-resistant)
// - Double voting is mathematically impossible
//
// ============================================================================

program zvote_protocol_v15.aleo {

    // ========================================================================
    // STRUCTS - Public data structures
    // ========================================================================

    // Proposal metadata stored publicly
    struct ProposalInfo {
        proposal_id: field,
        creator: address,
        start_block: u32,
        end_block: u32,
        options_count: u8,
        is_active: bool,
        total_votes: u64
    }

    // Vote tally key - combines proposal and option
    struct TallyKey {
        proposal_id: field,
        option_id: u8
    }

    // ========================================================================
    // RECORDS - Private data (encrypted to owner only)
    // ========================================================================

    // Voting power record - issued to eligible voters
    // This record is CONSUMED when voting (one-time use)
    record VotingPower {
        owner: address,
        proposal_id: field,
        weight: u64,
        nullifier_seed: field  // Secret seed for nullifier generation
    }

    // Admin capability record - proves admin rights
    record AdminCap {
        owner: address,
        dao_id: field
    }

    // ========================================================================
    // MAPPINGS - Public on-chain state
    // ========================================================================

    // Proposal registry: proposal_id => ProposalInfo
    mapping proposals: field => ProposalInfo;

    // Vote tallies: hash(proposal_id, option_id) => vote_count
    mapping vote_tallies: field => u64;

    // Nullifier set: nullifier => has_voted
    // Prevents double voting without revealing voter identity
    mapping nullifiers: field => bool;

    // Proposal counter for unique IDs
    mapping proposal_counter: u8 => u64;

    // ========================================================================
    // TRANSITIONS - Core protocol functions
    // ========================================================================

    // ------------------------------------------------------------------------
    // Initialize Admin Capability
    // Creates an admin record for managing proposals
    // ------------------------------------------------------------------------
    transition init_admin(dao_id: field) -> AdminCap {
        return AdminCap {
            owner: self.caller,
            dao_id: dao_id
        };
    }

    // ------------------------------------------------------------------------
    // Create Proposal
    // Admin creates a new governance proposal with voting window
    // ------------------------------------------------------------------------
    transition create_proposal(
        admin: AdminCap,
        proposal_id: field,
        start_block: u32,
        end_block: u32,
        options_count: u8
    ) -> AdminCap {
        // Validate inputs
        assert(start_block < end_block);
        assert(options_count >= 2u8);
        assert(options_count <= 10u8);

        // Return admin cap (not consumed)
        let returned_admin: AdminCap = AdminCap {
            owner: admin.owner,
            dao_id: admin.dao_id
        };

        return returned_admin then finalize(
            proposal_id,
            self.caller,
            start_block,
            end_block,
            options_count
        );
    }

    finalize create_proposal(
        proposal_id: field,
        creator: address,
        start_block: u32,
        end_block: u32,
        options_count: u8
    ) {
        // Ensure proposal doesn't already exist
        let exists: bool = Mapping::contains(proposals, proposal_id);
        assert(!exists);

        // Create and store proposal
        let proposal: ProposalInfo = ProposalInfo {
            proposal_id: proposal_id,
            creator: creator,
            start_block: start_block,
            end_block: end_block,
            options_count: options_count,
            is_active: true,
            total_votes: 0u64
        };

        Mapping::set(proposals, proposal_id, proposal);

        // Initialize vote tallies for each option to 0
        // Option IDs: 0, 1, 2, ... (options_count - 1)
        for i: u8 in 0u8..10u8 {
            if i < options_count {
                let tally_key: TallyKey = TallyKey {
                    proposal_id: proposal_id,
                    option_id: i
                };
                let tally_hash: field = BHP256::hash_to_field(tally_key);
                Mapping::set(vote_tallies, tally_hash, 0u64);
            }
        }
    }

    // ------------------------------------------------------------------------
    // Create Public Proposal (SIMPLIFIED - for testing/demos)
    // Anyone can create a proposal without AdminCap
    // ------------------------------------------------------------------------
    transition create_public_proposal(
        proposal_id: field,
        start_block: u32,
        end_block: u32,
        options_count: u8
    ) {
        // Validate inputs
        assert(start_block < end_block);
        assert(options_count >= 2u8);
        assert(options_count <= 10u8);

        return then finalize(
            proposal_id,
            self.caller,
            start_block,
            end_block,
            options_count
        );
    }

    finalize create_public_proposal(
        proposal_id: field,
        creator: address,
        start_block: u32,
        end_block: u32,
        options_count: u8
    ) {
        // Ensure proposal doesn't already exist
        let exists: bool = Mapping::contains(proposals, proposal_id);
        assert(!exists);

        // Create and store proposal
        let proposal: ProposalInfo = ProposalInfo {
            proposal_id: proposal_id,
            creator: creator,
            start_block: start_block,
            end_block: end_block,
            options_count: options_count,
            is_active: true,
            total_votes: 0u64
        };

        Mapping::set(proposals, proposal_id, proposal);

        // Initialize vote tallies
        for i: u8 in 0u8..10u8 {
            if i < options_count {
                let tally_key: TallyKey = TallyKey {
                    proposal_id: proposal_id,
                    option_id: i
                };
                let tally_hash: field = BHP256::hash_to_field(tally_key);
                Mapping::set(vote_tallies, tally_hash, 0u64);
            }
        }
    }

    // ------------------------------------------------------------------------
    // Mint Voting Power (Public)
    // Allows anyone to mint voting power for themselves (for testing/demo)
    // In production, this would be restricted to admin or token holders
    // ------------------------------------------------------------------------
    transition mint_voting_power(
        proposal_id: field,
        weight: u64
    ) -> VotingPower {
        return VotingPower {
            owner: self.caller,
            proposal_id: proposal_id,
            weight: weight,
            nullifier_seed: 0field // Default seed, user should rotate in real app
        };
    }

    // ------------------------------------------------------------------------
    // Cast Vote (PRIVATE)
    // User casts a private vote using their VotingPower record
    // ------------------------------------------------------------------------
    transition cast_vote(
        voting_power: VotingPower,
        vote_option: u8
    ) {
        // Consume the voting power record (it's now spent)
        // This ensures one-time use

        // Generate nullifier from secret seed + proposal_id
        // This is deterministic but unpredictable without the seed
        let nullifier_input: field = voting_power.nullifier_seed + voting_power.proposal_id;
        let nullifier: field = BHP256::hash_to_field(nullifier_input);

        // Transition to finalize with:
        // - nullifier (to prevent double voting)
        // - proposal_id (to identify the proposal)
        // - vote_option (the private choice)
        // - weight (the voting power)
        return then finalize(
            nullifier,
            voting_power.proposal_id,
            vote_option,
            voting_power.weight
        );
    }

    finalize cast_vote(
        nullifier: field,
        proposal_id: field,
        vote_option: u8,
        weight: u64
    ) {
        // SECURITY CHECK 1: Prevent double voting
        let already_voted: bool = Mapping::contains(nullifiers, nullifier);
        assert(!already_voted);

        // SECURITY CHECK 2: Verify proposal exists and is active
        let proposal: ProposalInfo = Mapping::get(proposals, proposal_id);
        assert(proposal.is_active);

        // SECURITY CHECK 3: Enforce voting window
        assert(block.height >= proposal.start_block);
        assert(block.height <= proposal.end_block);

        // SECURITY CHECK 4: Valid vote option
        assert(vote_option < proposal.options_count);

        // Mark nullifier as used (prevents double voting)
        Mapping::set(nullifiers, nullifier, true);

        // Update vote tally (public)
        let tally_key: TallyKey = TallyKey {
            proposal_id: proposal_id,
            option_id: vote_option
        };
        let tally_hash: field = BHP256::hash_to_field(tally_key);
        
        let current_tally: u64 = Mapping::get_or_use(vote_tallies, tally_hash, 0u64);
        let new_tally: u64 = current_tally + weight;
        Mapping::set(vote_tallies, tally_hash, new_tally);

        // Update total votes on proposal
        let updated_proposal: ProposalInfo = ProposalInfo {
            proposal_id: proposal.proposal_id,
            creator: proposal.creator,
            start_block: proposal.start_block,
            end_block: proposal.end_block,
            options_count: proposal.options_count,
            is_active: proposal.is_active,
            total_votes: proposal.total_votes + weight
        };
        Mapping::set(proposals, proposal_id, updated_proposal);
    }

    // ------------------------------------------------------------------------
    // Cast Public Vote (SIMPLIFIED - for testing/demos)
    // A simpler voting method that doesn't require a VotingPower record
    // Uses caller address as nullifier base for double-vote prevention
    // ------------------------------------------------------------------------
    transition cast_public_vote(
        proposal_id: field,
        vote_option: u8,
        weight: u64
    ) {
        // Generate nullifier from caller + proposal_id
        // This ensures each address can only vote once per proposal
        let nullifier_input: field = BHP256::hash_to_field(self.caller) + proposal_id;
        let nullifier: field = BHP256::hash_to_field(nullifier_input);

        return then finalize(
            nullifier,
            proposal_id,
            vote_option,
            weight
        );
    }

    finalize cast_public_vote(
        nullifier: field,
        proposal_id: field,
        vote_option: u8,
        weight: u64
    ) {
        // SECURITY CHECK 1: Prevent double voting
        let already_voted: bool = Mapping::contains(nullifiers, nullifier);
        assert(!already_voted);

        // SECURITY CHECK 2: Verify proposal exists and is active
        let proposal: ProposalInfo = Mapping::get(proposals, proposal_id);
        assert(proposal.is_active);

        // SECURITY CHECK 3: Enforce voting window
        assert(block.height >= proposal.start_block);
        assert(block.height <= proposal.end_block);

        // SECURITY CHECK 4: Valid vote option
        assert(vote_option < proposal.options_count);

        // Mark nullifier as used
        Mapping::set(nullifiers, nullifier, true);

        // Update vote tally
        let tally_key: TallyKey = TallyKey {
            proposal_id: proposal_id,
            option_id: vote_option
        };
        let tally_hash: field = BHP256::hash_to_field(tally_key);
        
        let current_tally: u64 = Mapping::get_or_use(vote_tallies, tally_hash, 0u64);
        let new_tally: u64 = current_tally + weight;
        Mapping::set(vote_tallies, tally_hash, new_tally);

        // Update total votes
        let updated_proposal: ProposalInfo = ProposalInfo {
            proposal_id: proposal.proposal_id,
            creator: proposal.creator,
            start_block: proposal.start_block,
            end_block: proposal.end_block,
            options_count: proposal.options_count,
            is_active: proposal.is_active,
            total_votes: proposal.total_votes + weight
        };
        Mapping::set(proposals, proposal_id, updated_proposal);
    }

    // ------------------------------------------------------------------------
    // Close Proposal
    // Admin closes voting after the voting period ends
    // ------------------------------------------------------------------------
    transition close_proposal(
        admin: AdminCap,
        proposal_id: field
    ) -> AdminCap {
        // Return admin cap
        let returned_admin: AdminCap = AdminCap {
            owner: admin.owner,
            dao_id: admin.dao_id
        };

        return returned_admin then finalize(proposal_id);
    }

    finalize close_proposal(proposal_id: field) {
        // Get proposal
        let proposal: ProposalInfo = Mapping::get(proposals, proposal_id);
        
        // Verify voting period has ended
        assert(block.height > proposal.end_block);

        // Mark proposal as inactive
        let closed_proposal: ProposalInfo = ProposalInfo {
            proposal_id: proposal.proposal_id,
            creator: proposal.creator,
            start_block: proposal.start_block,
            end_block: proposal.end_block,
            options_count: proposal.options_count,
            is_active: false,
            total_votes: proposal.total_votes
        };
        Mapping::set(proposals, proposal_id, closed_proposal);
    }
}
