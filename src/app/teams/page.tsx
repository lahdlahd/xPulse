/**
 * Teams Page
 * Detailed view of all teams and their statistics
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { TEAMS, ALL_TEAMS } from '@/constants';
import useSwapRecorder from '@/hooks/useSwapRecorder';

interface TeamStats {
  momentum: number;
  supporters: number;
  volume: number;
}

export default function TeamsPage() {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);
  const [teamStats, setTeamStats] = useState<Record<string, TeamStats>>({});

  // Build a map of teamCode => token address for on-chain reads
  const tokenMap: Record<string, `0x${string}`> = {};
  ALL_TEAMS.forEach((code) => {
    // getTeamTokenAddress is not imported here; read from env vars convention
    const envKey = `NEXT_PUBLIC_${code}_TOKEN_ADDRESS`;
    // @ts-ignore - access process.env dynamically
    const addr = (process.env[envKey] || '0x') as `0x${string}`;
    tokenMap[code] = addr;
  });

  const { stats: onchainStats, loading: onchainLoading, refresh } = useSwapRecorder(tokenMap, 15000);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch on-chain stats via useSwapRecorder
  useEffect(() => {
    if (!isConnected) return;
    // Map onchainStats shape to local TeamStats type
    const mapped: Record<string, TeamStats> = {};
    Object.entries(onchainStats || {}).forEach(([code, s]) => {
      mapped[code] = { momentum: s.momentum, supporters: s.supporters, volume: s.volume24h };
    });
    setTeamStats(mapped);
  }, [isConnected, onchainStats]);

  if (!isMounted) {
    return <div className="text-slate-400">Loading teams...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Teams</h1>
        <p className="text-slate-400">
          Explore all World Cup teams, their momentum, and supporter statistics.
        </p>
      </div>

      {!isConnected ? (
        <div className="card bg-blue-900/30 border-accent-blue text-center py-12">
          <p className="text-slate-300 mb-4">Connect your wallet to start trading fan tokens.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_TEAMS.map((teamCode) => {
            const team = TEAMS[teamCode];
            const stats = teamStats[teamCode];
            if (!team) return null;

            const momentum = stats?.momentum ?? 0;
            const supporters = stats?.supporters ?? 0;
            const volume = stats?.volume ?? 0;

            return (
              <div
                key={teamCode}
                className="card hover:border-accent-blue/50 transition-all hover:shadow-lg hover:shadow-accent-blue/20 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{team.flagEmoji}</div>
                    <h3 className="text-lg font-bold text-slate-100">{team.name}</h3>
                    <p className="text-sm text-slate-400">Code: {teamCode}</p>
                  </div>

                  <div className="space-y-2 text-sm border-t border-slate-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Momentum</span>
                      <span className={`font-semibold ${momentum > 0 ? 'text-accent-emerald' : 'text-slate-300'}`}>
                        {momentum > 0 ? '+' : ''}{momentum.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supporters</span>
                      <span className="text-accent-emerald font-semibold">
                        {supporters > 0 ? (supporters / 1000).toFixed(1) + 'K' : '0'}
                      </span>
                    </div>
                    {volume > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">24h Volume</span>
                        <span className="text-slate-300 font-semibold">
                          {(volume / 1000).toFixed(1)}K OKB
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/trade?team=${teamCode}`}
                    className="w-full block text-center py-2 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/40 text-accent-blue font-semibold transition-colors group-hover:bg-accent-blue/50"
                  >
                    Trade {teamCode}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
