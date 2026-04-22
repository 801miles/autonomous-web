/**
 * Signal Strength Scorer
 * Formula: S = α·H + β·E + γ·I
 *   H = Shannon Entropy (lexical diversity / information density)
 *   E = Entity Count (proper nouns, numbers, domain-specific terms)
 *   I = Sentiment Intensity (absolute emotional weight)
 *  
 * Weights:
 *   α = 0.40  (entropy is the primary signal of specificity)
 *   β = 0.35  (entities anchor intent to real-world constructs)
 *   γ = 0.25  (emotional intensity signals commitment)
 */

const ALPHA = 0.40;
const BETA  = 0.35;
const GAMMA = 0.25;

// Named entity signals — capitalized words, numbers, domain terms
const ENTITY_PATTERNS = [
  /\b[A-Z][a-z]{2,}\b/g,                          // Proper nouns
  /\b\d[\d,\.%x]*\b/g,                             // Numbers / metrics
  /\b(API|SaaS|B2B|B2C|CRM|AI|ML|UI|UX|ROI|KPI|MVP|GTM|CTA|NLP)\b/gi,  // Acronyms
];

// Emotional intensity lexicon (0.0–1.0 weight)
const INTENSITY_LEXICON: Record<string, number> = {
  critical: 0.9, essential: 0.85, urgent: 0.9, vital: 0.85, must: 0.8,
  non: 0.7, never: 0.85, always: 0.75, primary: 0.7, fundamental: 0.8,
  love: 0.75, hate: 0.8, fear: 0.9, trust: 0.75, breakthrough: 0.9,
  revolutionary: 0.85, impossible: 0.85, unprecedented: 0.9,
};

export interface SignalResult {
  score: number;       // 0–100
  entropy: number;     // 0–1 normalized
  entityCount: number;
  sentimentIntensity: number; // 0–1
  label: string;
  components: { H: number; E: number; I: number };
}

function computeShannonEntropy(text: string): number {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  if (words.length < 3) return 0;

  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;

  const total = words.length;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }

  // Normalize: max entropy for N words ≈ log2(N), cap at log2(50)
  return Math.min(entropy / Math.log2(Math.max(total, 2)), 1);
}

function countEntities(text: string): number {
  const matches = new Set<string>();
  for (const pattern of ENTITY_PATTERNS) {
    const found = text.match(pattern) ?? [];
    for (const f of found) matches.add(f);
  }
  return matches.size;
}

function computeSentimentIntensity(text: string): number {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  if (words.length === 0) return 0;

  let total = 0;
  let count = 0;
  for (const w of words) {
    if (INTENSITY_LEXICON[w]) {
      total += INTENSITY_LEXICON[w];
      count++;
    }
  }
  // Normalize: intensity density relative to word count
  return Math.min((count > 0 ? total / count : 0) * (count / Math.sqrt(words.length)), 1);
}

export function computeSignalStrength(texts: Record<string, string>): SignalResult {
  const combined = Object.values(texts).join(" ");

  const H = computeShannonEntropy(combined);
  const entityCount = countEntities(combined);
  // Normalize entity count: 0–20+ entities → 0–1
  const E = Math.min(entityCount / 20, 1);
  const I = computeSentimentIntensity(combined);

  const rawScore = ALPHA * H + BETA * E + GAMMA * I;
  const score = Math.round(rawScore * 100);

  const label =
    score >= 80 ? "Architect-Grade Signal" :
    score >= 60 ? "High Density" :
    score >= 40 ? "Moderate Signal" :
    score >= 20 ? "Shallow Intent" :
    "Insufficient Signal";

  return { score, entropy: H, entityCount, sentimentIntensity: I, label, components: { H, E, I } };
}

export function getSignalColor(score: number): string {
  if (score >= 80) return "#8b5cf6"; // violet — architect grade
  if (score >= 60) return "#22c55e"; // emerald — high
  if (score >= 40) return "#f59e0b"; // amber — moderate
  if (score >= 20) return "#f97316"; // orange — shallow
  return "#ef4444";                  // red — insufficient
}
