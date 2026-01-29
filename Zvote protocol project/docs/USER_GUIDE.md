# zVote User Guide

How to participate in private governance with zVote.

## What is zVote?

zVote is a voting system for DAOs that keeps your vote **completely private**. Unlike traditional blockchain voting where everyone can see how you voted, zVote uses zero-knowledge proofs to hide your vote while still proving it was counted correctly.

## Key Privacy Guarantees

| Feature | What It Means |
|---------|---------------|
| **Private Vote** | No one can see how you voted |
| **No Receipts** | You cannot prove how you voted (even if you want to) |
| **Verified Counting** | Your vote is mathematically guaranteed to be counted |
| **One Vote** | You can only vote once per proposal |

## How to Vote

### Step 1: Connect Your Wallet

1. Visit the zVote dApp
2. Click **Connect Wallet** in the top right
3. Approve the connection in your Aleo wallet (Leo Wallet or Puzzle Wallet)
4. Your address will appear when connected

### Step 2: View Active Proposals

- Browse the list of active proposals
- Each proposal shows:
  - Title and description
  - Voting options
  - Current vote tally (aggregated, not individual)
  - Time remaining

### Step 3: Cast Your Vote

1. Select your preferred option
2. Click **Cast Private Vote**
3. Your wallet will generate a zero-knowledge proof (this takes ~5-10 seconds)
4. Approve the transaction in your wallet
5. Wait for confirmation

### Step 4: Confirmation

After voting, you will see:
- ✅ "Vote Submitted!" confirmation
- Transaction hash
- **Important**: No receipt of how you voted is provided

## What You CANNOT Do

| Action | Reason |
|--------|--------|
| Vote twice | Nullifier system prevents this |
| Prove your vote | No receipt is generated |
| Change your vote | Once submitted, votes are final |
| Vote outside voting window | Timing is enforced on-chain |

## Frequently Asked Questions

### Why can't I prove how I voted?

This is a feature, not a bug! If you could prove your vote:
- Someone could pay you to vote a certain way
- Someone could threaten you if you don't prove compliance
- Governance becomes a marketplace

By making vote proofs impossible, zVote makes bribery pointless.

### Is my vote actually counted?

Yes! While your individual vote is hidden, the zero-knowledge proof guarantees:
1. You were eligible to vote
2. Your vote was for a valid option
3. The tally was correctly incremented

### What if I lose my wallet?

Your vote is already recorded on-chain. The VotingPower record is consumed when you vote, so there's nothing to recover. 

### Can admins see how I voted?

No. Not even the DAO administrators can see individual votes. They can only see:
- Who has received voting power (public)
- Aggregate tallies (public)
- That a vote was cast (not the choice)

## Troubleshooting

### "Proof generation is slow"

ZK proof generation happens on your device and requires computational power. For best results:
- Use a desktop/laptop (not mobile)
- Wait for the full process to complete
- Don't close the tab during proof generation

### "Transaction failed"

Common causes:
1. **Already voted** - Check if you've already voted on this proposal
2. **Voting ended** - The voting window may have closed
3. **No voting power** - Ensure you received a VotingPower record from the admin

### "Wallet not connecting"

1. Ensure you have Leo Wallet or Puzzle Wallet installed
2. Refresh the page
3. Try disconnecting and reconnecting
