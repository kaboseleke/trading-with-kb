"use client";
import { Signal } from "@/lib/forex-data";
import { formatPrice } from "@/lib/forex-data";

interface Props {
  signal: Signal;
  onRefresh: () => void;
  loading?: boolean;
}

const SMC_COLORS: Record<string, string> = {
  "Order Block": "tag-ob",
  "Fair Value Gap": "tag-fvg",
  "Liquidity Sweep": "tag-liq",
  "BOS": "tag-bos",
  "CHoCH": "tag-smc",
  "Breaker Block": "tag-ict",
  "Mitigation Block": "tag-ob",
};

export default function SignalCard({ signal, onRefresh, loading }: Props) {
  const isBuy = signal.direction === "BUY";
  const isSell = signal.direction === "SELL";
  const isWait = signal.direction === "WAIT";

  const signalClass = isBuy ? "signal-buy" : isSell ? "signal-sell" : "signal-wait";
  const badgeClass = isBuy ? "badge-buy" : isSell ? "badge-sell" : "badge-wait";
  const dirColor = isBuy ? "var(--buy-green)" : isSell ? "var(--sell-red)" : "var(--neutral)";

  const strengthColor =
    signal.strength === "STRONG" ? "var(--buy-green)" :
    signal.strength === "MODERATE" ? "var(--accent-gold)" :
    "var(--text-muted)";

  const pips = Math.abs(signal.entry - signal.stopLoss);
  const time = new Date(signal.generatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const confluenceColor =
    signal.confluence >= 75 ? "var(--buy-green)" :
    signal.confluence >= 55 ? "var(--accent-gold)" :
    "var(--sell-red)";

  return (
    <div className={`card-glass ${signalClass} p-4`} style={{ position: "relative", overflow: "hidden" }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.05em" }}>
            {signal.pair}
          </span>
          <span className={`tag ${signal.timeframe === "H4" ? "tag-ict" : signal.timeframe === "H1" ? "tag-smc" : "tag-bos"}`}>
            {signal.timeframe}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{time}</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 3,
              padding: "3px 8px",
              color: "var(--text-muted)",
              fontSize: "0.6rem",
              cursor: "pointer",
              letterSpacing: "0.1em",
            }}
          >
            {loading ? "..." : "↻ REFRESH"}
          </button>
        </div>
      </div>

      {/* Direction + Strength */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`${badgeClass}`} style={{
          padding: "4px 14px",
          borderRadius: 3,
          fontFamily: "Rajdhani, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "0.15em",
        }}>
          {signal.direction}
        </div>
        <div style={{ fontSize: "0.65rem", color: strengthColor, fontWeight: 600, letterSpacing: "0.1em" }}>
          {signal.strength}
        </div>
        <div style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--text-secondary)" }}>
          Confluence: <span style={{ color: confluenceColor, fontWeight: 600 }}>{signal.confluence}%</span>
        </div>
      </div>

      {/* Confluence bar */}
      <div className="progress-bar mb-3">
        <div className="progress-fill" style={{ width: `${signal.confluence}%`, background: confluenceColor }} />
      </div>

      {/* Price levels */}
      <div className="grid grid-cols-2 gap-2 mb-3" style={{ fontSize: "0.72rem" }}>
        <div style={{ background: "var(--bg-secondary)", borderRadius: 4, padding: "8px 10px" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: 2, fontSize: "0.6rem", letterSpacing: "0.1em" }}>ENTRY</div>
          <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{formatPrice(signal.pair, signal.entry)}</div>
        </div>
        <div style={{ background: "var(--bg-secondary)", borderRadius: 4, padding: "8px 10px" }}>
          <div style={{ color: "var(--sell-red)", marginBottom: 2, fontSize: "0.6rem", letterSpacing: "0.1em" }}>STOP LOSS</div>
          <div style={{ color: "var(--sell-red)", fontWeight: 600 }}>{formatPrice(signal.pair, signal.stopLoss)}</div>
        </div>
        <div style={{ background: "var(--bg-secondary)", borderRadius: 4, padding: "8px 10px" }}>
          <div style={{ color: "var(--buy-green)", marginBottom: 2, fontSize: "0.6rem", letterSpacing: "0.1em" }}>TP 1</div>
          <div style={{ color: "var(--buy-green)", fontWeight: 600 }}>{formatPrice(signal.pair, signal.takeProfit1)}</div>
        </div>
        <div style={{ background: "var(--bg-secondary)", borderRadius: 4, padding: "8px 10px" }}>
          <div style={{ color: "var(--buy-green)", marginBottom: 2, fontSize: "0.6rem", letterSpacing: "0.1em" }}>TP 2</div>
          <div style={{ color: "var(--buy-green)", fontWeight: 600 }}>{formatPrice(signal.pair, signal.takeProfit2)}</div>
        </div>
      </div>

      {/* TP3 + RR */}
      <div className="flex gap-2 mb-3">
        <div style={{ flex: 1, background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", borderRadius: 4, padding: "6px 10px", fontSize: "0.7rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>TP 3 (SWING) </span>
          <span style={{ color: "var(--buy-green)", fontWeight: 700 }}>{formatPrice(signal.pair, signal.takeProfit3)}</span>
        </div>
        <div style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)", borderRadius: 4, padding: "6px 12px", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>R:R </span>
          <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>1:{signal.riskReward}</span>
        </div>
      </div>

      {/* Market structure */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>STRUCTURE:</span>
        <span style={{ fontSize: "0.65rem", color: dirColor, fontWeight: 600 }}>{signal.marketStructure}</span>
        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginLeft: "auto" }}>📍 {signal.sessionContext}</span>
      </div>

      {/* SMC Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {signal.smcConcepts?.map((c) => (
          <span key={c} className={`tag ${SMC_COLORS[c] || "tag-smc"}`}>{c}</span>
        ))}
        {signal.ictConcepts?.map((c) => (
          <span key={c} className="tag tag-ict">{c}</span>
        ))}
      </div>

      {/* Bias */}
      <div style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "8px 10px",
        fontSize: "0.68rem",
        color: "var(--text-secondary)",
        lineHeight: 1.5,
        marginBottom: 8,
      }}>
        <span style={{ color: "var(--accent-gold)", fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.1em" }}>BIAS // </span>
        {signal.bias}
      </div>

      {/* Analysis */}
      <div style={{
        fontSize: "0.67rem",
        color: "var(--text-muted)",
        lineHeight: 1.6,
        borderTop: "1px solid var(--border)",
        paddingTop: 8,
      }}>
        {signal.analysis}
      </div>

      {/* Watermark */}
      <div style={{
        position: "absolute",
        bottom: 8, right: 10,
        fontSize: "0.55rem",
        color: "var(--border-bright)",
        letterSpacing: "0.1em",
        opacity: 0.5,
      }}>
        TRADING WITH KB
      </div>
    </div>
  );
}
