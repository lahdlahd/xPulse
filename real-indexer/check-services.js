import http from "http";

const services = [
  { name: "GraphQL Server", url: "http://localhost:4000/graphql", port: 4000 },
  { name: "Event Listener", url: "http://localhost:3003/stats", port: 3003 },
  { name: "Frontend", url: "http://localhost:3002", port: 3002 },
];

async function checkService(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 3000 }, (res) => {
      resolve(true);
      req.destroy();
    });

    req.on("error", () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log("🔍 Checking Service Status\n");

  for (const service of services) {
    const isRunning = await checkService(service.url);
    const status = isRunning ? "✅ RUNNING" : "❌ NOT RUNNING";
    console.log(`${status} - ${service.name} (port ${service.port})`);
  }

  console.log("\n📝 Next Steps:");
  console.log("   1. Open http://localhost:3002 in browser");
  console.log("   2. Check Leaderboard page for Argentina team");
  console.log("   3. Verify momentum and supporter data appears");
  console.log("   4. Watch data update in real-time");
}

main().catch(console.error);
