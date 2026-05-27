import { keccak256, toHex } from "viem";

// Event signatures from FanXPulseHook.sol
const eventSignatures = {
  MomentumChanged: "MomentumChanged(address,uint256,uint256,uint256)",
  SupporterPointsAwarded: "SupporterPointsAwarded(address,address,uint256,uint256)",
  SwapExecuted: "SwapExecuted(address,address,uint256,uint256,uint256,uint256,uint256)",
  HookInitialized: "HookInitialized(address,uint256)",
  StreakDetected: "StreakDetected(address,address,uint256,uint256)",
};

const observedTopics = {
  "0xcc8923e8dae41f70e5490321acfccbbab780be453d55c87256fea8152edca433": "Event 1 (MomentumChanged or similar?)",
  "0xa192aa69b4ddfe68815a0f371dd91dce69b5d227fd321c1b2aaa8ddee0009376": "Event 2 (SupporterPointsAwarded or StreakDetected?)",
};

console.log("🔍 Event Signature Analysis\n");
console.log("Expected Event Signatures (calculated Keccak256):");
console.log("================================================\n");

Object.entries(eventSignatures).forEach(([name, signature]) => {
  const topic = keccak256(toHex(signature));
  console.log(`${name}:`);
  console.log(`  Signature: ${signature}`);
  console.log(`  Topic: ${topic}`);

  // Check if this matches any observed topic
  if (observedTopics[topic]) {
    console.log(`  ✅ MATCHES OBSERVED: ${observedTopics[topic]}`);
  }
  console.log("");
});

console.log("\nObserved Topics (from transaction):");
console.log("===================================\n");

Object.entries(observedTopics).forEach(([topic, description]) => {
  console.log(`${topic}`);
  console.log(`  Description: ${description}`);

  // Find matching signature
  let found = false;
  Object.entries(eventSignatures).forEach(([name, sig]) => {
    const calcTopic = keccak256(toHex(sig));
    if (calcTopic === topic) {
      console.log(`  ✅ MATCHES: ${name}`);
      found = true;
    }
  });

  if (!found) {
    console.log(`  ❌ NOT FOUND in expected signatures`);
  }
  console.log("");
});

console.log("\n💡 Action Items:");
console.log("   If observed topics don't match:");
console.log("   1. Check the actual Hook contract ABI");
console.log("   2. Verify event definitions in FanXPulseHook.sol");
console.log("   3. Update listener.js with correct event signatures");
