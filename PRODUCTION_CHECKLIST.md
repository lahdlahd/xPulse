# 🚀 Production Build & Deployment Verification

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] `npm run type-check` - No TypeScript errors
- [ ] All imports using `@/` aliases
- [ ] No console.log statements in production code
- [ ] All components have `'use client'` where needed
- [ ] No commented-out code blocks
- [ ] Environment variables properly configured

### ✅ Performance
- [ ] Bundle size under 300KB gzipped
- [ ] Lighthouse score 90+
- [ ] First Contentful Paint < 2s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

### ✅ Testing
- [ ] All pages load without errors
- [ ] Navigation works on all routes
- [ ] Data displays correctly
- [ ] Forms submit properly
- [ ] Responsive on all breakpoints
- [ ] No broken links

### ✅ Security
- [ ] No sensitive data in code
- [ ] Environment variables in .env.local only
- [ ] CORS properly configured
- [ ] Contract addresses verified
- [ ] No dev dependencies in production

---

## Build Verification

### Step 1: Type Check
```bash
npm run type-check
```
Expected: ✅ "Successfully compiled with TypeScript"

### Step 2: Production Build
```bash
npm run build
```
Expected: ✅ "compiled successfully" without warnings

### Step 3: Bundle Analysis (Optional)
```bash
npm run build -- --debug
```
Check output for unexpectedly large packages

### Step 4: Local Production Test
```bash
npm run build
npm start
```
Visit http://localhost:3000 - Should work identically to dev

---

## Performance Metrics

### Before Optimization
- Document Complete: 2.5s
- Largest Contentful Paint: 2.8s
- Cumulative Layout Shift: 0.08

### After Optimization (Target)
- Document Complete: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.05

### Tools
- Lighthouse: DevTools → Lighthouse
- Bundle Analyzer: `npm run build -- --analyze`
- Profiling: React DevTools Profiler tab

---

## Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<dev-id>
NEXT_PUBLIC_X_LAYER_RPC_TESTNET=https://testrpc.xlayer.tech
NEXT_PUBLIC_X_LAYER_RPC_MAINNET=https://rpc.xlayer.tech
NEXT_PUBLIC_REAL_INDEXER_URL=http://localhost:4000
```

### Production (Vercel)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<prod-id>
NEXT_PUBLIC_X_LAYER_RPC_TESTNET=https://testrpc.xlayer.tech
NEXT_PUBLIC_X_LAYER_RPC_MAINNET=https://rpc.xlayer.tech
NEXT_PUBLIC_REAL_INDEXER_URL=https://api.fanxpulse.dev/graphql
```

---

## Deployment Validation

### After Vercel Deployment

```bash
# Check site is live
curl https://fanxpulse.vercel.app

# Verify environment variables are set
# (Check Vercel dashboard → Settings → Environment Variables)

# Test API endpoints
curl https://fanxpulse.vercel.app/api/health

# Run Lighthouse on production
npm install -g lighthouse
lighthouse https://fanxpulse.vercel.app
```

### Expected Results
- HTTP 200 responses
- All pages load
- No console errors
- Lighthouse score 90+
- Load time < 3s

---

## Common Issues & Fixes

### Issue: TypeScript Errors
```bash
# Fix
npm run type-check -- --noEmit
npm install -D typescript@latest
```

### Issue: Bundle Too Large
```bash
# Analyze
npm run build -- --analyze

# Remove unused dependencies
npm ls --all
npm prune
```

### Issue: Environment Variables Not Loading
```bash
# Verify
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# In Vercel: 
# - Settings → Environment Variables
# - Add variable
# - Redeploy
```

### Issue: GraphQL API Timeout
- Check `real-indexer/graphql-server.js` is running
- Verify CORS headers
- Check API response time

---

## Rollback Plan

If production deployment has issues:

```bash
# Rollback to previous deployment
vercel rollback

# Or redeploy specific commit
vercel --prod [git-hash]

# Or switch DNS to previous version
# (Configure in domain settings)
```

---

## Monitoring Checklist

Post-deployment, monitor:

- [ ] Error rates (Vercel Analytics)
- [ ] Page load times (DevTools)
- [ ] API response times (Network tab)
- [ ] User reports (Discord/Email)
- [ ] Blockchain transaction success

---

## Sign-Off

- [ ] Developer: Code reviewed and tested
- [ ] QA: All tests passed
- [ ] Devops: Infrastructure verified
- [ ] Product: Feature complete

**Ready to Deploy**: ✅ YES / ❌ NO

Deployment timestamp: _____________
Deployed by: _____________
