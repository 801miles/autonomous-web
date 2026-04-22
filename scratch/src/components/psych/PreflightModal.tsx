"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, CheckCircle, ArrowRight } from "lucide-react";
import { type DissonanceResult } from "@/lib/dissonance-linter";
import { type RFTResult } from "@/lib/rft-scorer";

interface PreflightModalProps {
  open: boolean;
  dissonance: DissonanceResult;
  rft: RFTResult;
  onProceed: () => void;
  onAdjust: () => void;
}

export const PreflightModal = ({ open, dissonance, rft, onProceed, onAdjust }: PreflightModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="glass rounded-3xl w-full max-w-xl p-8 space-y-8 border"
              style={{
                borderColor: "rgba(239,68,68,0.3)",
                boxShadow: "0 0 40px rgba(239,68,68,0.15), 0 0 80px rgba(239,68,68,0.05)",
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-2xl shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Pre-Flight Strategy Check</h2>
                  <p className="text-sm text-foreground/40 mt-1">
                    Dissonance threshold exceeded. Your language and stated strategy are misaligned.
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">Dissonance</span>
                  <div className="text-2xl font-bold text-red-400 font-mono">
                    {(dissonance.dissonanceScore * 100).toFixed(0)}%
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${dissonance.dissonanceScore * 100}%` }} />
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">RFT Score</span>
                  <div className="text-2xl font-bold font-mono" style={{ color: rft.score > 0 ? "#22c55e" : "#ef4444" }}>
                    {rft.score > 0 ? "+" : ""}{rft.score.toFixed(2)}
                  </div>
                  <div className="text-xs text-foreground/30">{rft.label}</div>
                </div>
              </div>

              {/* Blind spots */}
              {dissonance.tomBlindSpots.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">
                    ToM Blind Spots
                  </span>
                  <ul className="space-y-2">
                    {dissonance.tomBlindSpots.slice(0, 3).map((spot, i) => (
                      <li key={i} className="flex gap-2 text-xs text-foreground/50 leading-relaxed">
                        <span className="text-amber-400 shrink-0">⚠</span>
                        {spot}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onAdjust}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-sm"
                >
                  <X className="w-4 h-4" /> Revise Strategy
                </button>
                <button
                  onClick={onProceed}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-red-500/80 hover:bg-red-500 transition-all text-sm text-white"
                >
                  Proceed Anyway <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-foreground/20 font-mono italic">
                "Proceed Anyway" overrides the dissonance gating. The specification will be generated with current inputs and flagged for manual review.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PreflightModal;
