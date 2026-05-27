/**
 * Deployment Script for FanXPulse Contracts
 * Deploys SwapRecorder and all 32 FanToken contracts to X Layer Testnet
 * 
 * Usage: node deploy.js
 * Environment: Private key should be in .env as PRIVATE_KEY
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Contract ABIs
const SWAP_RECORDER_ABI = [
  "constructor()",
  "function registerTeam(address teamToken, string memory teamCode) external",
  "event TeamRegistered(address indexed teamToken, string indexed teamCode, uint256 timestamp)",
];

const FAN_TOKEN_ABI = [
  "constructor(string memory _name, string memory _symbol, string memory _teamCode, uint256 initialSupply)",
  "function setMinter(address _minter) external",
  "function mint(address to, uint256 amount) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

// Bytecodes - these would come from compilation
// For now, we'll read them from compiled artifacts or use a simpler approach

const RPC_URL = 'https://testrpc.xlayer.tech';
const CHAIN_ID = 1952;

const TEAM_CONFIGS = [
  { name: "Argentina Fans", symbol: "ARG", code: "ARG", supply: 1000000 },
  { name: "Australia Fans", symbol: "AUS", code: "AUS", supply: 1000000 },
  { name: "Belgium Fans", symbol: "BEL", code: "BEL", supply: 1000000 },
  { name: "Brazil Fans", symbol: "BRA", code: "BRA", supply: 1000000 },
  { name: "Cameroon Fans", symbol: "CMR", code: "CMR", supply: 1000000 },
  { name: "Canada Fans", symbol: "CAN", code: "CAN", supply: 1000000 },
  { name: "Costa Rica Fans", symbol: "CRC", code: "CRC", supply: 1000000 },
  { name: "Croatia Fans", symbol: "CRO", code: "CRO", supply: 1000000 },
  { name: "Denmark Fans", symbol: "DEN", code: "DEN", supply: 1000000 },
  { name: "Ecuador Fans", symbol: "ECU", code: "ECU", supply: 1000000 },
  { name: "England Fans", symbol: "ENG", code: "ENG", supply: 1000000 },
  { name: "France Fans", symbol: "FRA", code: "FRA", supply: 1000000 },
  { name: "Germany Fans", symbol: "DEU", code: "DEU", supply: 1000000 },
  { name: "Ghana Fans", symbol: "GHA", code: "GHA", supply: 1000000 },
  { name: "Iran Fans", symbol: "IRN", code: "IRN", supply: 1000000 },
  { name: "Japan Fans", symbol: "JPN", code: "JPN", supply: 1000000 },
  { name: "Mexico Fans", symbol: "MEX", code: "MEX", supply: 1000000 },
  { name: "Morocco Fans", symbol: "MOR", code: "MOR", supply: 1000000 },
  { name: "Netherlands Fans", symbol: "NED", code: "NED", supply: 1000000 },
  { name: "Poland Fans", symbol: "POL", code: "POL", supply: 1000000 },
  { name: "Portugal Fans", symbol: "POR", code: "POR", supply: 1000000 },
  { name: "Qatar Fans", symbol: "QAT", code: "QAT", supply: 1000000 },
  { name: "South Korea Fans", symbol: "KOR", code: "KOR", supply: 1000000 },
  { name: "Saudi Arabia Fans", symbol: "SAU", code: "SAU", supply: 1000000 },
  { name: "Serbia Fans", symbol: "SRB", code: "SRB", supply: 1000000 },
  { name: "Senegal Fans", symbol: "SEN", code: "SEN", supply: 1000000 },
  { name: "Spain Fans", symbol: "ESP", code: "ESP", supply: 1000000 },
  { name: "Switzerland Fans", symbol: "SUI", code: "SUI", supply: 1000000 },
  { name: "Tunisia Fans", symbol: "TUN", code: "TUN", supply: 1000000 },
  { name: "USA Fans", symbol: "USA", code: "USA", supply: 1000000 },
  { name: "Uruguay Fans", symbol: "URY", code: "URY", supply: 1000000 },
  { name: "Wales Fans", symbol: "WAL", code: "WAL", supply: 1000000 },
];

async function deploy(privateKey) {
  console.log('🚀 Starting deployment to X Layer Testnet (1952)...\n');

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
  const signer = new ethers.Wallet(privateKey, provider);
  
  console.log(`📝 Deploying from: ${signer.address}`);
  
  // Get balance
  const balance = await provider.getBalance(signer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} OKB\n`);

  if (balance === 0n) {
    console.error('❌ ERROR: Account has no OKB balance. Please fund it first.');
    return;
  }

  const deploymentLog = {
    timestamp: new Date().toISOString(),
    deployer: signer.address,
    chainId: CHAIN_ID,
    contracts: {
      swapRecorder: null,
      fanTokens: {},
    },
  };

  try {
    // Read compiled contract files (use Foundry artifacts from out/)
    const swapRecorderPath = path.join(__dirname, 'out/SwapRecorder/SwapRecorder.json');
    const fanTokenPath = path.join(__dirname, 'out/FanToken/FanToken.json');

    if (!fs.existsSync(swapRecorderPath) || !fs.existsSync(fanTokenPath)) {
      console.error('❌ ERROR: Contract artifacts not found. Run: forge build');
      console.error(`   Looking for: ${swapRecorderPath}`);
      console.error(`   Looking for: ${fanTokenPath}`);
      return;
    }

    const swapRecorderArtifact = JSON.parse(fs.readFileSync(swapRecorderPath, 'utf8'));
    const fanTokenArtifact = JSON.parse(fs.readFileSync(fanTokenPath, 'utf8'));

    console.log('✅ Contract artifacts loaded\n');

    // Deploy SwapRecorder
    console.log('📦 Deploying SwapRecorder...');
    const swapRecorderFactory = new ethers.ContractFactory(
      swapRecorderArtifact.abi,
      swapRecorderArtifact.bytecode.object,
      signer
    );
    const swapRecorder = await swapRecorderFactory.deploy();
    await swapRecorder.waitForDeployment();
    const swapRecorderAddr = await swapRecorder.getAddress();
    console.log(`✅ SwapRecorder deployed: ${swapRecorderAddr}\n`);
    deploymentLog.contracts.swapRecorder = swapRecorderAddr;

    // Deploy FanTokens
    console.log(`📦 Deploying ${TEAM_CONFIGS.length} FanToken contracts...\n`);
    
    for (let i = 0; i < TEAM_CONFIGS.length; i++) {
      const team = TEAM_CONFIGS[i];
      const fanTokenFactory = new ethers.ContractFactory(
        fanTokenArtifact.abi,
        fanTokenArtifact.bytecode.object,
        signer
      );

      const fanToken = await fanTokenFactory.deploy(
        team.name,
        team.symbol,
        team.code,
        team.supply
      );
      await fanToken.waitForDeployment();
      const tokenAddr = await fanToken.getAddress();
      
      deploymentLog.contracts.fanTokens[team.code] = tokenAddr;
      
      console.log(`  ✅ [${i + 1}/${TEAM_CONFIGS.length}] ${team.code}: ${tokenAddr}`);

      // Set SwapRecorder as minter
      const tx = await fanToken.setMinter(swapRecorderAddr);
      await tx.wait();
      
      // Register team with SwapRecorder
      const registerTx = await swapRecorder.registerTeam(tokenAddr, team.code);
      await registerTx.wait();
    }

    console.log('\n✅ All contracts deployed and configured!\n');

    // Save deployment log
    const logPath = path.join(__dirname, 'deployment-log.json');
    fs.writeFileSync(logPath, JSON.stringify(deploymentLog, null, 2));
    console.log(`📋 Deployment log saved to: ${logPath}\n`);

    // Generate .env snippet
    const envSnippet = generateEnvSnippet(deploymentLog);
    console.log('📝 Add these to your .env.local:\n');
    console.log(envSnippet);

    return deploymentLog;

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    if (error.data) {
      console.error('   Error data:', error.data);
    }
    throw error;
  }
}

function generateEnvSnippet(log) {
  let snippet = `# SwapRecorder Deployment (${new Date().toLocaleDateString()})\n`;
  snippet += `NEXT_PUBLIC_SWAP_RECORDER_ADDRESS=${log.contracts.swapRecorder}\n\n`;
  snippet += `# Fan Token Addresses\n`;
  
  for (const [code, address] of Object.entries(log.contracts.fanTokens)) {
    snippet += `NEXT_PUBLIC_${code}_TOKEN_ADDRESS=${address}\n`;
  }
  
  return snippet;
}

// Main execution
const privateKey = process.argv[2] || process.env.PRIVATE_KEY;

if (!privateKey) {
  console.error('❌ Error: Private key required');
  console.error('Usage: node deploy.js <privateKey>');
  console.error('Or set PRIVATE_KEY environment variable');
  process.exit(1);
}

deploy(privateKey).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
