/**
 * Teams Grid Component
 * Display all teams with their stats and momentum
 * Fetches real data from FanXPulseHook contract
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePublicClient } from 'wagmi';
import { ALL_TEAMS, TEAMS, FAN_XPULSE_HOOK_ADDRESS } from '@/constants';
import { useTeamStatsFromHook, type RealTeamStats } from '@/hooks/useTeamStatsFromHook';
import type { TeamCode } from '@/types';

// Fallback stats used when contract is unavailable
const FALLBACK_TEAM_STATS: Record<TeamCode, RealTeamStats> = {
  ARG: { momentum: 72, supporterCount: 1234, volume24h: '125.5K OKB', priceChange: 12.5 },
  AUS: { momentum: 42, supporterCount: 456, volume24h: '45.2K OKB', priceChange: 1.3 },
  BEL: { momentum: 68, supporterCount: 823, volume24h: '82.1K OKB', priceChange: 8.7 },
  BRA: { momentum: 88, supporterCount: 2456, volume24h: '234.2K OKB', priceChange: 18.2 },
  CMR: { momentum: 35, supporterCount: 267, volume24h: '28.3K OKB', priceChange: -3.2 },
  CAN: { momentum: 41, supporterCount: 312, volume24h: '34.5K OKB', priceChange: 0.8 },
  CRC: { momentum: 49, supporterCount: 445, volume24h: '44.2K OKB', priceChange: -1.5 },
  CRO: { momentum: 76, supporterCount: 1345, volume24h: '135.6K OKB', priceChange: 14.2 },
  DEN: { momentum: 72, supporterCount: 987, volume24h: '105.2K OKB', priceChange: 11.1 },
  ECU: { momentum: 46, supporterCount: 378, volume24h: '39.1K OKB', priceChange: 2.3 },
  ENG: { momentum: 65, supporterCount: 982, volume24h: '98.1K OKB', priceChange: -5.3 },
  FRA: { momentum: 92, supporterCount: 1876, volume24h: '189.5K OKB', priceChange: 25.7 },
  DEU: { momentum: 85, supporterCount: 1654, volume24h: '167.2K OKB', priceChange: 19.8 },
  GHA: { momentum: 38, supporterCount: 289, volume24h: '31.2K OKB', priceChange: 0.5 },
  IRN: { momentum: 32, supporterCount: 201, volume24h: '21.8K OKB', priceChange: -4.1 },
  JPN: { momentum: 54, supporterCount: 678, volume24h: '71.3K OKB', priceChange: 6.2 },
  MEX: { momentum: 71, supporterCount: 1123, volume24h: '115.4K OKB', priceChange: 10.9 },
  MOR: { momentum: 51, supporterCount: 456, volume24h: '48.5K OKB', priceChange: 3.7 },
  NED: { momentum: 79, supporterCount: 1432, volume24h: '144.3K OKB', priceChange: 16.5 },
  POL: { momentum: 48, supporterCount: 345, volume24h: '37.8K OKB', priceChange: -0.9 },
  POR: { momentum: 74, supporterCount: 1234, volume24h: '128.9K OKB', priceChange: 13.4 },
  QAT: { momentum: 29, supporterCount: 156, volume24h: '16.7K OKB', priceChange: -5.8 },
  KOR: { momentum: 53, supporterCount: 567, volume24h: '59.4K OKB', priceChange: 5.1 },
  SAU: { momentum: 22, supporterCount: 123, volume24h: '12.4K OKB', priceChange: -8.2 },
  SRB: { momentum: 45, supporterCount: 334, volume24h: '35.6K OKB', priceChange: 1.7 },
  SEN: { momentum: 47, supporterCount: 398, volume24h: '42.1K OKB', priceChange: 2.9 },
  ESP: { momentum: 58, supporterCount: 745, volume24h: '67.3K OKB', priceChange: -2.1 },
  SUI: { momentum: 68, supporterCount: 876, volume24h: '89.2K OKB', priceChange: 9.3 },
  TUN: { momentum: 36, supporterCount: 267, volume24h: '29.1K OKB', priceChange: -2.4 },
  USA: { momentum: 69, supporterCount: 1089, volume24h: '112.3K OKB', priceChange: 10.2 },
  URY: { momentum: 55, supporterCount: 523, volume24h: '54.2K OKB', priceChange: 4.8 },
  WAL: { momentum: 44, supporterCount: 456, volume24h: '46.7K OKB', priceChange: 0.3 },
};

const TeamsGrid: React.FC = () => {
  const router = useRouter();
  
  // Fetch real stats from Hook contract
  const { stats: contractStats, isLoading } = useTeamStatsFromHook(FAN_XPULSE_HOOK_ADDRESS, FALLBACK_TEAM_STATS);
  const [teamStats, setTeamStats] = useState<Record<TeamCode, RealTeamStats>>(FALLBACK_TEAM_STATS);

  // Update local state when contract data changes
  useEffect(() => {
    setTeamStats(contractStats);
  }, [contractStats]);

  const [displayCount, setDisplayCount] = useState(5);
  const TEAMS_PER_PAGE = 5;
  const visibleTeams = ALL_TEAMS.slice(0, displayCount);
  const hasMoreTeams = displayCount < ALL_TEAMS.length;

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + TEAMS_PER_PAGE);
  };

  const handleTrade = (teamCode: TeamCode) => {
    router.push(`/trade?team=${teamCode}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {visibleTeams.map((teamCode) => {
        const team = TEAMS[teamCode];
        const stats = teamStats[teamCode] || { 
          momentum: 0, 
          supporterCount: 0, 
          volume24h: '0 OKB',
          priceChange24h: 0 
        };

        return (
          <motion.div
            key={teamCode}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="card relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div
              className="absolute -inset-px rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300 -z-10"
              style={{
                background: `linear-gradient(to bottom-right, ${team.primaryColor}, ${team.secondaryColor})`,
              }}
            />

            {/* Team Avatar */}
            <div className="text-4xl mb-4">{team.flagEmoji}</div>

            {/* Team Code */}
            <h3 className="text-lg font-bold text-slate-100 mb-1">{teamCode}</h3>
            <p className="text-sm text-slate-400 mb-4">{team.name}</p>

            {/* Momentum Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Momentum</span>
                <span className="text-xs font-semibold text-accent-gold">{Math.min(stats.momentum || 0, 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.momentum || 0, 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-gold rounded-full"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Supporters</span>
                <span className="text-slate-200 font-semibold">{stats.supporterCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">24h Volume</span>
                <span className="text-slate-200 font-semibold">{stats.volume24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">24h Change</span>
                <span
                  className={`font-semibold ${
                    stats.priceChange >= 0 ? 'text-accent-emerald' : 'text-accent-red'
                  }`}
                >
                  {stats.priceChange > 0 ? '+' : ''}
                  {stats.priceChange}%
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => handleTrade(teamCode)}
              className="mt-4 w-full btn-primary text-sm hover:scale-105 transition-transform"
            >
              Trade {teamCode}
            </button>
          </motion.div>
        );
      })}
      </motion.div>

      {/* Show More Button */}
      {hasMoreTeams && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={handleShowMore}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Load More Teams ({ALL_TEAMS.length - displayCount} remaining)
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TeamsGrid;
