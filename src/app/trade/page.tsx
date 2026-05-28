/**
 * Trade Page
 * Main trading interface for swapping fan tokens
 */

'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { TEAMS } from '@/constants';
import { getTeamTokenAddress } from '@/lib/teamTokens';
import type { TeamCode } from '@/types';

const SWAP_RECORDER_ABI = [
  {
    type: 'function',
    name: 'swap',
    stateMutability: 'payable',
    inputs: [{ name: 'teamToken', type: 'address' }],
    outputs: [],
  },
] as const;

function TradeContent() {
  const searchParams = useSearchParams();
  const { isConnected, isCorrectChain } = useWalletConnection();
  const { address } = useAccount();
  const { sendTransaction, isPending, data: txHash } = useSendTransaction();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });
  
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamCode | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [tokenBalances, setTokenBalances] = useState<Record<TeamCode, number>>({});
  const processedTxHashRef = useRef<`0x${string}` | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const teamParam = searchParams.get('team') as TeamCode;
    if (teamParam && TEAMS[teamParam]) {
      setSelectedTeam(teamParam);
    }
    
    // Load token balances from localStorage
    const saved = localStorage.getItem('tokenBalances');
    if (saved) {
      setTokenBalances(JSON.parse(saved));
    }
  }, [searchParams]);

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPayAmount(value);
    
    if (value && !isNaN(Number(value))) {
      const received = (Number(value) * 1.5).toFixed(6);
      setReceiveAmount(received);
    } else {
      setReceiveAmount('');
    }
  };

  const handleSwap = async () => {
    if (!selectedTeam || !payAmount || Number(payAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const swapRecorderAddress = (process.env.NEXT_PUBLIC_SWAP_RECORDER_ADDRESS || '') as `0x${string}`;
      
      if (!swapRecorderAddress || swapRecorderAddress === '') {
        alert('SwapRecorder contract not configured. Deploy contracts first.');
        return;
      }

      // Get team token address
      const teamTokenAddress = getTeamTokenAddress(selectedTeam);
      
      if (!teamTokenAddress || teamTokenAddress === '0x') {
        alert(`Token address for ${selectedTeam} not configured`);
        return;
      }

      // Convert OKB amount to wei (1 OKB = 1e18 wei)
      const amountInWei = BigInt(Math.floor(Number(payAmount) * 1e18)).toString();

      const encodedData = encodeFunctionData({
        abi: SWAP_RECORDER_ABI,
        functionName: 'swap',
        args: [teamTokenAddress],
      });

      sendTransaction({
        to: swapRecorderAddress,
        value: BigInt(amountInWei),
        data: encodedData,
      });

    } catch (error) {
      console.error('Swap error:', error);
      alert('Failed to initiate swap. Please try again.');
    }
  };

  // Monitor transaction confirmation
  useEffect(() => {
    if (!txHash || isConfirming || !selectedTeam) {
      return;
    }

    if (processedTxHashRef.current === txHash) {
      return;
    }

    processedTxHashRef.current = txHash;

    const received = Number(receiveAmount);

    setTokenBalances((currentBalances) => {
      const updated = {
        ...currentBalances,
        [selectedTeam]: (currentBalances[selectedTeam] || 0) + received,
      };
      localStorage.setItem('tokenBalances', JSON.stringify(updated));
      return updated;
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fanxpulse:notify', {
        detail: {
          message: `✅ Swap successful! Tx: ${txHash} | ${payAmount} OKB → ${receiveAmount} ${selectedTeam}`,
          type: 'success',
        },
      }));
    }

    // Notify other parts of the app (teams/leaderboard) to refresh on-chain stats
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fanxpulse:swap', { detail: { team: selectedTeam, tx: txHash } }));
      }
    } catch (e) {
      // ignore
    }

    setPayAmount('');
    setReceiveAmount('');
  }, [txHash, isConfirming, selectedTeam, receiveAmount, payAmount]);

  if (!isMounted) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const team = selectedTeam ? TEAMS[selectedTeam] : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          {selectedTeam ? `Trade ${selectedTeam}` : 'Trade Fan Tokens'}
        </h1>
        <p className="text-slate-400">
          Swap fan tokens with real-time momentum updates recorded on the blockchain.
        </p>
      </div>

      {!isConnected ? (
        <div className="card bg-blue-900/30 border-accent-blue text-center py-12">
          <p className="text-slate-300 mb-4">Connect your wallet to start trading.</p>
        </div>
      ) : !isCorrectChain ? (
        <div className="card bg-red-900/30 border-accent-red text-center py-12">
          <p className="text-slate-300">Please switch to X Layer network to trade.</p>
        </div>
      ) : selectedTeam && team ? (
        <div className="max-w-2xl">
          {/* Trading Interface */}
          <div className="card space-y-6">
            <div className="pb-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{team.name} Token</h2>
              <p className="text-slate-400">Code: {selectedTeam}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 block mb-2">You Pay (OKB)</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={payAmount}
                  onChange={handlePayAmountChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-slate-700/60 text-slate-400 cursor-default" aria-hidden="true">
                  ⇅
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-2">You Receive ({selectedTeam})</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={receiveAmount}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue"
                  disabled
                />
              </div>
            </div>

            <button 
              onClick={handleSwap}
              disabled={isPending || isConfirming || !payAmount}
              className={`w-full py-3 font-semibold rounded-lg transition-all ${
                isPending || isConfirming || !payAmount
                  ? 'bg-accent-blue/50 cursor-not-allowed opacity-60' 
                  : 'btn-primary hover:bg-blue-600'
              }`}
            >
              {isPending ? 'Sign in Wallet...' : isConfirming ? 'Confirming...' : `Swap ${selectedTeam} Tokens`}
            </button>

            {/* Swap Details */}
            <div className="card space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-slate-100">Swap Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Price Impact</span>
                  <span>0.12%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Liquidity Available</span>
                  <span>High</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Network</span>
                  <span>X Layer Testnet</span>
                </div>
                <div className="pt-3 border-t border-slate-700 mt-3">
                  <p className="text-slate-300 text-xs">
                    💡 Each swap triggers a Uniswap V4 Hook that updates team momentum!
                  </p>
                </div>
              </div>
            </div>

            {/* Token Portfolio */}
            <div className="card space-y-4 bg-gradient-to-br from-slate-800 to-slate-900 border-accent-emerald/30">
              <h3 className="text-lg font-semibold text-accent-emerald">Your Portfolio</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(tokenBalances).length === 0 ? (
                  <p className="text-slate-400">No tokens yet. Start swapping!</p>
                ) : (
                  Object.entries(tokenBalances).map(([code, balance]) => {
                    if (balance <= 0) return null;
                    const tokenTeam = TEAMS[code as TeamCode];
                    return (
                      <div key={code} className="flex justify-between items-center p-2 rounded bg-slate-700/30">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tokenTeam.flagEmoji}</span>
                          <span className="text-slate-300 font-semibold">{code}</span>
                        </div>
                        <span className="text-accent-emerald font-semibold">{balance.toFixed(6)}</span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Your token balances update immediately after each successful swap.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card bg-amber-900/30 border-accent-orange text-center py-12 space-y-4">
          <p className="text-slate-300">Select a team to start trading or use the Teams page.</p>
          <a href="/teams" className="inline-block btn-primary">
            View All Teams
          </a>
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading trade page...</div>}>
      <TradeContent />
    </Suspense>
  );
}
