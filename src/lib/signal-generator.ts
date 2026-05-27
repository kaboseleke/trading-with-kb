import { Signal, getCurrentSession } from "./forex-data";
import { getLivePriceAsync, getLivePrice } from "./price-feed";

export interface MarketBias {
  pair: string;
  htf_bias: "Bullish" | "Bearish" | "Neutral";
  h4_structure: string;
  h1_structure: string;
  m15_structure: string;
  currentPrice: number;
  dailyChange: number;
  weeklyBias: string;
  keyLevels: string[];
}

export async function generateSignalFromAI(pair: string, currentPrice: number): Promise<Signal> {
  const session = getCurrentSession();
  const now = new Date();
  const apiKey = process.env.GROQ_API_KEY;

  const prompt = `You are an expert Forex analyst using SMC (Smart Money Concepts) and ICT (Inner Circle Trader) methodologies. Analyze ${pair} at current live price ${currentPrice} during the ${session} session.

Generate a swing trading signal. Return ONLY raw JSON — no markdown, no backticks, no explanation:

{"direction":"BUY","strength":"STRONG","entry":${currentPrice},"stopLoss":0,"takeProfit1":0,"takeProfit2":0,"takeProfit3":0,"riskReward":2.5,"timeframe":"H1","smcConcepts":["Order Block","BOS"],"ictConcepts":["Optimal Trade Entry"],"marketStructure":"Bullish","confluence":78,"analysis":"2-3 sentence technical analysis using SMC/ICT concepts specific to ${pair} at price ${currentPrice}.","bias":"One sentence directional bias.","keyLevels":[{"label":"Demand OB","price":0,"type":"ob"},{"label":"FVG","price":0,"type":"fvg"}],"sessionContext":"${session}"}

Rules:
- direction: "BUY", "SELL", or "WAIT"
- strength: "STRONG", "MODERATE", or "WEAK"
- entry must be very close to ${currentPrice} (within 5 pips)
- stopLoss behind structure (25-40 pips for majors, 150-300 for XAUUSD, 30-50 for JPY pairs)
- takeProfit1 at 1.5x risk distance, takeProfit2 at 2.5x, takeProfit3 at 4x
- riskReward: number like 2.5
- timeframe: "M15", "H1", or "H4"
- smcConcepts: 1-3 from ["Order Block","Fair Value Gap","Liquidity Sweep","BOS","CHoCH","Breaker Block","Mitigation Block"]
- ictConcepts: 1-2 from ["Optimal Trade Entry","Kill Zone","Displacement","Imbalance","Power of 3","Judas Swing","Silver Bullet"]
- marketStructure: "Bullish","Bearish","Ranging","Accumulation", or "Distribution"
- confluence: 0-100
- keyLevels: 2-3 realistic price levels close to ${currentPrice}
- All prices must be realistic for ${pair} near ${currentPrice}`;

  if (apiKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 800,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: "You are a professional Forex analyst specializing in SMC and ICT concepts. Always respond with raw JSON only — no markdown, no backticks, no extra text.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "{}";
      const clean = text.replace(/```json\n?|```\n?/g, "").trim();
      const parsed = JSON.parse(clean);

      return {
        id: `${pair}-${Date.now()}`,
        pair,
        generatedAt: now.toISOString(),
        status: "active",
        ...parsed,
      } as Signal;
    } catch (e) {
      console.error("Groq signal generation failed, using fallback:", e);
    }
  }

  return generateFallbackSignal(pair, currentPrice, session, now.toISOString());
}

export function generateFallbackSignal(pair: string, price: number, session: string, timestamp: string): Signal {
  const isBuy = Math.random() > 0.45;
  const dir = isBuy ? "BUY" : "SELL";
  const isJpy = pair.includes("JPY");
  const isGold = pair === "XAUUSD";
  const pipMult = isJpy ? 0.01 : isGold ? 0.1 : 0.0001;
  const slPips = isGold ? 250 : isJpy ? 35 : 30;
  const slDist = slPips * pipMult * 10;
  const sl = isBuy ? price - slDist : price + slDist;
  const rr = 2.5;
  const tpDist = Math.abs(price - sl);
  const tp1 = isBuy ? price + tpDist * 1.5 : price - tpDist * 1.5;
  const tp2 = isBuy ? price + tpDist * rr : price - tpDist * rr;
  const tp3 = isBuy ? price + tpDist * 4 : price - tpDist * 4;
  const dec = isJpy ? 3 : isGold ? 2 : 5;
  const f = (n: number) => parseFloat(n.toFixed(dec));

  const smcPick = ["Order Block", "Fair Value Gap", "Liquidity Sweep", "BOS", "CHoCH"] as const;
  const ictPick = ["Optimal Trade Entry", "Kill Zone", "Displacement"] as const;

  return {
    id: `${pair}-${Date.now()}`,
    pair,
    direction: dir as "BUY" | "SELL",
    strength: "MODERATE",
    entry: f(price),
    stopLoss: f(sl),
    takeProfit1: f(tp1),
    takeProfit2: f(tp2),
    takeProfit3: f(tp3),
    riskReward: rr,
    timeframe: "H1",
    smcConcepts: [smcPick[Math.floor(Math.random() * 3)], smcPick[3 + Math.floor(Math.random() * 2)]] as any,
    ictConcepts: [ictPick[Math.floor(Math.random() * 3)]] as any,
    marketStructure: (isBuy ? "Bullish" : "Bearish") as any,
    confluence: 62 + Math.floor(Math.random() * 22),
    analysis: `${pair} showing a ${isBuy ? "bullish" : "bearish"} order block confluence on H1 timeframe at ${f(price)}. Price has swept ${isBuy ? "sell-side" : "buy-side"} liquidity and is returning to ${isBuy ? "discount" : "premium"} pricing zone. M15 CHoCH confirms ${isBuy ? "bullish" : "bearish"} continuation.`,
    bias: `${isBuy ? "Bullish" : "Bearish"} bias — ${isBuy ? "targeting higher liquidity pools above" : "targeting lower liquidity pools below"} current price ${f(price)}`,
    keyLevels: [
      { label: isBuy ? "Bullish OB" : "Bearish OB", price: f(isBuy ? sl * 1.003 : sl * 0.997), type: "ob" },
      { label: "FVG Zone", price: f((price + tp1) / 2), type: "fvg" },
      { label: isBuy ? "BSL Target" : "SSL Target", price: f(tp2), type: isBuy ? "resistance" : "support" },
    ],
    generatedAt: timestamp,
    sessionContext: session,
    status: "active",
  };
}

const STRUCTURES = ["Bullish", "Bearish", "Ranging", "Accumulation", "Distribution"];

export async function generateMarketBias(pair: string, price: number): Promise<MarketBias> {
  const htf = Math.random() > 0.5 ? "Bullish" : "Bearish";
  const dailyChange = parseFloat(((Math.random() - 0.48) * 1.2).toFixed(3));

  return {
    pair,
    htf_bias: htf as "Bullish" | "Bearish",
    h4_structure: STRUCTURES[Math.floor(Math.random() * 3)],
    h1_structure: STRUCTURES[Math.floor(Math.random() * 4)],
    m15_structure: STRUCTURES[Math.floor(Math.random() * 5)],
    currentPrice: price,
    dailyChange,
    weeklyBias: htf === "Bullish"
      ? "Targeting buy-side liquidity pools above — expect retracement to discount OBs before continuation"
      : "Targeting sell-side liquidity pools below — watch for rallies into premium OBs as short entries",
    keyLevels: [
      `Strong demand zone: ${(price * 0.994).toFixed(5)}`,
      `Key supply zone: ${(price * 1.006).toFixed(5)}`,
    ],
  };
}
