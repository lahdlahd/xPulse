/**
 * Teams Page
 * Detailed view of all teams and their statistics
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { TEAMS, ALL_TEAMS } from '@/constants';

interface TeamStats {
  momentum: number;
  supporters: number;
  volume: number;
}

export default function TeamsPage() {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);
  const [teamStats, setTeamStats] = useState<Record<string, TeamStats>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch real team stats from GraphQL every 15 seconds
  useEffect(() => {
    if (!isConnected) return;

    const fetchTeamStats = async () => {
      try {
        const graphqlUrl = process.env.NEXT_PUBLIC_REAL_INDEXER_URL || 'http://localhost:4000/graphql';
        
        const query = `
          query {
            teams {
              code
              momentum
              supporters
              volume24h
            }
          }
        `;

        const response = await fetch(graphqlUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        
        if (data.data?.teams) {
          const stats: Record<string, TeamStats> = {};
          data.data.teams.forEach((team: any) => {
            stats[team.code] = {
              momentum: team.momentum || 0,
              supporters: team.supporters || 0,
              volume: team.volume24h || 0,
            };
          });
          setTeamStats(stats);
        }
      } catch (error) {
        console.error('Failed to fetch team stats:', error);
      }
    };

    fetchTeamStats();
    const interval = setInterval(fetchTeamStats, 15000);
    return () => clearInterval(interval);
  }, [isConnected]);

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
