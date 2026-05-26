"use client";
import { useState } from "react";

interface Props {
  selectedPairs: string[];
  allPairs: string[];
  onAdd: (pair: string) => void;
  onRemove: (pair: string) => void;
  filterDir: "ALL" | "BUY" | "SELL" | "WAIT";
  setFilterDir: (v: "ALL" | "BUY" | "SELL" | "WAIT") => void;
  filterTF: "ALL" | "M15" | "H1" | "H4";
  setFilterTF: (v: "ALL" | "M15" | "H1" | "H4") => void;
  onRefreshAll: () => void;
}

export default function SignalFilters({
  selectedPairs, allPairs, onAdd, onRemove,
  filterDir, setFilterDir, filterTF, setFilterTF, onRefreshAll,
}: Props) {
  const [showPairMenu, setShowPairMenu] = useState(false);
  const available = allPairs.filter((p) => !selectedPairs.includes(p));

  const dirOptions = ["ALL", "BUY", "SELL", "WAIT"] as const;
  const tfOptions = ["ALL", "M15", "H1", "H4"] as const;

  const dirColor = (d: string) =>
    d === "BUY" ? "var(--buy-green)" : d === "SELL" ? "var(--sell-red)" : d === "WAIT" ? "var(--neutral)" : "var(--text-secondary)";

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Active pair chips */}
        {selectedPairs.map((p) => (
          <div key={p} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--bg-card)", border: "1px solid var(--border-bright)",
            borderRadius: 4, padding: "4px 10px", fontSize: "0.7rem",
          }}>
            <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>{p}</span>
            <button onClick={() => onRemove(p)} style={{
              background: "none", border: "none", color: "var(--text-muted)",
              cursor: "pointer", fontSize: "0.75rem", lineHeight: 1, padding: 0,
            }}>×</button>
          </div>
        ))}

        {/* Add pair */}
        <div style={{ position: "relative" }}>
          <button className="btn-outline" style={{ padding: "4px 12px", fontSize: "0.65rem" }}
            onClick={() => setShowPairMenu(!showPairMenu)}>
            + Add Pair
          </button>
          {showPairMenu && available.length > 0 && (
            <div style={{
              position: "absolute", top: "110%", left: 0, zIndex: 100,
              background: "var(--bg-card)", border: "1px solid var(--border-bright)",
              borderRadius: 6, minWidth: 140, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
              {available.map((p) => (
                <button key={p} onClick={() => { onAdd(p); setShowPairMenu(false); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "8px 14px", fontSize: "0.72rem",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-primary)", borderBottom: "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh all */}
        <button className="btn-primary" style={{ marginLeft: "auto", padding: "5px 14px", fontSize: "0.65rem" }}
          onClick={onRefreshAll}>
          ↻ Refresh All
        </button>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>DIRECTION:</span>
        {dirOptions.map((d) => (
          <button key={d} onClick={() => setFilterDir(d)} style={{
            padding: "3px 12px", fontSize: "0.65rem", fontWeight: 600,
            borderRadius: 3, border: "1px solid",
            cursor: "pointer", letterSpacing: "0.08em",
            background: filterDir === d ? "rgba(240,180,41,0.1)" : "none",
            borderColor: filterDir === d ? "var(--accent-gold)" : "var(--border)",
            color: filterDir === d ? "var(--accent-gold)" : dirColor(d),
            transition: "all 0.15s",
          }}>{d}</button>
        ))}

        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", marginLeft: 12 }}>TIMEFRAME:</span>
        {tfOptions.map((tf) => (
          <button key={tf} onClick={() => setFilterTF(tf)} style={{
            padding: "3px 12px", fontSize: "0.65rem", fontWeight: 600,
            borderRadius: 3, border: "1px solid",
            cursor: "pointer", letterSpacing: "0.08em",
            background: filterTF === tf ? "rgba(0,212,255,0.1)" : "none",
            borderColor: filterTF === tf ? "var(--accent-cyan)" : "var(--border)",
            color: filterTF === tf ? "var(--accent-cyan)" : "var(--text-muted)",
            transition: "all 0.15s",
          }}>{tf}</button>
        ))}

        <span style={{ marginLeft: "auto", fontSize: "0.6rem", color: "var(--text-muted)" }}>
          {selectedPairs.length} pairs monitored
        </span>
      </div>
    </div>
  );
}
