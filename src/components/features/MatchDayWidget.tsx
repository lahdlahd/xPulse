'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS } from '@/constants';
import { getActiveMatches, getNextMatch, getMatchStatus, formatMultiplier, getTeamMultipliers } from '@/utils/matchDayMultipliers';

/**
 * MatchDayWidget Component
 * Displays current and upcoming World Cup matches with multiplier info
 */
export default function MatchDayWidget() {
  const [activeMatches, setActiveMatches] = useState<typeof import('@/utils/matchDayMultipliers').WORLD_CUP_MATCHES>([]);
  const [nextMatch, setNextMatch] = useState<typeof import('@/utils/matchDayMultipliers').WORLD_CUP_MATCHES[0] | undefined>();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every 30 seconds
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setActiveMatches(getActiveMatches(now));
      setNextMatch(getNextMatch(now));
    }, 30000);

    // Initial update
    setActiveMatches(getActiveMatches());
    setNextMatch(getNextMatch());

    return () => clearInterval(timer);
  }, []);

  if (activeMatches.length === 0 && !nextMatch) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 max-w-sm z-40">
      <AnimatePresence>
        {/* Active Matches */}
        {activeMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 p-4 rounded-lg bg-gradient-to-br from-red-900/60 to-orange-900/40 border border-red-500/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-400 text-xl animate-pulse">🔴</span>
              <p className="text-sm font-bold text-red-100">LIVE MATCHES</p>
            </div>

            {activeMatches.map((match) => {
              const team1 = TEAMS[match.team1Code];
              const team2 = TEAMS[match.team2Code];
              const team1Mult = getTeamMultipliers(match.team1Code);
              const team2Mult = getTeamMultipliers(match.team2Code);

              return (
                <div key={match.id} className="mb-3 p-3 rounded bg-black/30 border border-red-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{team1.flagEmoji}</span>
                      <span className="text-xs font-semibold text-slate-100">{match.team1Code}</span>
                    </div>
                    <p className="text-xs text-red-200 font-mono">{getMatchStatus(match, currentTime)}</p>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-xs font-semibold text-slate-100">{match.team2Code}</span>
                      <span className="text-lg">{team2.flagEmoji}</span>
                    </div>
                  </div>

                  {/* Multiplier Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30">
                      <p className="text-amber-200 font-bold">{formatMultiplier(team1Mult.momentumMultiplier)}</p>
                      <p className="text-amber-300/70">Momentum</p>
                    </div>
                    <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30">
                      <p className="text-amber-200 font-bold">{formatMultiplier(team1Mult.pointsMultiplier)}</p>
                      <p className="text-amber-300/70">Points</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Next Match */}
        {nextMatch && activeMatches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 rounded-lg bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border border-blue-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400 text-xl">⏱️</span>
              <p className="text-sm font-bold text-blue-100">NEXT MATCH</p>
            </div>

            <div className="p-3 rounded bg-black/20 border border-blue-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg">{TEAMS[nextMatch.team1Code].flagEmoji}</span>
                  <span className="text-xs font-semibold text-slate-100">{nextMatch.team1Code}</span>
                </div>
                <span className="text-xs text-blue-300 font-mono">vs</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-xs font-semibold text-slate-100">{nextMatch.team2Code}</span>
                  <span className="text-lg">{TEAMS[nextMatch.team2Code].flagEmoji}</span>
                </div>
              </div>

              <p className="text-xs text-blue-200 text-center">
                {getMatchStatus(nextMatch, currentTime)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
