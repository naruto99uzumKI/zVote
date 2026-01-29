# zVote Protocol

> **Private, Bribe-Resistant DAO Governance on Aleo**

zVote is a production-ready governance protocol that makes DAO voting truly private using zero-knowledge proofs. Built on Aleo, it ensures that voters cannot prove how they voted — making bribery mathematically impossible.

## 🔐 Core Features

- **Private Voting** - Votes are encrypted and never revealed on-chain
- **Bribe-Resistant** - No vote receipts possible (even to the voter)
- **Verifiable Results** - Publicly verifiable aggregate tallies
- **Double-Vote Prevention** - Cryptographic nullifiers ensure one vote per user

## 🏗️ Project Structure

```
Zvote protocol project/
├── contracts/
│   └── zvote_protocol/
│       └── src/main.leo     # Core Leo smart contract
├── frontend/
│   ├── components/          # React UI components
│   ├── lib/                 # Aleo SDK integration
│   └── App.tsx              # Main application
└── docs/
    ├── ARCHITECTURE.md      # Technical architecture
    ├── USER_GUIDE.md        # User documentation
    └── DEVELOPER.md         # Developer guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Leo CLI (for contract development)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Contracts

```bash
cd contracts/zvote_protocol
leo build
leo deploy --network testnet
```

## 📖 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER.md)

## 🔗 Live Demo

- **Frontend**: [Coming Soon - Vercel Deployment]
- **Program ID**: `zvote_protocol.aleo`
- **Network**: Aleo Testnet

## ⚖️ License

MIT License - See [LICENSE](LICENSE)
