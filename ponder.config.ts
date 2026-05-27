import { createConfig } from "@ponder/core";

export default createConfig({
  networks: {
    xlayerTestnet: {
      chainId: 1952,
      rpcUrl: process.env.XLAYER_TESTNET_RPC || "https://testrpc.xlayer.tech",
    },
  },
  contracts: {
    FanXPulseHook: {
      network: "xlayerTestnet",
      address: process.env.HOOK_ADDRESS || "0xc70691c9eE72fe74dCaecD287258816d134C51FC",
      abi: `[
        {
          "type": "event",
          "name": "MomentumChanged",
          "inputs": [
            { "name": "team", "type": "address", "indexed": true },
            { "name": "oldMomentum", "type": "uint256", "indexed": false },
            { "name": "newMomentum", "type": "uint256", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
          ]
        },
        {
          "type": "event",
          "name": "SupporterPointsAwarded",
          "inputs": [
            { "name": "supporter", "type": "address", "indexed": true },
            { "name": "team", "type": "address", "indexed": true },
            { "name": "points", "type": "uint256", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
          ]
        },
        {
          "type": "event",
          "name": "SwapExecuted",
          "inputs": [
            { "name": "teamA", "type": "address", "indexed": true },
            { "name": "teamB", "type": "address", "indexed": true },
            { "name": "amount0In", "type": "uint256", "indexed": false },
            { "name": "amount1In", "type": "uint256", "indexed": false },
            { "name": "amount0Out", "type": "uint256", "indexed": false },
            { "name": "amount1Out", "type": "uint256", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
          ]
        }
      ]`,
    },
  },
});
