"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, Eye } from "lucide-react";
import { type DissonanceResult, type ClashPhrase, getDissonanceGlow } from "@/lib/dissonance-linter";
import { cn } from "@/lib/utils";

interface DissonanceLinterProps {
  text: string;
  result: DissonanceResult;
  className?: string;
}

export const DissonanceLinter = ({ text, result, className }: DissonanceLinterProps) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const boxShadow = getDissonanceGlow(result.severity);

  if (result.severity === "none" && result.tomBlindSpots.length === 0) return null;

  // Build annotated text segments
  const segments = buildAnnotatedSegments(text, result.clashPhrases, result.severity === "semi-active" || result.severity === "active");

  const severityConfig = {
    passive: { color: "amber", icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, label: "Minor Divergence" },
    "semi-active": { color: "orange", icon: <AlertTriangle className="w-4 h-4 text-orange-400" />, label: "Signal Clash Detected" },
    active: { color: "red", icon: <AlertTriangle className="w-4 h-4 text-red-400" />, label: "Critical Dissonance" },
    none: { color: "primary", icon: null, label: "" },
  };
  const config = severityConfig[result.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl border overflow-hidden", className)}
      style={{
        borderColor: result.severity === "active" ? "rgba(239,68,68,0.3)" :
                     result.severity === "semi-active" ? "rgba(249,115,22,0.3)" :
                     "rgba(245,158,11,0.2)",
        boxShadow,
        background: "rgba(15,15,25,0.6)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/60">{config.label}</span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-foreground/30">
            {(result.dissonanceScore * 100).toFixed(0)}% dissonance
          </span>
        </div>
        <Eye className="w-3 h-3 text-foreground/20" />
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Recommendation */}
        <p className="text-xs text-foreground/50 leading-relaxed font-medium">{result.recommendation}</p>

        {/* Annotated text (semi-active+) */}
        {(result.severity === "semi-active" || result.severity === "active") && result.clashPhrases.length > 0 && (
          <div className="bg-white/3 rounded-xl p-3 text-sm font-sans leading-relaxed relative">
            {segments.map((seg, i) =>
              seg.clash ? (
                <span key={i} className="relative inline-block">
                  <span
                    className="underline decoration-wavy decoration-orange-400 cursor-help"
                    onMouseEnter={() => setActiveTooltip(seg.reason ?? null)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    {seg.text}
                  </span>
                  <AnimatePresence>
                    {activeTooltip === seg.reason && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        className="absolute z-50 bottom-full left-0 mb-2 w-64 glass rounded-xl p-3 text-[11px] text-foreground/70 leading-relaxed shadow-xl"
                      >
                        <div className="flex gap-2">
                          <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <span><strong className="text-primary/80">ToM Unit:</strong> {seg.reason}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
              ) : (
                <span key={i} className="text-foreground/50">{seg.text}</span>
              )
            )}
          </div>
        )}

        {/* ToM Blind Spots */}
        {result.tomBlindSpots.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">
              ToM Blind Spots Detected
            </span>
            {result.tomBlindSpots.map((spot, i) => (
              <div key={i} className="flex gap-2 text-[11px] text-foreground/50 leading-relaxed">
                <span className="text-primary/60 shrink-0">→</span>
                {spot}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

function buildAnnotatedSegments(
  text: string,
  clashPhrases: ClashPhrase[],
  annotate: boolean
): Array<{ text: string; clash: boolean; reason?: string }> {
  if (!annotate || clashPhrases.length === 0) {
    return [{ text, clash: false }];
  }

  const segments: Array<{ text: string; clash: boolean; reason?: string }> = [];
  let cursor = 0;
  const sorted = [...clashPhrases].sort((a, b) => a.startIndex - b.startIndex);

  for (const clash of sorted) {
    if (cursor < clash.startIndex) {
      segments.push({ text: text.slice(cursor, clash.startIndex), clash: false });
    }
    segments.push({ text: text.slice(clash.startIndex, clash.endIndex), clash: true, reason: clash.clashReason });
    cursor = clash.endIndex;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), clash: false });
  }

  return segments;
}

export default DissonanceLinter;
