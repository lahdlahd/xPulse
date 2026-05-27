/**
 * Teams Page
 * Detailed view of all teams and their statistics
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { TEAMS, ALL_TEAMS } from '@/constants';

export default function TeamsPage() {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="text-slate-400">Loading teams...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Teams</h1>
        <p className="text-slate-400">
          Explore all World Cup teams, their momentum, and supporter statistics.
        </p>
      </div>

      {!isConnected ? (
        <div className="card bg-blue-900/30 border-accent-blue text-center py-12">
          <p className="text-slate-300 mb-4">Connect your wallet to start trading fan tokens.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_TEAMS.map((teamCode) => {
            const team = TEAMS[teamCode];
            if (!team) return null;

            return (
              <div
                key={teamCode}
                className="card hover:border-accent-blue/50 transition-all hover:shadow-lg hover:shadow-accent-blue/20 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{team.flagEmoji}</div>
                    <h3 className="text-lg font-bold text-slate-100">{team.name}</h3>
                    <p className="text-sm text-slate-400">Code: {teamCode}</p>
                  </div>

                  <div className="space-y-2 text-sm border-t border-slate-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Momentum</span>
                      <span className="text-accent-blue font-semibold">+2.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supporters</span>
                      <span className="text-accent-emerald font-semibold">1.2K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">24h Volume</span>
                      <span className="text-slate-300 font-semibold">45.3K OKB</span>
                    </div>
                  </div>

                  <Link
                    href={`/trade?team=${teamCode}`}
                    className="w-full block text-center py-2 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/40 text-accent-blue font-semibold transition-colors group-hover:bg-accent-blue/50"
                  >
                    Trade {teamCode}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
