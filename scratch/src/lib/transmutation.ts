/**
 * Transmutation Engine
 * Expands the 5 Golden Questions into a structured Technical Specification (PRD).
 * Also generates the Agent Consensus debate log for the Dashboard.
 */

import { type RFTPolarity } from "./rft-scorer";

export interface IntakeData {
  utility: string;
  psychography: string;
  identity: string;
  proof: string;
  sync: string;
  rftScore: RFTPolarity;
}

export interface TechSpec {
  title: string;
  timestamp: string;
  rftProfile: string;
  sections: SpecSection[];
  cssVariables: Record<string, string>;
  componentMap: ComponentDirective[];
  agentLog: AgentLogEntry[];
}

export interface SpecSection {
  heading: string;
  unit: "Engineer" | "UX Lead" | "Psychologist" | "ToM Specialist";
  content: string;
}

export interface ComponentDirective {
  atom: string;
  component: string;
  purpose: string;
  serverComponent: boolean;
  psychologicalFunction: string;
  gainBias: number;   // 0.0–1.0: proportion of gain-frame weight
  fearBias: number;   // 0.0–1.0: proportion of fear-frame weight (1 - gainBias)
}

export interface AgentLogEntry {
  time: string;
  agent: "Engineer" | "UX Lead" | "Psychologist" | "ToM";
  message: string;
  type: "info" | "debate" | "consensus" | "warning";
}

// CSS psychographic hardening based on RFT score
function generateCSSVariables(rft: RFTPolarity): Record<string, string> {
  if (rft > 0.4) {
    // Promotion: high-contrast, kinetic, eager
    return {
      "--radius": "1rem",
      "--transition-speed": "150ms",
      "--cta-weight": "800",
      "--hero-gradient": "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
      "--primary-action": "#22c55e",
      "--verbiage-mode": "action-verbs",
      "--border-style": "bold",
    };
  } else if (rft < -0.4) {
    // Prevention: stability, trust, vigilance
    return {
      "--radius": "0.5rem",
      "--transition-speed": "300ms",
      "--cta-weight": "600",
      "--hero-gradient": "linear-gradient(135deg, #1e3a5f 0%, #0f2027 100%)",
      "--primary-action": "#3b82f6",
      "--verbiage-mode": "trust-verbs",
      "--border-style": "subtle",
    };
  } else {
    // Balanced
    return {
      "--radius": "0.75rem",
      "--transition-speed": "200ms",
      "--cta-weight": "700",
      "--hero-gradient": "linear-gradient(135deg, #8b5cf6 0%, #1e3a5f 100%)",
      "--primary-action": "#8b5cf6",
      "--verbiage-mode": "balanced",
      "--border-style": "glass",
    };
  }
}

function deriveAtomicMap(data: IntakeData): ComponentDirective[] {
  const isPromotion = data.rftScore > 0;
  return [
    {
      atom: "Organism",
      component: "HeroConversion",
      purpose: `Primary CTA anchored to: "${data.utility.split(".")[0]}"`,
      serverComponent: true,
      psychologicalFunction: isPromotion ? "Gain-framed headline with eager CTA" : "Safety-framed headline with trust anchor",
      gainBias: isPromotion ? 0.85 : 0.4,
      fearBias: isPromotion ? 0.15 : 0.6,
    },
    {
      atom: "Organism",
      component: "PsychographyResonanceBlock",
      purpose: `Addresses visitor friction: "${data.psychography.substring(0, 60)}..."`,
      serverComponent: false,
      psychologicalFunction: "Empathy mapping — mirror the user's pain state before resolving it",
      gainBias: 0.35,
      fearBias: 0.65,
    },
    {
      atom: "Organism",
      component: "TrustArchitecture",
      purpose: `Social proof: "${data.proof.substring(0, 60)}..."`,
      serverComponent: true,
      psychologicalFunction: "Social proof reduces skepticism at the moment of commitment",
      gainBias: isPromotion ? 0.3 : 0.2,
      fearBias: isPromotion ? 0.7 : 0.8,
    },
    {
      atom: "Molecule",
      component: "IdentityTokenSet",
      purpose: `Brand: "${data.identity}" encoded into design tokens`,
      serverComponent: true,
      psychologicalFunction: "Identity coherence across visual layers builds subconscious trust",
      gainBias: 0.5,
      fearBias: 0.5,
    },
    {
      atom: "Atom",
      component: "CTAButton",
      purpose: "Primary conversion mechanism",
      serverComponent: false,
      psychologicalFunction: isPromotion ? "Action verb, high-contrast, eager scale animation" : "Stability verb, deep color, reassuring micro-pulse",
      gainBias: isPromotion ? 0.92 : 0.45,
      fearBias: isPromotion ? 0.08 : 0.55,
    },
    {
      atom: "Molecule",
      component: "SocialProofGrid",
      purpose: `Evidence layer: "${data.proof.substring(0, 50)}..."`,
      serverComponent: true,
      psychologicalFunction: "Skepticism dissolution via concrete, verified third-party validation",
      gainBias: isPromotion ? 0.35 : 0.25,
      fearBias: isPromotion ? 0.65 : 0.75,
    },
  ];
}

function generateSpecSections(data: IntakeData): SpecSection[] {
  return [
    {
      heading: "1. Conversion Architecture",
      unit: "Engineer",
      content: `Primary conversion goal: "${data.utility}". The Server Component pattern is applied to the HeroConversion organism for immediate static rendering. The CTA triggers a Client Component state transition optimized for ${data.rftScore > 0 ? "eagerness (150ms ease-out)" : "reassurance (300ms ease-in-out)"}. Route: App Router with parallel loading for above-the-fold paint optimization.`,
    },
    {
      heading: "2. Psychographic UX Calibration",
      unit: "UX Lead",
      content: `Visitor emotional state derived: "${data.psychography}". UX friction setting: ${data.rftScore > 0 ? "LOW — dense information flow with action-triggering micro-animations." : "HIGH TRUST — sparse layouts, ample whitespace, data-heavy trust marks."} Typography scale calibrates to Identity Anchors: "${data.identity}". Motion: ${data.rftScore > 0 ? "Fast, kinetic (150ms), forward-pulling." : "Calm, deliberate (300ms), stability-signaling."}`,
    },
    {
      heading: "3. Psychological Hardening Layer",
      unit: "Psychologist",
      content: `RFT Profile: ${data.rftScore > 0.4 ? "Promotion-dominant (+)" : data.rftScore < -0.4 ? "Prevention-dominant (−)" : "Balanced (±)"}. Dissonance prevention: All copy reviewed for strategy alignment. Trust marks (${data.proof.substring(0, 40)}...) placed at maximum skepticism inflection point — immediately after the primary value proposition. Loss-aversion framing ${data.rftScore < 0 ? "active: 'Don't miss X' patterns embedded." : "inactive: positive gain-framing applied across all CTAs."}`,
    },
    {
      heading: "4. Theory of Mind — Visitor Simulation",
      unit: "ToM Specialist",
      content: `Simulated visitor belief state on arrival: ${data.rftScore > 0 ? `"I want results fast but I'm skeptical this tool delivers at the scale I need."` : `"I need to trust this platform before I commit. I've been burned before."`} Design response to this belief: ${data.rftScore > 0 ? "Lead with outcome, then prove it. Social proof follows the hook, not precedes it." : "Lead with safety signal, then introduce the outcome. Proof precedes the offer."} Agent Sync context: "${data.sync}".`,
    },
    {
      heading: "5. Component Specification (Atomic Design)",
      unit: "Engineer",
      content: `Stack: Next.js 15, React 19, Tailwind v4. Components: HeroConversion [Server], PsychographyResonanceBlock [Client], TrustArchitecture [Server], IdentityTokenSet [Server], CTAButton [Client]. CSS Variables injected: --transition-speed, --cta-weight, --verbiage-mode, --hero-gradient. All Server Components prerender on build; Client Components hydrate post-paint.`,
    },
  ];
}

function generateAgentLog(data: IntakeData): AgentLogEntry[] {
  const entries: AgentLogEntry[] = [
    { time: "00:01", agent: "Engineer", message: "Intake matrix received. Parsing conversion goal: \"" + data.utility.substring(0, 40) + "...\"", type: "info" },
    { time: "00:02", agent: "UX Lead", message: "Psychography mapped. Visitor emotion: friction-state detected. Calibrating UX density.", type: "info" },
    { time: "00:03", agent: "Psychologist", message: `RFT Score computed: ${data.rftScore.toFixed(2)}. ${data.rftScore > 0 ? "Promotion mode." : "Prevention mode."}`, type: "info" },
    { time: "00:04", agent: "Engineer", message: "Server Components assigned: HeroConversion, TrustArchitecture, IdentityTokenSet.", type: "info" },
    { time: "00:05", agent: "Psychologist", message: data.rftScore > 0.3 ? "Warning: High promotion mode may underweight trust signals. Recommend proof injection above fold." : "Trust-first architecture confirmed. Loss-frame framing activated.", type: data.rftScore > 0.3 ? "warning" : "info" },
    { time: "00:06", agent: "UX Lead", message: "Debating CTA placement: below vs. within hero. Psychologist preference: concurrent.", type: "debate" },
    { time: "00:07", agent: "Engineer", message: "CTA within hero confirmed. Reduces scroll friction; aligns with RFT eagerness score.", type: "debate" },
    { time: "00:08", agent: "ToM", message: "Visitor simulation complete. Predicted hesitation point: immediately after pricing discovery. Trust mark must precede it.", type: "info" },
    { time: "00:09", agent: "Psychologist", message: "Agreed. Social proof organism repositioned above conversion CTA per ToM simulation.", type: "consensus" },
    { time: "00:10", agent: "Engineer", message: "Specification locked. Generating Spec-as-Code blueprint. CSS variables hardened.", type: "consensus" },
  ];
  return entries;
}

export function transmute(data: IntakeData): TechSpec {
  return {
    title: `AAO Technical Specification — ${new Date().toISOString().slice(0, 10)}`,
    timestamp: new Date().toISOString(),
    rftProfile: data.rftScore > 0.4 ? "Promotion+" : data.rftScore < -0.4 ? "Prevention−" : "Balanced±",
    sections: generateSpecSections(data),
    cssVariables: generateCSSVariables(data.rftScore),
    componentMap: deriveAtomicMap(data),
    agentLog: generateAgentLog(data),
  };
}
