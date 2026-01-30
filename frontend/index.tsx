// ============================================================================
// zVote Protocol - Entry Point
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './lib/WalletContext';
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

// Render the app wrapped with the WalletProvider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);