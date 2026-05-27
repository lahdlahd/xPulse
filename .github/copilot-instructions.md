# FanXPulse - Project Guidelines

## Project Overview

**FanXPulse** is a World Cup-themed fan token trading platform built on Uniswap V4 Hooks for the X Layer Season 3 Hackathon.

**Core Value Proposition**: Every swap triggers a Uniswap V4 Hook that visibly updates team momentum, supporter points, and leaderboard rankings.

## Architecture Principles

1. **Hook-First Design** - The V4 Hook is the core product, not an add-on
2. **Type-Safe** - 100% TypeScript with strict mode enabled
3. **Modular Structure** - Easy to locate and extend features
4. **Production Quality** - Clean code, no tech debt, scalable patterns
5. **Dark Theme** - Premium sports trading platform aesthetic

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit
- **Blockchain**: Solidity, Foundry, Uniswap V4
- **Network**: X Layer (Testnet 195, Mainnet 196)
- **Indexer**: Ponder (Phase 4)
- **Deployment**: Vercel

## Folder Structure

```
src/
├── app/              # Next.js pages & layouts
├── components/       # React components (layout, features, ui)
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries (chains, wagmi, etc)
├── types/           # TypeScript type definitions
├── constants/       # Team configs, constants, feature flags
├── services/        # API & blockchain services
├── utils/           # Helper functions
└── public/          # Static assets
```

## Development Guidelines

### Code Standards
- Use `'use client'` for all interactive components
- Import from `@/` path aliases (see tsconfig.json)
- Keep components under 300 lines (break down if needed)
- Use TypeScript interfaces for all data structures
- Add JSDoc comments to functions

### Components
- Feature components go in `/components/features/`
- Layout components in `/components/layout/`
- Reusable UI components in `/components/ui/`
- Use Framer Motion for animations (smooth, not flashy)

### Styling
- TailwindCSS for all styles (no inline styles)
- Use predefined colors from theme
- Dark mode always enabled
- Mobile-first responsive design
- Reference `/src/app/globals.css` for base styles

### Smart Contract Integration
- All wallet interactions via Wagmi hooks
- Contract calls typed with Viem ABIs
- X Layer network config in `/src/lib/chains.ts`
- Environment variables for contract addresses

## Phases Overview

### PHASE 1: Setup ✅
- Next.js + TypeScript + TailwindCSS
- Wagmi + Viem + X Layer configuration
- Wallet connection (OKX Wallet support)
- Landing page with hero section
- Placeholder pages for all main sections
- **Status**: Ready for Phase 2

### PHASE 2: Smart Contracts (Next)
- Foundry setup for contract development
- ERC20 fan token contracts
- Uniswap V4 Pool deployment
- Custom Hook implementation
- beforeSwap/afterSwap logic
- Event emissions

### PHASE 3: Momentum Engine
- Momentum calculation system
- Supporter points mechanics
- Streak detection
- Match-day mode
- Real-time updates

### PHASE 4: Indexer Integration
- Ponder setup
- Event indexing from Hook
- GraphQL queries
- Real-time leaderboard
- Live momentum tracking

### PHASE 5: Advanced UI
- Trading interface
- Momentum visualizations
- Interactive leaderboards
- Charts and analytics
- Smooth animations

### PHASE 6: Deployment
- Contract verification
- Mainnet readiness
- Production deployment
- Documentation

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `src/lib/wagmi.ts` | Wagmi configuration (wallet connectors) |
| `src/lib/chains.ts` | X Layer chain definitions |
| `src/constants/index.ts` | Team data, app config, constants |
| `src/types/index.ts` | All TypeScript type definitions |
| `src/hooks/useWalletConnection.ts` | Wallet state management |
| `src/components/layout/RootLayout.tsx` | Web3 provider root |
| `tailwind.config.ts` | Theme & animations |
| `.env.local` | Local environment (gitignored) |

## Important Constraints

### DO
✅ Build incrementally (one phase at a time)
✅ Use existing hooks (Wagmi, React, custom)
✅ Write TypeScript for type safety
✅ Make Hook visibility paramount
✅ Test wallet connections thoroughly
✅ Keep dark mode consistent
✅ Use semantic HTML

### DON'T
❌ Generate fake blockchain logic
❌ Skip TypeScript types
❌ Use inline styles (use Tailwind)
❌ Overcomplicate component hierarchy
❌ Build entire app at once
❌ Hide the Hook's importance
❌ Use generic AI-generated styling

## Testing Before Phase 2

- [ ] Wallet connection works (MetaMask, OKX)
- [ ] Network switching to X Layer works
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] Hero section animates smoothly
- [ ] Teams grid displays correctly
- [ ] Navigation links work
- [ ] Placeholder pages load

## Environment Variables

**Required for deployment:**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=        # From cloud.walletconnect.com
NEXT_PUBLIC_X_LAYER_RPC_TESTNET=             # Already set
NEXT_PUBLIC_X_LAYER_RPC_MAINNET=             # Already set
```

**Populated after Phase 2 (Contract Deployment):**
```env
NEXT_PUBLIC_HOOK_ADDRESS=                    # Custom Hook contract
NEXT_PUBLIC_UNISWAP_V4_POOL_MANAGER_ADDRESS= # Pool Manager
```

## Debugging Tips

### Wallet Connection Issues
1. Check `useWalletConnection()` hook in console
2. Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
3. Test with multiple wallets (MetaMask, OKX)
4. Check X Layer RPC endpoints are accessible

### Build Errors
1. Run `npm run type-check` before deploying
2. Check for missing `'use client'` directives
3. Verify all imports use `@/` aliases

### Styling Issues
1. Check Tailwind config is imported in `globals.css`
2. Verify dark mode class on html element
3. Use TailwindCSS IntelliSense VS Code extension

## Resources

- **Wagmi Docs**: https://wagmi.sh
- **Viem Guide**: https://viem.sh
- **Uniswap V4**: https://docs.uniswap.org/contracts/v4/overview
- **X Layer Docs**: https://xlayer.okx.com/developer
- **Next.js App Router**: https://nextjs.org/docs/app

## Questions to Ask Before Coding

1. Does this belong in a component, hook, or utility?
2. Is this typed with TypeScript?
3. Does this stay on the dark theme?
4. Does this make the Hook more visible?
5. Is this incrementally testable?

## Success Criteria for Phase 1

✅ Project initializes and runs with `npm install && npm run dev`
✅ Wallet connection works (OKX, MetaMask supported)
✅ Can switch to X Layer network
✅ Home page loads with animations
✅ Responsive on all devices
✅ Can navigate to all placeholder pages
✅ Types compile without errors
✅ Ready for Phase 2 (Smart Contracts)

---

**Built for X Layer Season 3 Hackathon** ⚽💰
