"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Layers, Cpu, BrainCircuit, Activity, Zap } from "lucide-react";

// Animated preview panel signals — simulates a live intake session
const PREVIEW_SIGNALS = [
  { label: "Signal Strength", value: "0.82", color: "#22c55e", unit: "S" },
  { label: "RFT Polarity", value: "+0.41", color: "#8b5cf6", unit: "P" },
  { label: "Dissonance", value: "passive", color: "#f59e0b", unit: "D" },
  { label: "Entity Density", value: "14 terms", color: "#06b6d4", unit: "E" },
];

const STREAM_LOGS = [
  { agent: "Engineer", msg: "Mapping Atomic Design hierarchy...", color: "#06b6d4" },
  { agent: "UX Lead", msg: "Calibrating psychographic friction...", color: "#a855f7" },
  { agent: "Psychologist", msg: "RFT hardening tokens → promotion mode", color: "#f59e0b" },
  { agent: "ToM", msg: "Blind spot analysis: Security flagged.", color: "#22c55e" },
  { agent: "Consensus", msg: "Specification sealed. ✓ Zero-drift.", color: "#8b5cf6" },
];

const Hero = () => {
  const [logIndex, setLogIndex] = useState(0);
  const [bars, setBars] = useState([0.4, 0.6, 0.75, 0.3, 0.9, 0.55]);

  // Animate the signal bars
  useEffect(() => {
    const t = setInterval(() => {
      setBars((b) => b.map(() => 0.2 + Math.random() * 0.75));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  // Stream log entries
  useEffect(() => {
    const t = setInterval(() => {
      setLogIndex((i) => (i + 1) % STREAM_LOGS.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden flex items-center">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
        >
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Archon Orchestrator v2.0
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.08]"
        >
          From Intent to{" "}
          <span className="text-gradient">Infrastructure</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-foreground/55 max-w-2xl mb-10 leading-relaxed"
        >
          Five psychographically-engineered questions. One 2,000-word industrial specification. 
          Zero architectural guesswork. The{" "}
          <span className="text-primary font-semibold">Archon Core</span> transmutes intent into 
          production-grade ecosystems autonomously.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link
            href="/intake"
            className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-base hover:neon-glow hover:scale-105 transition-all shadow-xl shadow-primary/25 active:scale-95"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            Begin Deep Intake
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="glass flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/10 hover:scale-105 transition-all active:scale-95"
          >
            View Orchestration
            <Layers className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Live Preview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full max-w-5xl glass rounded-3xl overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                archon_v2 · live_simulation
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {/* Left: Signal Matrix */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">
                <Activity className="w-3 h-3" />
                Signal Matrix · Real-time
              </div>

              {/* Animated Bars */}
              <div className="space-y-3">
                {["Entropy", "Entity Density", "Sentiment", "Coherence", "RFT Weight", "Signal Score"].map((label, i) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-foreground/30">
                      <span>{label}</span>
                      <span>{(bars[i] * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${bars[i] * 100}%` }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, #8b5cf6 0%, ${bars[i] > 0.6 ? "#22c55e" : bars[i] > 0.4 ? "#f59e0b" : "#ef4444"} 100%)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Signal readouts */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {PREVIEW_SIGNALS.map((sig) => (
                  <div key={sig.label} className="bg-white/3 rounded-xl p-3 space-y-1">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-foreground/25">{sig.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-base font-mono" style={{ color: sig.color }}>{sig.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Agent Consensus Stream */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">
                <BrainCircuit className="w-3 h-3" />
                Agent Consensus · Streaming
              </div>

              <div className="space-y-2 font-mono text-xs">
                {STREAM_LOGS.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i <= logIndex ? 1 : 0.15 }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-2"
                  >
                    <span className="font-bold shrink-0" style={{ color: log.color }}>
                      [{log.agent}]
                    </span>
                    <span className={i === logIndex ? "text-foreground/80" : "text-foreground/25"}>
                      {log.msg}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Animated spec preview */}
              <div className="mt-4 bg-white/3 rounded-2xl p-4 space-y-3">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground/25">
                  Specification Preview
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={logIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="space-y-2"
                  >
                    {["Atomic Design Map", "CSS Token Set", "Component Directives", "Agent Debate Log"].map((item, i) => (
                      <div key={item} className="flex items-center gap-2">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                          className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                        />
                        <span className="text-[10px] text-foreground/40 font-mono">{item}</span>
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[9px] text-emerald-400 font-mono font-bold">✓</span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/20 pt-2">
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block w-2 h-3.5 bg-primary"
                />
                AWAITING_INTAKE_SIGNALS...
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-8 mt-12 text-center"
        >
          {[
            { value: "5", label: "Golden Questions" },
            { value: "4", label: "Archon Agents" },
            { value: "2K", label: "Word Specification" },
            { value: "0", label: "Architectural Guesses" },
          ].map(({ value, label }) => (
            <div key={label} className="space-y-1">
              <div className="text-2xl font-bold text-gradient">{value}</div>
              <div className="text-xs text-foreground/30 font-medium uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
