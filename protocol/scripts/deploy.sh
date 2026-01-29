#!/bin/bash
# =============================================================================
# zVote Protocol - Deployment Script
# =============================================================================
#
# This script builds and deploys the zvote_protocol.aleo program to Aleo testnet
#
# Prerequisites:
# 1. Install Leo CLI: https://developer.aleo.org/leo/installation
# 2. Install SnarkOS: https://github.com/AleoHQ/snarkOS
# 3. Have testnet credits from https://faucet.aleo.org/
#
# =============================================================================

# Configuration
NETWORK="testnetbeta"
PRIVATE_KEY="YOUR_PRIVATE_KEY_HERE"  # Replace with your private key
FEE="10000000"  # 10 credits (adjust as needed)

# API endpoints
QUERY_URL="https://api.explorer.aleo.org/v1/${NETWORK}"
BROADCAST_URL="https://api.explorer.aleo.org/v1/${NETWORK}/transaction/broadcast"

echo "==================================="
echo "zVote Protocol Deployment"
echo "==================================="
echo ""

# Step 1: Build the Leo program
echo "Step 1: Building Leo program..."
cd contracts/zvote_protocol
leo build

if [ $? -ne 0 ]; then
    echo "ERROR: Leo build failed!"
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Step 2: Deploy to network
echo "Step 2: Deploying to ${NETWORK}..."
echo ""

snarkos developer deploy zvote_protocol.aleo \
    --private-key ${PRIVATE_KEY} \
    --query ${QUERY_URL} \
    --broadcast ${BROADCAST_URL} \
    --fee ${FEE} \
    --path ./build/

if [ $? -ne 0 ]; then
    echo "ERROR: Deployment failed!"
    exit 1
fi

echo ""
echo "==================================="
echo "✅ Deployment Successful!"
echo "==================================="
echo ""
echo "Program deployed: zvote_protocol.aleo"
echo "Network: ${NETWORK}"
echo ""
echo "You can now test voting in the frontend!"
