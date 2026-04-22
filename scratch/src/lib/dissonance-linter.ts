/**
 * Dissonance Linter — Psychological Core
 * Detects phrases that clash with the user's stated RFT mode.
 * 
 * Severity tiers:
 *   0.0–0.3  → passive (amber glow on container)
 *   0.3–0.7  → semi-active (underline clashing phrases with ToM tooltips)
 *   0.7+     → active (trigger Pre-Flight Strategy Check modal)
 */

import { getDissonanceScore, scoreRFT, type RFTPolarity } from "./rft-scorer";

export type DissonanceSeverity = "none" | "passive" | "semi-active" | "active";

export interface ClashPhrase {
  phrase: string;
  startIndex: number;
  endIndex: number;
  clashReason: string;     // ToM tooltip content
  rftPolarity: "promotion" | "prevention";
}

// Phrase patterns that signal promotion in a prevention context and vice versa
const PROMOTION_PHRASES = [
  { pattern: /\b(scale|grow\w*|dominate|disrupt|bold)\b/gi, reason: "This suggests an Eager/Promotion mindset. Ensure your safety and trust structures match this ambition." },
  { pattern: /\b(maximize|opportunit\w+|win|breakthrough)\b/gi, reason: "Opportunity language can undermine prevention-focused trust signals. Consider pairing with proof-points." },
];

const PREVENTION_PHRASES = [
  { pattern: /\b(risk|secur\w+|prevent|avoid|caution)\b/gi, reason: "Risk-avoidance language in a Promotion context may signal hesitancy to your audience. Consider reframing as 'reliability' or 'confidence'." },
  { pattern: /\b(failure|vulnerabilit\w+|threat|breach)\b/gi, reason: "Loss-framing in a promotion context creates cognitive friction for gain-motivated visitors." },
];

export interface DissonanceResult {
  severity: DissonanceSeverity;
  dissonanceScore: number;       // 0–1
  clashPhrases: ClashPhrase[];
  tomBlindSpots: string[];       // What the user HASN'T mentioned
  recommendation: string;
}

// ToM Blind Spot detection — what concepts are conspicuously absent
const CONCEPT_PAIRS: Array<{ mentioned: RegExp; absent: RegExp; warning: string }> = [
  { mentioned: /\bscale|grow/i, absent: /\bsecur|privacy|compliance/i, warning: "You've mentioned 'Scale' but not 'Security'. At scale, data privacy and compliance become critical trust factors." },
  { mentioned: /\bconvert|revenue|sales/i, absent: /\btrust|proof|testimonial/i, warning: "Conversion intent detected, but no trust-building signals. Skeptical visitors need social proof before acting." },
  { mentioned: /\binnovat|disrupt/i, absent: /\bproven|track record|case study/i, warning: "Disruption claims without proof of execution risk being dismissed as marketing noise." },
  { mentioned: /\bfast|quick|instant/i, absent: /\bqualit|reliab|stable/i, warning: "Speed signals detected without quality anchors. Speed without reliability breeds mistrust." },
  { mentioned: /\benterprise|B2B|corporate/i, absent: /\bcompliance|security|SLA|support/i, warning: "Enterprise targeting without compliance/SLA signals will fail procurement scrutiny." },
  { mentioned: /\bAI|machine learning|automat/i, absent: /\bhuman|control|oversight|transparent/i, warning: "AI claims without human oversight language trigger fear of loss-of-control in risk-averse buyers." },
];

export function runDissonanceLint(
  text: string,
  lockedRFT: RFTPolarity
): DissonanceResult {
  const detected = scoreRFT(text);
  const dissonanceScore = getDissonanceScore(lockedRFT, detected.score);

  const severity: DissonanceSeverity =
    dissonanceScore < 0.3 ? "none" :
    dissonanceScore < 0.5 ? "passive" :
    dissonanceScore < 0.7 ? "semi-active" :
    "active";

  // Find clashing phrases based on the locked RFT mode
  const clashPhrases: ClashPhrase[] = [];
  const sourcePatterns = lockedRFT > 0.1 ? PREVENTION_PHRASES : PROMOTION_PHRASES;

  for (const { pattern, reason } of sourcePatterns) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      clashPhrases.push({
        phrase: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        clashReason: reason,
        rftPolarity: lockedRFT > 0.1 ? "promotion" : "prevention",
      });
    }
  }

  // ToM Blind Spot analysis
  const tomBlindSpots: string[] = [];
  for (const { mentioned, absent, warning } of CONCEPT_PAIRS) {
    if (mentioned.test(text) && !absent.test(text)) {
      tomBlindSpots.push(warning);
    }
  }

  const recommendation =
    severity === "active"
      ? "Critical dissonance detected. Your language contradicts your stated strategy. A Pre-Flight Check is required."
      : severity === "semi-active"
      ? "Moderate signal clash. Clashing phrases highlighted. Review ToM tooltips to align intent."
      : severity === "passive"
      ? "Minor divergence. Your NLP signals lean away from your stated mode."
      : "Language is coherent with your stated RFT strategy.";

  return { severity, dissonanceScore, clashPhrases, tomBlindSpots, recommendation };
}

export function getDissonanceGlow(severity: DissonanceSeverity): string {
  switch (severity) {
    case "active": return "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.15)";
    case "semi-active": return "0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(249, 115, 22, 0.15)";
    case "passive": return "0 0 20px rgba(245, 158, 11, 0.3)";
    default: return "none";
  }
}
