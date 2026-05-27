import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // Team Momentum and Statistics
  Team: p.createTable({
    id: p.string(), // team address
    teamCode: p.string(), // ARG, BRA, FRA, etc.
    address: p.string(), // Token contract address
    currentMomentum: p.int(), // 0-100
    momentumHistory: p.string(), // JSON array of recent momentum values
    totalSwaps: p.bigint(),
    totalVolume24h: p.bigint(),
    totalSupporters: p.int(),
    priceChange24h: p.float(),
    lastUpdated: p.bigint(),
    createdAt: p.bigint(),
  }),

  // Momentum Change Events
  MomentumChange: p.createTable({
    id: p.string(), // txHash-logIndex
    teamAddress: p.string(),
    teamCode: p.string(),
    oldMomentum: p.int(),
    newMomentum: p.int(),
    momentumDelta: p.int(),
    timestamp: p.bigint(),
    blockNumber: p.int(),
    transactionHash: p.string(),
  }),

  // Supporter Points
  SupporterPoints: p.createTable({
    id: p.string(), // txHash-logIndex
    supporterAddress: p.string(),
    teamAddress: p.string(),
    teamCode: p.string(),
    pointsAwarded: p.bigint(),
    totalPoints: p.bigint(), // cumulative
    timestamp: p.bigint(),
    blockNumber: p.int(),
    transactionHash: p.string(),
  }),

  // Swap Events
  Swap: p.createTable({
    id: p.string(), // txHash-logIndex
    teamAAddress: p.string(),
    teamACode: p.string(),
    teamBAddress: p.string(),
    teamBCode: p.string(),
    amount0In: p.bigint(),
    amount1In: p.bigint(),
    amount0Out: p.bigint(),
    amount1Out: p.bigint(),
    totalValue: p.bigint(), // estimated value
    timestamp: p.bigint(),
    blockNumber: p.int(),
    transactionHash: p.string(),
  }),

  // Supporter Rankings
  Supporter: p.createTable({
    id: p.string(), // supporter address
    address: p.string(),
    totalPoints: p.bigint(),
    favoriteTeam: p.string(), // team code
    favoriteTeamAddress: p.string(),
    swapCount: p.int(),
    lastSwapTime: p.bigint(),
    createdAt: p.bigint(),
    updatedAt: p.bigint(),
  }),

  // Leaderboard Position (for faster queries)
  LeaderboardPosition: p.createTable({
    id: p.string(), // teamCode-timestamp (daily)
    teamCode: p.string(),
    teamAddress: p.string(),
    rank: p.int(),
    momentum: p.int(),
    supporters: p.int(),
    volume24h: p.bigint(),
    timestamp: p.bigint(),
  }),

  // Hourly Stats (for charts)
  HourlyStats: p.createTable({
    id: p.string(), // teamCode-hour
    teamCode: p.string(),
    teamAddress: p.string(),
    hour: p.bigint(),
    startMomentum: p.int(),
    endMomentum: p.int(),
    swapCount: p.int(),
    volumeIn: p.bigint(),
    volumeOut: p.bigint(),
    newSupporters: p.int(),
  }),
}));
