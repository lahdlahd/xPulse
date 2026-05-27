/**
 * Wagmi Configuration
 * Sets up Web3 wallet connections and blockchain interactions
 */

import { createConfig, http } from 'wagmi';
import { xLayerMainnet, xLayerTestnet } from './chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not work.');
}

export const wagmiConfig = createConfig({
  chains: [xLayerTestnet, xLayerMainnet],
  connectors: [
    injected({
      target: 'metaMask', // Support MetaMask
    }),
    injected({
      target: 'okx', // Support OKX Wallet
    }),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            showQrModal: true,
          }),
        ]
      : []),
  ],
  transports: {
    [xLayerMainnet.id]: http(process.env.NEXT_PUBLIC_X_LAYER_RPC_MAINNET),
    [xLayerTestnet.id]: http(process.env.NEXT_PUBLIC_X_LAYER_RPC_TESTNET),
  },
  multiInjectedProviderDiscovery: true,
});
