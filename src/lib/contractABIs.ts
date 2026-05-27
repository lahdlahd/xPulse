/**
 * Contract ABIs for Frontend Integration
 * 
 * Copy these into src/lib/contractABIs.ts
 * Use with Wagmi for contract interactions
 */

export const FAN_XPULSE_HOOK_ABI = [
  {
    type: "event",
    name: "HookInitialized",
    inputs: [
      { name: "hookAddress", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "SwapExecuted",
    inputs: [
      { name: "teamA", type: "address", indexed: true },
      { name: "teamB", type: "address", indexed: true },
      { name: "amount0In", type: "uint256", indexed: false },
      { name: "amount1In", type: "uint256", indexed: false },
      { name: "amount0Out", type: "uint256", indexed: false },
      { name: "amount1Out", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MomentumChanged",
    inputs: [
      { name: "team", type: "address", indexed: true },
      { name: "oldMomentum", type: "uint256", indexed: false },
      { name: "newMomentum", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "SupporterPointsAwarded",
    inputs: [
      { name: "supporter", type: "address", indexed: true },
      { name: "team", type: "address", indexed: true },
      { name: "points", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "StreakDetected",
    inputs: [
      { name: "supporter", type: "address", indexed: true },
      { name: "team", type: "address", indexed: true },
      { name: "streakCount", type: "uint256", indexed: false },
      { name: "multiplier", type: "uint256", indexed: false }
    ]
  },
  {
    type: "function",
    name: "getMomentum",
    inputs: [{ name: "team", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getSupporterPoints",
    inputs: [{ name: "supporter", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getLeaderboard",
    inputs: [],
    outputs: [
      { name: "teams", type: "address[]" },
      { name: "momentums", type: "uint256[]" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "registerTeam",
    inputs: [
      { name: "teamToken", type: "address" },
      { name: "code", type: "string" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "teamMomentum",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "supporterPoints",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  }
] as const;

export const FAN_TOKEN_ABI = [
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "SwapExecuted",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MomentumUpdated",
    inputs: [
      { name: "newMomentum", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "burn",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "recordSwap",
    inputs: [
      { name: "trader", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOut", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "calculateMomentum",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getStats",
    inputs: [],
    outputs: [
      { name: "_totalSupply", type: "uint256" },
      { name: "_swapCount", type: "uint256" },
      { name: "_totalVolume", type: "uint256" },
      { name: "_momentum", type: "uint256" }
    ],
    stateMutability: "view"
  }
] as const;
