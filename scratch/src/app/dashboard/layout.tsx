import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orchestration Dashboard",
  description: "View your live Archon specification — agent consensus, psychographic heatmaps, atomic component maps, and CSS token exports. Generated from your 5-question intake.",
  openGraph: {
    title: "Archon Orchestration Dashboard",
    description: "Real-time architectural specification derived from your psychographic intake signals.",
    type: "website",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
