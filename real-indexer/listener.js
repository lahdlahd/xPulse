import { createPublicClient, http } from "viem";
import express from "express";


// X Layer Testnet config
const XLAYER_TESTNET = {
  id: 1952,
  name: "X Layer Testnet",
  rpcUrl: "https://testrpc.xlayer.tech",
};

// SwapRecorder contract address (use env or fallback to deployed address)
const HOOK_ADDRESS = process.env.SWAP_RECORDER_ADDRESS || "0x31A125c28dE06309D84dE7f6A386548e1f7060b8";

// Store indexed events in memory
let indexedData = {
  teams: new Map(),
  momentumChanges: [],
  supporterPoints: [],
  swaps: [],
  supporters: new Map(),
};

// Event ABIs - proper ABI format
// Events (SwapRecorder)
const SWAP_EXECUTED_EVENT = {
  type: "event",
  name: "SwapExecuted",
  inputs: [
    { name: "trader", type: "address", indexed: true },
    { name: "teamToken", type: "address", indexed: true },
    { name: "teamCode", type: "string", indexed: false },
    { name: "okbAmount", type: "uint256", indexed: false },
    { name: "tokenAmount", type: "uint256", indexed: false },
    { name: "timestamp", type: "uint256", indexed: false },
  ],
};

const MOMENTUM_CHANGED_EVENT = {
  type: "event",
  name: "MomentumChanged",
  inputs: [
    { name: "teamToken", type: "address", indexed: true },
    { name: "teamCode", type: "string", indexed: false },
    { name: "oldMomentum", type: "uint256", indexed: false },
    { name: "newMomentum", type: "uint256", indexed: false },
    { name: "timestamp", type: "uint256", indexed: false },
  ],
};

const SUPPORTER_POINTS_EVENT = {
  type: "event",
  name: "SupporterPointsAwarded",
  inputs: [
    { name: "trader", type: "address", indexed: true },
    { name: "teamToken", type: "address", indexed: true },
    { name: "teamCode", type: "string", indexed: false },
    { name: "points", type: "uint256", indexed: false },
    { name: "timestamp", type: "uint256", indexed: false },
  ],
};

// Create Viem client
const client = createPublicClient({
  chain: XLAYER_TESTNET,
  transport: http(XLAYER_TESTNET.rpcUrl),
});

// Fetch and index events from Hook contract
async function indexEvents() {
  try {
    // Get current block
    const currentBlock = await client.getBlockNumber();
    const searchRange = 100n; // Max 100 blocks per query on X Layer
    const startBlock = currentBlock > searchRange ? currentBlock - searchRange : 0n;

    console.log(`🔍 Polling blocks ${startBlock} to ${currentBlock}...`);

    // Fetch MomentumChanged events
    const momentumEvents = await client.getLogs({
      address: HOOK_ADDRESS,
      event: MOMENTUM_CHANGED_EVENT,
      fromBlock: startBlock,
      toBlock: currentBlock,
    });

    console.log(`✅ Found ${momentumEvents.length} MomentumChanged events`);
    
    // Process MomentumChanged events
    for (const event of momentumEvents) {
      const { teamToken, newMomentum } = event.args;
      const teamId = teamToken.toLowerCase();
    
      const existing = indexedData.teams.get(teamId);
      indexedData.teams.set(teamId, {
        id: teamId,
        address: teamToken,
        currentMomentum: Number(newMomentum),
        totalSupporters: existing?.totalSupporters || 0,
        totalVolume24h: existing?.totalVolume24h || "0",
        totalSwaps: existing?.totalSwaps || 0,
        lastUpdated: Date.now(),
      });

      indexedData.momentumChanges.push({
        id: `${event.transactionHash}-${event.logIndex}`,
        teamAddress: team,
        oldMomentum: Number(event.args.oldMomentum),
        newMomentum: Number(newMomentum),
        timestamp: Date.now(),
        blockNumber: Number(event.blockNumber),
        transactionHash: event.transactionHash,
      });
    }

    // Fetch SupporterPointsAwarded events
    const supporterEvents = await client.getLogs({
      address: HOOK_ADDRESS,
      event: SUPPORTER_POINTS_EVENT,
      fromBlock: startBlock,
      toBlock: currentBlock,
    });

    console.log(`✅ Found ${supporterEvents.length} SupporterPointsAwarded events`);

    // Process SupporterPointsAwarded events
    for (const event of supporterEvents) {
      const { trader, teamToken, points } = event.args;
      const supporterId = trader.toLowerCase();
      
      const existing = indexedData.supporters.get(supporterId) || {
        address: trader,
        totalPoints: 0,
        favoriteTeamAddress: teamToken,
      };

      indexedData.supporters.set(supporterId, {
        ...existing,
        totalPoints: (existing.totalPoints || 0) + Number(points),
      });

      indexedData.supporterPoints.push({
        id: `${event.transactionHash}-${event.logIndex}`,
        supporterAddress: trader,
        teamAddress: teamToken,
        pointsAwarded: Number(points),
        timestamp: Date.now(),
        blockNumber: Number(event.blockNumber),
        transactionHash: event.transactionHash,
      });

      // Increment team supporter count
      const teamId = teamToken.toLowerCase();
      const teamData = indexedData.teams.get(teamId);
      if (teamData) {
        teamData.totalSupporters = (teamData.totalSupporters || 0) + 1;
      }
    }

    // Fetch SwapExecuted events
    const swapEvents = await client.getLogs({
      address: HOOK_ADDRESS,
      event: SWAP_EXECUTED_EVENT,
      fromBlock: startBlock,
      toBlock: currentBlock,
    });

    console.log(`✅ Found ${swapEvents.length} SwapExecuted events`);

    // Process SwapExecuted events
    for (const event of swapEvents) {
      const { trader, teamToken, teamCode, okbAmount, tokenAmount } = event.args;

      indexedData.swaps.push({
        id: `${event.transactionHash}-${event.logIndex}`,
        traderAddress: trader,
        teamAddress: teamToken,
        teamCode: teamCode || null,
        okbAmount: Number(okbAmount),
        tokenAmount: Number(tokenAmount),
        timestamp: Date.now(),
        blockNumber: Number(event.blockNumber),
        transactionHash: event.transactionHash,
      });

      // Update team volume and swaps
      const teamId = teamToken.toLowerCase();
      const teamData = indexedData.teams.get(teamId);
      if (teamData) {
        const currentVolume = BigInt(teamData.totalVolume24h || "0");
        teamData.totalVolume24h = (currentVolume + BigInt(okbAmount)).toString();
        teamData.totalSwaps = (teamData.totalSwaps || 0) + 1;
      }
    }

    console.log(`\n📊 Indexing Complete:`);
    console.log(`   - Teams: ${indexedData.teams.size}`);
    console.log(`   - Momentum Changes: ${indexedData.momentumChanges.length}`);
    console.log(`   - Supporter Points: ${indexedData.supporterPoints.length}`);
    console.log(`   - Swaps: ${indexedData.swaps.length}`);
    console.log(`   - Supporters: ${indexedData.supporters.size}`);
  } catch (error) {
    console.error("❌ Error indexing events:", error);
  }
}

// Express server to expose indexed data
const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "✅ Real event listener running" });
});

app.get("/teams", (req, res) => {
  res.json(Array.from(indexedData.teams.values()));
});

app.get("/momentum-changes", (req, res) => {
  res.json(indexedData.momentumChanges.slice(-100)); // Last 100
});

app.get("/supporter-points", (req, res) => {
  res.json(indexedData.supporterPoints.slice(-100)); // Last 100
});

app.get("/swaps", (req, res) => {
  res.json(indexedData.swaps.slice(-100)); // Last 100
});

app.get("/supporters", (req, res) => {
  res.json(Array.from(indexedData.supporters.values()));
});

app.get("/stats", (req, res) => {
  res.json({
    teams: indexedData.teams.size,
    momentumChanges: indexedData.momentumChanges.length,
    supporterPoints: indexedData.supporterPoints.length,
    swaps: indexedData.swaps.length,
    supporters: indexedData.supporters.size,
    lastUpdate: new Date().toISOString(),
  });
});

const PORT = 3003;
app.listen(PORT, async () => {
  console.log(`🚀 Event Listener API running on http://localhost:${PORT}`);
  console.log(`📡 Hook Address: ${HOOK_ADDRESS}`);
  console.log(`🌐 Network: X Layer Testnet (1952)\n`);

  // Initial index
  await indexEvents();

  // Re-index every 10 seconds for new events
  setInterval(indexEvents, 10000);
});
