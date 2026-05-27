/**
 * Header Component
 * Navigation and wallet connection UI
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { APP_CONFIG } from '@/constants';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-850 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-gold bg-clip-text text-transparent">
              ⚽
            </div>
            <span className="text-xl font-bold text-slate-100">{APP_CONFIG.APP_NAME}</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/teams"
              className="text-slate-300 hover:text-accent-blue transition-colors duration-200"
            >
              Teams
            </Link>
            <Link
              href="/trade"
              className="text-slate-300 hover:text-accent-blue transition-colors duration-200"
            >
              Trade
            </Link>
            <Link
              href="/leaderboard"
              className="text-slate-300 hover:text-accent-blue transition-colors duration-200"
            >
              Leaderboard
            </Link>
            <Link
              href="/momentum"
              className="text-slate-300 hover:text-accent-blue transition-colors duration-200"
            >
              Momentum
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="ml-auto">
            <ConnectButton accountStatus="address" chainStatus="icon" />
          </div>
        </div>
      </div>
    </header>
  );
}
