/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary football/sports colors
        'primary-dark': '#0F172A',
        'primary-darker': '#020617',
        'accent-blue': '#3B82F6',
        'accent-gold': '#FBBF24',
        'accent-emerald': '#10B981',
        'accent-red': '#EF4444',
        
        // Dark theme
        'slate-900': '#0F172A',
        'slate-850': '#1E293B',
        'slate-800': '#1E293B',
        'slate-700': '#334155',
        'slate-600': '#475569',
        'slate-500': '#64748B',
        'slate-400': '#94A3B8',
        'slate-300': '#CBD5E1',
        'slate-200': '#E2E8F0',
        'slate-100': '#F1F5F9',
        'slate-50': '#F8FAFC',
        
        // Team colors (team-specific)
        'argentina': '#87CEEB',
        'brazil': '#FFD700',
        'england': '#E31937',
        'france': '#002395',
        'spain': '#FFC400',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0F172A 0%, #020617 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
        'gradient-momentum': 'linear-gradient(90deg, #EF4444 0%, #FBBF24 50%, #10B981 100%)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        shimmer: 'shimmer 2s infinite',
        momentum: 'momentum 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        momentum: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(1.05)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['Menlo', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.5)',
      },
      backdropFilter: {
        'glass': 'backdrop-filter: blur(4px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
