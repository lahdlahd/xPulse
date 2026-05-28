/**
 * Root Layout
 * Wraps entire application with providers
 */

import type { Metadata } from 'next';
import RootLayout from '@/components/layout/RootLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'FanXPulse - World Cup Fan Token Trading',
  description: 'Trade World Cup fan tokens with real-time momentum updates on X Layer blockchain.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
