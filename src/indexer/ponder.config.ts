import { createConfig } from "@ponder/core";

export default createConfig({
  networks: {
    // X Layer Testnet
    xlayerTestnet: {
      chainId: 1952,
      rpcUrl: process.env.XLAYER_TESTNET_RPC ?? "https://testrpc.xlayer.tech",
      pollingInterval: 12_000,
    },
    // X Layer Mainnet (for future)
    xlayerMainnet: {
      chainId: 196,
      rpcUrl: process.env.XLAYER_MAINNET_RPC ?? "https://rpc.xlayer.tech",
      pollingInterval: 12_000,
    },
  },

  contracts: {
    // FanXPulseHook Contract
    FanXPulseHook: {
      network: "xlayerTestnet",
      address: process.env.HOOK_ADDRESS ?? "0xc70691c9eE72fe74dCaecD287258816d134C51FC",
      abi: [
        {
          type: "event",
          name: "MomentumChanged",
          inputs: [
            { name: "team", type: "address", indexed: true },
            { name: "oldMomentum", type: "uint256" },
            { name: "newMomentum", type: "uint256" },
            { name: "timestamp", type: "uint256" },
          ],
        },
        {
          type: "event",
          name: "SupporterPointsAwarded",
          inputs: [
            { name: "supporter", type: "address", indexed: true },
            { name: "team", type: "address", indexed: true },
            { name: "points", type: "uint256" },
            { name: "timestamp", type: "uint256" },
          ],
        },
        {
          type: "event",
          name: "SwapExecuted",
          inputs: [
            { name: "teamA", type: "address", indexed: true },
            { name: "teamB", type: "address", indexed: true },
            { name: "amount0In", type: "uint256" },
            { name: "amount1In", type: "uint256" },
            { name: "amount0Out", type: "uint256" },
            { name: "amount1Out", type: "uint256" },
            { name: "timestamp", type: "uint256" },
          ],
        },
      ],
      startBlock: 0,
    },
  },
});
