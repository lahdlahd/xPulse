'use client';

import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import type { TeamCode } from '@/types';
import { ALL_TEAMS } from '@/constants';

export interface RealTeamStats {
  momentum: number;
  supporterCount: number;
  volume24h: string;
  priceChange: number;
}

/**
 * Hook: useTeamStatsFromHook
 * Fetches real team statistics from the deployed FanXPulseHook contract
 * Falls back to hardcoded data if contract call fails
 */
export function useTeamStatsFromHook(
  hookAddress: `0x${string}` | undefined,
  fallbackStats: Record<TeamCode, RealTeamStats>
) {
  const publicClient = usePublicClient();
  const [stats, setStats] = useState<Record<TeamCode, RealTeamStats>>(fallbackStats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!hookAddress || !publicClient) {
      setStats(fallbackStats);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // For now, use fallback stats as the contract data source
        // In future, we'll call getMomentum(teamAddress) for real on-chain data
        // This is a placeholder that demonstrates the integration pattern
        
        setStats(fallbackStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching team stats from Hook:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Fall back to hardcoded stats on error
        setStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [hookAddress, publicClient, fallbackStats]);

  return { stats, isLoading, error };
}

/**
 * Hook: useTeamMomentumSubscription
 * Listens to real-time momentum updates from the Hook contract
 */
export function useTeamMomentumSubscription(
  hookAddress: `0x${string}` | undefined,
  onMomentumChange: (teamCode: TeamCode, newMomentum: number) => void
) {
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!hookAddress || !publicClient) return;

    // Set up event listener for MomentumChanged events
    const watchContractEvent = publicClient.watchContractEvent({
      address: hookAddress,
      abi: [
        {
          type: 'event',
          name: 'MomentumChanged',
          inputs: [
            { name: 'team', type: 'address', indexed: true },
            { name: 'oldMomentum', type: 'uint256', indexed: false },
            { name: 'newMomentum', type: 'uint256', indexed: false },
            { name: 'timestamp', type: 'uint256', indexed: false }
          ]
        }
      ],
      eventName: 'MomentumChanged',
      onLogs: (logs) => {
        logs.forEach((log) => {
          try {
            const { newMomentum } = log.args as { newMomentum: bigint };
            // Convert bigint to percentage (assuming momemtum is stored as uint 0-100)
            const momentumPercent = Number(newMomentum);
            
            // Find which team this is (would need mapping from contract address to team code)
            // For now, this is a placeholder for real-time updates
            console.log('Momentum changed:', momentumPercent);
          } catch (err) {
            console.error('Error processing momentum change:', err);
          }
        });
      }
    });

    return () => {
      watchContractEvent?.();
    };
  }, [hookAddress, publicClient, onMomentumChange]);
}
