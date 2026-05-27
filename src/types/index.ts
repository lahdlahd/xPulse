/**
 * Core Type Definitions
 * Used throughout the FanXPulse application
 */

// ============================================
// Team & Fan Token Types
// ============================================

export type TeamCode = 'ARG' | 'AUS' | 'BEL' | 'BRA' | 'CMR' | 'CAN' | 'CRC' | 'CRO' |
  'DEN' | 'ECU' | 'ENG' | 'FRA' | 'DEU' | 'GHA' | 'IRN' | 'JPN' |
  'MEX' | 'MOR' | 'NED' | 'POL' | 'POR' | 'QAT' | 'KOR' | 'SAU' |
  'SRB' | 'SEN' | 'ESP' | 'SUI' | 'TUN' | 'USA' | 'URY' | 'WAL';

export interface Team {
  id: string;
  code: TeamCode;
  name: string;
  country: string;
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  momentum: number; // 0-100
  supporterCount: number;
  totalVolume: bigint;
  currentPrice: number;
  priceChange24h: number; // percentage
  flagEmoji: string;
  primaryColor: string;
  secondaryColor: string;
}

// ============================================
// User / Supporter Types
// ============================================

export interface Supporter {
  address: `0x${string}`;
  totalPoints: number;
  currentRank: number;
  favoriteTeam: TeamCode | null;
  holdings: Record<TeamCode, bigint>; // token balance per team
  totalVolume: bigint;
  joinDate: number; // timestamp
  lastActivity: number; // timestamp
}

export interface SupporterPoints {
  swapPoints: number;
  holdingBonus: number;
  streakBonus: number;
  volumeBonus: number;
  matchDayBonus: number;
  totalPoints: number;
}

// ============================================
// Swap & Transaction Types
// ============================================

export interface SwapEvent {
  transactionHash: `0x${string}`;
  timestamp: number;
  user: `0x${string}`;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  amountOut: bigint;
  isBuy: boolean;
  team: TeamCode;
  priceImpact: number; // percentage
}

export interface MomentumUpdate {
  team: TeamCode;
  previousMomentum: number;
  newMomentum: number;
  updateReason: 'swap' | 'streak' | 'velocity' | 'decay';
  changeAmount: number;
  timestamp: number;
}

// ============================================
// Leaderboard Types
// ============================================

export interface LeaderboardEntry {
  rank: number;
  address: `0x${string}`;
  displayName?: string;
  points: number;
  favoriteTeam?: TeamCode;
  volume: bigint;
}

export interface TeamLeaderboardEntry {
  rank: number;
  team: TeamCode;
  momentum: number;
  supporters: number;
  volume: bigint;
  trending: boolean;
}

// ============================================
// Hook / Contract Interaction Types
// ============================================

export interface PoolState {
  poolAddress: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: bigint;
  liquidity: bigint;
}

export interface HookConfig {
  address: `0x${string}`;
  poolManager: `0x${string}`;
  enabled: boolean;
  version: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================
// Real-time Data Types (WebSocket/Indexer)
// ============================================

export interface RealtimeUpdate {
  type: 'swap' | 'momentum' | 'leaderboard' | 'points';
  data: unknown;
  timestamp: number;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

// ============================================
// Match Day Types
// ============================================

export interface MatchDay {
  id: string;
  date: number;
  teams: [TeamCode, TeamCode];
  status: 'upcoming' | 'live' | 'completed';
  isActive: boolean;
  multiplier: number; // points multiplier during match day (e.g., 2.0 for 2x)
}

// ============================================
// Error Types
// ============================================

export class FanXPulseError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'FanXPulseError';
  }
}

export type ErrorCode =
  | 'WALLET_NOT_CONNECTED'
  | 'UNSUPPORTED_CHAIN'
  | 'INSUFFICIENT_BALANCE'
  | 'INVALID_AMOUNT'
  | 'SWAP_FAILED'
  | 'CONTRACT_ERROR'
  | 'INDEXER_ERROR'
  | 'UNKNOWN_ERROR';
