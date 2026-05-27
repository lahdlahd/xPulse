/**
 * GraphQL Server for FanXPulse
 * Serves team statistics from Ponder indexer
 * Runs on port 4000
 */

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const ALL_TEAMS = [
  'ARG', 'AUS', 'BEL', 'BRA', 'CMR', 'CAN', 'CRC', 'CRO', 'DEN', 'ECU',
  'ENG', 'FRA', 'DEU', 'GHA', 'IRN', 'JPN', 'MEX', 'MOR', 'NED', 'POL',
  'POR', 'QAT', 'KOR', 'SAU', 'SRB', 'SEN', 'ESP', 'SUI', 'TUN', 'USA',
  'URY', 'WAL'
];

// In-memory cache of team data (will be updated by Ponder listener)
const teamDataCache = new Map();

// Initialize cache with zero data for all teams
ALL_TEAMS.forEach(code => {
  teamDataCache.set(code, {
    code,
    momentum: 0,
    supporters: 0,
    volume24h: 0,
  });
});

// GraphQL Schema
const typeDefs = gql`
  type Team {
    code: String!
    momentum: Int!
    supporters: Int!
    volume24h: Float!
  }

  type Query {
    teams: [Team!]!
    team(code: String!): Team
  }
`;

// Resolvers
const resolvers = {
  Query: {
    teams: () => {
      return Array.from(teamDataCache.values());
    },
    team: (_, { code }) => {
      return teamDataCache.get(code);
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    teamDataCache,
  }),
});

console.log(`✅ GraphQL Server running at ${url}`);
console.log(`📊 Serving team statistics from Ponder indexer`);

export { teamDataCache };
