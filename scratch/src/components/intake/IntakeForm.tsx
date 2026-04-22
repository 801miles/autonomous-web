"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, BrainCircuit, Target, Users,
  Sparkles, ShieldCheck, Database, CheckCircle2, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreRFT, type RFTResult, type RFTMode } from "@/lib/rft-scorer";
import { computeSignalStrength, type SignalResult } from "@/lib/signal-strength";
import { runDissonanceLint, type DissonanceResult } from "@/lib/dissonance-linter";
import { transmute, type IntakeData, type TechSpec } from "@/lib/transmutation";
import { SignalMeter } from "./SignalMeter";
import { RftSlider } from "./RftSlider";
import { DissonanceLinter } from "@/components/psych/DissonanceLinter";
import { PreflightModal } from "@/components/psych/PreflightModal";

const QUESTIONS = [
  {
    id: "utility" as const,
    title: "Core Utility",
    question: "What is the single non-negotiable conversion or outcome this platform must achieve in its first 30 seconds of interaction?",
    placeholder: "e.g. Schedule a discovery call with a high-intent enterprise lead.",
    icon: <Target className="w-5 h-5" />,
    tom: "This maps your entire organism hierarchy. The conversion goal determines which UI patterns receive maximum weight in the Atomic Design layer.",
  },
  {
    id: "psychography" as const,
    title: "Audience Psychography",
    question: "Describe your ideal visitor's dominant emotional friction and how your solution resolves it.",
    placeholder: "e.g. They feel overwhelmed by technical complexity; we resolve this with radical clarity and automation.",
    icon: <Users className="w-5 h-5" />,
    tom: "Understanding the visitor's belief state before arrival allows the designer unit to calibrate UX friction levels and the psychologist to pre-empt skepticism.",
  },
  {
    id: "identity" as const,
    title: "Identity Anchors",
    question: "Name three brand values that must be encoded into every design and code decision.",
    placeholder: "e.g. Transparency, Precision, Future-Proof.",
    icon: <Sparkles className="w-5 h-5" />,
    tom: "Identity Anchors become CSS variables and typographic tokens. 'Precision' → sharp corners, dense type. 'Warmth' → rounded, generous spacing.",
  },
  {
    id: "proof" as const,
    title: "Social Proof Strategy",
    question: "What specific social proof or data evidence will bridge the trust gap for a skeptical visitor?",
    placeholder: "e.g. 500+ deployments, Fortune 500 logos, CEO testimonials, 99.9% uptime SLA.",
    icon: <ShieldCheck className="w-5 h-5" />,
    tom: "Trust assets placed at the maximum skepticism inflection point — immediately post-offer — dissolve resistance before commitment.",
  },
  {
    id: "sync" as const,
    title: "Agent Synchronization",
    question: "Which Knowledge Items or AI contexts should be observed to align this build with your existing profiles?",
    placeholder: "e.g. Reference Nomadxe Midnight-Luxe palette, previous CRM integration logs.",
    icon: <Database className="w-5 h-5" />,
    tom: "Synchronizing with active knowledge items ensures design-system continuity across autonomous build cycles. Zero-regression, brand-coherent outputs.",
  },
];

export const IntakeForm = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    utility: "", psychography: "", identity: "", proof: "", sync: "",
  });
  const [rftMode, setRftMode] = useState<RFTMode>("autonomous");
  const [lockedRFT, setLockedRFT] = useState(0);
  const [preflightOpen, setPreflightOpen] = useState(false);
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [spec, setSpec] = useState<TechSpec | null>(null);

  // Derived real-time state
  const currentText = answers[QUESTIONS[step].id] ?? "";
  const [rftResult, setRftResult] = useState<RFTResult>({ score: 0, promotionWeight: 0, preventionWeight: 0, dominantTerms: [], label: "Neutral / Balanced", confidence: 0 });
  const [signalResult, setSignalResult] = useState<SignalResult>({ score: 0, entropy: 0, entityCount: 0, sentimentIntensity: 0, label: "Insufficient Signal", components: { H: 0, E: 0, I: 0 } });
  const [dissonanceResult, setDissonanceResult] = useState<DissonanceResult>({ severity: "none", dissonanceScore: 0, clashPhrases: [], tomBlindSpots: [], recommendation: "" });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-analyze on text change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const currentRFT = scoreRFT(currentText);
      setRftResult(currentRFT);
      setSignalResult(computeSignalStrength(answers));
      const lockedVal = rftMode === "locked" ? lockedRFT : currentRFT.score;
      setDissonanceResult(runDissonanceLint(currentText, lockedVal));
    }, 300);
  }, [currentText, answers, rftMode, lockedRFT]);

  const handleNext = () => {
    if (step === QUESTIONS.length - 1) {
      // Final submission
      if (dissonanceResult.severity === "active" && !preflightOpen) {
        setPreflightOpen(true);
        return;
      }
      handleTransmute();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleTransmute = async () => {
    setPreflightOpen(false);
    setIsTransmuting(true);
    // Simulate async processing
    await new Promise((r) => setTimeout(r, 2500));
    const data: IntakeData = {
      ...(answers as unknown as IntakeData),
      rftScore: rftMode === "locked" ? lockedRFT : rftResult.score,
    };
    const result = transmute(data);
    setSpec(result);
    setIsTransmuting(false);
    // Store in sessionStorage for dashboard consumption (single transmute call)
    sessionStorage.setItem("aao_spec", JSON.stringify(result));
    window.location.href = "/dashboard?status=orchestrating";
  };

  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[step];

  if (isTransmuting) return <TransmutationOverlay />;

  return (
    <>
      <PreflightModal
        open={preflightOpen}
        dissonance={dissonanceResult}
        rft={rftResult}
        onProceed={handleTransmute}
        onAdjust={() => setPreflightOpen(false)}
      />

      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">
            <span>Question {step + 1} / {QUESTIONS.length}</span>
            <span>Intake {Math.round(progress)}% Complete</span>
          </div>
          <div className="h-px w-full bg-white/5 relative overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <motion.div
                key={i}
                animate={{ backgroundColor: i < step ? "#8b5cf6" : i === step ? "#8b5cf680" : "#ffffff10" }}
                className="h-1 flex-1 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-8 space-y-6"
                style={{ boxShadow: dissonanceResult.severity !== "none" ? `0 0 30px rgba(245,158,11,0.08)` : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/15 rounded-xl text-primary">
                    {currentQ.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{currentQ.title}</h2>
                    <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest">Golden Question {step + 1}</p>
                  </div>
                </div>

                <label className="block space-y-3">
                  <span className="text-base font-medium text-foreground/70 leading-relaxed block">
                    {currentQ.question}
                  </span>
                  <textarea
                    id={`intake-${currentQ.id}`}
                    value={currentText}
                    onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                    placeholder={currentQ.placeholder}
                    rows={5}
                    className="w-full bg-white/5 border border-white/8 rounded-2xl p-4 text-sm text-foreground focus:border-primary/40 focus:ring-1 focus:ring-primary/30 transition-all outline-none resize-none font-sans placeholder:text-foreground/20"
                  />
                </label>

                {/* ToM Tooltip */}
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex gap-2.5 text-xs text-primary/60 leading-relaxed">
                  <BrainCircuit className="w-4 h-4 shrink-0 text-primary/40 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase text-[9px] tracking-widest block mb-1 text-primary/40">ToM Unit</span>
                    {currentQ.tom}
                  </div>
                </div>

                {/* Dissonance Linter (semi-active+) */}
                {dissonanceResult.severity !== "none" && (
                  <DissonanceLinter
                    text={currentText}
                    result={dissonanceResult}
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => step > 0 && setStep(step - 1)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
                      step === 0 ? "opacity-0 pointer-events-none" : "hover:bg-white/5"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentText.length < 10}
                    className="bg-primary disabled:opacity-40 text-white px-7 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:neon-glow transition-all disabled:cursor-not-allowed"
                  >
                    {step === QUESTIONS.length - 1 ? "Initialize Transmutation" : "Next Signal"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar: Signal Meter + RFT Slider */}
          <div className="space-y-4">
            <SignalMeter result={signalResult} />
            <RftSlider
              result={rftResult}
              mode={rftMode}
              lockedValue={lockedRFT}
              onModeChange={setRftMode}
              onLockChange={setLockedRFT}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const TransmutationOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full max-w-lg mx-auto glass rounded-3xl p-12 text-center space-y-6"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent mx-auto"
    />
    <div className="space-y-2">
      <h3 className="font-bold text-xl">Transmuting Intent</h3>
      <p className="text-sm text-foreground/40">
        The AAO units are expanding your signals into a 2,000-word industrial specification...
      </p>
    </div>
    <div className="font-mono text-xs text-foreground/20 space-y-1">
      <p>[Engineer] → Atomic Design mapping...</p>
      <p>[UX Lead] → Psychographic calibration...</p>
      <p>[Psychologist] → RFT hardening...</p>
      <p>[ToM Unit] → Blind spot validation...</p>
    </div>
  </motion.div>
);

export default IntakeForm;
