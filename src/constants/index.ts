/**
 * Application Constants
 * Team configurations, colors, and static data
 */

import type { Team, TeamCode } from '@/types';

// ============================================
// Contract Addresses (X Layer Testnet)
// ============================================

/** FanXPulseHook deployed on X Layer Testnet */
export const FAN_XPULSE_HOOK_ADDRESS = '0xc70691c9eE72fe74dCaecD287258816d134C51FC' as const;

// ============================================
// Team Configurations
// ============================================

export const TEAMS: Record<TeamCode, Omit<Team, 'tokenAddress' | 'momentum' | 'supporterCount' | 'totalVolume' | 'currentPrice' | 'priceChange24h'>> = {
  ARG: { id: 'argentina', code: 'ARG', name: 'Argentina', country: 'Argentina', tokenDecimals: 18, flagEmoji: '🇦🇷', primaryColor: '#1E40AF', secondaryColor: '#FBBF24' },
  AUS: { id: 'australia', code: 'AUS', name: 'Australia', country: 'Australia', tokenDecimals: 18, flagEmoji: '🇦🇺', primaryColor: '#1F2937', secondaryColor: '#FBBF24' },
  BEL: { id: 'belgium', code: 'BEL', name: 'Belgium', country: 'Belgium', tokenDecimals: 18, flagEmoji: '🇧🇪', primaryColor: '#1E40AF', secondaryColor: '#DC2626' },
  BRA: { id: 'brazil', code: 'BRA', name: 'Brazil', country: 'Brazil', tokenDecimals: 18, flagEmoji: '🇧🇷', primaryColor: '#15803D', secondaryColor: '#FBBF24' },
  CMR: { id: 'cameroon', code: 'CMR', name: 'Cameroon', country: 'Cameroon', tokenDecimals: 18, flagEmoji: '🇨🇲', primaryColor: '#15803D', secondaryColor: '#DC2626' },
  CAN: { id: 'canada', code: 'CAN', name: 'Canada', country: 'Canada', tokenDecimals: 18, flagEmoji: '🇨🇦', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  CRC: { id: 'costa-rica', code: 'CRC', name: 'Costa Rica', country: 'Costa Rica', tokenDecimals: 18, flagEmoji: '🇨🇷', primaryColor: '#1E40AF', secondaryColor: '#DC2626' },
  CRO: { id: 'croatia', code: 'CRO', name: 'Croatia', country: 'Croatia', tokenDecimals: 18, flagEmoji: '🇭🇷', primaryColor: '#DC2626', secondaryColor: '#1E40AF' },
  DEN: { id: 'denmark', code: 'DEN', name: 'Denmark', country: 'Denmark', tokenDecimals: 18, flagEmoji: '🇩🇰', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  ECU: { id: 'ecuador', code: 'ECU', name: 'Ecuador', country: 'Ecuador', tokenDecimals: 18, flagEmoji: '🇪🇨', primaryColor: '#15803D', secondaryColor: '#FBBF24' },
  ENG: { id: 'england', code: 'ENG', name: 'England', country: 'England', tokenDecimals: 18, flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', primaryColor: '#FFFFFF', secondaryColor: '#DC2626' },
  FRA: { id: 'france', code: 'FRA', name: 'France', country: 'France', tokenDecimals: 18, flagEmoji: '🇫🇷', primaryColor: '#1E40AF', secondaryColor: '#FFFFFF' },
  DEU: { id: 'germany', code: 'DEU', name: 'Germany', country: 'Germany', tokenDecimals: 18, flagEmoji: '🇩🇪', primaryColor: '#000000', secondaryColor: '#DC2626' },
  GHA: { id: 'ghana', code: 'GHA', name: 'Ghana', country: 'Ghana', tokenDecimals: 18, flagEmoji: '🇬🇭', primaryColor: '#DC2626', secondaryColor: '#15803D' },
  IRN: { id: 'iran', code: 'IRN', name: 'Iran', country: 'Iran', tokenDecimals: 18, flagEmoji: '🇮🇷', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  JPN: { id: 'japan', code: 'JPN', name: 'Japan', country: 'Japan', tokenDecimals: 18, flagEmoji: '🇯🇵', primaryColor: '#FFFFFF', secondaryColor: '#DC2626' },
  MEX: { id: 'mexico', code: 'MEX', name: 'Mexico', country: 'Mexico', tokenDecimals: 18, flagEmoji: '🇲🇽', primaryColor: '#15803D', secondaryColor: '#FFFFFF' },
  MOR: { id: 'morocco', code: 'MOR', name: 'Morocco', country: 'Morocco', tokenDecimals: 18, flagEmoji: '🇲🇦', primaryColor: '#DC2626', secondaryColor: '#15803D' },
  NED: { id: 'netherlands', code: 'NED', name: 'Netherlands', country: 'Netherlands', tokenDecimals: 18, flagEmoji: '🇳🇱', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  POL: { id: 'poland', code: 'POL', name: 'Poland', country: 'Poland', tokenDecimals: 18, flagEmoji: '🇵🇱', primaryColor: '#FFFFFF', secondaryColor: '#DC2626' },
  POR: { id: 'portugal', code: 'POR', name: 'Portugal', country: 'Portugal', tokenDecimals: 18, flagEmoji: '🇵🇹', primaryColor: '#DC2626', secondaryColor: '#15803D' },
  QAT: { id: 'qatar', code: 'QAT', name: 'Qatar', country: 'Qatar', tokenDecimals: 18, flagEmoji: '🇶🇦', primaryColor: '#8B1538', secondaryColor: '#FFFFFF' },
  KOR: { id: 'south-korea', code: 'KOR', name: 'South Korea', country: 'South Korea', tokenDecimals: 18, flagEmoji: '🇰🇷', primaryColor: '#DC2626', secondaryColor: '#000000' },
  SAU: { id: 'saudi-arabia', code: 'SAU', name: 'Saudi Arabia', country: 'Saudi Arabia', tokenDecimals: 18, flagEmoji: '🇸🇦', primaryColor: '#15803D', secondaryColor: '#FFFFFF' },
  SRB: { id: 'serbia', code: 'SRB', name: 'Serbia', country: 'Serbia', tokenDecimals: 18, flagEmoji: '🇷🇸', primaryColor: '#DC2626', secondaryColor: '#1E40AF' },
  SEN: { id: 'senegal', code: 'SEN', name: 'Senegal', country: 'Senegal', tokenDecimals: 18, flagEmoji: '🇸🇳', primaryColor: '#15803D', secondaryColor: '#DC2626' },
  ESP: { id: 'spain', code: 'ESP', name: 'Spain', country: 'Spain', tokenDecimals: 18, flagEmoji: '🇪🇸', primaryColor: '#DC2626', secondaryColor: '#15803D' },
  SUI: { id: 'switzerland', code: 'SUI', name: 'Switzerland', country: 'Switzerland', tokenDecimals: 18, flagEmoji: '🇨🇭', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  TUN: { id: 'tunisia', code: 'TUN', name: 'Tunisia', country: 'Tunisia', tokenDecimals: 18, flagEmoji: '🇹🇳', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  USA: { id: 'usa', code: 'USA', name: 'United States', country: 'United States', tokenDecimals: 18, flagEmoji: '🇺🇸', primaryColor: '#1E40AF', secondaryColor: '#DC2626' },
  URY: { id: 'uruguay', code: 'URY', name: 'Uruguay', country: 'Uruguay', tokenDecimals: 18, flagEmoji: '🇺🇾', primaryColor: '#1E40AF', secondaryColor: '#FFFFFF' },
  WAL: { id: 'wales', code: 'WAL', name: 'Wales', country: 'Wales', tokenDecimals: 18, flagEmoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', primaryColor: '#15803D', secondaryColor: '#FFFFFF' },
};

export const ALL_TEAMS: TeamCode[] = [
  'ARG', 'AUS', 'BEL', 'BRA', 'CMR', 'CAN', 'CRC', 'CRO',
  'DEN', 'ECU', 'ENG', 'FRA', 'DEU', 'GHA', 'IRN', 'JPN',
  'MEX', 'MOR', 'NED', 'POL', 'POR', 'QAT', 'KOR', 'SAU',
  'SRB', 'SEN', 'ESP', 'SUI', 'TUN', 'USA', 'URY', 'WAL',
];

// ============================================
// Network Configuration
// ============================================

export const CHAIN_CONFIG = {
  X_LAYER_MAINNET: {
    id: 196,
    name: 'X Layer',
    rpcUrl: process.env.NEXT_PUBLIC_X_LAYER_RPC_MAINNET,
  },
  X_LAYER_TESTNET: {
    id: 195,
    name: 'X Layer Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_X_LAYER_RPC_TESTNET,
  },
};

// ============================================
// Contract Addresses (Will be populated after deployment)
// ============================================

export const CONTRACT_ADDRESSES = {
  UNISWAP_V4_POOL_MANAGER: process.env.NEXT_PUBLIC_UNISWAP_V4_POOL_MANAGER_ADDRESS as `0x${string}`,
  UNISWAP_V4_ROUTER: process.env.NEXT_PUBLIC_UNISWAP_V4_ROUTER_ADDRESS as `0x${string}`,
  HOOK: process.env.NEXT_PUBLIC_HOOK_ADDRESS as `0x${string}`,
};

// ============================================
// App Configuration
// ============================================

export const APP_CONFIG = {
  APP_NAME: 'FanXPulse',
  APP_DESCRIPTION: 'World Cup Fan Token + Match Momentum Trading Platform',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ENVIRONMENT: process.env.NEXT_PUBLIC_APP_ENV || 'development',
};

// ============================================
// Momentum System Configuration
// ============================================

export const MOMENTUM_CONFIG = {
  // How momentum changes based on swap patterns
  BASE_SWAP_MOMENTUM: 1,
  CONSECUTIVE_BUY_MULTIPLIER: 1.5, // +50% per consecutive buy
  HEAVY_SELL_DECAY: -2,
  HIGH_VELOCITY_BOOST: 2.5, // For fast trading streaks
  MOMENTUM_MAX: 100,
  MOMENTUM_MIN: 0,
  MOMENTUM_DECAY_RATE: 0.1, // Per block
  VELOCITY_WINDOW_BLOCKS: 100, // Measure velocity over last 100 blocks
};

// ============================================
// Points System Configuration
// ============================================

export const POINTS_CONFIG = {
  BASE_SWAP_POINTS: 10,
  HOLD_BONUS_PER_HOUR: 1,
  STREAK_BONUS_MULTIPLIER: 1.2,
  MATCH_DAY_MULTIPLIER: 2,
  VOLUME_BONUS_THRESHOLDS: {
    1000: 50, // 1000 tokens = 50 bonus points
    5000: 150,
    10000: 300,
  },
};

// ============================================
// UI / Display Constants
// ============================================

export const UI_CONFIG = {
  // Animation durations (in ms)
  ANIMATION_DURATION_FAST: 150,
  ANIMATION_DURATION_NORMAL: 300,
  ANIMATION_DURATION_SLOW: 500,
  
  // Polling intervals
  REAL_TIME_UPDATE_INTERVAL: 1000, // 1 second
  LEADERBOARD_REFRESH_INTERVAL: 5000, // 5 seconds
  MOMENTUM_REFRESH_INTERVAL: 2000, // 2 seconds
  
  // Pagination
  ITEMS_PER_PAGE_LEADERBOARD: 20,
  ITEMS_PER_PAGE_SWAPS: 50,
};

// ============================================
// Validation Constants
// ============================================

export const VALIDATION = {
  MIN_SWAP_AMOUNT: BigInt('1000000000000000000'), // 1 token with 18 decimals
  MAX_SWAP_AMOUNT: BigInt('1000000000000000000000000'), // 1M tokens
  MIN_ADDRESS_LENGTH: 42,
  MAX_ADDRESS_LENGTH: 42,
};

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  WRONG_CHAIN: 'Please switch to X Layer network',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this swap',
  INVALID_AMOUNT: 'Invalid swap amount',
  SWAP_FAILED: 'Swap transaction failed',
  CONTRACT_CALL_FAILED: 'Contract interaction failed',
  INDEXER_UNAVAILABLE: 'Data service is currently unavailable',
};

// ============================================
// Feature Flags
// ============================================

export const FEATURE_FLAGS = {
  ENABLE_MATCH_DAY_MODE: true,
  ENABLE_NFT_BADGES: true,
  ENABLE_ADVANCED_CHARTS: true,
  ENABLE_REALTIME_UPDATES: true,
  ENABLE_LEADERBOARD: true,
};
