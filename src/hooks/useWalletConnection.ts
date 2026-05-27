/**
 * useWalletConnection Hook
 * Manages wallet connection state and network validation
 */

'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { xLayerMainnet, xLayerTestnet } from '@/lib/chains';
import type { FanXPulseError } from '@/types';

interface UseWalletConnectionReturn {
  isConnected: boolean;
  address: `0x${string}` | undefined;
  isCorrectChain: boolean;
  currentChain: number | undefined;
  switchToXLayer: () => Promise<void>;
  error: FanXPulseError | null;
}

export function useWalletConnection(): UseWalletConnectionReturn {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<FanXPulseError | null>(null);

  // Determine if the current chain is correct
  const isCorrectChain = chainId === xLayerMainnet.id || chainId === xLayerTestnet.id;

  // Function to switch to X Layer
  const switchToXLayer = async () => {
    try {
      if (switchChain) {
        // Prefer testnet for development
        const targetChain = process.env.NODE_ENV === 'production' ? xLayerMainnet.id : xLayerTestnet.id;
        await switchChain({ chainId: targetChain });
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch chain';
      setError({
        name: 'FanXPulseError',
        code: 'UNSUPPORTED_CHAIN',
        message: errorMessage,
      } as unknown as FanXPulseError);
    }
  };

  // Auto-switch to correct chain when wallet connects
  useEffect(() => {
    if (isConnected && !isCorrectChain) {
      switchToXLayer();
    }
  }, [isConnected, isCorrectChain]);

  return {
    isConnected,
    address,
    isCorrectChain,
    currentChain: chainId,
    switchToXLayer,
    error,
  };
}
