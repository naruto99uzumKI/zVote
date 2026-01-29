# zVote Architecture

Technical overview of the zVote private governance protocol.

## System Overview

```
┌──────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│   React Frontend │────▶│   Aleo Network    │◀────│   Leo Contract  │
│   (Wallet + UI)  │     │   (Testnet/Main)  │     │   zvote_protocol│
└──────────────────┘     └───────────────────┘     └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
   ┌──────────┐           ┌──────────────┐          ┌────────────┐
   │ Local ZK │           │ Public State │          │  Records   │
   │  Prover  │           │  (Mappings)  │          │ (Private)  │
   └──────────┘           └──────────────┘          └────────────┘
```

## Core Components

### 1. Leo Smart Contract

**Location**: `contracts/zvote_protocol/src/main.leo`

#### Data Structures

| Type | Name | Visibility | Purpose |
|------|------|------------|---------|
| Record | `VotingPower` | Private | Voting eligibility token |
| Record | `AdminCap` | Private | Admin authorization |
| Mapping | `proposals` | Public | Proposal metadata |
| Mapping | `vote_tallies` | Public | Aggregated vote counts |
| Mapping | `nullifiers` | Public | Double-vote prevention |

#### Key Transitions

| Function | Access | Description |
|----------|--------|-------------|
| `init_admin` | Anyone | Create admin capability record |
| `create_proposal` | Admin | Create new governance proposal |
| `issue_voting_power` | Admin | Distribute voting tokens to eligible voters |
| `cast_vote` | Voter | Submit private vote (consumes voting power) |
| `close_proposal` | Admin | Close voting after period ends |

### 2. Privacy Mechanism

#### How Votes Stay Private

1. **Vote Choice** - Never stored individually on-chain
2. **Nullifier System** - Derived from secret seed, prevents double voting
3. **Finalize Blocks** - Only aggregate tallies updated publicly
4. **No Receipts** - Voter cannot prove their vote, even to themselves

#### Nullifier Generation

```
nullifier = BHP256::hash_to_field(nullifier_seed + proposal_id)
```

- `nullifier_seed`: Random secret embedded in VotingPower record
- Result: Deterministic but unpredictable identifier
- **Property**: Same voter + same proposal = same nullifier

### 3. Frontend Architecture

```
frontend/
├── lib/
│   ├── aleo.ts       # Aleo SDK wrapper
│   └── hooks.ts      # React state hooks
├── components/
│   ├── WalletConnect.tsx   # Wallet connection
│   ├── VotingCard.tsx      # Vote interface
│   └── CreateProposal.tsx  # Proposal creation
└── App.tsx           # Main application
```

## Security Model

### Threat Analysis

| Threat | Mitigation |
|--------|------------|
| Double Voting | Nullifier set prevents reuse |
| Vote Manipulation | ZK proofs verify eligibility |
| Bribery | No vote receipts possible |
| Front-running | Block-based timing constraints |
| Admin Abuse | Admin actions are public and auditable |

### Trust Assumptions

1. **Aleo Network** - Correctly validates ZK proofs
2. **Voter Device** - Honest local proof generation
3. **Admin** - Correct voting power distribution (auditable)

## Deployment

### Testnet

```bash
cd contracts/zvote_protocol
leo deploy --network testnet
```

### Program ID

After deployment, the program will be available at:
```
zvote_protocol.aleo
```

## Data Flow

### Creating a Proposal

```
Admin calls create_proposal()
    ↓
Transition validates inputs
    ↓
Finalize block:
  - Checks proposal doesn't exist
  - Stores ProposalInfo in mapping
  - Initializes vote tallies to 0
```

### Casting a Vote

```
Voter calls cast_vote(VotingPower, option)
    ↓
VotingPower record consumed (one-time use)
    ↓
Nullifier generated locally
    ↓
ZK proof created on voter device
    ↓
Finalize block (public):
  - Verify nullifier not used
  - Verify proposal active
  - Verify voting window
  - Store nullifier
  - Increment tally (only aggregate visible)
```
