# zVote: Privacy-Preserving Voting Protocol

zVote is a secure, decentralized voting application built on the **Aleo** blockchain. It leverages Zero-Knowledge Proofs (ZKPs) to ensure voter privacy while maintaining transparent and verifiable results.

## 📂 Project Structure

- **`frontend/`**: The web application for voters and administrators.
  - Built with React/Vite.
  - Handles wallet connection (Leo Wallet).
  - Manages ZK proof generation and transaction submission.
  
- **`protocol/`**: The core Aleo smart contracts (`.aleo`/`.leo`).
  - Defines the voting logic, credential minting, and tallies.
  - Deployment scripts included in `protocol/scripts/`.

- **`docs/`**: Documentation for builders and architecture.

## 🚀 Quick Start

### Frontend (User Interface)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:5173`.

### Protocol (Smart Contracts)

1.  Navigate to the protocol directory:
    ```bash
    cd protocol
    ```
2.  Use Leo CLI to build and test:
    ```bash
    leo build
    leo run
    ```
3.  Deploy using the provided scripts in `scripts/`.

## 🛠 Prerequisites

- **Node.js** v18+
- **Leo Wallet** Browser Extension
- **Aleo SDK** (included in frontend)

## 🔐 Key Features

- **Private Voting**: Votes are encrypted and only decrypted during tallying.
- **Sybil Resistance**: Voting power is minted via verified credentials.
- **On-Chain Verification**: Results are verifiable on the Aleo network.

## 📄 License
MIT
