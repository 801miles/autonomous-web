import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type ClerkApiUser = {
  email_addresses?: Array<{ email_address?: string }>;
};

async function getPrisma() {
  const mod = await import("@/lib/db");
  return mod.prisma;
}

export async function getOrCreateCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const prisma = await getPrisma();
  const existing = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (existing) return existing;

  const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!clerkRes.ok) {
    throw new Error("Failed to fetch Clerk user data");
  }

  const clerkUser = (await clerkRes.json()) as ClerkApiUser;
  const email = clerkUser.email_addresses?.[0]?.email_address;
  if (!email) {
    throw new Error("No email address found for user");
  }

  return prisma.user.create({
    data: {
      clerkUserId: userId,
      email,
    },
  });
}

export function hasPaidGenerationAccess(user: { hasPaidExport: boolean; generationCredits: number; plan: "FREE" | "PRO" }) {
  return user.hasPaidExport || user.plan === "PRO" || user.generationCredits > 0;
}

export async function getCurrentUserOrNull() {
  const { userId } = await auth();
  if (!userId) return null;

  const prisma = await getPrisma();
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    user = await getOrCreateCurrentUser();
  }

  return user;
}

export async function getRevenueSnapshot(userId: string) {
  const prisma = await getPrisma();
  const [checkoutStarted, checkoutCompleted, generationDelivered] = await Promise.all([
    prisma.conversionEvent.count({ where: { userId, eventType: "checkout_started" } }),
    prisma.conversionEvent.count({ where: { userId, eventType: "checkout_completed" } }),
    prisma.conversionEvent.count({ where: { userId, eventType: "generation_delivered" } }),
  ]);

  return {
    checkoutStarted,
    checkoutCompleted,
    generationDelivered,
  };
}

export async function logConversionEvent(input: {
  userId: string;
  eventType: string;
  eventSource?: string;
  metadata?: string;
  amountCents?: number;
}) {
  const prisma = await getPrisma();
  await prisma.conversionEvent.create({
    data: {
      userId: input.userId,
      eventType: input.eventType,
      eventSource: input.eventSource,
      metadata: input.metadata,
      amountCents: input.amountCents,
    },
  });
}
