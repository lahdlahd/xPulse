import { createPublicClient, createWalletClient, http, parseEther, getAddress, encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// X Layer Testnet
const RPC_URL = "https://testrpc.xlayer.tech";

// Hook contract details (use the deployed one from .env.deployed)
const HOOK_ADDRESS = "0x906407592cdAfE2F6DB4cC2710e1F515c416e352";

// Team token addresses (from .env.deployed)
const TEAM_TOKENS = {
  ARG: "0x167452bAC7bedaFC8d8eEDa356A4096321E79710",
  BRA: "0xe274fd08a09F24f37CbD2A5943B9A7B29503918F",
  ENG: "0x26f6e7dE53De649aFC44D23d0Bb1AC7D6ebEF7c7",
  FRA: "0x4bd3De84141309Ec83d465EE118c29d1Bb7ebD01",
  ESP: "0xdAC9C0Cd103B0d7E65B54c481122751A576e2746",
};

// Minimal Hook ABI - just the afterSwap function
const HOOK_ABI = [
  {
    type: "function",
    name: "afterSwap",
    inputs: [
      { name: "sender", type: "address" },
      { name: "team", type: "address" },
      { name: "amount0In", type: "uint256" },
      { name: "amount1In", type: "uint256" },
      { name: "amount0Out", type: "uint256" },
      { name: "amount1Out", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMomentum",
    inputs: [{ name: "team", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSupporterPoints",
    inputs: [{ name: "supporter", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
];

// Create clients
const publicClient = createPublicClient({
  transport: http(RPC_URL),
});

// Use a test private key (replace with environment variable in production)
const account = privateKeyToAccount(
  "0x8f21d2e65d74e39de87335cd0b2b6a68a73e9200c44f103c598ce063a42556ef"
);

const walletClient = createWalletClient({
  account,
  transport: http(RPC_URL),
});

async function testSwap() {
  console.log("🔄 Triggering a test swap on FanXPulse Hook...");
  console.log(`📍 Caller: ${account.address}`);
  console.log(`🪝 Hook Address: ${HOOK_ADDRESS}`);
  console.log(`🌐 Network: X Layer Testnet\n`);

  try {
    // Get account balance
    const balance = await publicClient.getBalance({
      address: account.address,
    });
    console.log(`💰 Account balance: ${(balance / BigInt(1e18)).toString()} ETH\n`);

    // Use Argentina team for testing
    const teamAddress = TEAM_TOKENS.ARG;
    console.log(`⚽ Using Argentina team: ${teamAddress}\n`);

    // Encode the afterSwap function call
    const callData = encodeFunctionData({
      abi: HOOK_ABI,
      functionName: "afterSwap",
      args: [
        account.address, // sender
        teamAddress, // team
        parseEther("0.1"), // amount0In - 0.1 tokens
        0n, // amount1In
        0n, // amount0Out
        parseEther("0.05"), // amount1Out - 0.05 tokens received
        "0x", // data
      ],
    });

    console.log(`📝 Sending afterSwap transaction...`);
    console.log(`   Team: Argentina (${teamAddress})`);
    console.log(`   Amount In: 0.1`);
    console.log(`   Amount Out: 0.05\n`);

    // Send transaction to call afterSwap
    const hash = await walletClient.sendTransaction({
      to: getAddress(HOOK_ADDRESS),
      data: callData,
    });

    console.log(`✅ Transaction sent!`);
    console.log(`📄 Hash: ${hash}\n`);
    console.log(`⏳ Waiting for confirmation...\n`);

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60_000,
    });

    console.log(`✅ Transaction confirmed!`);
    console.log(`📦 Block: ${receipt.blockNumber}`);
    console.log(`🔗 Status: ${receipt.status === "success" ? "Success" : "Failed"}`);
    console.log(`📋 Logs: ${receipt.logs.length} events\n`);

    if (receipt.logs.length > 0) {
      console.log(`📊 Events emitted:`);
      receipt.logs.forEach((log, i) => {
        console.log(`   ${i + 1}. Topic: ${log.topics[0]}`);
      });
    }

    // Check hook state after swap
    console.log(`\n🔍 Checking Hook state after swap...`);
    try {
      const momentum = await publicClient.readContract({
        address: getAddress(HOOK_ADDRESS),
        abi: HOOK_ABI,
        functionName: "getMomentum",
        args: [teamAddress],
      });
      console.log(`   Team momentum: ${momentum.toString()}`);

      const points = await publicClient.readContract({
        address: getAddress(HOOK_ADDRESS),
        abi: HOOK_ABI,
        functionName: "getSupporterPoints",
        args: [account.address],
      });
      console.log(`   Supporter points: ${points.toString()}`);
    } catch {
      console.log(`   (State reading not available)`);
    }

    console.log(
      `\n✨ Swap triggered! Real event listener should capture events within 30 seconds.`
    );
    console.log(`🔗 Check http://localhost:3003/stats for real-time data.`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.details) {
      console.error("   Details:", error.details);
    }
    console.log(
      "\n💡 Make sure the Hook has proper team registration or adjust team address."
    );
  }
}

testSwap().catch(console.error);
