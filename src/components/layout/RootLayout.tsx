/**
 * Main Layout Component
 * Wrapper for the entire application
 */

'use client';

import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import { useToastNotifications, ToastContainer } from '@/components/ui/ToastNotifications';
import MatchDayWidget from '@/components/features/MatchDayWidget';
import Header from './Header';
import Footer from './Footer';

// RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

// Create a client
const queryClient = new QueryClient();

interface RootLayoutProps {
  children: React.ReactNode;
}

// Toast Provider Wrapper
function WithToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, showNotification, removeToast } = useToastNotifications();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="FanXPulse - World Cup Fan Token Trading Platform" />
        <title>FanXPulse</title>
      </head>
      <body className="bg-slate-900 text-slate-100">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize="compact">
              <WithToastProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <MatchDayWidget />
                  <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                  </main>
                  <Footer />
                </div>
              </WithToastProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
