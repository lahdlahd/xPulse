# 📦 Deployment Guide

## Overview

FanXPulse deployment consists of 3 components:

1. **Frontend** (Next.js) → Vercel
2. **Event Listener** (Node.js) → Railway/Heroku
3. **GraphQL Server** (Apollo) → Railway/Heroku

---

## 🎯 Step 1: Frontend Deployment to Vercel

### Prerequisites
- Vercel account (free tier: https://vercel.com)
- GitHub account with code pushed
- Wallet Connect Project ID

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /path/to/fanxpulse
vercel --prod
```

**Vercel will ask**:
- Link to existing project? → No (first time)
- Set up and deploy? → Yes
- Scope? → Personal
- Detected project? → Yes
- Build command? → `npm run build` (default)
- Output? → `.next` (default)

### Configure Environment Variables

1. Go to **Vercel Dashboard** → Your Project → Settings
2. Click **Environment Variables**
3. Add these variables (mark as "Production"):

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_X_LAYER_RPC_TESTNET=https://testrpc.xlayer.tech
NEXT_PUBLIC_X_LAYER_RPC_MAINNET=https://rpc.xlayer.tech
NEXT_PUBLIC_REAL_INDEXER_URL=https://api.yourdomain.com/graphql
```

4. Click "Save"
5. Redeploy: **Deployments** → **Redeploy**

### Verify Deployment

```bash
# Your site is now live at
https://fanxpulse.vercel.app

# (or whatever domain you configured)
```

Check:
- [ ] Site loads
- [ ] Wallet connection works
- [ ] Pages load with data
- [ ] No console errors

---

## 🔵 Step 2: Deploy Event Listener

### Option A: Railway (Recommended)

1. **Create Railway Account** → https://railway.app

2. **Connect GitHub** → Login with GitHub

3. **Create New Project** → "Deploy from GitHub repo"

4. **Select Repository** → fanxpulse

5. **Add Service**:
   - Select `real-indexer` directory
   - Service name: `event-listener`
   - Start command: `node listener.js`

6. **Environment Variables**:
   - `X_LAYER_RPC=https://testrpc.xlayer.tech`
   - `PORT=3003`

7. **Deploy** → Automatic on push

8. **Get URL**: Dashboard → event-listener → Public URL

### Option B: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create fanxpulse-listener

# Set environment variables
heroku config:set X_LAYER_RPC=https://testrpc.xlayer.tech --app fanxpulse-listener

# Add Procfile to real-indexer/
echo "web: node listener.js" > real-indexer/Procfile

# Deploy
cd real-indexer
git subtree push --prefix real-indexer heroku main
```

### Verify Event Listener

```bash
# Check it's running
curl https://fanxpulse-listener.railway.app/stats

# Should return JSON with statistics
```

---

## 🟣 Step 3: Deploy GraphQL Server

### Option A: Railway

1. **In Railway Project** → Add Service

2. **Configure Service**:
   - Select `real-indexer` directory again
   - Service name: `graphql-server`
   - Start command: `node graphql-server.js`
   - Railway port: `4000`

3. **Environment Variables**:
   - `REST_API_URL=https://fanxpulse-listener.railway.app`
   - `PORT=4000`

4. **Deploy** → Get public URL

### Option B: Heroku

```bash
# Create app
heroku create fanxpulse-graphql

# Set variables
heroku config:set REST_API_URL=https://fanxpulse-listener.herokuapp.com --app fanxpulse-graphql

# Add Procfile
echo "web: node graphql-server.js" > real-indexer/Procfile

# Deploy
cd real-indexer
git subtree push --prefix real-indexer heroku main
```

### Verify GraphQL Server

```bash
# Test GraphQL endpoint
curl -X POST https://fanxpulse-graphql.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { teams { id currentMomentum } }"}'

# Should return team data
```

---

## 🔗 Step 4: Connect Everything

### Update Frontend Environment Variables

In **Vercel Dashboard** → Settings → Environment Variables:

```env
NEXT_PUBLIC_REAL_INDEXER_URL=https://fanxpulse-graphql.railway.app
```

Redeploy frontend to use new GraphQL URL.

### Verify Full Pipeline

1. Visit https://fanxpulse.vercel.app
2. Navigate to `/leaderboard`
3. Should show real team data
4. Check network tab → GraphQL requests → Status 200

---

## 📊 Production URLs

After deployment, you'll have:

| Service | URL |
|---------|-----|
| Frontend | https://fanxpulse.vercel.app |
| GraphQL API | https://fanxpulse-graphql.railway.app |
| Event Listener | https://fanxpulse-listener.railway.app |

---

## 🔐 Security Checklist

Before going live:

- [ ] Remove all `.env.local` files from git
- [ ] Use Vercel's secret management for sensitive data
- [ ] Enable CORS only for your domain (not `*`)
- [ ] Use HTTPS everywhere
- [ ] Set security headers (CSP, X-Frame-Options, etc)
- [ ] Monitor error logs regularly

### Enable CORS for Production

In `real-indexer/graphql-server.js`:

```javascript
const corsOptions = {
  origin: 'https://fanxpulse.vercel.app',
  credentials: true,
};

app.use(cors(corsOptions));
```

---

## 🚨 Troubleshooting Deployment

### Issue: "Cannot find module"
```bash
# Solution: Install dependencies on platform
# Railway/Heroku auto-run: npm install
# But check package.json is in root
```

### Issue: Environment variables not loading
```bash
# Solution: Restart deployment
# Vercel: Redeploy
# Railway: Restart service
# Heroku: heroku restart
```

### Issue: CORS errors
```bash
# Solution: Update CORS settings in GraphQL server
# Make sure frontend URL is in allowed origins
```

### Issue: Port issues
```bash
# Solution: Railway/Heroku assign PORT dynamically
# Use process.env.PORT in listener.js and graphql-server.js
```

---

## 📈 Monitoring

### Vercel
- **Dashboard** → Analytics tab
- Monitor build times, errors, page views
- Check error rate < 0.1%

### Railway/Heroku
- **Dashboard** → Logs tab
- Monitor service health
- Check for errors in real-time

### Custom Monitoring
```bash
# Script to check all services
#!/bin/bash

# Check frontend
curl -s https://fanxpulse.vercel.app/health || echo "Frontend down"

# Check GraphQL
curl -s https://fanxpulse-graphql.railway.app/graphql || echo "GraphQL down"

# Check listener
curl -s https://fanxpulse-listener.railway.app/health || echo "Listener down"
```

---

## 🆘 Rollback Procedure

### Vercel Rollback
```bash
# View deployment history
vercel deployments

# Rollback to previous
vercel rollback

# Or specific deployment
vercel promote <deployment-id>
```

### Railway/Heroku Rollback
```bash
# View releases
heroku releases --app fanxpulse-graphql

# Rollback to previous
heroku releases:rollback -1 --app fanxpulse-graphql
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads at https://fanxpulse.vercel.app
- [ ] Wallet connection works
- [ ] Pages load with real data
- [ ] Leaderboard shows real teams
- [ ] Momentum page has real events
- [ ] Charts render correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable (< 3s load)
- [ ] Lighthouse score 90+

---

## 🎉 Deployment Complete!

Your FanXPulse is now live! 

**Share with the world**:
- https://fanxpulse.vercel.app
- GitHub repository link
- Hackathon submission

---

**Built for X Layer Season 3** ⚽💰
