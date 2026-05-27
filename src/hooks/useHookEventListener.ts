'use client';

import { useEffect, useRef } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import type { Address } from 'viem';

export interface MomentumChangeEvent {
  team: Address;
  oldMomentum: bigint;
  newMomentum: bigint;
  timestamp: bigint;
}

export interface SupporterPointsEvent {
  supporter: Address;
  team: Address;
  points: bigint;
  timestamp: bigint;
}

/**
 * Hook: useHookEventListener
 * Listens to real-time events from the FanXPulseHook contract
 * Automatically updates UI when events occur
 */
export function useHookEventListener(
  hookAddress: Address | undefined,
  onMomentumChange?: (event: MomentumChangeEvent) => void,
  onSupporterPoints?: (event: SupporterPointsEvent) => void
) {
  const eventCallbacksRef = useRef({ onMomentumChange, onSupporterPoints });

  // Update refs without causing re-renders
  useEffect(() => {
    eventCallbacksRef.current = { onMomentumChange, onSupporterPoints };
  }, [onMomentumChange, onSupporterPoints]);

  // Listen to MomentumChanged events
  useWatchContractEvent({
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
        const { team, oldMomentum, newMomentum, timestamp } = log.args;
        if (team && typeof newMomentum !== 'undefined' && eventCallbacksRef.current.onMomentumChange) {
          eventCallbacksRef.current.onMomentumChange({
            team,
            oldMomentum: oldMomentum || 0n,
            newMomentum,
            timestamp: timestamp || 0n,
          });
        }
      });
    }
  });

  // Listen to SupporterPointsAwarded events
  useWatchContractEvent({
    address: hookAddress,
    abi: [
      {
        type: 'event',
        name: 'SupporterPointsAwarded',
        inputs: [
          { name: 'supporter', type: 'address', indexed: true },
          { name: 'team', type: 'address', indexed: true },
          { name: 'points', type: 'uint256', indexed: false },
          { name: 'timestamp', type: 'uint256', indexed: false }
        ]
      }
    ],
    eventName: 'SupporterPointsAwarded',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { supporter, team, points, timestamp } = log.args;
        if (supporter && team && typeof points !== 'undefined' && eventCallbacksRef.current.onSupporterPoints) {
          eventCallbacksRef.current.onSupporterPoints({
            supporter,
            team,
            points,
            timestamp: timestamp || 0n,
          });
        }
      });
    }
  });
}

/**
 * Hook: useMomentumUpdater
 * Manages real-time momentum updates in component state
 * Call with your team stats state setter
 */
export function useMomentumUpdater(
  hookAddress: Address | undefined,
  onUpdate?: (teamAddress: Address, newMomentum: number) => void
) {
  useHookEventListener(
    hookAddress,
    (event) => {
      const momentumPercent = Number(event.newMomentum);
      
      // Log the update
      console.log(`📊 Momentum updated: Team ${event.team} → ${momentumPercent}%`);
      
      // Call the update callback
      if (onUpdate) {
        onUpdate(event.team, momentumPercent);
      }
    },
    (event) => {
      const pointsAwarded = Number(event.points);
      console.log(`🎯 Points awarded: Supporter ${event.supporter} gained ${pointsAwarded} points for ${event.team}`);
    }
  );
}

/**
 * Hook: useEventNotification
 * Shows toast-like notifications when events occur
 * Use with your notification system
 */
export function useEventNotification(
  hookAddress: Address | undefined,
  showNotification?: (message: string, type: 'success' | 'info' | 'warning') => void
) {
  useHookEventListener(
    hookAddress,
    (event) => {
      const diff = Number(event.newMomentum) - Number(event.oldMomentum);
      const direction = diff > 0 ? '📈' : '📉';
      const message = `${direction} Momentum ${diff > 0 ? 'increased' : 'decreased'} by ${Math.abs(diff)}%`;
      
      if (showNotification) {
        showNotification(message, 'info');
      }
    },
    (event) => {
      const message = `🎯 +${Number(event.points)} Points Awarded!`;
      if (showNotification) {
        showNotification(message, 'success');
      }
    }
  );
}
