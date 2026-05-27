# FanXPulse Ponder Indexer

Real-time blockchain indexer for the FanXPulseHook contract events on X Layer.

## Overview

This Ponder indexer listens to all events emitted by the FanXPulseHook contract and indexes them into a queryable GraphQL API. It provides real-time data for:

- **Team Momentum** - Updated whenever a swap occurs
- **Supporter Points** - Tracked across all users
- **Swap Events** - Historical record of all token swaps
- **Leaderboards** - Real-time rankings by momentum, points, volume, etc.

## Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### 1. Install Dependencies

```bash
cd src/indexer
npm install
```

### 2. Configure Environment

Create `.env.local` in `src/indexer/`:

```env
# X Layer RPC Endpoints
XLAYER_TESTNET_RPC=https://testrpc.xlayer.tech
XLAYER_MAINNET_RPC=https://rpc.xlayer.tech

# Hook Contract Address (from deployment)
HOOK_ADDRESS=0xc70691c9eE72fe74dCaecD287258816d134C51FC

# Ponder Configuration
PONDER_PORT=42069
DATABASE_URL=file:./ponder.db
```

### 3. Start the Indexer

```bash
npm run dev
```

The GraphQL API will be available at: **http://localhost:42069/graphql**

## Available Queries

### Teams Leaderboard

```graphql
query {
  teams(orderBy: "currentMomentum", orderDirection: "desc", limit: 100) {
    id
    teamCode
    address
    currentMomentum
    totalSwaps
    totalVolume24h
    totalSupporters
    priceChange24h
    lastUpdated
  }
}
```

### Supporter Rankings

```graphql
query {
  supporters(orderBy: "totalPoints", orderDirection: "desc", limit: 50) {
    id
    address
    totalPoints
    favoriteTeam
    swapCount
    lastSwapTime
  }
}
```

### Momentum History (Last 30 changes)

```graphql
query {
  momentumChanges(
    where: { teamCode: "BRA" }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 30
  ) {
    id
    teamCode
    oldMomentum
    newMomentum
    momentumDelta
    timestamp
    blockNumber
  }
}
```

### Recent Swaps

```graphql
query {
  swaps(orderBy: "timestamp", orderDirection: "desc", limit: 50) {
    id
    teamACode
    teamBCode
    amount0In
    amount1In
    amount0Out
    amount1Out
    totalValue
    timestamp
  }
}
```

### Team-Specific Stats

```graphql
query {
  teams(where: { teamCode: "ARG" }) {
    id
    teamCode
    currentMomentum
    momentumHistory
    totalSwaps
    totalVolume24h
    totalSupporters
    createdAt
  }
}
```

## Frontend Integration

### Using the Indexer Hooks

```typescript
import { useIndexerLeaderboard, useIndexerSupporterRankings } from '@/hooks/useIndexer';

function MyComponent() {
  // Fetch leaderboard
  const { teams, isLoading } = useIndexerLeaderboard('http://localhost:42069');

  // Fetch supporters
  const { supporters } = useIndexerSupporterRankings('http://localhost:42069', 100);

  return (
    // Use teams and supporters data
  );
}
```

### Environment Setup

Add to `src/app/.env.local`:

```env
NEXT_PUBLIC_PONDER_URL=http://localhost:42069
```

## Schema

### Teams Table
- `id`: Team address (lowercase)
- `teamCode`: 3-letter code (ARG, BRA, etc.)
- `address`: Token contract address
- `currentMomentum`: 0-100 percentage
- `momentumHistory`: JSON array of recent values
- `totalSwaps`: Number of swaps
- `totalVolume24h`: Total trading volume
- `totalSupporters`: Number of unique supporters
- `priceChange24h`: 24-hour price change percentage

### Supporters Table
- `id`: Supporter wallet address
- `totalPoints`: Cumulative points earned
- `favoriteTeam`: Team code they support most
- `swapCount`: Number of swaps made
- `createdAt`: First activity timestamp

### MomentumChange Table
- Tracks every momentum update
- Useful for charts and historical analysis

### Swap Table
- Records all token swaps
- Tracks volume and pricing data

### LeaderboardPosition Table
- Daily snapshots for historical ranking
- Prevents data loss if recent events are reorganized

## Production Deployment

### Deploying to Vercel/Railway

1. Push indexer to repository
2. Create new project pointing to `src/indexer`
3. Set environment variables in hosting dashboard
4. Deploy!

Example Railway config:
```yaml
services:
  indexer:
    buildCommand: npm install && npm run build
    startCommand: npm start
    environments_inherit: []
    envs:
      XLAYER_TESTNET_RPC: ${{ secrets.XLAYER_TESTNET_RPC }}
      HOOK_ADDRESS: ${{ secrets.HOOK_ADDRESS }}
      DATABASE_URL: postgresql://${{ secrets.DATABASE_URL }}
```

## Troubleshooting

### Indexer Not Starting

```bash
# Clear data and restart
rm ponder.db
npm run dev
```

### GraphQL Query Errors

- Check HOOK_ADDRESS is correct
- Verify contract events are being emitted
- Check Ponder logs for errors

### No Data Appearing

1. Verify contract is deployed at HOOK_ADDRESS
2. Ensure events are being emitted (make a test swap)
3. Check indexer logs for processing status
4. Wait for block confirmations (usually 1-2 blocks)

## Monitoring

### Viewing Indexer Status

Visit **http://localhost:42069** in browser:
- Current block being indexed
- Network status
- Sync progress
- Event counts

### Database Inspection

```bash
# View recent momentum changes
sqlite3 ponder.db "SELECT * FROM momentum_changes ORDER BY timestamp DESC LIMIT 10;"
```

## Next Steps

- Integrate leaderboard with frontend
- Setup WebSocket subscriptions for real-time updates
- Add supporter profile pages
- Create team detail views with charts
- Implement trading interface

---

**Built for X Layer with Ponder** ⚽📊
