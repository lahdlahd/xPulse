/**
 * @title GraphQL Server for Real-Time Event Indexer
 * @description Wraps the REST API (port 3003) with Apollo GraphQL server
 * Provides GraphQL queries for teams, momentum, supporter points, swaps
 */

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import http from "http";

// GraphQL Schema
const typeDefs = gql`
  type Team {
    id: String!
    address: String!
    currentMomentum: String!
    totalSupporters: Int!
    totalVolume24h: String!
    totalSwaps: Int!
  }

  type MomentumChange {
    id: String!
    teamAddress: String!
    oldMomentum: String!
    newMomentum: String!
    timestamp: String!
    blockNumber: Int!
  }

  type SupporterPoints {
    id: String!
    supporterAddress: String!
    teamAddress: String!
    points: String!
    timestamp: String!
    blockNumber: Int!
  }

  type Swap {
    id: String!
    teamAAddress: String!
    teamBAddress: String!
    amount0In: String!
    amount1In: String!
    amount0Out: String!
    amount1Out: String!
    timestamp: String!
    blockNumber: Int!
  }

  type Supporter {
    address: String!
    totalPoints: String!
    favoriteTeamAddress: String!
  }

  type IndexingStats {
    teams: Int!
    momentumChanges: Int!
    supporterPoints: Int!
    swaps: Int!
    supporters: Int!
    lastUpdate: String!
  }

  type Query {
    # Teams
    teams: [Team!]!
    teamByAddress(address: String!): Team

    # Momentum
    momentumChanges(limit: Int): [MomentumChange!]!
    momentumByTeam(teamAddress: String!): String!

    # Supporters
    supporterPoints(limit: Int): [SupporterPoints!]!
    supporters: [Supporter!]!
    supporterByAddress(address: String!): Supporter

    # Swaps
    swaps(limit: Int): [Swap!]!

    # Stats
    indexingStats: IndexingStats!
  }
`;

// Resolver functions - fetch from REST API on port 3003
const resolvers = {
  Query: {
    teams: async () => {
      try {
        const data = await fetchFromAPI("/teams");
        return data || [];
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
      }
    },

    teamByAddress: async (_, { address }) => {
      try {
        const data = await fetchFromAPI("/teams");
        return data.find((t) => t.address.toLowerCase() === address.toLowerCase());
      } catch (error) {
        console.error("Error fetching team:", error);
        return null;
      }
    },

    momentumChanges: async (_, { limit = 100 }) => {
      try {
        const data = await fetchFromAPI("/momentum-changes");
        return data.slice(-limit) || [];
      } catch (error) {
        console.error("Error fetching momentum changes:", error);
        return [];
      }
    },

    momentumByTeam: async (_, { teamAddress }) => {
      try {
        const data = await fetchFromAPI("/teams");
        const team = data.find((t) => t.address.toLowerCase() === teamAddress.toLowerCase());
        return team ? team.currentMomentum : "0";
      } catch (error) {
        console.error("Error fetching momentum:", error);
        return "0";
      }
    },

    supporterPoints: async (_, { limit = 100 }) => {
      try {
        const data = await fetchFromAPI("/supporter-points");
        return data.slice(-limit) || [];
      } catch (error) {
        console.error("Error fetching supporter points:", error);
        return [];
      }
    },

    supporters: async () => {
      try {
        const data = await fetchFromAPI("/supporters");
        return data || [];
      } catch (error) {
        console.error("Error fetching supporters:", error);
        return [];
      }
    },

    supporterByAddress: async (_, { address }) => {
      try {
        const data = await fetchFromAPI("/supporters");
        return data.find((s) => s.address.toLowerCase() === address.toLowerCase());
      } catch (error) {
        console.error("Error fetching supporter:", error);
        return null;
      }
    },

    swaps: async (_, { limit = 100 }) => {
      try {
        const data = await fetchFromAPI("/swaps");
        return data.slice(-limit) || [];
      } catch (error) {
        console.error("Error fetching swaps:", error);
        return [];
      }
    },

    indexingStats: async () => {
      try {
        const data = await fetchFromAPI("/stats");
        return data;
      } catch (error) {
        console.error("Error fetching stats:", error);
        return {
          teams: 0,
          momentumChanges: 0,
          supporterPoints: 0,
          swaps: 0,
          supporters: 0,
          lastUpdate: new Date().toISOString(),
        };
      }
    },
  },
};

// Helper function to fetch from REST API
function fetchFromAPI(path) {
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

// Start Apollo Server
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = Number(process.env.PORT || process.env.PORT_GRAPHQL || 4000);

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀 GraphQL Server running at ${url}`);
  console.log(`📡 Wrapping real event listener: http://localhost:3003`);
  console.log(`💾 Query endpoint: ${url}graphql`);
}

startServer().catch(console.error);
