# FanXPulse - PHASE 5 Testing Guide ✅

## Quick Start Test

**In Terminal, run:**
```bash
cd c:\Users\USER\OneDrive\Desktop\xPulse\real-indexer
node test-full-flow.js
```

This will verify all backend services are running and data flows correctly.

---

## Manual Testing Checklist

### 1. **Services Check** ✅
Run in separate terminals:

**Terminal 1 - Event Listener:**
```bash
cd c:\Users\USER\OneDrive\Desktop\xPulse\real-indexer
node listener.js
```
Expected: `✅ Listening on port 3003` + polling messages

**Terminal 2 - GraphQL Server:**
```bash
cd c:\Users\USER\OneDrive\Desktop\xPulse\real-indexer
node graphql-server.js
```
Expected: `🚀 GraphQL Server running at http://localhost:4000`

**Terminal 3 - Frontend:**
```bash
cd c:\Users\USER\OneDrive\Desktop\xPulse
npm run dev
```
Expected: Frontend running at `localhost:3000`

---

### 2. **Frontend Pages Test** 🌐

#### Page 1: **Teams** (`localhost:3000/teams`)
- [ ] Teams grid loads with all 32 teams
- [ ] Each team shows flag emoji, code, name
- [ ] Momentum bars animate on load
- [ ] "Trade" button navigates to `/trade?team=ARG` correctly
- [ ] Responsive on mobile/tablet/desktop

#### Page 2: **Trade** (`localhost:3000/trade?team=ARG`)
- [ ] Loads with selected team (ARG)
- [ ] Shows "Trade ARG" in title
- [ ] Enter amount in "You Pay" field (e.g. 0.01)
- [ ] "You Receive" auto-calculates with 1.5x conversion
- [ ] Click "Swap ARG Tokens" button
- [ ] See swap confirmation
- [ ] Token appears in "Your Portfolio" section on right

#### Page 3: **Leaderboard** (`localhost:3000/leaderboard`)
- [ ] Loads with team rankings
- [ ] Teams sorted by momentum score
- [ ] Shows medals for top 3 (🥇🥈🥉)
- [ ] Displays momentum bars, supporter count, volume
- [ ] Last update timestamp shows
- [ ] Page auto-refreshes every 15 seconds
- [ ] Mobile view shows cards instead of table

#### Page 4: **Momentum** (`localhost:3000/momentum`)
- [ ] Shows momentum statistics cards
- [ ] Displays total momentum changes
- [ ] Shows top gainer team
- [ ] Momentum history timeline loads
- [ ] Can filter by team using buttons
- [ ] Shows momentum change visualizations (📈📉)
- [ ] Momentum charts render (one for all, one for selected team)
- [ ] Charts update with real data

---

### 3. **Real Data Flow Test** 🔄

**Trigger a real swap:**

```bash
cd c:\Users\USER\OneDrive\Desktop\xPulse\real-indexer
node trigger-swap.js
```

This executes a real blockchain transaction. Then verify:

1. **Leaderboard updates** - Momentum changes reflect
2. **Momentum page updates** - New entry in timeline
3. **Charts update** - Line charts animate with new data

---

### 4. **Data Pipeline Verification** 📊

**Check REST API returns data:**
```bash
# PowerShell
Invoke-WebRequest http://localhost:3003/stats | ConvertTo-Json
Invoke-WebRequest http://localhost:3003/teams | ConvertTo-Json
```

Expected: Returns JSON with team data

**Check GraphQL returns data:**
```bash
# Visit in browser: http://localhost:4000/graphql
# Or from PowerShell:
$query = @"
query {
  teams {
    id
    currentMomentum
    totalSupporters
  }
}
"@

Invoke-WebRequest -Uri http://localhost:4000/graphql -Method POST -Body $query -ContentType "application/json"
```

---

### 5. **Component Tests** ⚙️

| Component | Location | Test |
|-----------|----------|------|
| TeamsGrid | `src/components/features/TeamsGrid.tsx` | Click trade button navigates correctly |
| Leaderboard | `src/components/features/Leaderboard.tsx` | Shows ranked teams with animations |
| MomentumChart | `src/components/features/MomentumChart.tsx` | Renders SVG charts with animations |
| Trade Page | `src/app/trade/page.tsx` | Calculates swaps, shows portfolio |
| Leaderboard Page | `src/app/leaderboard/page.tsx` | Queries GraphQL every 15 seconds |
| Momentum Page | `src/app/momentum/page.tsx` | Queries GraphQL every 10 seconds |

---

## Success Criteria ✅

All of the following should work:

- ✅ Frontend loads without errors
- ✅ All pages render correctly
- ✅ Data flows from Hook → Listener → GraphQL → Frontend
- ✅ Leaderboard shows live team rankings
- ✅ Momentum page shows live momentum changes
- ✅ Charts visualize momentum trends
- ✅ Trade page calculates swaps and tracks portfolio
- ✅ All pages auto-refresh with latest data
- ✅ Responsive design works on all screen sizes

---

## Troubleshooting

### Pages show "Loading..." forever
**Fix:** Ensure event listener and GraphQL are running
```bash
# Check ports
netstat -tuln | findstr "3003\|4000"
```

### "Cannot fetch from localhost:4000"
**Fix:** GraphQL server not running
```bash
cd real-indexer && node graphql-server.js
```

### No teams showing on leaderboard
**Fix:** Event listener hasn't captured any data yet
```bash
# Run a test swap to generate events
cd real-indexer && node trigger-swap.js
```

### Charts not animating
**Fix:** Framer Motion not imported
- Check imports in `src/app/momentum/page.tsx`
- Verify `MomentumChart.tsx` has motion imports

---

## Next Steps

After successful testing:

✅ **PHASE 5 Complete** - All advanced UI built with real data

**Ready for PHASE 6: Deployment**
- Contract verification
- Mainnet readiness
- Production deployment
- Documentation

---

## Important URLs

- **Frontend:** http://localhost:3000
- **GraphQL Playground:** http://localhost:4000/graphql
- **REST API:** http://localhost:3003

## Commands Reference

```bash
# Start all services
Terminal 1: cd real-indexer && node listener.js
Terminal 2: cd real-indexer && node graphql-server.js  
Terminal 3: npm run dev

# Test data flow
cd real-indexer && node test-full-flow.js

# Trigger test swap
cd real-indexer && node trigger-swap.js

# Check services
netstat -tuln | findstr "3000\|3003\|4000"
```

---

**Build for X Layer Season 3 Hackathon** ⚽💰
