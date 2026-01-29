# zVote Developer Guide

Technical guide for developers building with or deploying zVote.

## Prerequisites

- **Node.js** 18 or higher
- **Leo CLI** ([Installation Guide](https://developer.aleo.org/leo/installation))
- **Aleo Wallet** (Leo Wallet or Puzzle Wallet for testing)

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Contracts

```bash
cd contracts/zvote_protocol

# Build the program
leo build

# Run locally (example: create admin)
leo run init_admin 1field
```

## Contract API Reference

### `init_admin`

Create an admin capability record.

```leo
transition init_admin(dao_id: field) -> AdminCap
```

**Example:**
```bash
leo run init_admin 1field
```

### `create_proposal`

Create a new governance proposal.

```leo
transition create_proposal(
    admin: AdminCap,
    proposal_id: field,
    start_block: u32,
    end_block: u32,
    options_count: u8
) -> AdminCap
```

**Parameters:**
- `admin`: Admin capability record
- `proposal_id`: Unique identifier for the proposal
- `start_block`: Block height when voting starts
- `end_block`: Block height when voting ends
- `options_count`: Number of voting options (2-10)

### `issue_voting_power`

Distribute voting power to eligible voters.

```leo
transition issue_voting_power(
    admin: AdminCap,
    voter: address,
    proposal_id: field,
    weight: u64,
    nullifier_seed: field
) -> (AdminCap, VotingPower)
```

**Parameters:**
- `admin`: Admin capability record
- `voter`: Address receiving voting power
- `proposal_id`: Proposal this voting power is for
- `weight`: Voting weight (e.g., token balance)
- `nullifier_seed`: Random secret for nullifier generation

**Important:** The `nullifier_seed` should be randomly generated and unique per voter per proposal.

### `cast_vote`

Submit a private vote.

```leo
transition cast_vote(
    voting_power: VotingPower,
    vote_option: u8
)
```

**Parameters:**
- `voting_power`: VotingPower record (consumed after use)
- `vote_option`: Index of chosen option (0-indexed)

### `close_proposal`

Close voting after the voting period ends.

```leo
transition close_proposal(
    admin: AdminCap,
    proposal_id: field
) -> AdminCap
```

## Deployment

### Testnet

1. Create a `.env` file:
```bash
NETWORK=testnet
PRIVATE_KEY=<your-private-key>
```

2. Deploy:
```bash
leo deploy --network testnet
```

3. Note the deployed program ID (should be `zvote_protocol.aleo`)

### Mainnet

For mainnet deployment, ensure:
- Full security audit completed
- Admin keys properly secured
- Rate limiting and monitoring in place

## Frontend Integration

### Wallet Connection

```typescript
import { aleoWallet } from './lib/aleo';

// Connect
const address = await aleoWallet.connect();

// Check status
const isConnected = aleoWallet.isConnected();

// Disconnect
await aleoWallet.disconnect();
```

### Reading On-Chain State

```typescript
import { getZVoteClient } from './lib/aleo';

const client = getZVoteClient();

// Get proposal
const proposal = await client.getProposal('1field');

// Get tallies
const tallies = await client.getAllTallies('1field', 3);

// Get current block
const block = await client.getCurrentBlock();
```

### Submitting Votes

Votes are submitted through the wallet's transaction approval flow:

```typescript
import { buildCastVoteTransaction } from './lib/aleo';

const tx = await buildCastVoteTransaction(votingPower, optionId);
// Submit through wallet
```

## Testing

### Unit Tests (Leo)

```bash
cd contracts/zvote_protocol
leo test
```

### Integration Tests

1. Deploy to testnet
2. Create a proposal
3. Issue voting power to test accounts
4. Cast votes
5. Verify tallies match expected values
6. Verify double-voting is prevented

### Security Checklist

- [ ] Nullifiers are correctly preventing double votes
- [ ] Voting window constraints are enforced
- [ ] Admin operations require valid AdminCap
- [ ] Vote options are validated against options_count
- [ ] No private data leaks in public mappings

## Troubleshooting

### "Program already exists"

The program name is already deployed. Either:
- Use a different network
- Modify the program name (not recommended)
- Use the existing deployment

### "Insufficient balance"

Deploying on Aleo requires credits for transaction fees. Ensure your account has testnet credits.

### "Proof verification failed"

Check that:
- All record fields match expected types
- Transition inputs are correctly formatted
- The program is correctly compiled
