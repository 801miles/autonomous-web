import { NextResponse } from "next/server";

// Mark as dynamic so Next.js never tries to statically generate this route
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Lazy-import to avoid module-level initialization during build
  const Stripe = (await import("stripe")).default;
  const { prisma } = await import("@/lib/db");

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe environment variables not configured." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-03-25.dahlia",
  });

  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe-Signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const stripeCustomerId = session.customer as string;
    const amountCents = session.amount_total ?? 0;

    if (userId) {
      try {
        const updatedUser = await prisma.user.update({
          where: { clerkUserId: userId },
          data: {
            hasPaidExport: true,
            plan: "PRO",
            stripeCustomerId: stripeCustomerId ?? undefined,
            lifetimeRevenueCents: {
              increment: amountCents,
            },
          },
        });

        await prisma.conversionEvent.create({
          data: {
            userId: updatedUser.id,
            eventType: "checkout_completed",
            eventSource: "stripe_webhook",
            metadata: JSON.stringify({
              stripeEventId: event.id,
              stripeSessionId: session.id,
              stripePaymentStatus: session.payment_status,
              referralCode: session.metadata?.referralCode ?? "direct",
              channel: session.metadata?.channel ?? "web",
              product: session.metadata?.product ?? "website_generation_package",
            }),
            amountCents,
          },
        });

        const webhookUrl = process.env.POST_PURCHASE_WEBHOOK_URL;
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event: "checkout_completed",
              userId: updatedUser.id,
              clerkUserId: userId,
              amountCents,
              referralCode: session.metadata?.referralCode ?? "direct",
              channel: session.metadata?.channel ?? "web",
              product: session.metadata?.product ?? "website_generation_package",
              occurredAt: new Date().toISOString(),
            }),
          }).catch((notifyError) => {
            console.error("[Webhook] post-purchase webhook failed:", notifyError);
          });
        }
      } catch (dbError) {
        console.error("[Webhook] DB update failed:", dbError);
        // Return 200 to prevent Stripe from retrying — log the failure instead
      }
    }
  }

  return NextResponse.json({ received: true });
}
