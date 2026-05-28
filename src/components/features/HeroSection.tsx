/**
 * Hero Section Component
 * Landing page hero with animated text and CTA
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
            Experience the future of sports trading. Real-time momentum, instant swaps, and transparent
            on-chain transactions on X Layer blockchain.
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
                <Link href="/trade" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
                  Start Trading
                </Link>
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
      </div>
    </motion.section>
  );
};

export default HeroSection;
