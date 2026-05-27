/**
 * Match-Day Multiplier System
 * Applies momentum and reward multipliers during World Cup matches
 */

import type { TeamCode } from '@/types';

export interface MatchDayMultipliers {
  momentumMultiplier: number;
  pointsMultiplier: number;
  volumeMultiplier: number;
  isLive: boolean;
  matchInfo?: {
    team1: TeamCode;
    team2: TeamCode;
    startTime: Date;
    endTime: Date;
  };
}

export interface WorldCupMatch {
  id: string;
  team1Code: TeamCode;
  team2Code: TeamCode;
  startTime: Date;
  endTime: Date;
  stage: 'group' | 'round16' | 'quarterfinal' | 'semifinal' | 'final';
  completed: boolean;
  team1Score?: number;
  team2Score?: number;
}

/**
 * World Cup 2026 Match Schedule (Example - Replace with real schedule)
 * In production, this would be fetched from a database or external API
 */
export const WORLD_CUP_MATCHES: WorldCupMatch[] = [
  // Group Stage Examples
  {
    id: 'match-001',
    team1Code: 'ARG',
    team2Code: 'AUS',
    startTime: new Date('2026-06-01T14:00:00Z'),
    endTime: new Date('2026-06-01T16:00:00Z'),
    stage: 'group',
    completed: false
  },
  {
    id: 'match-002',
    team1Code: 'BRA',
    team2Code: 'SRB',
    startTime: new Date('2026-06-01T20:00:00Z'),
    endTime: new Date('2026-06-01T22:00:00Z'),
    stage: 'group',
    completed: false
  },
  {
    id: 'match-003',
    team1Code: 'FRA',
    team2Code: 'DEU',
    startTime: new Date('2026-06-02T14:00:00Z'),
    endTime: new Date('2026-06-02T16:00:00Z'),
    stage: 'group',
    completed: false
  },
  // Add more matches as needed
];

/**
 * Get multipliers for a team at current time
 * Returns base multipliers if no match is active
 */
export function getTeamMultipliers(teamCode: TeamCode, currentTime = new Date()): MatchDayMultipliers {
  const activeMatch = WORLD_CUP_MATCHES.find((match) => {
    const isTeamInMatch = match.team1Code === teamCode || match.team2Code === teamCode;
    const isMatchActive = currentTime >= match.startTime && currentTime <= match.endTime;
    return isTeamInMatch && isMatchActive && !match.completed;
  });

  // Base multipliers
  const baseMultipliers: MatchDayMultipliers = {
    momentumMultiplier: 1.0,
    pointsMultiplier: 1.0,
    volumeMultiplier: 1.0,
    isLive: false,
  };

  if (!activeMatch) {
    // Check if match is upcoming (within 1 hour)
    const upcomingMatch = WORLD_CUP_MATCHES.find((match) => {
      const isTeamInMatch = match.team1Code === teamCode || match.team2Code === teamCode;
      const timeUntilMatch = match.startTime.getTime() - currentTime.getTime();
      const isUpcoming = timeUntilMatch > 0 && timeUntilMatch <= 60 * 60 * 1000; // 1 hour
      return isTeamInMatch && isUpcoming && !match.completed;
    });

    if (upcomingMatch) {
      // Pre-match hype boost
      return {
        momentumMultiplier: 1.2, // 20% boost
        pointsMultiplier: 1.1, // 10% boost
        volumeMultiplier: 1.15, // 15% boost
        isLive: false,
        matchInfo: {
          team1: upcomingMatch.team1Code,
          team2: upcomingMatch.team2Code,
          startTime: upcomingMatch.startTime,
          endTime: upcomingMatch.endTime,
        },
      };
    }

    return baseMultipliers;
  }

  // Match is live - apply full multipliers
  return {
    momentumMultiplier: 3.0, // 3x multiplier
    pointsMultiplier: 2.5, // 2.5x multiplier
    volumeMultiplier: 2.0, // 2x multiplier
    isLive: true,
    matchInfo: {
      team1: activeMatch.team1Code,
      team2: activeMatch.team2Code,
      startTime: activeMatch.startTime,
      endTime: activeMatch.endTime,
    },
  };
}

/**
 * Apply multipliers to momentum value
 */
export function applyMomentumMultiplier(baseMomentum: number, multiplier: number): number {
  const result = baseMomentum * multiplier;
  // Cap at 100%
  return Math.min(result, 100);
}

/**
 * Apply multipliers to points
 */
export function applyPointsMultiplier(basePoints: bigint, multiplier: number): bigint {
  const result = BigInt(Math.floor(Number(basePoints) * multiplier));
  return result;
}

/**
 * Get all active matches at current time
 */
export function getActiveMatches(currentTime = new Date()): WorldCupMatch[] {
  return WORLD_CUP_MATCHES.filter((match) => {
    return currentTime >= match.startTime && currentTime <= match.endTime && !match.completed;
  });
}

/**
 * Get next upcoming match
 */
export function getNextMatch(currentTime = new Date()): WorldCupMatch | undefined {
  return WORLD_CUP_MATCHES.filter((match) => match.startTime > currentTime && !match.completed).sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  )[0];
}

/**
 * Get match status string for UI display
 */
export function getMatchStatus(match: WorldCupMatch, currentTime = new Date()): string {
  if (match.completed) {
    return `Final: ${match.team1Score ?? 0} - ${match.team2Score ?? 0}`;
  }

  if (currentTime >= match.startTime && currentTime <= match.endTime) {
    const elapsed = currentTime.getTime() - match.startTime.getTime();
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes}'`;
  }

  if (currentTime < match.startTime) {
    const timeUntil = match.startTime.getTime() - currentTime.getTime();
    const hoursUntil = Math.floor(timeUntil / 3600000);
    const minutesUntil = Math.floor((timeUntil % 3600000) / 60000);

    if (hoursUntil > 0) {
      return `Starts in ${hoursUntil}h ${minutesUntil}m`;
    }
    return `Starts in ${minutesUntil}m`;
  }

  return 'Finished';
}

/**
 * Format multiplier for display
 */
export function formatMultiplier(multiplier: number): string {
  if (multiplier === 1) {
    return '1.0x';
  }
  return `${multiplier.toFixed(1)}x`;
}
