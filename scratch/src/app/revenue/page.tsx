import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateCurrentUser, getRevenueSnapshot } from "@/lib/entitlements";

export const metadata: Metadata = {
  title: "Revenue Console",
  description: "Monetization metrics for checkout and generation delivery performance.",
};

type EventMeta = {
  channel?: string;
  referralCode?: string;
};

function toPercent(num: number, den: number) {
  if (den <= 0) return "0%";
  return `${Math.round((num / den) * 100)}%`;
}

function parseMeta(raw: string | null): EventMeta {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as EventMeta;
  } catch {
    return {};
  }
}

export default async function RevenuePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { prisma } = await import("@/lib/db");
  const currentUser = await getOrCreateCurrentUser();
  const mine = await getRevenueSnapshot(currentUser.id);

  const [totalRevenue, globalCheckoutStarted, globalCheckoutCompleted, globalGenerationDelivered, recentCompleted] = await Promise.all([
    prisma.user.aggregate({ _sum: { lifetimeRevenueCents: true } }),
    prisma.conversionEvent.count({ where: { eventType: "checkout_started" } }),
    prisma.conversionEvent.count({ where: { eventType: "checkout_completed" } }),
    prisma.conversionEvent.count({ where: { eventType: "generation_delivered" } }),
    prisma.conversionEvent.findMany({
      where: { eventType: "checkout_completed" },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const lifetimeRevenue = (totalRevenue._sum.lifetimeRevenueCents ?? 0) / 100;
  const checkoutConversion = toPercent(globalCheckoutCompleted, globalCheckoutStarted);
  const deliveryRate = toPercent(globalGenerationDelivered, globalCheckoutCompleted);
  const byChannel: Record<string, number> = {};
  const byReferral: Record<string, number> = {};

  recentCompleted.forEach((evt) => {
    const meta = parseMeta(evt.metadata);
    const channel = meta.channel ?? "web";
    const referral = meta.referralCode ?? "direct";
    byChannel[channel] = (byChannel[channel] ?? 0) + 1;
    byReferral[referral] = (byReferral[referral] ?? 0) + 1;
  });

  const topReferral = Object.entries(byReferral).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Console</h1>
          <p className="text-foreground/45 text-sm mt-2">
            Live funnel health for web and mobile (Android/iOS) generation monetization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-foreground/40">Lifetime Revenue</div>
            <div className="text-3xl font-bold mt-2">${lifetimeRevenue.toFixed(2)}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-foreground/40">Checkout Conversion</div>
            <div className="text-3xl font-bold mt-2">{checkoutConversion}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-foreground/40">Delivery Rate</div>
            <div className="text-3xl font-bold mt-2">{deliveryRate}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-lg">Global Funnel</h2>
            <div className="text-sm text-foreground/60">Checkout Started: {globalCheckoutStarted}</div>
            <div className="text-sm text-foreground/60">Checkout Completed: {globalCheckoutCompleted}</div>
            <div className="text-sm text-foreground/60">Generation Delivered: {globalGenerationDelivered}</div>
          </div>
          <div className="glass rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-lg">Your Funnel</h2>
            <div className="text-sm text-foreground/60">Checkout Started: {mine.checkoutStarted}</div>
            <div className="text-sm text-foreground/60">Checkout Completed: {mine.checkoutCompleted}</div>
            <div className="text-sm text-foreground/60">Generation Delivered: {mine.generationDelivered}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-lg">Paid Checkouts by Channel</h2>
            {Object.keys(byChannel).length === 0 ? (
              <div className="text-sm text-foreground/55">No checkout completions yet.</div>
            ) : (
              Object.entries(byChannel).map(([channel, count]) => (
                <div key={channel} className="flex justify-between text-sm text-foreground/60">
                  <span className="uppercase tracking-widest text-[11px]">{channel}</span>
                  <span className="font-bold text-foreground">{count}</span>
                </div>
              ))
            )}
          </div>
          <div className="glass rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-lg">Top Referral Codes</h2>
            {topReferral.length === 0 ? (
              <div className="text-sm text-foreground/55">No referral-attributed checkouts yet.</div>
            ) : (
              topReferral.map(([code, count]) => (
                <div key={code} className="flex justify-between text-sm text-foreground/60">
                  <span className="uppercase tracking-widest text-[11px]">{code}</span>
                  <span className="font-bold text-foreground">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
