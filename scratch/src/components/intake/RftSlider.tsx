"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Cpu, Shield, Zap } from "lucide-react";
import { type RFTResult, type RFTMode, getRFTColor } from "@/lib/rft-scorer";
import { cn } from "@/lib/utils";

interface RftSliderProps {
  result: RFTResult;
  mode: RFTMode;
  lockedValue: number;     // -1 to +1, for manual lock
  onModeChange: (m: RFTMode) => void;
  onLockChange: (v: number) => void;
  className?: string;
}

const SPECTRUM_LABELS = [
  { pos: 0, label: "Prevention", icon: <Shield className="w-3 h-3" />, color: "#ef4444" },
  { pos: 50, label: "Neutral", icon: null, color: "#a855f7" },
  { pos: 100, label: "Promotion", icon: <Zap className="w-3 h-3" />, color: "#22c55e" },
];

export const RftSlider = ({ result, mode, lockedValue, onModeChange, onLockChange, className }: RftSliderProps) => {
  const displayScore = mode === "locked" ? lockedValue : result.score;
  const displayPct = ((displayScore + 1) / 2) * 100; // convert -1..+1 to 0..100
  const color = getRFTColor(displayScore);

  return (
    <div className={cn("glass rounded-2xl p-5 space-y-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">
            Motivational Focus
          </span>
          <p className="text-[10px] text-foreground/30 font-mono mt-0.5">Regulatory Focus Theory</p>
        </div>
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          <button
            onClick={() => onModeChange("autonomous")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              mode === "autonomous" ? "bg-primary text-white" : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            <Cpu className="w-3 h-3" /> NLP
          </button>
          <button
            onClick={() => onModeChange("locked")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              mode === "locked" ? "bg-primary text-white" : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            <Lock className="w-3 h-3" /> Lock
          </button>
        </div>
      </div>

      {/* Spectrum Track */}
      <div className="relative pt-2 pb-6">
        {/* Background gradient track */}
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500/40 via-violet-500/40 to-emerald-500/40 relative overflow-visible">
          {/* Tick marks */}
          {SPECTRUM_LABELS.map(({ pos }) => (
            <div
              key={pos}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/10"
              style={{ left: `${pos}%` }}
            />
          ))}

          {/* Indicator thumb */}
          <motion.div
            animate={{ left: `${displayPct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-lg z-10 border-2 border-background"
            style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}88` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 px-0.5">
          {SPECTRUM_LABELS.map(({ pos, label, icon, color: c }) => (
            <div key={pos} className="flex flex-col items-center gap-0.5">
              {icon && <span style={{ color: c }} className="opacity-70">{icon}</span>}
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: c, opacity: 0.7 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Manual lock input range (only shown when locked) */}
        {mode === "locked" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <input
              type="range"
              min={-100}
              max={100}
              step={1}
              value={Math.round(lockedValue * 100)}
              onChange={(e) => onLockChange(Number(e.target.value) / 100)}
              className="w-full accent-primary"
            />
          </motion.div>
        )}
      </div>

      {/* Score + Label + Dominant Terms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <motion.span
            key={displayScore.toFixed(2)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold font-mono"
            style={{ color }}
          >
            {displayScore > 0 ? "+" : ""}{displayScore.toFixed(2)}
          </motion.span>
          <span className="text-xs font-bold text-foreground/40">{result.label}</span>
        </div>

        {result.dominantTerms.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {result.dominantTerms.map((term) => (
              <span key={term} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-foreground/40 border border-white/5">
                {term}
              </span>
            ))}
          </div>
        )}

        {mode === "autonomous" && result.confidence < 0.3 && (
          <p className="text-[10px] text-amber-400/70 font-mono">
            Low signal density. Add more specificity for accurate NLP detection.
          </p>
        )}
      </div>
    </div>
  );
};

export default RftSlider;
