# FanXPulse PHASE 2: Smart Contracts

## Overview

PHASE 2 implements the **core product feature**: a Uniswap V4 Hook that updates team momentum, supporter points, and leaderboard rankings on every swap.

**Key Components:**
- **FanToken.sol** - ERC20 fan tokens for each World Cup team
- **FanXPulseHook.sol** - Uniswap V4 Hook (the heart of the system)
- **Deploy.s.sol** - Foundry deployment script

## Architecture

### FanToken (ERC20)
Each team has its own ERC20 token that traders can buy/sell:
- **Teams**: ARG, BRA, ENG, FRA, ESP
- **Initial Supply**: 1,000,000 per team
- **Tracks**: swap count, total volume, momentum calculation

```solidity
// Record a swap (called by Hook)
token.recordSwap(trader, amountIn, amountOut);

// Get current momentum
uint256 momentum = token.calculateMomentum();
```

### FanXPulseHook (Core Product)
The hook triggers on **every swap** to:

1. **Update Momentum** (Team Leaderboard)
   - Base: 1 momentum per swap
   - Multiplier: 1.5x for consecutive buys
   - Boost: 2.5x for high-velocity trading (>10 transactions/hour)

2. **Award Supporter Points**
   - Base: 10 points per swap
   - Hold Bonus: +1 point per hour holding
   - Amount Bonus: Proportional to swap size

3. **Detect Streaks**
   - Consecutive buy streaks earn bonus multipliers
   - Tracked per supporter per team

4. **Emit Events**
   - Every hook execution emits indexed events
   - Events are consumed by Ponder indexer (Phase 4)
   - Real-time leaderboard updates

```solidity
// Hook events
event MomentumChanged(address team, uint256 oldMomentum, uint256 newMomentum);
event SupporterPointsAwarded(address supporter, address team, uint256 points);
event StreakDetected(address supporter, address team, uint256 streakCount);
```

## Deployment on X Layer

### Setup (First Time)

1. **Install Foundry:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Test Compilation:**
   ```bash
   cd contracts
   forge build
   ```

3. **Set Environment Variables:**
   ```bash
   # .env file
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_oklink_api_key
   ```

### Deploy to X Layer Testnet (Chain ID 195)

```bash
cd contracts

# Compile contracts
forge build

# Deploy to testnet
forge script script/Deploy.s.sol \
  --rpc-url https://testrpc.xlayer.tech \
  --private-key $PRIVATE_KEY \
  --broadcast

# Verify on OKLink (optional)
forge verify-contract <contract_address> \
  --chain xlayer_testnet \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  FanXPulseHook
```

### Expected Deployment Output
```
Deploying:
  - FanXPulseHook: 0x...
  - FanToken[ARG]: 0x...
  - FanToken[BRA]: 0x...
  - FanToken[ENG]: 0x...
  - FanToken[FRA]: 0x...
  - FanToken[ESP]: 0x...

Total Gas: ~X,XXX,XXX
```

## Contract Addresses (After Deployment)

Update your frontend environment variables:

```env
# .env.local (frontend)
NEXT_PUBLIC_HOOK_ADDRESS=            # After deployment
NEXT_PUBLIC_ARG_TOKEN_ADDRESS=      # After deployment
NEXT_PUBLIC_BRA_TOKEN_ADDRESS=      # After deployment
NEXT_PUBLIC_ENG_TOKEN_ADDRESS=      # After deployment
NEXT_PUBLIC_FRA_TOKEN_ADDRESS=      # After deployment
NEXT_PUBLIC_ESP_TOKEN_ADDRESS=      # After deployment
```

## Hook Integration with Frontend

### Reading Hook Data

```typescript
// src/lib/hookClient.ts
import { useContractRead } from 'wagmi';

// Get team momentum
const { data: momentum } = useContractRead({
  address: HOOK_ADDRESS,
  abi: FAN_XPULSE_HOOK_ABI,
  functionName: 'getMomentum',
  args: [teamAddress],
});

// Get supporter points
const { data: points } = useContractRead({
  address: HOOK_ADDRESS,
  abi: FAN_XPULSE_HOOK_ABI,
  functionName: 'getSupporterPoints',
  args: [userAddress],
});

// Get leaderboard
const { data: leaderboard } = useContractRead({
  address: HOOK_ADDRESS,
  abi: FAN_XPULSE_HOOK_ABI,
  functionName: 'getLeaderboard',
});
```

### Listening to Hook Events

```typescript
// Listen to MomentumChanged events for live updates
const momentum$ = watchContractEvent({
  address: HOOK_ADDRESS,
  abi: FAN_XPULSE_HOOK_ABI,
  eventName: 'MomentumChanged',
  onLogs: (logs) => {
    logs.forEach(log => {
      console.log(`${log.team} momentum: ${log.newMomentum}`);
      // Update leaderboard UI in real-time
    });
  },
});
```

## Testing

### Local Testing with Anvil

```bash
cd contracts

# Start local chain
anvil --chain-id 195 --fork-url https://testrpc.xlayer.tech

# In another terminal, deploy to local
forge script script/Deploy.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast

# Run tests
forge test
```

### Test Scenarios

1. **Token Deployment**
   - [x] All 5 team tokens deployed
   - [x] Token balances correct
   - [x] Team registration successful

2. **Hook Momentum**
   - [ ] Momentum increases on swap
   - [ ] Consecutive buy multiplier applied
   - [ ] High velocity boost triggered

3. **Supporter Points**
   - [ ] Base points awarded (10 per swap)
   - [ ] Hold bonus calculated correctly
   - [ ] Amount bonus proportional to swap size

4. **Events**
   - [ ] MomentumChanged emitted
   - [ ] SupporterPointsAwarded emitted
   - [ ] StreakDetected emitted

## Solidity Standards

- **Compiler**: 0.8.26
- **Optimization**: 200 runs
- **License**: MIT
- **EVM Version**: Latest (Shanghai)

## Phase 2 Checklist

- [x] Foundry configuration (foundry.toml)
- [x] FanToken.sol contract
- [x] FanXPulseHook.sol contract  
- [x] Deploy.s.sol script
- [ ] Deploy to X Layer Testnet
- [ ] Verify contracts on OKLink
- [ ] Generate contract ABIs for frontend
- [ ] Create hook client library
- [ ] Integrate with frontend Wagmi setup

## Next: Phase 3

Once deployed to testnet:
1. Generate contract ABIs
2. Update frontend environment variables
3. Create Wagmi hooks for contract interaction
4. Implement trading interface (Phase 5)
5. Setup Ponder indexer (Phase 4)

## Resources

- **Foundry Docs**: https://book.getfoundry.sh
- **Solidity Docs**: https://docs.soliditylang.org
- **Uniswap V4**: https://docs.uniswap.org/contracts/v4
- **X Layer**: https://xlayer.okx.com/developer
