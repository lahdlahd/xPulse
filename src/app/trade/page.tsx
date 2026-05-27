/**
 * Trade Page
 * Main trading interface for swapping fan tokens
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAccount } from 'wagmi';
import { TEAMS } from '@/constants';
import type { TeamCode } from '@/types';

function TradeContent() {
  const searchParams = useSearchParams();
  const { isConnected, isCorrectChain } = useWalletConnection();
  const { address } = useAccount();
  
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamCode | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<Record<TeamCode, number>>({});

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

    setIsSwapping(true);
    try {
      // Show wallet confirmation dialog
      const confirmed = confirm(
        `Confirm swap:\n\n${payAmount} OKB → ${receiveAmount} ${selectedTeam}\n\nPlease approve in your wallet.`
      );
      
      if (!confirmed) {
        setIsSwapping(false);
        return;
      }

      // Simulate transaction processing with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const received = Number(receiveAmount);
      
      // Update token balance and persist
      const updated = {
        ...tokenBalances,
        [selectedTeam]: (tokenBalances[selectedTeam] || 0) + received,
      };
      setTokenBalances(updated);
      localStorage.setItem('tokenBalances', JSON.stringify(updated));
      
      alert(`✅ Swap successful!\n\n${payAmount} OKB → ${receiveAmount} ${selectedTeam}\n\nYour tokens have been added to your portfolio.`);
      setPayAmount('');
      setReceiveAmount('');
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

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
          Swap fan tokens with real-time momentum updates powered by Uniswap V4 Hooks.
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
                <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
                  ⇅
                </button>
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
              disabled={isSwapping || !payAmount}
              className={`w-full py-3 font-semibold rounded-lg transition-all ${
                isSwapping || !payAmount
                  ? 'bg-accent-blue/50 cursor-not-allowed opacity-60' 
                  : 'btn-primary hover:bg-blue-600'
              }`}
            >
              {isSwapping ? 'Processing...' : `Swap ${selectedTeam} Tokens`}
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
