/**
 * RFT Scorer — Regulatory Focus Theory
 * Scores text on a bi-directional spectrum:
 *   -1.0 = Pure Prevention / Vigilance (security, stability, caution)
 *   +1.0 = Pure Promotion / Eagerness (growth, opportunity, gain)
 */

export type RFTMode = "autonomous" | "locked";
export type RFTPolarity = number; // -1.0 to +1.0

// Weighted promotion lexicon (positive polarity signals)
const PROMOTION_LEXICON: Record<string, number> = {
  grow: 1.0, growth: 1.0, opportunity: 0.95, achieve: 0.9, aspire: 0.9,
  ambition: 0.85, expand: 0.85, accelerate: 0.9, launch: 0.85, gain: 0.8,
  win: 0.8, maximize: 0.8, innovate: 0.95, scale: 0.85, breakthrough: 1.0,
  excel: 0.8, transform: 0.85, advance: 0.8, dominate: 0.9, lead: 0.75,
  leverage: 0.7, amplify: 0.85, unlock: 0.8, elevate: 0.85,
  succeed: 0.9, thrive: 0.9, momentum: 0.8, bold: 0.75, vision: 0.7,
  pioneering: 0.9, disrupt: 0.85, capitalize: 0.75, impact: 0.7,
};

// Weighted prevention lexicon (negative polarity signals)
const PREVENTION_LEXICON: Record<string, number> = {
  risk: 1.0, secure: 0.95, protect: 0.9, prevent: 1.0, avoid: 0.9,
  safety: 0.95, compliance: 0.85, vigilant: 0.9, caution: 0.85,
  careful: 0.8, guard: 0.9, defend: 0.9, reliable: 0.75, stable: 0.85,
  trust: 0.8, verify: 0.85, validate: 0.8, proven: 0.75, audit: 0.8,
  threat: 0.95, loss: 0.9, failure: 0.9, vulnerability: 0.95, breach: 1.0,
  concern: 0.7, prudent: 0.8, mitigate: 0.85, conservative: 0.8,
  accountability: 0.75, oversight: 0.8, due: 0.6, diligence: 0.7,
};

export interface RFTResult {
  score: RFTPolarity;               // -1.0 to +1.0
  promotionWeight: number;          // raw promotion signal
  preventionWeight: number;         // raw prevention signal
  dominantTerms: string[];          // top contributing words
  label: string;                    // human-readable label
  confidence: number;               // 0–1, based on signal density
}

export function scoreRFT(text: string): RFTResult {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  let promotionWeight = 0;
  let preventionWeight = 0;
  const matchedTerms: Array<{ term: string; weight: number; type: "p" | "v" }> = [];

  for (const word of words) {
    if (PROMOTION_LEXICON[word]) {
      promotionWeight += PROMOTION_LEXICON[word];
      matchedTerms.push({ term: word, weight: PROMOTION_LEXICON[word], type: "p" });
    }
    if (PREVENTION_LEXICON[word]) {
      preventionWeight += PREVENTION_LEXICON[word];
      matchedTerms.push({ term: word, weight: PREVENTION_LEXICON[word], type: "v" });
    }
  }

  const total = promotionWeight + preventionWeight;
  const score: RFTPolarity = total === 0 ? 0 : (promotionWeight - preventionWeight) / total;
  const confidence = Math.min(total / (words.length * 0.3 + 1), 1);

  const dominantTerms = matchedTerms
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((t) => t.term);

  const label =
    score > 0.6 ? "Strong Promotion" :
    score > 0.2 ? "Moderate Promotion" :
    score > -0.2 ? "Neutral / Balanced" :
    score > -0.6 ? "Moderate Prevention" :
    "Strong Prevention";

  return { score, promotionWeight, preventionWeight, dominantTerms, label, confidence };
}

export function getDissonanceScore(locked: RFTPolarity, detected: RFTPolarity): number {
  // Returns 0–1 dissonance between user-locked polarity and NLP-detected polarity
  return Math.abs(locked - detected) / 2;
}

export function getRFTColor(score: RFTPolarity): string {
  if (score > 0.5) return "#22c55e"; // emerald — high promotion
  if (score > 0.1) return "#84cc16"; // lime — lean promotion
  if (score > -0.1) return "#a855f7"; // violet — neutral
  if (score > -0.5) return "#f97316"; // orange — lean prevention
  return "#ef4444";                    // red — high prevention
}
