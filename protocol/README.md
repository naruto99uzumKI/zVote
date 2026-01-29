# zVote Protocol - Leo Smart Contract

Private, bribe-resistant DAO governance built on Aleo.

## Build

```bash
leo build
```

## Test

```bash
# Initialize admin
leo run init_admin 1field

# Create proposal
leo run create_proposal "{owner: aleo1..., dao_id: 1field}" 1field 100u32 200u32 3u8

# Issue voting power
leo run issue_voting_power "{owner: aleo1..., dao_id: 1field}" aleo1voter... 1field 100u64 12345field

# Cast vote
leo run cast_vote "{owner: aleo1voter..., proposal_id: 1field, weight: 100u64, nullifier_seed: 12345field}" 1u8
```

## Deploy

```bash
leo deploy --network testnet
```
