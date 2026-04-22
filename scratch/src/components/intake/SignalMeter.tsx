"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap } from "lucide-react";
import { type SignalResult, getSignalColor } from "@/lib/signal-strength";
import { cn } from "@/lib/utils";

interface SignalMeterProps {
  result: SignalResult;
  className?: string;
}

export const SignalMeter = ({ result, className }: SignalMeterProps) => {
  const color = getSignalColor(result.score);

  return (
    <div className={cn("glass rounded-2xl p-5 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Activity className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">
            Signal Strength
          </span>
        </div>
        <motion.span
          key={result.score}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-xl font-mono"
          style={{ color }}
        >
          {result.score}
          <span className="text-xs text-foreground/30 font-normal ml-0.5">/ 100</span>
        </motion.span>
      </div>

      {/* Primary score bar */}
      <div className="space-y-1">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.score}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="text-[10px] text-foreground/30 font-mono italic">{result.label}</span>
      </div>

      {/* Formula breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <ComponentBar label="H · Entropy" value={result.components.H} alpha="α" color="#8b5cf6" />
        <ComponentBar label="E · Entity" value={result.components.E} alpha="β" color="#06b6d4" />
        <ComponentBar label="I · Intensity" value={result.components.I} alpha="γ" color="#f59e0b" />
      </div>

      <div className="text-[10px] font-mono text-foreground/20 text-center select-none">
        S = 0.40·H + 0.35·E + 0.25·I
      </div>
    </div>
  );
};

const ComponentBar = ({ label, value, alpha, color }: { label: string; value: number; alpha: string; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-mono font-bold" style={{ color }}>{alpha}</span>
      <span className="text-[9px] font-mono text-foreground/30">{Math.round(value * 100)}</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
    <span className="text-[8px] text-foreground/20 font-mono block truncate">{label}</span>
  </div>
);

export default SignalMeter;
