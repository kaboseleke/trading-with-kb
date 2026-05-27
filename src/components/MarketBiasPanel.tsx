"use client";
import { useEffect, useState } from "react";
import { getLivePrice } from "@/lib/price-feed";
import { generateMarketBias } from "@/lib/signal-generator";
import type { MarketBias } from "@/lib/signal-generator";
import { FOREX_PAIRS } from "@/lib/forex-data";

interface Props {
  pairs: string[];
}

const structureColor = (s: string) => {
  if (s === "Bullish" || s === "Accumulation") return "var(--buy-green)";
  if (s === "Bearish" || s === "Distribution") return "var(--sell-red)";
  return "var(--neutral)";
};

const structureIcon = (s: string) => {
  if (s === "Bullish" || s === "Accumulation") return "▲";
  if (s === "Bearish" || s === "Distribution") return "▼";
  return "◆";
};

export default function MarketBiasPanel({ pairs }: Props) {
  const [biases, setBiases] = useState<MarketBias[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const results = await Promise.all(
        pairs.map(async (pair) => {
          const price = await getLivePrice(pair);
          return generateMarketBias(pair, price);
        })
      );
      setBiases(results);
      setLoading(false);
    };
    load();
  }, [pairs]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
        <div className="loading-spinner" style={{ margin: "0 auto 16px" }} />
        Analyzing market structure across all pairs...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div style={{ width: 3, height: 20, background: "var(--accent-gold)", borderRadius: 2 }} />
        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.15em", color: "var(--text-secondary)" }}>
          MULTI-TIMEFRAME MARKET BIAS
        </h2>
      </div>

      {/* HTF Overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {biases.map((b) => {
          const pairInfo = FOREX_PAIRS.find((p) => p.symbol === b.pair);
          const htfBullish = b.htf_bias === "Bullish";
          const htfBearish = b.htf_bias === "Bearish";

          return (
            <div key={b.pair} className="card-glass p-4" style={{
              borderLeft: `3px solid ${htfBullish ? "var(--buy-green)" : htfBearish ? "var(--sell-red)" : "var(--neutral)"}`,
            }}>
              {/* Pair header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{b.pair}</div>
                  <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{pairInfo?.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                    fontSize: "0.9rem",
                    color: htfBullish ? "var(--buy-green)" : htfBearish ? "var(--sell-red)" : "var(--neutral)",
                  }}>
                    {structureIcon(b.htf_bias)} {b.htf_bias.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>HTF Bias</div>
                </div>
              </div>

              {/* Current price */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: 3, letterSpacing: "0.1em" }}>CURRENT PRICE</div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {b.currentPrice.toFixed(b.pair.includes("JPY") ? 3 : b.pair === "XAUUSD" ? 2 : 5)}
                  </span>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 600,
                    color: b.dailyChange >= 0 ? "var(--buy-green)" : "var(--sell-red)",
                  }}>
                    {b.dailyChange >= 0 ? "+" : ""}{b.dailyChange.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* MTF Structure */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.1em" }}>MULTI-TF STRUCTURE</div>
                {[
                  { tf: "H4", val: b.h4_structure },
                  { tf: "H1", val: b.h1_structure },
                  { tf: "M15", val: b.m15_structure },
                ].map(({ tf, val }) => (
                  <div key={tf} className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", width: 32 }}>{tf}</span>
                    <div className="flex-1 mx-2" style={{ height: 2, background: "var(--border)", borderRadius: 1, position: "relative" }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 1,
                        width: val === "Bullish" || val === "Accumulation" ? "80%" : val === "Bearish" || val === "Distribution" ? "30%" : "55%",
                        background: structureColor(val),
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: "0.62rem", fontWeight: 600, color: structureColor(val), width: 85, textAlign: "right" }}>
                      {structureIcon(val)} {val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Weekly bias */}
              <div style={{
                background: "var(--bg-secondary)", borderRadius: 4, padding: "8px 10px",
                fontSize: "0.65rem", color: "var(--text-secondary)", lineHeight: 1.5,
                borderLeft: `2px solid ${htfBullish ? "var(--buy-green)" : "var(--sell-red)"}`,
              }}>
                {b.weeklyBias}
              </div>
            </div>
          );
        })}
      </div>

      {/* Session analysis */}
      <div className="card-glass p-5">
        <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--accent-gold)", marginBottom: 16 }}>
          ICT SESSION MAP
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Tokyo", time: "00:00 - 09:00 UTC", active: false, desc: "Low volatility. Range builds. Judas swings form." },
            { name: "London Open", time: "07:00 - 09:00 UTC", active: false, desc: "Kill Zone. Major reversals. Order block mitigation." },
            { name: "New York Open", time: "12:00 - 14:00 UTC", active: false, desc: "Kill Zone. Highest volume. OTE entries. Silver Bullet." },
            { name: "London Close", time: "15:00 - 17:00 UTC", active: false, desc: "Reversal or continuation. Partial profit taking." },
          ].map((s) => {
            const hour = new Date().getUTCHours();
            const isActive =
              (s.name === "Tokyo" && (hour >= 0 && hour < 9)) ||
              (s.name === "London Open" && hour >= 7 && hour < 9) ||
              (s.name === "New York Open" && hour >= 12 && hour < 14) ||
              (s.name === "London Close" && hour >= 15 && hour < 17);

            return (
              <div key={s.name} style={{
                background: isActive ? "rgba(240,180,41,0.07)" : "var(--bg-secondary)",
                border: `1px solid ${isActive ? "rgba(240,180,41,0.3)" : "var(--border)"}`,
                borderRadius: 6, padding: "12px 14px",
              }}>
                <div className="flex items-center gap-2 mb-1">
                  {isActive && <div className="live-dot" />}
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: isActive ? "var(--accent-gold)" : "var(--text-primary)" }}>
                    {s.name}
                  </span>
                </div>
                <div style={{ fontSize: "0.6rem", color: "var(--accent-cyan)", marginBottom: 6 }}>{s.time}</div>
                <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
