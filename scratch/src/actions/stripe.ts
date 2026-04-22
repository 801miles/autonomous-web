"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { getOrCreateCurrentUser, logConversionEvent } from "@/lib/entitlements";

export type CreateCheckoutSessionResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

/**
 * Starts Stripe Checkout for the one-time export unlock.
 * Does not push to GitHub or build a ZIP — those are delivered after payment (see /api/generation/package).
 */
export async function createCheckoutSession(
  intentId: string,
  channel: "web" | "android" | "ios" = "web",
  deliveryPreference: "github" | "zip" = "github"
): Promise<CreateCheckoutSessionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "Sign in to unlock checkout." };
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      ok: false,
      message: "Payments are not configured. Add STRIPE_SECRET_KEY on the server and redeploy.",
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let user;
  try {
    user = await getOrCreateCurrentUser();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Account error";
    if (msg.includes("fetch Clerk") || msg.includes("Clerk")) {
      return { ok: false, message: "Could not load your profile from Clerk. Check CLERK_SECRET_KEY and try again." };
    }
    if (msg.toLowerCase().includes("prisma") || msg.includes("connect") || msg.includes("database")) {
      return { ok: false, message: "Database unavailable. Set DATABASE_URL to Postgres (e.g. Supabase) on Vercel." };
    }
    return { ok: false, message: msg };
  }

  const cookieStore = await cookies();
  const referralCode = cookieStore.get("archon_ref")?.value ?? "direct";

  if (user.hasPaidExport) {
    return { ok: true, url: "/dashboard?export_success=true" };
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.stripeCustomerId ? undefined : user.email,
      customer: user.stripeCustomerId ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Archon Website Generation Package",
              description: "One-time unlock for production website generation deliverables: GitHub push and .ZIP bundle.",
              images: [`${appUrl}/opengraph-image`],
            },
            unit_amount: 2900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/dashboard?export_success=true`,
      cancel_url: `${appUrl}/dashboard?export_cancelled=true`,
      client_reference_id: userId,
      metadata: {
        intentId,
        product: "website_generation_package",
        userDbId: user.id,
        referralCode,
        channel,
        deliveryPreference,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe error";
    return { ok: false, message: msg };
  }

  if (!session.url) {
    return { ok: false, message: "Stripe did not return a checkout URL. Check your Stripe account and API key." };
  }

  try {
    await logConversionEvent({
      userId: user.id,
      eventType: "checkout_started",
      eventSource: "dashboard_export_cta",
      metadata: JSON.stringify({
        intentId,
        stripeSessionId: session.id,
        amountCents: 2900,
        referralCode,
        channel,
        deliveryPreference,
      }),
      amountCents: 2900,
    });
  } catch {
    // Checkout is valid even if analytics write fails
  }

  return { ok: true, url: session.url };
}
