'use client';

import { useState } from 'react';

// Types
export interface LeaderboardTeamFromIndexer {
  teamCode: string;
  address: string;
  currentMomentum: number;
  totalSwaps: string;
  totalVolume24h: string;
  totalSupporters: number;
  priceChange24h: number;
}

// Hooks - minimal stubs
export function useIndexerLeaderboard() {
  const [teams] = useState<LeaderboardTeamFromIndexer[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  return { teams, isLoading, error };
}

export function useIndexerSupporterRankings() {
  return { supporters: [], isLoading: false, error: null };
}

export function useIndexerMomentumHistory() {
  return { changes: [], isLoading: false, error: null };
}
