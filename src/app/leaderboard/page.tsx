/**
 * Leaderboard Page
 * Supporter rankings and team momentum leaderboard
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import Leaderboard from '@/components/features/Leaderboard';
import type { TeamCode } from '@/types';

interface TeamStats {
  momentum: number;
  supporterCount: number;
  volume24h: string;
  priceChange: number;
}

function LeaderboardContent() {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);
  const [teamStats, setTeamStats] = useState<Record<TeamCode, TeamStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch real data from GraphQL
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const query = `
          query {
            teams {
              id
              address
              currentMomentum
              totalSupporters
              totalVolume24h
              totalSwaps
            }
          }
        `;

        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();

        if (data.data?.teams) {
          const stats: Record<TeamCode, TeamStats> = {};
          
          data.data.teams.forEach((team: any) => {
            const teamCode = team.id as TeamCode;
            stats[teamCode] = {
              momentum: Math.min(team.currentMomentum || 0, 100),
              supporterCount: team.totalSupporters || 0,
              volume24h: `${(team.totalVolume24h / 1e18).toFixed(2)}K OKB`, // Convert from Wei
              priceChange: (Math.random() * 30 - 10), // Placeholder until we calculate real changes
            };
          });

          setTeamStats(stats);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsMounted(true);
    fetchLeaderboardData();

    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchLeaderboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return <div className="text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {!isConnected ? (
        <div className="card bg-blue-900/30 border-accent-blue text-center py-12">
          <p className="text-slate-300 mb-4">Connect your wallet to view the leaderboard.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Momentum Leaderboard</h1>
              <p className="text-slate-400">
                Real-time team rankings based on trading activity.
              </p>
            </div>
            {lastUpdate && (
              <div className="text-right">
                <p className="text-xs text-slate-400">Last updated</p>
                <p className="text-sm text-accent-blue font-semibold">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          <Leaderboard teamStats={teamStats} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading leaderboard...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
