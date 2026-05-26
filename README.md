# 📈 Trading With KB — AI Forex Signal Platform

AI-powered Forex signal analysis for swing traders. Uses SMC (Smart Money Concepts) and ICT (Inner Circle Trader) methodologies across M15, H1, and H4 timeframes.

---

## ✨ Features

- ⚡ **Live AI Signals** — Claude AI analyzes each pair using SMC/ICT logic
- 📊 **Multi-Timeframe Analysis** — M15, H1, H4 timeframe coverage
- 🏛️ **SMC Concepts** — Order Blocks, FVGs, Liquidity Sweeps, BOS/CHoCH, Breaker Blocks
- 🎯 **ICT Concepts** — OTE entries, Kill Zones, Power of 3, Displacement
- 🌍 **10 Pairs Covered** — XAUUSD, EURUSD, GBPUSD, USDJPY, GBPJPY + more
- 📚 **Built-in Education** — Full SMC/ICT concept reference guide
- 🌐 **Market Bias Panel** — HTF bias + session map per pair
- 🔄 **Real-time Updates** — Refresh any pair on demand
- 🎨 **Terminal UI** — Dark trading terminal aesthetic

---

## 🚀 Deployment (Vercel + GitHub)

### Step 1 — Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/trading-with-kb.git
cd trading-with-kb
npm install
```

### Step 2 — Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key
```

Get your API key at: https://console.groq.com

### Step 3 — Run Locally

```bash
npm run dev
# Opens at http://localhost:3000
```

### Step 4 — Push to GitHub

```bash
git init
git add .
git commit -m "🚀 Initial commit — Trading With KB"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trading-with-kb.git
git push -u origin main
```

### Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo `trading-with-kb`
3. In **Environment Variables**, add:
   - `GROQ_API_KEY` = your key from console.groq.com
4. Click **Deploy** ✅

---

## 📁 Project Structure

```
trading-with-kb/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts    # AI signal API endpoint
│   │   ├── globals.css             # Terminal dark theme CSS
│   │   ├── layout.tsx              # Root layout + fonts
│   │   └── page.tsx                # Main dashboard page
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── TickerBar.tsx           # Live price ticker
│   │   ├── StatsBar.tsx            # Performance stats
│   │   ├── HeroSection.tsx         # Hero with session info
│   │   ├── SignalCard.tsx          # Individual signal card
│   │   ├── SignalFilters.tsx       # Pair/direction/TF filters
│   │   ├── MarketBiasPanel.tsx     # MTF bias + session map
│   │   ├── SMCEducation.tsx        # SMC/ICT concept guide
│   │   └── Footer.tsx              # Footer
│   └── lib/
│       ├── forex-data.ts           # Pair data, types, utilities
│       └── signal-generator.ts     # AI signal + bias logic
├── .env.example                    # Environment template
├── .gitignore
├── next.config.ts
├── vercel.json
└── README.md
```

---

## ⚙️ How It Works

1. User selects a Forex pair
2. Frontend calls `/api/analyze` with the pair
3. API fetches live price, calls Claude AI with SMC/ICT prompt
4. Claude returns structured JSON: entry, SL, TP1/2/3, concepts, analysis
5. Signal card renders with full analysis and R:R ratios

---

## ⚠️ Disclaimer

Trading Forex carries significant risk. Signals are for **educational purposes only**. 
Never risk more than 1-2% per trade. Past performance is not indicative of future results.
Trading With KB is not a licensed financial advisor.

---

Built by KB · Powered by Claude AI · Deployed on Vercel
