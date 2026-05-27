/**
 * Footer Component
 * Application footer with links and info
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { APP_CONFIG } from '@/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">{APP_CONFIG.APP_NAME}</h3>
            <p className="text-slate-400 text-sm">{APP_CONFIG.APP_DESCRIPTION}</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/teams" className="text-slate-400 hover:text-accent-blue transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link href="/trade" className="text-slate-400 hover:text-accent-blue transition-colors">
                  Trade
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-slate-400 hover:text-accent-blue transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#docs"
                  className="text-slate-400 hover:text-accent-blue transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#github"
                  className="text-slate-400 hover:text-accent-blue transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#audit"
                  className="text-slate-400 hover:text-accent-blue transition-colors"
                >
                  Audits
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-slate-400 hover:text-accent-blue transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-slate-400 hover:text-accent-blue transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © {currentYear} {APP_CONFIG.APP_NAME}. Built for X Layer Season 3 Hackathon.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#twitter" className="text-slate-400 hover:text-accent-blue transition-colors">
                Twitter
              </a>
              <a href="#discord" className="text-slate-400 hover:text-accent-blue transition-colors">
                Discord
              </a>
              <a href="#telegram" className="text-slate-400 hover:text-accent-blue transition-colors">
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
