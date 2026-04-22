"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { type TechSpec } from "@/lib/transmutation";
import { cn } from "@/lib/utils";

interface PsychHeatmapProps {
  spec: TechSpec;
}

type FilterMode = "all" | "fear" | "gain";

export const PsychHeatmap = ({ spec }: PsychHeatmapProps) => {
  const [filter, setFilter] = useState<FilterMode>("all");

  // RFT adjustment applied on top of per-component bias from transmutation engine
  const getRftAdjustedGain = (base: number) => {
    const rftBoost = spec.rftProfile.startsWith("Promotion") ? 0.05 : -0.05;
    return Math.max(0, Math.min(1, base + rftBoost));
  };

  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Psychographic Heatmap</h3>
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {(["all", "gain", "fear"] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === f
                  ? f === "gain" ? "bg-emerald-500 text-white"
                    : f === "fear" ? "bg-rose-500 text-white"
                    : "bg-primary text-white"
                  : "text-foreground/30 hover:text-foreground/60"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/60" />
          Gain / Promotion
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-rose-500/60" />
          Fear / Prevention
        </div>
      </div>

      {/* Live component rows from spec.componentMap */}
      <div className="space-y-3">
        {spec.componentMap.map((comp, i) => {
          const gain = getRftAdjustedGain(comp.gainBias);
          const fear = 1 - gain;

          if (filter === "gain" && gain < 0.5) return null;
          if (filter === "fear" && fear < 0.5) return null;

          return (
            <motion.div
              key={comp.component}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-foreground/30">
                    {comp.atom}
                  </span>
                  <span className="text-sm font-medium">{comp.component}</span>
                </div>
                <span className="text-[9px] text-foreground/30 font-mono truncate max-w-[120px]">
                  {comp.psychologicalFunction.split(" ").slice(0, 3).join(" ")}…
                </span>
              </div>
              <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gain * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="h-full bg-emerald-500/50 rounded-l-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fear * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="h-full bg-rose-500/50 rounded-r-full"
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-foreground/20 px-0.5">
                <span>Gain {(gain * 100).toFixed(0)}%</span>
                <span>Fear {(fear * 100).toFixed(0)}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-foreground/20 border-t border-white/5 pt-4">
        RFT Profile: <span className="text-primary">{spec.rftProfile}</span>{" "}
        · {spec.componentMap.length} components · heatmap RFT-adjusted.
      </div>
    </div>
  );
};

export default PsychHeatmap;
