"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { getOrCreateCurrentUser, logConversionEvent } from "@/lib/entitlements";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

export async function createCheckoutSession(intentId: string, channel: "web" | "android" | "ios" = "web") {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const user = await getOrCreateCurrentUser();
  const cookieStore = await cookies();
  const referralCode = cookieStore.get("archon_ref")?.value ?? "direct";

  // Already paid — send to dashboard with success flag
  if (user.hasPaidExport) {
    return { url: `/dashboard?export_success=true` };
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
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
          unit_amount: 2900, // $29.00 USD
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
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

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
    }),
    amountCents: 2900,
  });

  return { url: session.url };
}
