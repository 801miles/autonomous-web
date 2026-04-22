import Hero from "@/components/Hero";
import AgentDashboard from "@/components/AgentDashboard";
import Terminal from "@/components/Terminal";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Archon | Architect Orchestrator",
  description: "Turn qualitative intent into production-grade infrastructure. Five psychographic questions, four autonomous agents, one 2,000-word specification. Generate for free.",
  openGraph: {
    title: "Archon | From Intent to Infrastructure",
    description: "The autonomous multi-agent architect. 5 questions. 4 agents. 1 production-grade spec.",
    type: "website",
    url: "https://archon.systems",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Archon",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://archon.systems",
  description:
    "Autonomous multi-agent architecture orchestrator. Transmutes psychographic signals into production-grade technical specifications.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to generate. $29 one-time export fee.",
  },
  publisher: {
    "@type": "Organization",
    name: "Archon Systems",
    url: "https://archon.systems",
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="jsonld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      <div className="flex flex-col min-h-screen">
        {/* Background Decor */}
        <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <Hero />

        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <AgentDashboard />
        </div>

        <div className="relative pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Terminal />
        </div>
      </div>
    </>
  );
}
