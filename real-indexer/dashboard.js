/**
 * FanXPulse Real-Time Pipeline Dashboard
 * Shows live status of all services and real blockchain data
 */

import http from "http";

const SERVICES = {
  graphql: { url: "http://localhost:4000/graphql", name: "GraphQL Server", port: 4000 },
  listener: { url: "http://localhost:3003/stats", name: "Event Listener", port: 3003 },
  frontend: { url: "http://localhost:3002", name: "Frontend (Next.js)", port: 3002 },
};

async function checkService(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 2000 }, () => {
      resolve(true);
      req.destroy();
    });
    req.on("error", () => resolve(false));
  });
}

async function getGraphQLData() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      query: `{
        indexingStats {
          teams
          momentumChanges
          supporterPoints
          swaps
          supporters
          lastUpdate
        }
      }`,
    });

    const options = {
      hostname: "localhost",
      port: 4000,
      path: "/graphql",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data).data?.indexingStats);
        } catch {
          resolve(null);
        }
      });
    });

    req.on("error", () => resolve(null));
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          FanXPulse Real-Time Pipeline Dashboard            ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  // Service Status
  console.log("🔍 SERVICE STATUS\n");
  for (const [key, service] of Object.entries(SERVICES)) {
    const isRunning = await checkService(service.url);
    const status = isRunning ? "✅ RUNNING" : "❌ OFFLINE";
    console.log(`  ${status}  ${service.name.padEnd(25)} → :${service.port}`);
  }

  // Real Data
  console.log("\n\n📊 REAL-TIME DATA FROM BLOCKCHAIN\n");
  const stats = await getGraphQLData();

  if (stats) {
    console.log(`  Teams Indexed:        ${stats.teams}`);
    console.log(`  Momentum Changes:     ${stats.momentumChanges}`);
    console.log(`  Supporter Points:     ${stats.supporterPoints}`);
    console.log(`  Swaps Tracked:        ${stats.swaps}`);
    console.log(`  Unique Supporters:    ${stats.supporters}`);
    const lastUpdate = new Date(stats.lastUpdate);
    console.log(`  Last Update:          ${lastUpdate.toLocaleTimeString()}`);
  }

  // Data Flow
  console.log("\n\n🔄 DATA FLOW PIPELINE\n");
  console.log("  X Layer Blockchain");
  console.log("         ↓ (SwapExecuted, MomentumChanged events)");
  console.log("  Event Listener (:3003)");
  console.log("         ↓ (REST API with real events)");
  console.log("  GraphQL Server (:4000)");
  console.log("         ↓ (GraphQL queries)");
  console.log("  Frontend Next.js (:3002)");
  console.log("         ↓ (useIndexer hooks)");
  console.log("  Live UI Components");

  // Next Steps
  console.log("\n\n🎯 NEXT STEPS\n");
  console.log("  1. Open http://localhost:3002 in your browser");
  console.log("  2. Navigate to Leaderboard page");
  console.log("  3. See Argentina team with real momentum data");
  console.log("  4. Check Supporters page for real-time rankings");
  console.log("  5. Run: node trigger-swap.js    (to generate more events)");
  console.log("  6. Watch data update live in the UI every 15 seconds!");

  // Commands
  console.log("\n\n💾 RUNNING SERVICES\n");
  console.log("  Terminal 1: Event Listener");
  console.log("    $ node real-indexer/listener.js\n");
  console.log("  Terminal 2: GraphQL Server");
  console.log("    $ node real-indexer/graphql-server.js\n");
  console.log("  Terminal 3: Frontend");
  console.log("    $ npm run dev\n");
  console.log("  Terminal 4: Trigger Swaps");
  console.log("    $ node real-indexer/trigger-swap.js\n");

  // URLs
  console.log("\n📡 ENDPOINT URLS\n");
  console.log("  Frontend:     http://localhost:3002");
  console.log("  GraphQL:      http://localhost:4000/graphql");
  console.log("  REST API:     http://localhost:3003");
  console.log("  Hook Contract: 0x906407592cdAfE2F6DB4cC2710e1F515c416e352\n");

  console.log("════════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
