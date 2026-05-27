/**
 * Teams Page
 * Detailed view of all teams and their statistics
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export default function TeamsPage() {
  const { isConnected } = useWalletConnection();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Teams</h1>
        <p className="text-slate-400">
          Explore all World Cup teams, their momentum, and supporter statistics.
        </p>
      </div>

      {isMounted ? (
        !isConnected ? (
          <div className="card bg-blue-900/30 border-accent-blue text-center py-12">
            <p className="text-slate-300 mb-4">Connect your wallet to view detailed team statistics.</p>
          </div>
        ) : (
        <div className="card">
          <p className="text-slate-400">
            Teams detail view coming in Phase 2 - Smart Contract Integration.
          </p>
        </div>
        )
      ) : (
        <div className="w-full h-32" />
      )}
    </div>
  );
}
