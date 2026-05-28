import { useEffect, useState, useCallback } from 'react';
import { createPublicClient, http } from 'viem';

// Minimal ABI for the view functions we need
const SWAP_RECORDER_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "team", "type": "address" }],
    "name": "getMomentum",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "team", "type": "address" }],
    "name": "getVolume24h",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "team", "type": "address" }],
    "name": "getSupporters",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const RPC = process.env.NEXT_PUBLIC_X_LAYER_RPC_TESTNET || 'https://testrpc.xlayer.tech';
const SWAP_ADDR = (process.env.NEXT_PUBLIC_SWAP_RECORDER_ADDRESS || '') as `0x${string}`;

const client = createPublicClient({
  chain: { id: 1952, name: 'X Layer Testnet', rpcUrls: { default: { http: [RPC] } } },
  transport: http(RPC),
});

export type TeamOnchainStats = { momentum: number; supporters: number; volume24h: number };

export function useSwapRecorder(teamAddresses: Record<string, `0x${string}`>, pollInterval = 15000) {
  const [stats, setStats] = useState<Record<string, TeamOnchainStats>>({});
  const [loading, setLoading] = useState(false);

  const fetchForTeam = useCallback(async (teamAddr: `0x${string}`) => {
    try {
      const [m, v, s] = await Promise.all([
        client.readContract({ address: SWAP_ADDR, abi: SWAP_RECORDER_ABI as any, functionName: 'getMomentum', args: [teamAddr] }),
        client.readContract({ address: SWAP_ADDR, abi: SWAP_RECORDER_ABI as any, functionName: 'getVolume24h', args: [teamAddr] }),
        client.readContract({ address: SWAP_ADDR, abi: SWAP_RECORDER_ABI as any, functionName: 'getSupporters', args: [teamAddr] }),
      ]);
      return { momentum: Number(m || 0), volume24h: Number(v || 0), supporters: Number(s || 0) };
    } catch (err) {
      // Silent failure — return zeros
      return { momentum: 0, volume24h: 0, supporters: 0 };
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const entries = Object.entries(teamAddresses);
    const pairs = await Promise.all(entries.map(async ([code, addr]) => {
      const data = await fetchForTeam(addr as `0x${string}`);
      return [code, data] as const;
    }));
    const next: Record<string, TeamOnchainStats> = {};
    pairs.forEach(([code, d]) => { next[code] = d; });
    setStats(next);
    setLoading(false);
  }, [teamAddresses, fetchForTeam]);

  useEffect(() => {
    let mounted = true;
    if (!SWAP_ADDR) return;
    (async () => {
      if (!mounted) return;
      await refresh();
    })();
    const id = setInterval(() => { if (mounted) refresh(); }, pollInterval);

    // Listen for global swap events to refresh immediately
    const handler = (e: any) => {
      try { refresh(); } catch (err) { /* ignore */ }
    };
    if (typeof window !== 'undefined') window.addEventListener('fanxpulse:swap', handler);
    return () => { mounted = false; clearInterval(id); };
  }, [refresh, pollInterval]);

  return { stats, loading, refresh };
}

export default useSwapRecorder;
