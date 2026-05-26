"use client";
import { getCurrentSession } from "@/lib/forex-data";
import { useEffect, useState } from "react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: "signals" | "bias" | "education") => void;
}

export default function Navbar({ activeTab, setActiveTab }: Props) {
  const [session, setSession] = useState("");

  useEffect(() => {
    setSession(getCurrentSession());
    const t = setInterval(() => setSession(getCurrentSession()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(7,10,15,0.97)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: "var(--accent-gold)", borderRadius: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(240,180,41,0.35)", flexShrink: 0,
          }}>
            <span style={{ color: "#000", fontWeight: 800, fontSize: "0.9rem", fontFamily: "Rajdhani, sans-serif" }}>KB</span>
          </div>
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", letterSpacing: "0.06em", lineHeight: 1.1 }}>
              TRADING WITH <span style={{ color: "var(--accent-gold)" }}>KB</span>
            </div>
            <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              AI SMC/ICT SIGNALS
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {([
            { id: "signals", label: "Signals" },
            { id: "bias", label: "Market Bias" },
            { id: "education", label: "SMC/ICT" },
          ] as const).map((l) => (
            <button key={l.id} onClick={() => setActiveTab(l.id)} style={{
              padding: "6px 16px", fontSize: "0.68rem", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
              background: activeTab === l.id ? "rgba(240,180,41,0.08)" : "none",
              border: "1px solid",
              borderColor: activeTab === l.id ? "rgba(240,180,41,0.3)" : "transparent",
              borderRadius: 4,
              color: activeTab === l.id ? "var(--accent-gold)" : "var(--text-muted)",
              transition: "all 0.15s",
            }}>{l.label}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 4, padding: "5px 10px",
            }}>
              <div className="live-dot" />
              <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", letterSpacing: "0.06em" }}>{session}</span>
            </div>
          )}
          <a href="#" style={{
            background: "var(--accent-gold)", color: "#000", fontWeight: 700,
            fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "7px 14px", borderRadius: 4, textDecoration: "none",
          }}>Join Free</a>
        </div>
      </div>
    </nav>
  );
}
