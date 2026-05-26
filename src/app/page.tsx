"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TickerBar from "@/components/TickerBar";
import StatsBar from "@/components/StatsBar";
import SignalCard from "@/components/SignalCard";
import SMCEducation from "@/components/SMCEducation";
import MarketBiasPanel from "@/components/MarketBiasPanel";
import SignalFilters from "@/components/SignalFilters";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { FOREX_PAIRS } from "@/lib/forex-data";
import type { Signal } from "@/lib/forex-data";

const DEFAULT_PAIRS = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "GBPJPY"];

export default function Home() {
  const [signals, setSignals] = useState<Record<string, Signal | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedPairs, setSelectedPairs] = useState<string[]>(DEFAULT_PAIRS);
  const [filterDir, setFilterDir] = useState<"ALL" | "BUY" | "SELL" | "WAIT">("ALL");
  const [filterTF, setFilterTF] = useState<"ALL" | "M15" | "H1" | "H4">("ALL");
  const [activeTab, setActiveTab] = useState<"signals" | "bias" | "education">("signals");
  const [initialized, setInitialized] = useState(false);

  const fetchSignal = useCallback(async (pair: string) => {
    setLoading((prev) => ({ ...prev, [pair]: true }));
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair }),
      });
      const data = await res.json();
      if (data.signal) {
        setSignals((prev) => ({ ...prev, [pair]: data.signal }));
      }
    } catch (e) {
      console.error("Failed to fetch signal for", pair);
    } finally {
      setLoading((prev) => ({ ...prev, [pair]: false }));
    }
  }, []);

  // Initial load — fetch all selected pairs
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    selectedPairs.forEach((pair, i) => {
      setTimeout(() => fetchSignal(pair), i * 600);
    });
  }, [initialized, selectedPairs, fetchSignal]);

  const handleAddPair = (pair: string) => {
    if (!selectedPairs.includes(pair)) {
      setSelectedPairs((prev) => [...prev, pair]);
      fetchSignal(pair);
    }
  };

  const handleRemovePair = (pair: string) => {
    setSelectedPairs((prev) => prev.filter((p) => p !== pair));
    setSignals((prev) => { const n = { ...prev }; delete n[pair]; return n; });
  };

  const visibleSignals = selectedPairs
    .map((p) => signals[p])
    .filter((s): s is Signal => {
      if (!s) return false;
      if (filterDir !== "ALL" && s.direction !== filterDir) return false;
      if (filterTF !== "ALL" && s.timeframe !== filterTF) return false;
      return true;
    });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TickerBar />
      <StatsBar />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px 60px" }}>

        {/* Hero */}
        <HeroSection />

        {/* Tab Nav */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
          {(["signals", "bias", "education"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--accent-gold)" : "2px solid transparent",
                color: activeTab === tab ? "var(--accent-gold)" : "var(--text-muted)",
                marginBottom: -1,
                transition: "all 0.2s",
              }}
            >
              {tab === "signals" ? "⚡ Live Signals" : tab === "bias" ? "📊 Market Bias" : "📚 SMC/ICT Guide"}
            </button>
          ))}
        </div>

        {/* SIGNALS TAB */}
        {activeTab === "signals" && (
          <div>
            <SignalFilters
              selectedPairs={selectedPairs}
              allPairs={FOREX_PAIRS.map((p) => p.symbol)}
              onAdd={handleAddPair}
              onRemove={handleRemovePair}
              filterDir={filterDir}
              setFilterDir={setFilterDir}
              filterTF={filterTF}
              setFilterTF={setFilterTF}
              onRefreshAll={() => selectedPairs.forEach((p, i) => setTimeout(() => fetchSignal(p), i * 500))}
            />

            {/* Loading placeholders */}
            {selectedPairs.some((p) => loading[p] || !signals[p]) && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                {selectedPairs.filter((p) => loading[p] || !signals[p]).map((pair) => (
                  <div key={pair} className="card-glass p-4" style={{ minHeight: 320 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="skeleton" style={{ width: 80, height: 20, borderRadius: 4 }} />
                      <div className="skeleton" style={{ width: 40, height: 18, borderRadius: 3 }} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="loading-spinner" />
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Analyzing {pair} with AI...</span>
                    </div>
                    {[1,2,3,4].map((n) => (
                      <div key={n} className="skeleton mb-2" style={{ height: 14, borderRadius: 3, width: `${70 + n * 5}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Signal Cards */}
            {visibleSignals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fadeInUp">
                {visibleSignals.map((signal) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    onRefresh={() => fetchSignal(signal.pair)}
                    loading={loading[signal.pair]}
                  />
                ))}
              </div>
            ) : (
              !selectedPairs.some((p) => loading[p] || !signals[p]) && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  No signals match your filters. Try changing direction or timeframe filters.
                </div>
              )
            )}

            <SMCEducation />
          </div>
        )}

        {/* BIAS TAB */}
        {activeTab === "bias" && (
          <MarketBiasPanel pairs={selectedPairs} />
        )}

        {/* EDUCATION TAB */}
        {activeTab === "education" && (
          <EducationPage />
        )}
      </main>
      <Footer />
    </div>
  );
}

function EducationPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          SMC & ICT Concepts — Complete Guide
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          Every signal generated by KB AI is rooted in Smart Money Concepts (SMC) and ICT methodology.
          Understanding these concepts will help you read and execute signals with confidence.
        </p>
      </div>

      <SMCEducation expanded />

      <div style={{ marginTop: 40, padding: "24px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
        <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--accent-gold)", letterSpacing: "0.1em", marginBottom: 16 }}>
          HOW KB AI GENERATES SIGNALS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "01", title: "HTF Bias", desc: "H4 chart is analyzed first to establish bullish or bearish bias. Smart Money directional flow is identified using BOS/CHoCH sequences." },
            { step: "02", title: "POI Identification", desc: "Points of Interest — Order Blocks, FVGs, Breaker Blocks — are mapped on H1. These are the zones where institutional orders are likely placed." },
            { step: "03", title: "M15 Entry Trigger", desc: "On M15, the AI waits for confirmation: a liquidity sweep, CHoCH, or displacement into the POI. Entry, SL behind structure, TP at liquidity pools." },
          ].map((s) => (
            <div key={s.step} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: 6, borderLeft: "3px solid var(--accent-gold)" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "var(--border-bright)", marginBottom: 4 }}>{s.step}</div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: 6, letterSpacing: "0.05em" }}>{s.title}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, padding: "20px 24px", background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.2)", borderRadius: 8 }}>
        <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          <span style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>⚠ RISK DISCLAIMER // </span>
          Trading Forex and commodities carries significant risk. AI-generated signals are for educational and informational purposes only.
          Always use proper risk management — never risk more than 1–2% of your account per trade. Past performance is not indicative of future results.
          Trading With KB is not a licensed financial advisor.
        </div>
      </div>
    </div>
  );
}
