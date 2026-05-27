import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema, graphql } from "graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";

const TEAMS = [
  { code: "ARG", momentum: 85, supporters: 1250 },
  { code: "BRA", momentum: 78, supporters: 1180 },
  { code: "ENG", momentum: 72, supporters: 950 },
  { code: "FRA", momentum: 88, supporters: 1320 },
  { code: "ESP", momentum: 65, supporters: 780 },
  { code: "AUS", momentum: 45, supporters: 420 },
  { code: "CAN", momentum: 38, supporters: 310 },
  { code: "CHI", momentum: 52, supporters: 580 },
  { code: "COL", momentum: 48, supporters: 490 },
  { code: "CRC", momentum: 35, supporters: 220 },
  { code: "CRO", momentum: 68, supporters: 820 },
  { code: "DEN", momentum: 55, supporters: 640 },
  { code: "ECU", momentum: 42, supporters: 350 },
  { code: "EGY", momentum: 38, supporters: 280 },
  { code: "GER", momentum: 82, supporters: 1150 },
  { code: "GHA", momentum: 40, supporters: 320 },
  { code: "JPN", momentum: 58, supporters: 720 },
  { code: "KOR", momentum: 61, supporters: 850 },
  { code: "MEX", momentum: 44, supporters: 410 },
  { code: "MAR", momentum: 70, supporters: 920 },
  { code: "NED", momentum: 75, supporters: 1020 },
  { code: "POL", momentum: 50, supporters: 540 },
  { code: "POR", momentum: 64, supporters: 780 },
  { code: "RUS", momentum: 35, supporters: 180 },
  { code: "SEN", momentum: 43, supporters: 380 },
  { code: "SRB", momentum: 56, supporters: 620 },
  { code: "SUI", momentum: 66, supporters: 820 },
  { code: "TUN", momentum: 41, supporters: 310 },
  { code: "URY", momentum: 59, supporters: 710 },
  { code: "USA", momentum: 54, supporters: 680 },
  { code: "WAL", momentum: 47, supporters: 450 },
  { code: "IRN", momentum: 39, supporters: 290 },
];

// Team Type
const TeamType = new GraphQLObjectType({
  name: "Team",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    teamCode: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    currentMomentum: { type: new GraphQLNonNull(GraphQLInt) },
    totalSwaps: { type: new GraphQLNonNull(GraphQLString) },
    totalVolume24h: { type: new GraphQLNonNull(GraphQLString) },
    totalSupporters: { type: new GraphQLNonNull(GraphQLInt) },
    priceChange24h: { type: new GraphQLNonNull(GraphQLString) },
    lastUpdated: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Query Type
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    teams: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeamType))),
      args: { limit: { type: GraphQLInt } },
      resolve: (_, { limit = 32 }) => {
        return TEAMS.slice(0, limit).map((team, idx) => ({
          id: `0x${idx.toString().padStart(40, "0")}`,
          teamCode: team.code,
          address: `0x${(idx + 1000).toString().padStart(40, "0")}`,
          currentMomentum: team.momentum,
          totalSwaps: Math.floor(Math.random() * 1000).toString(),
          totalVolume24h: Math.floor(Math.random() * 1000000).toString(),
          totalSupporters: team.supporters,
          priceChange24h: (Math.random() * 20 - 10).toFixed(2),
          lastUpdated: Date.now().toString(),
          createdAt: (Date.now() - 86400000).toString(),
        }));
      },
    },
    team: {
      type: TeamType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (_, { id }) => {
        const idx = parseInt(id.slice(2), 16);
        if (idx >= TEAMS.length) return null;
        const team = TEAMS[idx];
        return {
          id,
          teamCode: team.code,
          address: `0x${(idx + 1000).toString().padStart(40, "0")}`,
          currentMomentum: team.momentum,
          totalSwaps: Math.floor(Math.random() * 1000).toString(),
          totalVolume24h: Math.floor(Math.random() * 1000000).toString(),
          totalSupporters: team.supporters,
          priceChange24h: (Math.random() * 20 - 10).toFixed(2),
          lastUpdated: Date.now().toString(),
          createdAt: (Date.now() - 86400000).toString(),
        };
      },
    },
  },
});

// Schema
const schema = new GraphQLSchema({ query: QueryType });

// Express app
const app = express();
app.use(express.json());

// GraphQL endpoint with playground using createHandler
app.use(
  "/graphql",
  createHandler({
    schema,
    rootValue: {},
  })
);

// Root endpoint info
app.get("/", (req, res) => {
  res.json({
    status: "✅ Mock Indexer Running",
    graphql: "http://localhost:42069/graphql",
    playground: "Visit http://localhost:42069/graphql in browser for GraphQL playground",
  });
});

const port = 42069;
app.listen(port, () => {
  console.log(`✅ Mock Indexer running on http://localhost:${port}/graphql`);
  console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log("📊 Ready to serve GraphQL queries!");
});

