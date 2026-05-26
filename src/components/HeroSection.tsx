"use client";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/lib/forex-data";

const TAGLINES = [
  "AI-Powered SMC Signals.",
  "ICT Concepts. Decoded.",
  "Smart Money. Tracked.",
  "Swing Trading. Simplified.",
];

export default function HeroSection() {
  const [tagline, setTagline] = useState(0);
  const [session] = useState(getCurrentSession());
  const [time, setTime] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTagline((p) => (p + 1) % TAGLINES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const update = () => setTime(new Date().toUTCString().slice(17, 25) + " UTC");
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: "40px 0 32px", borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="live-dot" />
            <span style={{ fontSize: "0.65rem", color: "var(--buy-green)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
              Live Analysis Active
            </span>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginLeft: 8 }}>{time}</span>
          </div>

          <h1 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
            color: "var(--text-primary)",
            marginBottom: 8,
          }}>
            TRADING WITH{" "}
            <span style={{
              color: "var(--accent-gold)",
              textShadow: "0 0 30px rgba(240,180,41,0.4)",
            }}>KB</span>
          </h1>

          <div style={{ height: 28, overflow: "hidden", marginBottom: 12 }}>
            <div key={tagline} className="animate-fadeInUp" style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--accent-cyan)",
              letterSpacing: "0.08em",
            }}>
              {TAGLINES[tagline]}
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: 520, lineHeight: 1.7 }}>
            Institutional-grade Forex signals powered by AI analysis of SMC & ICT concepts.
            M15 · H1 · H4 timeframes. Order blocks, FVGs, liquidity sweeps — all automated for swing traders.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220 }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "12px 16px",
          }}>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.12em", marginBottom: 6 }}>ACTIVE SESSION</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-gold)", fontFamily: "Rajdhani, sans-serif" }}>
              📍 {session}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["M15", "H1", "H4"].map((tf) => (
              <div key={tf} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-bright)",
                borderRadius: 4,
                padding: "6px 0",
                textAlign: "center",
                fontSize: "0.65rem",
                color: "var(--accent-cyan)",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}>
                {tf}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
