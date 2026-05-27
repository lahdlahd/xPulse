import { createPublicClient, http } from "viem";
import express from "express";


// X Layer Testnet config
const XLAYER_TESTNET = {
  id: 1952,
  name: "X Layer Testnet",
  rpcUrl: "https://testrpc.xlayer.tech",
};

// Hook contract address
const HOOK_ADDRESS = "0x906407592cdAfE2F6DB4cC2710e1F515c416e352";

// Store indexed events in memory
let indexedData = {
  teams: new Map(),
  momentumChanges: [],
  supporterPoints: [],
  swaps: [],
  supporters: new Map(),
};

// Event ABIs - proper ABI format
const MOMENTUM_CHANGED_EVENT = {
  type: "event",
  name: "MomentumChanged",
  inputs: [
    { name: "team", type: "address", indexed: true },
    { name: "oldMomentum", type: "uint256", indexed: false },
    { name: "newMomentum", type: "uint256", indexed: false },
    { name: "timestamp", type: "uint256", indexed: false },
  ],
};

const SUPPORTER_POINTS_EVENT = {
  type: "event",
  name: "SupporterPointsAwarded",
  inputs: [
    { name: "supporter", type: "address", indexed: true },
    { name: "team", type: "address", indexed: true },
    { name: "points", type: "uint256", indexed: false },
    { name: "timestamp", type: "uint256", indexed: false },
  ],
};

const SWAP_EXECUTED_EVENT = {
  type: "event",
  name: "SwapExecuted",
  inputs: [
    { name: "teamA", type: "address", indexed: true },
    { name: "teamB", type: "address", indexed: true },
    { name: "amount0In", type: "uint256", indexed: false },
    { name: "amount1In", type: "uint256", indexed: false },
    { name: "amount0Out", type: "uint256", indexed: false },
    { name: "amount1Out", type: "uint256", indexed: false },
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
      const { team, newMomentum } = event.args;
      const teamId = team.toLowerCase();
      
      const existing = indexedData.teams.get(teamId);
      indexedData.teams.set(teamId, {
        id: teamId,
        address: team,
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
      const { supporter, team, points } = event.args;
      const supporterId = supporter.toLowerCase();
      
      const existing = indexedData.supporters.get(supporterId) || {
        address: supporter,
        totalPoints: 0n,
        favoriteTeamAddress: team,
      };

      indexedData.supporters.set(supporterId, {
        ...existing,
        totalPoints: existing.totalPoints + points,
      });

      indexedData.supporterPoints.push({
        id: `${event.transactionHash}-${event.logIndex}`,
        supporterAddress: supporter,
        teamAddress: team,
        pointsAwarded: Number(points),
        timestamp: Date.now(),
        blockNumber: Number(event.blockNumber),
        transactionHash: event.transactionHash,
      });

      // Increment team supporter count
      const teamId = team.toLowerCase();
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
      const { teamA, teamB, amount0In, amount1In } = event.args;

      indexedData.swaps.push({
        id: `${event.transactionHash}-${event.logIndex}`,
        teamAAddress: teamA,
        teamBAddress: teamB,
        amount0In: Number(amount0In),
        amount1In: Number(amount1In),
        timestamp: Date.now(),
        blockNumber: Number(event.blockNumber),
        transactionHash: event.transactionHash,
      });

      // Update team volumes
      const teamAId = teamA.toLowerCase();
      const teamBId = teamB.toLowerCase();

      const teamAData = indexedData.teams.get(teamAId);
      if (teamAData) {
        const currentVolume = BigInt(teamAData.totalVolume24h || "0");
        teamAData.totalVolume24h = (currentVolume + amount0In).toString();
        teamAData.totalSwaps = (teamAData.totalSwaps || 0) + 1;
      }

      const teamBData = indexedData.teams.get(teamBId);
      if (teamBData) {
        const currentVolume = BigInt(teamBData.totalVolume24h || "0");
        teamBData.totalVolume24h = (currentVolume + amount1In).toString();
        teamBData.totalSwaps = (teamBData.totalSwaps || 0) + 1;
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
