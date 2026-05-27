import { createConfig } from "@ponder/core";

export default createConfig({
  networks: {
    xlayerTestnet: {
      chainId: 1952,
      rpcUrl: process.env.XLAYER_TESTNET_RPC || "https://testrpc.xlayer.tech",
    },
  },
  contracts: {
    SwapRecorder: {
      network: "xlayerTestnet",
      address: process.env.SWAP_RECORDER_ADDRESS || "0x31A125c28dE06309D84dE7f6A386548e1f7060b8",
      abi: `[
        {
          "type": "event",
          "name": "SwapExecuted",
          "inputs": [
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "teamToken", "type": "address", "indexed": true },
            { "name": "teamCode", "type": "string", "indexed": true },
            { "name": "okbAmount", "type": "uint256", "indexed": false },
            { "name": "tokenAmount", "type": "uint256", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
          ]
        },
        {
          "type": "event",
          "name": "MomentumChanged",
          "inputs": [
            { "name": "teamToken", "type": "address", "indexed": true },
            { "name": "teamCode", "type": "string", "indexed": true },
            { "name": "oldMomentum", "type": "uint256", "indexed": false },
            { "name": "newMomentum", "type": "uint256", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
          ]
        },
        {
          "type": "event",
          "name": "SupporterPointsAwarded",
          "inputs": [
            { "name": "trader", "type": "address", "indexed": true },
            { "name": "teamToken", "type": "address", "indexed": true },
            { "name": "teamCode", "type": "string", "indexed": true },
            { "name": "points", "type": "uint256", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
          ]
        }
      ]`,
      startBlock: 0,
    },
  },
});
