"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_123", {
  apiVersion: "2026-03-25.dahlia" as any,
});

export async function createCheckoutSession(intentId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user exists in our DB
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    }).then((res) => res.json());

    user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.email_addresses[0].email_address,
      },
    });
  }

  // If user already paid
  if (user.hasPaidExport) {
    return { url: `/dashboard/${intentId}/export` };
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.stripeCustomerId ? undefined : user.email,
    customer: user.stripeCustomerId ? user.stripeCustomerId : undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Archon Architectural Export",
            description: "One-time fee to export your architectural specifications.",
          },
          unit_amount: 2900, // $29.00
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/${intentId}?export_success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/${intentId}?export_cancelled=true`,
    client_reference_id: userId,
  });

  return { url: session.url };
}
