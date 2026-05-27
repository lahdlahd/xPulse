/**
 * Hero Section Component
 * Landing page hero with animated text and CTA
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletConnection } from '@/hooks/useWalletConnection';

const HeroSection: React.FC = () => {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering wallet-dependent content after client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative py-20 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-slate-900 to-accent-gold/10 rounded-2xl blur-3xl -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text */}
        <motion.div variants={itemVariants} className="text-left">
          <motion.h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Trade World Cup
            <span className="gradient-text block">Fan Tokens</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-300 mb-4 leading-relaxed">
            Experience the future of sports trading. Real-time momentum, instant swaps, and decentralized
            on-chain reactions powered by Uniswap V4 Hooks.
          </motion.p>

          <motion.p variants={itemVariants} className="text-base text-slate-400 mb-8">
            Support your favorite team. Earn points. Climb the leaderboard. Influence match momentum.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            {isMounted ? (
              !isConnected ? (
                <div className="w-48">
                  <ConnectButton accountStatus="button" chainStatus="none" />
                </div>
              ) : (
                <button className="btn-primary text-lg px-8 py-3">
                  Start Trading
                </button>
              )
            ) : (
              <div className="w-48 h-10" /> // Placeholder during hydration
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-8 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-accent-emerald text-lg">✓</span>
              <span className="text-slate-400">Verified Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-emerald text-lg">✓</span>
              <span className="text-slate-400">Non-Custodial</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Visual */}
        <motion.div variants={itemVariants} className="relative">
          <div className="relative">
            {/* Animated Cards */}
            <div className="absolute top-0 right-0 w-64 h-48 bg-gradient-to-br from-accent-blue/20 to-accent-gold/20 rounded-2xl border border-accent-blue/30 p-6 shadow-glass">
              <div className="text-4xl mb-4">⚽</div>
              <p className="text-slate-300 text-sm font-semibold">Argentina</p>
              <p className="text-slate-400 text-xs">Momentum: 85%</p>
            </div>

            <div className="absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-br from-accent-emerald/20 to-accent-gold/20 rounded-2xl border border-accent-gold/30 p-6 shadow-glass">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-slate-300 text-sm font-semibold">Your Rewards</p>
              <p className="text-slate-400 text-xs">1,250 Points</p>
            </div>

            <div className="relative z-10 mx-auto w-72 h-96 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center p-6 shadow-glass">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📊
              </motion.div>
              <p className="text-slate-300 font-semibold">Live Momentum</p>
              <p className="text-slate-400 text-sm">Real-time updates</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
