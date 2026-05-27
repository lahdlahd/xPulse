#!/usr/bin/env node

/**
 * Full End-to-End Test Suite
 * Tests all pages and data flows for PHASE 5 completion
 */

const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function request(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function testRESTAPI() {
  log('\n📡 Testing REST API (Port 3003)', 'cyan');
  try {
    const result = await request({
      hostname: 'localhost',
      port: 3003,
      path: '/stats',
      method: 'GET',
    });

    if (result.status === 200) {
      log('✅ REST API /stats working', 'green');
      log(`   Total teams: ${result.data.totalTeams || 0}`, 'green');
      log(`   Total momentum changes: ${result.data.totalMomentumChanges || 0}`, 'green');
      return true;
    } else {
      log(`❌ REST API error: ${result.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ REST API connection failed: ${error.message}`, 'red');
    return false;
  }
}

async function testGraphQL() {
  log('\n📊 Testing GraphQL API (Port 4000)', 'cyan');
  try {
    const query = `
      query {
        teams {
          id
          address
          currentMomentum
          totalSupporters
          totalVolume24h
          totalSwaps
        }
      }
    `;

    const result = await request({
      hostname: 'localhost',
      port: 4000,
      path: '/graphql',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { query },
    });

    if (result.status === 200 && result.data.data?.teams) {
      log('✅ GraphQL teams query working', 'green');
      const teams = result.data.data.teams;
      log(`   Teams returned: ${teams.length}`, 'green');
      if (teams.length > 0) {
        const firstTeam = teams[0];
        log(
          `   Sample: ${firstTeam.id} - Momentum: ${firstTeam.currentMomentum}, Supporters: ${firstTeam.totalSupporters}`,
          'green'
        );
      }
      return true;
    } else {
      log(`❌ GraphQL query failed: ${result.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ GraphQL connection failed: ${error.message}`, 'red');
    return false;
  }
}

async function testMomentumChanges() {
  log('\n📈 Testing Momentum Changes Query', 'cyan');
  try {
    const query = `
      query {
        momentumChanges(first: 10) {
          teamId
          oldMomentum
          newMomentum
          timestamp
        }
      }
    `;

    const result = await request({
      hostname: 'localhost',
      port: 4000,
      path: '/graphql',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { query },
    });

    if (result.status === 200 && result.data.data?.momentumChanges) {
      const changes = result.data.data.momentumChanges;
      log('✅ Momentum changes query working', 'green');
      log(`   Total changes: ${changes.length}`, 'green');
      if (changes.length > 0) {
        const firstChange = changes[0];
        log(
          `   Sample: ${firstChange.teamId} - ${firstChange.oldMomentum}% → ${firstChange.newMomentum}%`,
          'green'
        );
      }
      return true;
    } else {
      log(`❌ Momentum changes query failed`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Momentum changes test failed: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('   XPULSE - PHASE 5 END-TO-END TEST SUITE', 'blue');
  log('='.repeat(60), 'blue');

  const tests = [
    { name: 'REST API', fn: testRESTAPI },
    { name: 'GraphQL Teams', fn: testGraphQL },
    { name: 'Momentum Changes', fn: testMomentumChanges },
  ];

  const results = [];
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push(result);
    } catch (error) {
      log(`\n❌ Test ${test.name} crashed: ${error.message}`, 'red');
      results.push(false);
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  const passed = results.filter(Boolean).length;
  const total = results.length;

  if (passed === total) {
    log(`✅ ALL TESTS PASSED (${passed}/${total})`, 'green');
    log(`\n🚀 Ready to test frontend at http://localhost:3000`, 'green');
    log(`   - Visit /teams to see Team Grid`, 'green');
    log(`   - Visit /trade to see Trading Interface`, 'green');
    log(`   - Visit /leaderboard to see Live Rankings`, 'green');
    log(`   - Visit /momentum to see Momentum Tracker`, 'green');
  } else {
    log(`⚠️  TESTS FAILED (${passed}/${total})`, 'yellow');
    log(`\n❌ Services not running. Start them with:`, 'red');
    log(`   1. Terminal 1: cd real-indexer && node listener.js`, 'yellow');
    log(`   2. Terminal 2: cd real-indexer && node graphql-server.js`, 'yellow');
    log(`   3. Terminal 3: cd xPulse && npm run dev`, 'yellow');
  }

  log('='.repeat(60) + '\n', 'blue');
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
