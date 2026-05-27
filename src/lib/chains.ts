/**
 * X Layer Network Configuration
 * Supports both mainnet and testnet
 */

import { Chain } from 'viem';

export const xLayerMainnet: Chain = {
  id: 196,
  name: 'X Layer',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.xlayer.tech'],
      webSocket: ['wss://ws.xlayer.tech'],
    },
    public: {
      http: ['https://rpc.xlayer.tech'],
      webSocket: ['wss://ws.xlayer.tech'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer',
    },
  },
  testnet: false,
};

export const xLayerTestnet: Chain = {
  id: 1952,
  name: 'X Layer Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: {
      http: ['https://testrpc.xlayer.tech'],
      webSocket: ['wss://testws.xlayer.tech'],
    },
    public: {
      http: ['https://testrpc.xlayer.tech'],
      webSocket: ['wss://testws.xlayer.tech'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OKLink Testnet',
      url: 'https://www.oklink.com/xlayer-test',
    },
  },
  testnet: true,
};

// Select the appropriate chain based on environment
export const selectedChain = process.env.NODE_ENV === 'production' ? xLayerMainnet : xLayerTestnet;
