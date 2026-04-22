import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, Apple, PlayCircle, Globe, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile + Web Delivery",
  description: "Install Archon as a mobile app and deliver generated assets for web, Android, and iOS workflows.",
};

export default function MobilePage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Web + Mobile Delivery</h1>
          <p className="text-foreground/50 max-w-2xl">
            Archon runs as a responsive web app and installs as a PWA for Android and iOS. Paid generation unlocks deployment and mobile handoff assets through the same API contract.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 space-y-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Web App</h2>
            <p className="text-sm text-foreground/50">Use dashboard, checkout, and generation delivery directly in browser.</p>
          </div>
          <div className="glass rounded-2xl p-5 space-y-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Android Install</h2>
            <p className="text-sm text-foreground/50">Chrome - menu - Install app. Archon runs standalone with service worker caching.</p>
          </div>
          <div className="glass rounded-2xl p-5 space-y-2">
            <Apple className="w-5 h-5 text-primary" />
            <h2 className="font-bold">iOS Install</h2>
            <p className="text-sm text-foreground/50">Safari - Share - Add to Home Screen. Supports full-screen PWA launch mode.</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Generation API Contract</h2>
          <p className="text-sm text-foreground/55">
            Paid users can retrieve production package metadata from <code>/api/generation/package</code>. This endpoint is gated by entitlement and returns web + Android + iOS target assets.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/pricing" className="px-4 py-2 rounded-xl bg-primary text-sm font-bold">
              Unlock Generation
            </Link>
            <Link href="/dashboard" className="px-4 py-2 rounded-xl glass text-sm font-bold">
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="text-sm text-foreground/40 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Next build target: package native wrappers (Capacitor/React Native) against this API contract.
        </div>
      </div>
    </div>
  );
}
