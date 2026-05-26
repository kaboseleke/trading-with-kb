export const FOREX_PAIRS = [
  { symbol: "XAUUSD", name: "Gold / USD", category: "Commodities", pip: 0.01 },
  { symbol: "EURUSD", name: "Euro / USD", category: "Majors", pip: 0.0001 },
  { symbol: "GBPUSD", name: "GBP / USD", category: "Majors", pip: 0.0001 },
  { symbol: "USDJPY", name: "USD / JPY", category: "Majors", pip: 0.01 },
  { symbol: "GBPJPY", name: "GBP / JPY", category: "Crosses", pip: 0.01 },
  { symbol: "EURJPY", name: "EUR / JPY", category: "Crosses", pip: 0.01 },
  { symbol: "USDCAD", name: "USD / CAD", category: "Majors", pip: 0.0001 },
  { symbol: "AUDUSD", name: "AUD / USD", category: "Majors", pip: 0.0001 },
  { symbol: "NZDUSD", name: "NZD / USD", category: "Majors", pip: 0.0001 },
  { symbol: "USDCHF", name: "USD / CHF", category: "Majors", pip: 0.0001 },
];

export const TIMEFRAMES = ["M15", "H1", "H4"] as const;
export type Timeframe = typeof TIMEFRAMES[number];

export type SignalDirection = "BUY" | "SELL" | "WAIT";
export type SignalStrength = "STRONG" | "MODERATE" | "WEAK";
export type SMCConcept = "Order Block" | "Fair Value Gap" | "Liquidity Sweep" | "BOS" | "CHoCH" | "Breaker Block" | "Mitigation Block";
export type ICTConcept = "Optimal Trade Entry" | "Kill Zone" | "Displacement" | "Imbalance" | "Power of 3" | "Judas Swing" | "Silver Bullet";
export type MarketStructure = "Bullish" | "Bearish" | "Ranging" | "Accumulation" | "Distribution";

export interface Signal {
  id: string;
  pair: string;
  direction: SignalDirection;
  strength: SignalStrength;
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskReward: number;
  timeframe: Timeframe;
  smcConcepts: SMCConcept[];
  ictConcepts: ICTConcept[];
  marketStructure: MarketStructure;
  confluence: number; // 0-100
  analysis: string;
  bias: string;
  keyLevels: { label: string; price: number; type: "support" | "resistance" | "ob" | "fvg" }[];
  generatedAt: string;
  sessionContext: string;
  status: "active" | "tp1_hit" | "tp2_hit" | "tp3_hit" | "sl_hit" | "expired";
}

export interface MarketBias {
  pair: string;
  htf_bias: "Bullish" | "Bearish" | "Neutral";
  h4_structure: MarketStructure;
  h1_structure: MarketStructure;
  m15_structure: MarketStructure;
  currentPrice: number;
  dailyChange: number;
  weeklyBias: string;
  keyLevels: string[];
}

// Session times (UTC)
export function getCurrentSession(): string {
  const hour = new Date().getUTCHours();
  if (hour >= 22 || hour < 7) return "Sydney/Tokyo";
  if (hour >= 7 && hour < 9) return "London Open";
  if (hour >= 9 && hour < 12) return "London";
  if (hour >= 12 && hour < 14) return "New York Open / Kill Zone";
  if (hour >= 14 && hour < 17) return "New York";
  if (hour >= 17 && hour < 22) return "Late New York";
  return "Unknown";
}

export function getPipValue(symbol: string, price: number): number {
  const pair = FOREX_PAIRS.find(p => p.symbol === symbol);
  if (!pair) return 0.0001;
  if (symbol === "XAUUSD") return 0.1;
  return pair.pip;
}

export function formatPrice(symbol: string, price: number): string {
  if (symbol === "USDJPY" || symbol === "GBPJPY" || symbol === "EURJPY") {
    return price.toFixed(3);
  }
  if (symbol === "XAUUSD") return price.toFixed(2);
  return price.toFixed(5);
}
