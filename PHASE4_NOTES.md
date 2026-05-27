/**
 * PHASE 4: Ponder Indexer Integration
 * 
 * This document covers the real-time blockchain indexer setup for FanXPulse.
 * The indexer listens to all Hook contract events and provides a GraphQL API
 * for fetching real-time momentum, supporter rankings, and trading history.
 */

# PHASE 4: Ponder Indexer Integration

## Overview

PHASE 4 adds real-time blockchain data indexing via Ponder, enabling:

✅ **Real-Time Updates** - Momentum, points, and swaps update instantly  
✅ **GraphQL API** - Query any indexed data with flexible filtering  
✅ **Historical Data** - Full event history for charts and analytics  
✅ **Leaderboards** - Dynamic rankings by momentum, points, volume  
✅ **Production Ready** - Deployable to production networks  

## Architecture

```
Hook Contract (X Layer)
    ↓ Events (MomentumChanged, SupporterPointsAwarded, SwapExecuted)
    ↓
Ponder Indexer (listening)
    ↓ Processes events
    ↓
SQLite/PostgreSQL Database
    ↓ Queries via
    ↓
GraphQL API (http://localhost:42069/graphql)
    ↓
Frontend Apps (useIndexer hooks)
```

## Files Created

### 1. Indexer Configuration
- **`src/indexer/ponder.config.ts`** - Network and contract configuration
  - X Layer Testnet & Mainnet RPC URLs
  - Hook contract address and ABI
  - Event definitions
  
- **`src/indexer/.env.local`** - Environment variables
  - RPC endpoints
  - Contract addresses
  - Port and database settings

### 2. Data Schema
- **`src/indexer/schema.ts`** - GraphQL schema definition
  - Teams (momentum, volume, supporters)
  - MomentumChange (event history)
  - SupporterPoints (player rankings)
  - Swap (transaction history)
  - Leaderboard (snapshots)
  - HourlyStats (aggregated data)

### 3. Event Handlers
- **`src/indexer/src/index.ts`** - Event processing logic
  - `MomentumChanged` → Update team momentum
  - `SupporterPointsAwarded` → Track player achievements
  - `SwapExecuted` → Record trading volume

### 4. Frontend Integration
- **`src/hooks/useIndexer.ts`** - React hooks for querying
  - `useIndexerLeaderboard()` - Fetch team rankings
  - `useIndexerSupporterRankings()` - Fetch player rankings
  - `useIndexerMomentumHistory()` - Fetch momentum changes
  - Auto-refresh intervals

## Quick Start

### 1. Install Dependencies
```bash
cd src/indexer
npm install
```

### 2. Configure Environment
Update `src/indexer/.env.local` with:
```env
HOOK_ADDRESS=0xc70691c9eE72fe74dCaecD287258816d134C51FC
XLAYER_TESTNET_RPC=https://testrpc.xlayer.tech
```

### 3. Start Indexer
```bash
npm run dev
```

### 4. Check Status
Visit: **http://localhost:42069**

## Querying Data

### Example: Get Top 10 Teams by Momentum

```graphql
query {
  teams(
    orderBy: "currentMomentum"
    orderDirection: "desc"
    limit: 10
  ) {
    teamCode
    currentMomentum
    totalSupporters
    totalVolume24h
  }
}
```

### Example: Get Player Rankings

```graphql
query {
  supporters(
    orderBy: "totalPoints"
    orderDirection: "desc"
    limit: 50
  ) {
    address
    totalPoints
    favoriteTeam
    swapCount
  }
}
```

### Example: Chart Data (Momentum History)

```graphql
query {
  momentumChanges(
    where: { teamCode: "BRA" }
    orderBy: "timestamp"
    orderDirection: "asc"
    limit: 100
  ) {
    timestamp
    newMomentum
    blockNumber
  }
}
```

## Frontend Usage

### Import and Use Hook

```typescript
import { useIndexerLeaderboard } from '@/hooks/useIndexer';

export function LeaderboardPage() {
  const { teams, isLoading, error } = useIndexerLeaderboard(
    'http://localhost:42069'
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <table>
      {teams.map((team) => (
        <tr key={team.address}>
          <td>{team.teamCode}</td>
          <td>{team.currentMomentum}%</td>
          <td>{team.totalSupporters}</td>
        </tr>
      ))}
    </table>
  );
}
```

### Set Base URL in Environment

**`src/app/.env.local`:**
```env
NEXT_PUBLIC_PONDER_URL=http://localhost:42069
```

## Database Schema

### Teams Table
```
id (address)
├── teamCode (ARG, BRA, etc.)
├── address (token contract)
├── currentMomentum (0-100)
├── momentumHistory (JSON)
├── totalSwaps (bigint)
├── totalVolume24h (bigint)
├── totalSupporters (int)
├── priceChange24h (float)
└── lastUpdated (timestamp)
```

### Supporters Table
```
id (address)
├── totalPoints (bigint)
├── favoriteTeam (code)
├── swapCount (int)
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

### MomentumChange Table
```
id (txHash-logIndex)
├── teamCode
├── oldMomentum
├── newMomentum
├── momentumDelta
├── timestamp
└── blockNumber
```

## Advanced Features

### Real-Time Subscriptions (Future)

When Ponder adds WebSocket support:

```typescript
const momentum$ = subscribeToMomentumChanges('BRA');

momentum$.subscribe((event) => {
  console.log(`BRA momentum: ${event.newMomentum}%`);
});
```

### Historical Charts

Using stored HourlyStats:

```graphql
query {
  hourlyStats(
    where: { teamCode: "ARG" }
    orderBy: "hour"
    limit: 24
  ) {
    hour
    startMomentum
    endMomentum
    volumeIn
    volumeOut
  }
}
```

### Leaderboard Snapshots

Daily leaderboard positions for year-over-year analysis:

```graphql
query {
  leaderboardPositions(
    where: { timestamp_gte: "2026-06-02" }
    orderBy: "rank"
  ) {
    teamCode
    rank
    momentum
    timestamp
  }
}
```

## Production Deployment

### Railway Deployment

1. Connect GitHub repo
2. Create new service pointing to `src/indexer`
3. Set secrets in Railway dashboard:
   ```
   XLAYER_TESTNET_RPC = https://testrpc.xlayer.tech
   HOOK_ADDRESS = 0xc70691c9eE72fe74dCaecD287258816d134C51FC
   DATABASE_URL = postgresql://...
   ```
4. Deploy!

### Vercel (with Postgres)

1. Add `@vercel/postgres` to `src/indexer/package.json`
2. Set `DATABASE_URL` in Vercel environment
3. Deploy with:
   ```bash
   vercel deploy --prod
   ```

## Monitoring

### Indexer Status

Visit console at **http://localhost:42069**:
- Current block number
- Indexed events count
- Sync status
- Network health

### Database Query Time

Monitor query performance:
```bash
sqlite3 ponder.db "EXPLAIN QUERY PLAN SELECT * FROM teams ORDER BY current_momentum DESC;"
```

### Event Lag

Check for event processing lag:
```bash
curl http://localhost:42069/health
```

## Troubleshooting

### No Data in Graphql

1. **Verify contract is deployed:**
   ```bash
   curl https://testrpc.xlayer.tech -X POST \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xHOOK_ADDRESS","latest"],"id":1}'
   ```

2. **Make a test swap** to emit events

3. **Check indexer logs** for:
   ```
   [INFO] Processing block X
   [INFO] Found N events
   ```

4. **Restart indexer:**
   ```bash
   rm ponder.db
   npm run dev
   ```

### GraphQL Errors

- Verify schema tables are created
- Check `DATABASE_URL` is correct
- Try simpler queries first (just `teams` without filters)

### Slow Queries

Add database indexes:
```sql
CREATE INDEX idx_teams_momentum ON teams(current_momentum DESC);
CREATE INDEX idx_supporters_points ON supporters(total_points DESC);
CREATE INDEX idx_momentum_timestamp ON momentum_changes(timestamp DESC);
```

## Next Steps

1. **Integrate with Leaderboard Page** - Replace mock data with real indexer data
2. **Build Trading Interface** - Query swap history, implement token swaps
3. **Add Charts** - Use momentum history for momentum charts
4. **Supporter Profiles** - Show player stats and transaction history
5. **Real-Time WebSockets** - When Ponder adds subscription support
6. **Setup Alerts** - Notify when teams reach momentum milestones

## Resources

- **Ponder Docs**: https://ponder.sh
- **GraphQL Best Practices**: https://graphql.org/learn
- **SQLite Query Optimization**: https://www.sqlite.org/queryplanner.html

---

**PHASE 4 Status**: ✅ Complete  
**Next Phase**: PHASE 5 - Advanced UI & Trading Interface  
**Deployment Ready**: Yes
