"use client";
import { useEffect, useState } from "react";

export default function StatsBar() {
  const [stats] = useState([
    { label: "Win Rate", value: "73.4%", sub: "Last 30 days", color: "var(--buy-green)" },
    { label: "Signals Today", value: "12", sub: "3 active", color: "var(--accent-gold)" },
    { label: "Avg R:R", value: "1:2.8", sub: "Monthly avg", color: "var(--accent-cyan)" },
    { label: "Best Pair", value: "XAUUSD", sub: "+4.2% this week", color: "var(--accent-gold)" },
    { label: "Active Users", value: "2,847", sub: "Using KB signals", color: "var(--text-secondary)" },
  ]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "1px",
      background: "var(--border)",
      borderTop: "1px solid var(--border)",
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: "var(--bg-secondary)", padding: "10px 16px" }}>
          <div style={{ fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
            {s.label}
          </div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: s.color, letterSpacing: "0.03em", lineHeight: 1.1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: "0.58rem", color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
