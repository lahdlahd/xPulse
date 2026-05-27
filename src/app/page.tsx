/**
 * Home Page
 * Landing page with hero, teams overview, and getting started
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { APP_CONFIG } from '@/constants';
import HeroSection from '@/components/features/HeroSection';
import TeamsGrid from '@/components/features/TeamsGrid';

export default function Home() {
  const { isConnected, isCorrectChain } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Status Alert */}
      {isMounted && !isConnected && (
        <div className="bg-blue-900/30 border border-accent-blue rounded-xl p-6 text-center">
          <p className="text-slate-200 mb-4">
            Connect your wallet to start trading and earn supporter points!
          </p>
        </div>
      )}

      {isMounted && isConnected && !isCorrectChain && (
        <div className="bg-red-900/30 border border-accent-red rounded-xl p-6 text-center">
          <p className="text-slate-200">
            Please switch to X Layer network to continue trading.
          </p>
        </div>
      )}

      {/* Teams Section */}
      {isMounted && isConnected && isCorrectChain && (
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">World Cup Teams</h2>
            <p className="text-slate-400">
              Choose your favorite team and start trading their fan tokens
            </p>
          </div>
          <TeamsGrid />
        </section>
      )}

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">
          Why FanXPulse?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      {isConnected && isCorrectChain && (
        <section className="py-12 text-center">
          <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-gold/20 border-accent-blue">
            <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Trade?</h3>
            <p className="text-slate-300 mb-6">
              Start trading fan tokens and climb the leaderboard to become the ultimate supporter!
            </p>
            <Link href="/trade" className="btn-primary">
              Go to Trading
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

const features = [
  {
    icon: '⚽',
    title: 'World Cup Themed',
    description: 'Trade fan tokens for your favorite national teams with real-time momentum tracking.',
  },
  {
    icon: '🔗',
    title: 'Uniswap V4 Hooks',
    description: 'Powered by decentralized swaps with custom hooks that react to trading activity.',
  },
  {
    icon: '📈',
    title: 'Momentum Engine',
    description: 'Team momentum updates in real-time as traders buy and sell fan tokens.',
  },
  {
    icon: '🏆',
    title: 'Leaderboards',
    description: 'Compete with other supporters and climb the rankings to earn exclusive rewards.',
  },
  {
    icon: '⭐',
    title: 'Earn Points',
    description: 'Accumulate supporter points through swaps, holding, and match-day bonuses.',
  },
  {
    icon: '🌍',
    title: 'X Layer Network',
    description: 'Fast, low-cost transactions on OKX\'s X Layer blockchain network.',
  },
];
