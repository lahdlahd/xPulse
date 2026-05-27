/**
 * PHASE 4 Quick Reference
 * Ponder Indexer Integration for FanXPulse
 */

# 🔄 PHASE 4: Ponder Indexer - Quick Reference

## What's Installed

### Core Files
```
src/indexer/
├── ponder.config.ts        # Network & contract config
├── schema.ts               # GraphQL schema (7 tables)
├── src/index.ts            # Event handler logic
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── .env.local              # Environment variables
└── README.md               # Full documentation
```

### Frontend Integration
```
src/hooks/
└── useIndexer.ts           # React hooks for querying
    ├── useIndexerLeaderboard()
    ├── useIndexerSupporterRankings()
    └── useIndexerMomentumHistory()
```

### Documentation
```
PHASE4_NOTES.md            # Complete setup guide
src/indexer/README.md      # Ponder-specific docs
```

## Quick Start (3 Steps)

### 1️⃣ Install
```bash
cd src/indexer
npm install
```

### 2️⃣ Configure
Edit `src/indexer/.env.local`:
```env
HOOK_ADDRESS=0xc70691c9eE72fe74dCaecD287258816d134C51FC
XLAYER_TESTNET_RPC=https://testrpc.xlayer.tech
```

### 3️⃣ Run
```bash
npm run dev
# GraphQL available at: http://localhost:42069/graphql
```

## What It Does

📊 **Listens to 3 Contract Events:**
- `MomentumChanged` → Updates team momentum
- `SupporterPointsAwarded` → Tracks player achievements  
- `SwapExecuted` → Records trading volume

💾 **Stores in 7 Tables:**
- Teams (momentum, supporters, volume)
- Supporters (points, favorite team, swaps)
- MomentumChange (event history)
- Swap (transaction records)
- LeaderboardPosition (daily snapshots)
- HourlyStats (aggregated data)
- SupporterPoints (detailed tracking)

🔗 **Exposes GraphQL API:**
- Query any data with filters
- Auto-refresh intervals (20s-60s)
- Real-time leaderboards

## Common Queries

### Top 10 Teams
```graphql
query {
  teams(orderBy: "currentMomentum", orderDirection: "desc", limit: 10) {
    teamCode
    currentMomentum
    totalSupporters
    totalVolume24h
  }
}
```

### Top 50 Players
```graphql
query {
  supporters(orderBy: "totalPoints", orderDirection: "desc", limit: 50) {
    address
    totalPoints
    favoriteTeam
    swapCount
  }
}
```

### Team Momentum History
```graphql
query {
  momentumChanges(
    where: { teamCode: "BRA" }
    orderBy: "timestamp"
    orderDirection: "desc"
    limit: 50
  ) {
    timestamp
    oldMomentum
    newMomentum
    blockNumber
  }
}
```

## Frontend Usage

```typescript
import { useIndexerLeaderboard } from '@/hooks/useIndexer';

function LeaderboardPage() {
  // Auto-refreshes every 30 seconds
  const { teams, isLoading, error } = useIndexerLeaderboard(
    'http://localhost:42069'
  );

  return (
    <div>
      {teams.map(team => (
        <div key={team.address}>
          {team.teamCode}: {team.currentMomentum}% momentum
        </div>
      ))}
    </div>
  );
}
```

## Database Info

**Type**: SQLite (local) / PostgreSQL (production)  
**Location**: `src/indexer/ponder.db`  
**Queries**: Via GraphQL API (http://localhost:42069/graphql)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No data in GraphQL | Make a test swap to emit events |
| Slow startup | First time indexes blockchain, can take 1-2 min |
| "HOOK_ADDRESS not found" | Verify address is deployed on testnet |
| Port 42069 in use | Change `PONDER_PORT=42070` in .env |
| Schema errors | `rm ponder.db && npm run dev` |

## Deployment

**Development**: `npm run dev` (can rebuild on changes)  
**Production**: `npm start` (optimized build)  
**Cloud**: Deploy to **Railway** or **Vercel** with PostgreSQL

## What's Next

After PHASE 4:
- ✅ Real-time data indexing working
- ✅ GraphQL API ready for queries
- ⏳ PHASE 5: Build trading interface
- ⏳ PHASE 6: Mainnet deployment

## Monitoring

Check indexer status at:
- **Console**: http://localhost:42069
- **GraphQL Explorer**: http://localhost:42069/graphql
- **Health**: `curl http://localhost:42069/health`

---

**PHASE 4 Complete!** 🎉

Next: Build the trading interface with token swaps and order placement.
