/**
 * Momentum Page
 * Real-time momentum tracking and visualization
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { TEAMS } from '@/constants';
import { motion } from 'framer-motion';
import { MomentumChart } from '@/components/features/MomentumChart';
import type { TeamCode } from '@/types';

interface MomentumChange {
  teamCode: TeamCode;
  oldMomentum: number;
  newMomentum: number;
  change: number;
  timestamp: string;
}

function MomentumContent() {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);
  const [momentumHistory, setMomentumHistory] = useState<MomentumChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamCode | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch momentum changes from GraphQL
  useEffect(() => {
    const fetchMomentumData = async () => {
      try {
        const query = `
          query {
            momentumChanges(first: 50) {
              teamId
              oldMomentum
              newMomentum
              timestamp
            }
          }
        `;

        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error('Failed to fetch momentum data');
        const data = await response.json();

        if (data.data?.momentumChanges) {
          const changes = data.data.momentumChanges.map((change: any) => ({
            teamCode: change.teamId as TeamCode,
            oldMomentum: change.oldMomentum,
            newMomentum: change.newMomentum,
            change: change.newMomentum - change.oldMomentum,
            timestamp: new Date(parseInt(change.timestamp) * 1000).toLocaleTimeString(),
          }));

          setMomentumHistory(changes.reverse()); // Most recent first
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch momentum data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsMounted(true);
    fetchMomentumData();

    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchMomentumData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const filteredHistory = selectedTeam
    ? momentumHistory.filter((m) => m.teamCode === selectedTeam)
    : momentumHistory;

  const topMomentumGainer = momentumHistory.reduce(
    (max, curr) => (curr.change > max.change ? curr : max),
    momentumHistory[0] || { change: 0 }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <div className="space-y-8">
      {!isConnected ? (
        <div className="card bg-blue-900/30 border-accent-blue text-center py-12">
          <p className="text-slate-300 mb-4">Connect your wallet to view live momentum updates.</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Match Momentum</h1>
              <p className="text-slate-400">
                Real-time momentum updates from on-chain trading activity.
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
              <p className="text-slate-400 text-sm mb-2">📊 Total Changes</p>
              <p className="text-3xl font-bold text-accent-blue">{momentumHistory.length}</p>
              <p className="text-xs text-slate-500 mt-1">momentum updates tracked</p>
            </div>

            <div className="card bg-gradient-to-br from-accent-emerald/20 to-accent-emerald/5 border-accent-emerald/30">
              <p className="text-slate-400 text-sm mb-2">🚀 Top Gainer</p>
              <p className="text-3xl font-bold text-accent-emerald">
                {topMomentumGainer.change > 0 ? '+' : ''}
                {topMomentumGainer.change.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {topMomentumGainer.teamCode ? TEAMS[topMomentumGainer.teamCode]?.name : 'N/A'}
              </p>
            </div>

            <div className="card bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border-accent-gold/30">
              <p className="text-slate-400 text-sm mb-2">⚡ Latest Update</p>
              <p className="text-3xl font-bold text-accent-gold">
                {momentumHistory[0]?.timestamp || '--:--:--'}
              </p>
              <p className="text-xs text-slate-500 mt-1">most recent momentum change</p>
            </div>
          </div>

          {/* Momentum Chart Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Momentum Chart */}
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Overall Momentum Trend</h2>
              <MomentumChart
                data={momentumHistory.map((m) => ({
                  teamCode: m.teamCode,
                  momentum: m.newMomentum,
                  timestamp: new Date(m.timestamp).getTime() / 1000,
                }))}
                height={150}
              />
            </div>

            {/* Team Momentum Charts */}
            {selectedTeam ? (
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">
                  {TEAMS[selectedTeam]?.name} Momentum
                </h2>
                <MomentumChart
                  data={momentumHistory
                    .filter((m) => m.teamCode === selectedTeam)
                    .map((m) => ({
                      teamCode: m.teamCode,
                      momentum: m.newMomentum,
                      timestamp: new Date(m.timestamp).getTime() / 1000,
                    }))}
                  teamCode={selectedTeam}
                  height={150}
                />
              </div>
            ) : (
              <div className="card bg-slate-900/40 flex items-center justify-center">
                <p className="text-slate-400 text-center">
                  Select a team above to see individual momentum chart
                </p>
              </div>
            )}
          </div>

          {/* Team Filter */}
          <div>
            <p className="text-sm text-slate-400 mb-3">Filter by team:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTeam(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedTeam === null
                    ? 'bg-accent-blue text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Teams
              </button>
              {/* Show top 8 teams for filtering */}
              {Array.from(new Set(momentumHistory.map((m) => m.teamCode)))
                .slice(0, 8)
                .map((teamCode) => (
                  <button
                    key={teamCode}
                    onClick={() => setSelectedTeam(teamCode)}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                      selectedTeam === teamCode
                        ? 'bg-accent-blue text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {TEAMS[teamCode]?.flagEmoji} {teamCode}
                  </button>
                ))}
            </div>
          </div>

          {/* Momentum History Timeline */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
              <p className="mt-4 text-slate-400">Loading momentum updates...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="card bg-slate-900/40 text-center py-12">
              <p className="text-slate-400">No momentum changes yet. Keep trading! 📈</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">
                {selectedTeam ? `${selectedTeam} Momentum Updates` : 'Momentum History'}
              </h2>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-2"
              >
                {filteredHistory.map((entry, index) => {
                  const team = TEAMS[entry.teamCode];
                  const isGain = entry.change > 0;

                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      className={`p-4 rounded-lg border transition-all ${
                        isGain
                          ? 'bg-gradient-to-r from-accent-emerald/10 to-transparent border-accent-emerald/30'
                          : 'bg-gradient-to-r from-accent-red/10 to-transparent border-accent-red/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left: Team Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-3xl">{team?.flagEmoji}</span>
                          <div>
                            <p className="font-semibold text-slate-100">{team?.name}</p>
                            <p className="text-xs text-slate-400">{entry.timestamp}</p>
                          </div>
                        </div>

                        {/* Middle: Momentum Change */}
                        <div className="text-center px-6">
                          <p className="text-sm text-slate-400 mb-1">Momentum</p>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 font-semibold">
                              {entry.oldMomentum.toFixed(1)}%
                            </span>
                            <span className="text-slate-500">→</span>
                            <span className="text-slate-100 font-bold text-lg">
                              {entry.newMomentum.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Right: Change Badge */}
                        <div
                          className={`px-4 py-2 rounded-lg font-bold text-center ${
                            isGain
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'bg-accent-red/20 text-accent-red'
                          }`}
                        >
                          <div className="text-lg">
                            {isGain ? '📈' : '📉'}
                          </div>
                          <p>
                            {isGain ? '+' : ''}
                            {entry.change.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Info Card */}
          <div className="card bg-slate-900/40 space-y-3">
            <h3 className="text-lg font-semibold text-slate-100">💡 How Momentum Works</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Momentum increases when fans swap for team tokens</li>
              <li>• Each swap through the Uniswap V4 Hook triggers momentum updates</li>
              <li>• Higher momentum = more community support</li>
              <li>• Check the Leaderboard to see which teams are trending</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default function MomentumPage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading momentum tracker...</div>}>
      <MomentumContent />
    </Suspense>
  );
}
