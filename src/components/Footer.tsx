"use client";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--bg-secondary)",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: 8 }}>
              TRADING WITH <span style={{ color: "var(--accent-gold)" }}>KB</span>
            </div>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 380, marginBottom: 12 }}>
              AI-powered SMC & ICT Forex signal analysis for swing traders. 
              Institutional-grade market analysis delivered automatically — M15, H1, H4.
            </p>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", lineHeight: 1.6, padding: "10px 12px", background: "var(--bg-card)", borderRadius: 4, borderLeft: "2px solid var(--sell-red)" }}>
              ⚠ Risk Warning: Forex trading carries significant risk. Signals are for educational purposes only. Never trade more than you can afford to lose.
            </div>
          </div>

          {/* Pairs */}
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Covered Pairs</div>
            {["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "GBPJPY", "EURJPY", "AUDUSD"].map((p) => (
              <div key={p} style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginBottom: 4 }}>{p}</div>
            ))}
          </div>

          {/* Concepts */}
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>SMC/ICT Concepts</div>
            {["Order Blocks", "Fair Value Gaps", "Liquidity Sweeps", "BOS / CHoCH", "Kill Zones", "OTE Entries", "Power of 3"].map((c) => (
              <div key={c} style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginBottom: 4 }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
            © 2024 Trading With KB. All rights reserved. For educational purposes only.
          </div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
            Built with AI · SMC · ICT · Next.js · Vercel
          </div>
        </div>
      </div>
    </footer>
  );
}
