// Hook Client Library for Frontend
// Usage: import hookClient and use to interact with FanXPulseHook

import { useContractRead, useContractWrite, useWatchContractEvent } from 'wagmi';
import { FAN_XPULSE_HOOK_ABI, FAN_TOKEN_ABI } from './contractABIs';
import type { Address } from 'viem';

export interface HookAddress {
  hook: Address;
  argToken: Address;
  braToken: Address;
  engToken: Address;
  fraToken: Address;
  espToken: Address;
}

/**
 * Hook: useTeamMomentum
 * Get current momentum for a team
 */
export function useTeamMomentum(hookAddress: Address, teamAddress: Address) {
  const { data, isLoading, error } = useContractRead({
    address: hookAddress,
    abi: FAN_XPULSE_HOOK_ABI,
    functionName: 'getMomentum',
    args: [teamAddress],
  });

  return {
    momentum: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook: useSupporterPoints
 * Get current supporter points for an address
 */
export function useSupporterPoints(hookAddress: Address, supporterAddress: Address) {
  const { data, isLoading, error } = useContractRead({
    address: hookAddress,
    abi: FAN_XPULSE_HOOK_ABI,
    functionName: 'getSupporterPoints',
    args: [supporterAddress],
  });

  return {
    points: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook: useLeaderboard
 * Get current leaderboard of all teams
 */
export function useLeaderboard(hookAddress: Address) {
  const { data, isLoading, error } = useContractRead({
    address: hookAddress,
    abi: FAN_XPULSE_HOOK_ABI,
    functionName: 'getLeaderboard',
  });

  const teams = (data?.[0] as Address[] | undefined) ?? [];
  const momentums = (data?.[1] as bigint[] | undefined) ?? [];

  const leaderboard = teams.map((team, index) => ({
    team,
    momentum: momentums[index] ?? 0n,
  })).sort((a, b) => Number(b.momentum - a.momentum));

  return {
    leaderboard,
    isLoading,
    error,
  };
}

/**
 * Hook: watchMomentumChanges
 * Listen to real-time momentum updates
 */
export function watchMomentumChanges(
  hookAddress: Address,
  onMomentumChange: (team: Address, newMomentum: bigint) => void
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWatchContractEvent({
    address: hookAddress,
    abi: FAN_XPULSE_HOOK_ABI,
    eventName: 'MomentumChanged',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { team, newMomentum } = log.args;
        if (team && newMomentum) {
          onMomentumChange(team, newMomentum);
        }
      });
    },
  });
}

/**
 * Hook: watchSupporterPoints
 * Listen to real-time supporter point awards
 */
export function watchSupporterPoints(
  hookAddress: Address,
  onPointsAwarded: (supporter: Address, team: Address, points: bigint) => void
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWatchContractEvent({
    address: hookAddress,
    abi: FAN_XPULSE_HOOK_ABI,
    eventName: 'SupporterPointsAwarded',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { supporter, team, points } = log.args;
        if (supporter && team && points) {
          onPointsAwarded(supporter, team, points);
        }
      });
    },
  });
}

/**
 * Hook: useTokenBalance
 * Get fan token balance
 */
export function useTokenBalance(tokenAddress: Address, accountAddress: Address) {
  const { data, isLoading, error } = useContractRead({
    address: tokenAddress,
    abi: FAN_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [accountAddress],
  });

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook: useTokenStats
 * Get token statistics (supply, swap count, volume, momentum)
 */
export function useTokenStats(tokenAddress: Address) {
  const { data, isLoading, error } = useContractRead({
    address: tokenAddress,
    abi: FAN_TOKEN_ABI,
    functionName: 'getStats',
  });

  const stats = data ? {
    totalSupply: data[0] as bigint,
    swapCount: data[1] as bigint,
    totalVolume: data[2] as bigint,
    momentum: data[3] as bigint,
  } : null;

  return {
    stats,
    isLoading,
    error,
  };
}

/**
 * Integration Example:
 * 
 * import { useTeamMomentum, useLeaderboard, watchMomentumChanges } from '@/lib/hookClient';
 * 
 * export function LeaderboardComponent() {
 *   const hookAddress = process.env.NEXT_PUBLIC_HOOK_ADDRESS as Address;
 *   const { leaderboard } = useLeaderboard(hookAddress);
 * 
 *   watchMomentumChanges(hookAddress, (team, newMomentum) => {
 *     console.log(`${team} new momentum: ${newMomentum}`);
 *     // Update UI in real-time
 *   });
 * 
 *   return (
 *     <div>
 *       {leaderboard.map(({ team, momentum }) => (
 *         <div key={team}>
 *           <span>{team}</span>
 *           <span>{momentum.toString()}</span>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
