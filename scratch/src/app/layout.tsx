import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import PwaRegistry from "@/components/PwaRegistry";
import { ToastProvider } from "@/components/ui/Toast";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Archon | Architect Orchestrator",
    template: "%s | Archon",
  },
  description: "Transmute psychographic signals into production-grade infrastructure. Archon is an autonomous multi-agent architecture orchestrator.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Archon",
  },
  applicationName: "Archon",
  keywords: ["AI Architecture", "Autonomous IDE", "Full-Stack AI", "Archon", "Architect Orchestrator"],
  openGraph: {
    title: "Archon | Architect Orchestrator",
    description: "From Intent to Infrastructure. The autonomous orchestrator.",
    type: "website",
    url: "https://archon.systems",
    siteName: "Archon",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Archon Architect Orchestrator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Archon | From Intent to Infrastructure",
    description: "Five psychographic questions. Four autonomous agents. One production-grade specification.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-full flex flex-col bg-background selection:bg-primary/30 selection:text-white`}>
        <ClerkProvider>
          <ToastProvider>
            <Navbar />
            <PwaRegistry />
            <PageTransition>
              <main className="flex-grow">{children}</main>
            </PageTransition>
          
          {/* Footer */}
          <footer className="py-12 px-6 border-t border-white/5 bg-background/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="text-foreground/40 text-xs font-mono uppercase tracking-widest">
                  © 2026 Archon Systems
                </div>
                <div className="flex gap-4 text-foreground/25 text-[10px] font-mono uppercase tracking-widest">
                  <a href="/privacy" className="hover:text-foreground/50 transition-colors">Privacy</a>
                  <a href="/terms" className="hover:text-foreground/50 transition-colors">Terms</a>
                </div>
              </div>
              <div className="flex gap-8 text-foreground/40 text-xs font-bold uppercase tracking-widest">
                <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
                <a href="/intake" className="hover:text-primary transition-colors">Intake</a>
                <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                <a href="/mobile" className="hover:text-primary transition-colors">Mobile</a>
                <a href="/revenue" className="hover:text-primary transition-colors">Revenue</a>
                <a href="https://github.com" target="_blank" rel="noopener" className="hover:text-primary transition-colors">GitHub</a>
              </div>
            </div>
          </footer>
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
