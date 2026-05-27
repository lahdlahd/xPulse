'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TEAMS, ALL_TEAMS } from '@/constants';
import type { TeamCode } from '@/types';

export interface LeaderboardTeam {
  rank: number;
  teamCode: TeamCode;
  name: string;
  flag: string;
  momentum: number;
  supporterCount: number;
  volume24h: string;
  priceChange: number;
}

interface LeaderboardProps {
  teamStats: Record<TeamCode, {
    momentum: number;
    supporterCount: number;
    volume24h: string;
    priceChange: number;
  }>;
  isLoading?: boolean;
}

/**
 * Leaderboard Component
 * Displays teams ranked by momentum with detailed statistics
 */
export default function Leaderboard({ teamStats, isLoading = false }: LeaderboardProps) {
  // Calculate ranked leaderboard
  const leaderboard = useMemo<LeaderboardTeam[]>(() => {
    return ALL_TEAMS
      .map((teamCode) => {
        const team = TEAMS[teamCode];
        const stats = teamStats[teamCode] || {
          momentum: 0,
          supporterCount: 0,
          volume24h: '0 OKB',
          priceChange: 0,
        };

        return {
          rank: 0, // Will be assigned after sorting
          teamCode,
          name: team.name,
          flag: team.flagEmoji,
          momentum: Math.min(stats.momentum || 0, 100),
          supporterCount: stats.supporterCount,
          volume24h: stats.volume24h,
          priceChange: stats.priceChange,
        };
      })
      .sort((a, b) => b.momentum - a.momentum)
      .map((team, index) => ({
        ...team,
        rank: index + 1,
      }));
  }, [teamStats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-orange-500/30';
    return 'bg-slate-900/40 border-slate-700/50';
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Momentum Leaderboard</h1>
        <p className="text-slate-400">
          Real-time rankings of all World Cup teams by momentum score
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
          <p className="mt-4 text-slate-400">Loading leaderboard...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-2"
            >
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">Team</div>
                <div className="col-span-2 text-right">Momentum</div>
                <div className="col-span-2 text-right">Supporters</div>
                <div className="col-span-2 text-right">Volume 24h</div>
                <div className="col-span-2 text-right">Price Change</div>
              </div>

              {/* Table Rows */}
              {leaderboard.map((team) => (
                <motion.div
                  key={team.teamCode}
                  variants={rowVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 rounded-lg border transition-all duration-200 ${getRankColor(team.rank)}`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-lg font-bold text-accent-gold">
                      {getRankMedal(team.rank)}
                    </span>
                  </div>

                  {/* Team */}
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="text-2xl">{team.flag}</span>
                    <div>
                      <p className="font-semibold text-slate-100">{team.teamCode}</p>
                      <p className="text-xs text-slate-400">{team.name}</p>
                    </div>
                  </div>

                  {/* Momentum */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="text-right">
                      <p className="font-semibold text-slate-100">{team.momentum.toFixed(1)}%</p>
                      <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${team.momentum}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-accent-blue to-accent-gold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Supporters */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="text-right">
                      <p className="font-semibold text-slate-100">{team.supporterCount.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">supporters</p>
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="text-right">
                      <p className="font-semibold text-slate-100">{team.volume24h}</p>
                      <p className="text-xs text-slate-400">OKB</p>
                    </div>
                  </div>

                  {/* Price Change */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          team.priceChange >= 0 ? 'text-accent-emerald' : 'text-accent-red'
                        }`}
                      >
                        {team.priceChange > 0 ? '+' : ''}
                        {team.priceChange.toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-400">24h</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Card View */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="md:hidden space-y-3"
          >
            {leaderboard.map((team) => (
              <motion.div
                key={team.teamCode}
                variants={rowVariants}
                className={`p-4 rounded-lg border ${getRankColor(team.rank)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl font-bold text-accent-gold">
                      {getRankMedal(team.rank)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-100">{team.teamCode}</p>
                      <p className="text-xs text-slate-400">{team.name}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{team.flag}</span>
                </div>

                <div className="space-y-2">
                  {/* Momentum Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Momentum</span>
                      <span className="text-slate-100 font-semibold">{team.momentum.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${team.momentum}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-accent-blue to-accent-gold"
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/30">
                    <div>
                      <p className="text-xs text-slate-400">Supporters</p>
                      <p className="text-sm font-semibold text-slate-100">
                        {(team.supporterCount / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Volume</p>
                      <p className="text-sm font-semibold text-slate-100">{team.volume24h}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Change</p>
                      <p
                        className={`text-sm font-semibold ${
                          team.priceChange >= 0 ? 'text-accent-emerald' : 'text-accent-red'
                        }`}
                      >
                        {team.priceChange > 0 ? '+' : ''}
                        {team.priceChange.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Leaderboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-700/50">
            <div className="card bg-slate-900/40">
              <p className="text-slate-400 text-sm mb-2">🥇 Top Momentum</p>
              <p className="text-2xl font-bold text-accent-gold">
                {leaderboard[0]?.momentum.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">{leaderboard[0]?.name}</p>
            </div>
            <div className="card bg-slate-900/40">
              <p className="text-slate-400 text-sm mb-2">👥 Total Supporters</p>
              <p className="text-2xl font-bold text-accent-blue">
                {leaderboard.reduce((sum, team) => sum + team.supporterCount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">across all teams</p>
            </div>
            <div className="card bg-slate-900/40">
              <p className="text-slate-400 text-sm mb-2">📊 Avg Momentum</p>
              <p className="text-2xl font-bold text-cyan-400">
                {(leaderboard.reduce((sum, team) => sum + team.momentum, 0) / leaderboard.length).toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">leaderboard average</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
