"use client";
import { useState } from "react";

interface Props {
  expanded?: boolean;
}

const concepts = [
  {
    id: "ob",
    label: "Order Block",
    tag: "tag-ob",
    short: "Last opposing candle before impulse move",
    detail: "An Order Block is the last bearish candle before a bullish impulse, or the last bullish candle before a bearish impulse. Smart Money accumulates positions here. Wait for price to retrace back into the OB zone, then look for confirmation (M15 CHoCH or FVG fill) before entering.",
    timeframes: ["H4", "H1"],
    signals: "Primary entry trigger on HTF retracement",
    confluence: ["FVG inside OB", "Liquidity swept above/below", "Kill Zone timing"],
  },
  {
    id: "fvg",
    label: "Fair Value Gap",
    tag: "tag-fvg",
    short: "3-candle imbalance / price inefficiency",
    detail: "An FVG (or Imbalance) forms when the high of candle 1 and the low of candle 3 don't overlap candle 2's body/wick range. This leaves an inefficiency in price. Markets tend to return to fill this gap before continuing. Use M15 FVGs inside H1 OBs for precision entries.",
    timeframes: ["M15", "H1"],
    signals: "Fill confirmation + continuation entry",
    confluence: ["Inside a higher TF OB", "After liquidity sweep", "Direction aligns with H4 bias"],
  },
  {
    id: "liq",
    label: "Liquidity Sweep",
    tag: "tag-liq",
    short: "Stop hunt above/below key swing levels",
    detail: "Smart Money engineers price to hunt stops clustered above swing highs (buy-side liquidity) or below swing lows (sell-side liquidity) to fill their large orders cheaply. After the sweep, price typically reverses sharply. The wick that takes out the level IS the signal — wait for a candle close back inside the range.",
    timeframes: ["H1", "H4"],
    signals: "Reversal entry after confirmed stop hunt",
    confluence: ["HTF OB nearby", "FVG formed on displacement back", "Volume spike on sweep candle"],
  },
  {
    id: "bos",
    label: "BOS / CHoCH",
    tag: "tag-bos",
    short: "Break of Structure / Change of Character",
    detail: "BOS (Break of Structure) occurs when price breaks a previous high in a bull trend or a previous low in a bear trend — confirming trend continuation. CHoCH (Change of Character) is the FIRST break of structure AGAINST the trend, signaling a potential reversal. CHoCH on H1 within H4 trend = high-probability confluence zone.",
    timeframes: ["M15", "H1", "H4"],
    signals: "Trend confirmation or early reversal detection",
    confluence: ["Occurs at HTF OB", "After liquidity sweep", "FVG forms on break candle"],
  },
  {
    id: "killzone",
    label: "ICT Kill Zones",
    tag: "tag-ict",
    short: "High-probability institutional timing windows",
    detail: "Kill Zones are specific session windows when Smart Money (banks, institutions) is most active. London Open (07:00–09:00 UTC), New York Open (12:00–14:00 UTC), and London Close (15:00–17:00 UTC) produce the majority of significant moves. Signals generated during these windows have statistically higher probability. Always check the session context on each signal.",
    timeframes: ["M15"],
    signals: "Session-based entry timing filter",
    confluence: ["Price at premium/discount extreme", "OB or FVG present", "HTF bias aligned"],
  },
  {
    id: "ote",
    label: "OTE — Optimal Trade Entry",
    tag: "tag-ict",
    short: "61.8%–79% Fibonacci retracement zone",
    detail: "The Optimal Trade Entry is the institutional entry zone defined by the 61.8% to 79% Fibonacci retracement of a valid swing leg. When price retraces into this zone AND an Order Block or FVG is present, this combination gives extremely precise, low-risk entries with institutional backing. Always measure from the swing low to swing high for buys (reversed for sells).",
    timeframes: ["H1", "H4"],
    signals: "High-precision low-risk entry zone",
    confluence: ["OB or FVG at 61.8–79% level", "Kill Zone timing", "HTF discount/premium zone"],
  },
  {
    id: "po3",
    label: "Power of 3",
    tag: "tag-ict",
    short: "Accumulation → Manipulation → Distribution",
    detail: "ICT's Power of 3 describes the daily market cycle: Accumulation (Asia — range builds, orders filled), Manipulation (London — Judas swing takes out obvious stops in the wrong direction), Distribution (New York — the actual move in the true direction). Understanding this prevents entering on the fake London move.",
    timeframes: ["H1", "H4"],
    signals: "Daily bias framing — avoid Judas swing entries",
    confluence: ["Asia range identified", "London stop hunt confirmed", "New York continuation trade"],
  },
  {
    id: "bb",
    label: "Breaker Block",
    tag: "tag-ob",
    short: "Failed OB that flips role — strong signal",
    detail: "A Breaker Block forms when an Order Block fails to hold and price breaks through it. The breaker then flips — a former demand OB becomes supply (resistance), and vice versa. Breakers are considered stronger than regular OBs because they represent trapped traders. Price revisiting a breaker often produces sharp moves.",
    timeframes: ["H1", "H4"],
    signals: "High-velocity reversal at flipped structure",
    confluence: ["Aligns with HTF bias reversal", "FVG formed on break", "Liquidity above/below"],
  },
];

export default function SMCEducation({ expanded = false }: Props) {
  const [open, setOpen] = useState<string | null>(expanded ? concepts[0].id : null);

  return (
    <div style={{ marginTop: expanded ? 0 : 32 }}>
      {!expanded && (
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 3, height: 20, background: "var(--accent-cyan)", borderRadius: 2 }} />
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.15em", color: "var(--text-secondary)" }}>
            SMC / ICT CONCEPT REFERENCE
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {concepts.map((c) => (
          <div key={c.id} className="card-glass" style={{ cursor: "pointer" }}
            onClick={() => setOpen(open === c.id ? null : c.id)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`tag ${c.tag}`}>{c.label}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {c.timeframes.map((t) => (
                    <span key={t} style={{ fontSize: "0.58rem", padding: "1px 5px", background: "var(--bg-secondary)", borderRadius: 2, color: "var(--text-muted)" }}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: 8 }}>{open === c.id ? "▾" : "▸"}</span>
            </div>
            <div style={{ padding: "0 14px", paddingBottom: open === c.id ? 14 : 8 }}>
              <div style={{ fontSize: "0.67rem", color: "var(--text-muted)", marginBottom: open === c.id ? 10 : 0 }}>{c.short}</div>
              {open === c.id && (
                <div className="animate-fadeIn" style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                  <p style={{ fontSize: "0.67rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 10 }}>{c.detail}</p>
                  <div style={{ fontSize: "0.6rem", color: "var(--accent-gold)", marginBottom: 8 }}>
                    🎯 Signal use: {c.signals}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 4 }}>CONFLUENCE FACTORS:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {c.confluence.map((cf) => (
                        <span key={cf} style={{ fontSize: "0.58rem", padding: "2px 7px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 2, color: "var(--accent-cyan)" }}>
                          {cf}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
