import { createPublicClient, http, parseAbi } from "viem";

const publicClient = createPublicClient({
  transport: http("https://testrpc.xlayer.tech"),
});

const HOOK_ADDRESS = "0x906407592cdAfE2F6DB4cC2710e1F515c416e352";

// Minimal ABI with event signatures
const HOOK_ABI = parseAbi([
  "event MomentumChanged(address indexed team, uint256 oldMomentum, uint256 newMomentum, uint256 timestamp)",
  "event SupporterPointsAwarded(address indexed supporter, address indexed team, uint256 points, uint256 timestamp)",
]);

async function queryEvents() {
  console.log("🔎 Direct Event Query from Block 31324136\n");

  try {
    // Query MomentumChanged
    console.log("📡 Fetching MomentumChanged events...");
    const momentumEvents = await publicClient.getLogs({
      address: HOOK_ADDRESS,
      events: HOOK_ABI,
      eventName: "MomentumChanged",
      fromBlock: BigInt(31324136),
      toBlock: BigInt(31324136),
    });
    console.log(`   Found: ${momentumEvents.length} events`);
    if (momentumEvents.length > 0) {
      const event = momentumEvents[0];
      console.log(`   Team: ${event.args.team}`);
      console.log(`   Old Momentum: ${event.args.oldMomentum}`);
      console.log(`   New Momentum: ${event.args.newMomentum}`);
      console.log(`   Timestamp: ${event.args.timestamp}`);
    }

    // Query SupporterPointsAwarded
    console.log("\n📡 Fetching SupporterPointsAwarded events...");
    const supporterEvents = await publicClient.getLogs({
      address: HOOK_ADDRESS,
      events: HOOK_ABI,
      eventName: "SupporterPointsAwarded",
      fromBlock: BigInt(31324136),
      toBlock: BigInt(31324136),
    });
    console.log(`   Found: ${supporterEvents.length} events`);
    if (supporterEvents.length > 0) {
      const event = supporterEvents[0];
      console.log(`   Supporter: ${event.args.supporter}`);
      console.log(`   Team: ${event.args.team}`);
      console.log(`   Points: ${event.args.points}`);
      console.log(`   Timestamp: ${event.args.timestamp}`);
    }

    // Generic tab-separated log query
    console.log("\n📡 Fetching all logs from Hook (generic)...");
    const allLogs = await publicClient.getLogs({
      address: HOOK_ADDRESS,
      fromBlock: BigInt(31324136),
      toBlock: BigInt(31324136),
    });
    console.log(`   Found: ${allLogs.length} logs`);
    allLogs.forEach((log, i) => {
      console.log(`\n   Log ${i + 1}:`);
      console.log(`     Topic[0]: ${log.topics[0]}`);
      console.log(`     Data: ${log.data.slice(0, 66)}...`);
      console.log(`     Index: ${log.logIndex}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

queryEvents().catch(console.error);
