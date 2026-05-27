import http from "http";

const endpoints = [
  { name: "stats", path: "/stats" },
  { name: "swaps", path: "/swaps" },
  { name: "supporter-points", path: "/supporter-points" },
  { name: "momentum-changes", path: "/momentum-changes" },
];

async function checkEndpoint(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3003${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function main() {
  console.log("🔍 Checking Event Listener Status\n");
  console.log("================================\n");

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Fetching ${endpoint.name}...`);
      const data = await checkEndpoint(endpoint.path);

      if (typeof data === "object") {
        if (endpoint.name === "stats") {
          console.log(`   ✅ Connected!`);
          console.log(`   Teams: ${data.teams}`);
          console.log(`   Momentum Changes: ${data.momentumChanges}`);
          console.log(`   Supporter Points: ${data.supporterPoints}`);
          console.log(`   Swaps: ${data.swaps}`);
          console.log(`   Supporters: ${data.supporters}`);
        } else if (Array.isArray(data)) {
          console.log(`   ✅ Found ${data.length} events`);
          if (data.length > 0) {
            console.log(`   Latest event:`, JSON.stringify(data[0], null, 2));
          }
        } else {
          console.log(`   Data:`, data);
        }
      }
      console.log("");
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log("================================");
  console.log("🎯 Real-time Pipeline Status:");
  console.log("   Listener: http://localhost:3003");
  console.log("   Frontend: http://localhost:3002");
}

main().catch(console.error);
