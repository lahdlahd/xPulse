import http from "http";

async function fetchFromAPI(path) {
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
          reject(new Error(`Failed to parse response from ${path}`));
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
  console.log("Checking REST API response format...\n");

  try {
    const teams = await fetchFromAPI("/teams");
    console.log("Teams response:");
    console.log(JSON.stringify(teams, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
