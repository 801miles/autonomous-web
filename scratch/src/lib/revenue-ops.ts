export type ExecutionRole = {
  id: string;
  title: string;
  objective: string;
  thisWeek: string[];
  kpi: string;
};

export const executionRoles: ExecutionRole[] = [
  {
    id: "growth-product",
    title: "Growth Product Lead",
    objective: "Turn free users into paying website-generation customers.",
    thisWeek: [
      "Clarify pricing copy around paid generation outcomes.",
      "Reduce friction from intake to paid checkout entry.",
      "Track generation intent and paid conversion events.",
    ],
    kpi: "Visitor -> checkout start rate",
  },
  {
    id: "monetization-engineer",
    title: "Monetization Engineer",
    objective: "Enforce entitlement and checkout reliability for generation fees.",
    thisWeek: [
      "Harden Stripe checkout action metadata for generation purchases.",
      "Align success/cancel states with generation unlock messaging.",
      "Prepare credits/subscription gate for API generation routes.",
    ],
    kpi: "Checkout success rate",
  },
  {
    id: "platform-builder",
    title: "Platform Builder (Web + Mobile)",
    objective: "Ship one generation pipeline that supports web and mobile deliverables.",
    thisWeek: [
      "Define output bundles for web deploy and mobile handoff.",
      "Keep generation UX identical across responsive breakpoints.",
      "Stage API contract for mobile clients.",
    ],
    kpi: "Paid generations delivered",
  },
];

export const monetizationNarrative = {
  headline: "Generate websites free. Pay to deploy production deliverables.",
  oneTimeOffer: "$29 unlock per production-grade generation package.",
};
