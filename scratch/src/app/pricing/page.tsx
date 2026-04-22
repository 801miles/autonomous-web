import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Check, X, Zap, Download, GitBranch, ArrowRight } from "lucide-react";
import { executionRoles, monetizationNarrative } from "@/lib/revenue-ops";

export const metadata: Metadata = {
  title: "Pricing",
  description: "One-time $29 production generation unlock. Generate website concepts for free, pay when you're ready to ship production deliverables.",
};

const FREE_FEATURES = [
  { text: "5 Golden Intake Questions", included: true },
  { text: "Real-time Signal Analysis", included: true },
  { text: "Psychographic RFT Scoring", included: true },
  { text: "Dissonance Detection", included: true },
  { text: "Live Orchestration Dashboard", included: true },
  { text: "Agent Consensus Visualization", included: true },
  { text: "Specification Preview", included: true },
  { text: "Production Website Build Package", included: false },
  { text: "Push to GitHub", included: false },
  { text: "Download as .ZIP", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Everything in Free", included: true },
  { text: "Production Website Build Package", included: true },
  { text: "Push to GitHub", included: true },
  { text: "Download as .ZIP", included: true },
  { text: "Cross-Platform Handoff Spec (Web + Mobile)", included: true },
  { text: "Full Component Directives", included: true },
  { text: "Atomic Design Map", included: true },
  { text: "Priority Agent Processing", included: true },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-20 px-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/15 blur-[160px] rounded-full" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Simple Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Generate for <span className="text-gradient">Free</span>. Pay when <span className="text-gradient">Shipping</span>.
          </h1>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed">
            {monetizationNarrative.headline}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="glass rounded-3xl p-8 space-y-8 flex flex-col">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground/60">Explorer</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-foreground/30 text-sm">forever</span>
              </div>
              <p className="text-sm text-foreground/40">
                Full access to intent analysis, psychographic profiling, and website blueprint generation.
              </p>
            </div>

            <ul className="space-y-3 flex-1">
              {FREE_FEATURES.map((feat) => (
                <li key={feat.text} className="flex items-center gap-3 text-sm">
                  {feat.included ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-foreground/15 shrink-0" />
                  )}
                  <span className={feat.included ? "text-foreground/70" : "text-foreground/25"}>
                    {feat.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/intake"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl glass font-bold text-sm hover:bg-white/10 hover:scale-[1.02] transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-primary" />
              Start Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="relative glass rounded-3xl p-8 space-y-8 flex flex-col ring-1 ring-primary/30 shadow-xl shadow-primary/10">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
              Ship Ready
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-primary">Architect</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-foreground/30 text-sm">one-time</span>
              </div>
              <p className="text-sm text-foreground/40">
                Unlock your production package for web deployment and mobile handoff assets.
              </p>
            </div>

            <ul className="space-y-3 flex-1">
              {PREMIUM_FEATURES.map((feat) => (
                <li key={feat.text} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground/70">{feat.text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/intake"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary font-bold text-sm hover:neon-glow hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-primary/25"
            >
              <ArrowRight className="w-4 h-4" />
              Begin Intake - Generate
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-center">Roles currently executing revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {executionRoles.map((role) => (
              <div key={role.id} className="glass rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold">{role.title}</h3>
                <p className="text-xs text-foreground/45 leading-relaxed">{role.objective}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">KPI: {role.kpi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ / Trust */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Answer 5 Questions", desc: "Our psychographic intake engine extracts your conversion intent, audience friction, and brand identity in minutes." },
              { step: "02", title: "Watch Agents Orchestrate", desc: "Four autonomous Archon agents (Engineer, UX Lead, Psychologist, ToM) debate and converge on your specification in real-time." },
              { step: "03", title: "Pay & Ship", desc: "Pay once to unlock your production generation package. Push to GitHub or download a deployment-ready .ZIP bundle." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="glass rounded-2xl p-6 space-y-3">
                <span className="text-xs font-mono font-bold text-primary">{step}</span>
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs text-foreground/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 text-center pt-8 border-t border-white/5">
          {[
            { icon: <Shield className="w-5 h-5" />, label: "Stripe Secure Checkout" },
            { icon: <Download className="w-5 h-5" />, label: "Instant Generation Package" },
            { icon: <GitBranch className="w-5 h-5" />, label: "GitHub Integration" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-foreground/30 text-xs font-medium">
              <span className="text-primary/50">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
