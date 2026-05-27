/**
 * Compilation Script for FanXPulse Contracts
 * Compiles Solidity contracts using solc
 */

const solc = require('solc');
const fs = require('fs');
const path = require('path');

function compileContracts() {
  console.log('🔨 Compiling contracts...\n');

  // Read source files
  const swapRecorderSource = fs.readFileSync(path.join(__dirname, 'src/SwapRecorder.sol'), 'utf8');
  const fanTokenSource = fs.readFileSync(path.join(__dirname, 'src/FanToken.sol'), 'utf8');
  const fanXPulseHookSource = fs.readFileSync(path.join(__dirname, 'src/FanXPulseHook.sol'), 'utf8');

  const sources = {
    'SwapRecorder.sol': { content: swapRecorderSource },
    'FanToken.sol': { content: fanTokenSource },
    'FanXPulseHook.sol': { content: fanXPulseHookSource },
  };

  const input = {
    language: 'Solidity',
    sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  // Compile
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === 'error');
    if (errors.length > 0) {
      console.error('❌ Compilation errors:');
      errors.forEach((error) => {
        console.error(`   ${error.sourceLocation.file}: ${error.message}`);
      });
      return false;
    }
  }

  // Create output directory
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Save compiled contracts
  for (const [fileName, file] of Object.entries(output.contracts)) {
    for (const [contractName, contract] of Object.entries(file)) {
      const contractOutDir = path.join(outDir, `${fileName.split('/').pop().replace('.sol', '')}`);
      if (!fs.existsSync(contractOutDir)) {
        fs.mkdirSync(contractOutDir, { recursive: true });
      }

      const contractFile = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode,
        deployedBytecode: contract.evm.deployedBytecode,
      };

      fs.writeFileSync(
        path.join(contractOutDir, `${contractName}.json`),
        JSON.stringify(contractFile, null, 2)
      );

      console.log(`✅ Compiled: ${fileName} -> ${contractName}`);
    }
  }

  console.log('\n✅ All contracts compiled successfully!\n');
  return true;
}

if (require.main === module) {
  const success = compileContracts();
  process.exit(success ? 0 : 1);
}

module.exports = { compileContracts };
