import http from "http";

const query = `
  query {
    indexingStats {
      teams
      momentumChanges
      supporterPoints
      swaps
      supporters
      lastUpdate
    }
    teams {
      id
      address
      currentMomentum
      totalSupporters
    }
    momentumChanges(limit: 5) {
      id
      teamAddress
      newMomentum
      timestamp
    }
  }
`;

async function testGraphQL() {
  const postData = JSON.stringify({ query });

  const options = {
    hostname: "localhost",
    port: 4000,
    path: "/graphql",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch {
          reject(new Error("Failed to parse response"));
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log("🔍 Testing GraphQL Endpoint\n");
  console.log("Endpoint: http://localhost:4000/graphql");
  console.log("Backing Store: http://localhost:3003 (REST API)\n");

  try {
    const result = await testGraphQL();

    if (result.errors) {
      console.error("❌ GraphQL Errors:");
      result.errors.forEach((err) => console.error(`   ${err.message}`));
    } else {
      console.log("✅ GraphQL Connection Successful!\n");

      const data = result.data;
      console.log("📊 Indexing Stats:");
      console.log(`   Teams: ${data.indexingStats.teams}`);
      console.log(`   Momentum Changes: ${data.indexingStats.momentumChanges}`);
      console.log(`   Supporter Points: ${data.indexingStats.supporterPoints}`);
      console.log(`   Swaps: ${data.indexingStats.swaps}`);
      console.log(`   Supporters: ${data.indexingStats.supporters}`);
      console.log(`   Last Update: ${data.indexingStats.lastUpdate}\n`);

      if (data.teams.length > 0) {
        console.log(`🏛️  First Team:`);
        console.log(`   Address: ${data.teams[0].address}`);
        console.log(`   Momentum: ${data.teams[0].currentMomentum}`);
      }

      if (data.momentumChanges.length > 0) {
        console.log(
          `\n⚡ Recent Momentum Changes (${data.momentumChanges.length}):`
        );
        data.momentumChanges.forEach((change, i) => {
          console.log(
            `   ${i + 1}. Team: ${change.teamAddress.slice(0, 10)}... → Momentum: ${change.newMomentum}`
          );
        });
      }

      console.log("\n🎯 Frontend is now ready to query:");
      console.log(
        "   new ApolloClient({ uri: 'http://localhost:4000/graphql' })"
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main().catch(console.error);
