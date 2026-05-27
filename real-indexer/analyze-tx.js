import { createPublicClient, http } from "viem";

const publicClient = createPublicClient({
  transport: http("https://testrpc.xlayer.tech"),
});

const HOOK_ADDRESS = "0x906407592cdAfE2F6DB4cC2710e1F515c416e352";
const TX_HASH = "0x0ce15ffc4b82da00f58f48b93db10e9adb1112ef5d1989ffa5d1c75485ab0051";

async function analyzeTransaction() {
  console.log("📊 Analyzing Transaction\n");
  console.log(`Hash: ${TX_HASH}`);
  console.log(`Hook: ${HOOK_ADDRESS}\n`);

  try {
    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: TX_HASH,
    });

    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`📋 Total logs: ${receipt.logs.length}\n`);

    if (receipt.logs.length > 0) {
      console.log("💾 Raw Event Logs:");
      receipt.logs.forEach((log, idx) => {
        console.log(`\nEvent ${idx + 1}:`);
        console.log(`  Address: ${log.address}`);
        console.log(`  Topic 0: ${log.topics[0]}`);
        if (log.topics.length > 1) {
          console.log(`  Topics: ${log.topics.length} (${log.topics.map(t => t.slice(0, 10) + "...").join(", ")})`);
        }
        console.log(`  Data: ${log.data.slice(0, 100)}...`);
      });
    }

    // Get the actual transaction
    console.log("\n\n📄 Transaction Details:");
    const tx = await publicClient.getTransaction({
      hash: TX_HASH,
    });
    console.log(`  From: ${tx.from}`);
    console.log(`  To: ${tx.to}`);
    console.log(`  Data: ${tx.input.slice(0, 100)}...`);
    console.log(`  Value: ${tx.value}`);

    console.log(
      "\n💡 The Hook afterSwap() was called, but events may not have emitted if:"
    );
    console.log("   - Team address wasn't registered");
    console.log("   - Event filtering in listener needs adjustment");
    console.log("   - Events exist but topic names don't match ABI");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

analyzeTransaction().catch(console.error);
