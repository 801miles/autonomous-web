"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Brain, Zap, RotateCcw } from "lucide-react";
import { PsychHeatmap } from "@/components/dashboard/PsychHeatmap";
import { AgentConsensus } from "@/components/dashboard/AgentConsensus";
import { SpecAsCode } from "@/components/dashboard/SpecAsCode";
import { transmute, type TechSpec, type IntakeData } from "@/lib/transmutation";
import { toast } from "@/components/ui/Toast";

// Fallback demo spec for direct navigation (no intake session)
const DEMO_INTAKE: IntakeData = {
  utility: "Convert enterprise visitors into booked discovery calls within 30 seconds of arrival.",
  psychography: "They feel overwhelmed by vendor complexity and risk. We resolve this with radical transparency and proven outcomes.",
  identity: "Precision, Trust, Future-Proof",
  proof: "500+ enterprise deployments, Fortune 500 logos, 99.9% uptime SLA, CEO testimonials.",
  sync: "Reference Nomadxe Midnight-Luxe palette, previous AAA platform session.",
  rftScore: 0.3,
};

const DEMO_SPEC = transmute(DEMO_INTAKE);

export default function DashboardPage() {
  const [spec, setSpec] = useState<TechSpec>(DEMO_SPEC);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [sourceLabel, setSourceLabel] = useState<"demo" | "live">("demo");

  const handleNewIntake = useCallback(() => {
    sessionStorage.removeItem("aao_spec");
    window.location.href = "/intake";
  }, []);

  useEffect(() => {
    // Read the spec the IntakeForm serialized into sessionStorage
    try {
      const raw = sessionStorage.getItem("aao_spec");
      if (raw) {
        const parsed: TechSpec = JSON.parse(raw);
        setSpec(parsed);
        setSourceLabel("live");
        const params = new URLSearchParams(window.location.search);
        if (params.get("status") === "orchestrating") {
          setIsOrchestrating(true);
          const timer = setTimeout(() => setIsOrchestrating(false), 2200);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // Malformed storage — fall back to demo spec silently
    }
  }, []);

  // Handle Stripe redirect query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("export_success") === "true") {
      toast({
        variant: "success",
        title: "Generation Package Unlocked! 🎉",
        description: "Your production deliverables are now unlocked. Use the deploy buttons below.",
        duration: 8000,
      });
      // Clean URL without hard reload
      window.history.replaceState({}, "", "/dashboard");
    } else if (params.get("export_cancelled") === "true") {
      toast({
        variant: "info",
        title: "Checkout cancelled",
        description: "No charge was made. Unlock production generation anytime for $29.",
        duration: 6000,
      });
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  if (isOrchestrating) return <OrchestratingOverlay />;

  return (
    <div className="flex flex-col min-h-screen pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-20 left-0 w-1/4 h-full bg-cyan-500/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-10 right-0 w-1/3 h-2/3 bg-purple-500/10 blur-[160px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl space-y-8">
        {/* Page header */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30 mb-4">
            <LayoutDashboard className="w-3 h-3" />
            AAO / Orchestration / Abstraction Stage
          </div>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Orchestration Dashboard</h1>
              <p className="text-foreground/40 text-sm mt-1">
                {sourceLabel === "live" ? "Live specification — derived from your intake signals." : "Demo specification — complete an intake to see live output."}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="glass px-4 py-2 rounded-xl text-xs font-medium">
                RFT Profile: <span className="text-primary font-bold">{spec.rftProfile}</span>
              </div>
              {sourceLabel === "live" ? (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded-xl ring-1 ring-cyan-400/20">
                  <Brain className="w-3 h-3" /> Live Spec
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-400/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-xl ring-1 ring-amber-400/20">
                  <Brain className="w-3 h-3" /> Demo Mode
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-400/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-xl ring-1 ring-emerald-400/20">
                <Brain className="w-3 h-3" /> Spec Complete
              </div>
              <button
                onClick={handleNewIntake}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-xl ring-1 ring-primary/20 hover:bg-primary/20 transition-all"
              >
                {sourceLabel === "live" ? <RotateCcw className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                {sourceLabel === "live" ? "New Intake" : "Start Intake"}
              </button>
            </div>
          </div>
        </div>

        {/* Row 1: Heatmap + Consensus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <PsychHeatmap spec={spec} />
          <AgentConsensus spec={spec} />
        </motion.div>

        {/* Row 2: Spec-as-Code (full width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SpecAsCode spec={spec} />
        </motion.div>
      </div>
    </div>
  );
}

function OrchestratingOverlay() {
  const steps = [
    "[Engineer] → Resolving Atomic Design hierarchy...",
    "[UX Lead] → Calibrating psychographic friction layers...",
    "[Psychologist] → Hardening RFT token weights...",
    "[ToM Unit] → Validating blind spot coverage...",
    "[Consensus] → Specification sealed. Rendering dashboard...",
  ];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((c) => (c < steps.length ? c + 1 : c));
    }, 380);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-background/90 backdrop-blur-lg z-50"
      >
        <div className="glass rounded-3xl p-12 max-w-lg w-full mx-6 text-center space-y-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-14 h-14 rounded-full border-2 border-primary border-t-transparent mx-auto"
          />
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl">Orchestrating Specification</h3>
            <p className="text-xs text-foreground/40">AAO units are reaching consensus on your live intent signals.</p>
          </div>
          <div className="font-mono text-xs text-left space-y-2">
            {steps.slice(0, visibleCount).map((s, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={i === visibleCount - 1 ? "text-primary" : "text-foreground/30"}
              >
                {s}
              </motion.p>
            ))}
          </div>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

