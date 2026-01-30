import React, { useState } from 'react';

const PROGRAM_ID = 'zvote_protocol_v15.aleo';

export const WalletTest: React.FC = () => {
    const [status, setStatus] = useState<string>('Idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [walletNetwork, setWalletNetwork] = useState<string>('unknown');
    const [txId, setTxId] = useState<string>('');

    const addLog = (msg: string) => {
        console.log(`[WalletTest] ${msg}`);
        setLogs(prev => [...prev, msg]);
    };

    const runTest = async () => {
        try {
            setStatus('Running...');
            addLog('Starting strict wallet test...');

            // 1. Direct Provider Access
            // @ts-ignore
            const leo = window.leoWallet;
            if (!leo) throw new Error('Leo Wallet not found (window.leoWallet missing)');
            addLog('Leo Wallet provider found');

            // 2. Connect (1-Arg to allow dynamic network)
            addLog('Connecting with DecryptPermission...');
            const connectResult = await leo.connect('DECRYPT_UPON_REQUEST');
            addLog(`Connect result: ${connectResult ? 'Success' : 'Failed'}`);

            // 3. Request Permissions
            addLog('Requesting permissions...');
            try {
                if (typeof leo.requestPermissions === 'function') {
                    await leo.requestPermissions({ records: true });
                    addLog('Permissions requested');
                } else {
                    addLog('requestPermissions not available on provider');
                }
            } catch (e: any) {
                addLog(`Permission warning: ${e.message}`);
            }

            // 4. Detect Network
            const net = leo.network;
            addLog(`Wallet Network Detected: ${net}`);
            setWalletNetwork(net);

            if (!net) throw new Error('Network is undefined after connection');

            // 5. Fixed Payload
            const payload = {
                program: PROGRAM_ID,
                functionName: 'mint_voting_power',
                inputs: ['1field', '1u64'], // Fixed valid inputs
                fee: 1_000_000,
                network: net // Strict dynamic network
            };

            addLog(`Requesting Execution on ${net}...`);
            addLog(`Payload: ${JSON.stringify(payload, null, 2)}`);

            // 6. Execute via Provider Only
            const result = await leo.requestExecution(payload);
            addLog(`Transaction ID: ${result}`);
            setTxId(result);
            setStatus('Success');

        } catch (e: any) {
            addLog(`ERROR: ${e.message}`);
            console.error(e);
            setStatus('Failed');
        }
    };

    return (
        <div className="p-10 bg-slate-900 min-h-screen text-white font-mono">
            <h1 className="text-2xl font-bold mb-5 text-indigo-400">Minimal Wallet Execution Test</h1>

            <div className="mb-5 p-4 border border-slate-700 rounded bg-slate-800">
                <p>Status: <span className={status === 'Success' ? 'text-green-400' : status === 'Failed' ? 'text-red-400' : 'text-yellow-400'}>{status}</span></p>
                <p>Network: <span className="text-blue-400">{walletNetwork}</span></p>
                {txId && <p className="text-green-400 mt-2">TX ID: {txId}</p>}
            </div>

            <button
                onClick={runTest}
                disabled={status === 'Running'}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-bold mb-8 disabled:opacity-50"
            >
                {status === 'Running' ? 'Running...' : 'Run Standard Execution Test'}
            </button>

            <div className="bg-black p-4 rounded border border-slate-800 h-96 overflow-auto">
                <h3 className="text-slate-500 text-sm mb-2 border-b border-slate-800 pb-2">DEBUG LOGS</h3>
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 text-sm border-b border-slate-900 pb-1 font-mono">
                        <span className="text-slate-600 mr-2">{i + 1}.</span>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};
