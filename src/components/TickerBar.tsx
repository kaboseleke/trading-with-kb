"use client";
import { useEffect, useState } from "react";
import { FOREX_PAIRS } from "@/lib/forex-data";
import { getLivePrice } from "@/lib/signal-generator";

interface PriceData {
  symbol: string;
  price: number;
  change: number;
}

export default function TickerBar() {
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const generate = () =>
      FOREX_PAIRS.map((p) => ({
        symbol: p.symbol,
        price: getLivePrice(p.symbol),
        change: parseFloat(((Math.random() - 0.48) * 0.8).toFixed(3)),
      }));

    setPrices(generate());
    const interval = setInterval(() => setPrices(generate()), 3000);
    return () => clearInterval(interval);
  }, []);

  const items = [...prices, ...prices]; // duplicate for seamless scroll

  return (
    <div className="ticker-wrap border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
      <div className="ticker-inner py-2">
        {items.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6" style={{ fontSize: "0.72rem" }}>
            <span style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>{p.symbol}</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{p.price.toFixed(p.symbol.includes("JPY") ? 3 : p.symbol === "XAUUSD" ? 2 : 5)}</span>
            <span style={{ color: p.change >= 0 ? "var(--buy-green)" : "var(--sell-red)", fontSize: "0.65rem" }}>
              {p.change >= 0 ? "▲" : "▼"} {Math.abs(p.change)}%
            </span>
            <span style={{ color: "var(--border-bright)", margin: "0 4px" }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
