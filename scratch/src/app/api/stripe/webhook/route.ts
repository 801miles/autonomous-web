import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_123", {
  apiVersion: "2026-03-25.dahlia" as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Fulfill the purchase...
    const userId = session.client_reference_id;
    const stripeCustomerId = session.customer as string;

    if (userId) {
      await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          hasPaidExport: true,
          stripeCustomerId: stripeCustomerId,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
