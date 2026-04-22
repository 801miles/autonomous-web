import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasPaidGenerationAccess, logConversionEvent } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/db");
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    return NextResponse.json({ error: "User record missing" }, { status: 404 });
  }

  if (!hasPaidGenerationAccess(user)) {
    return NextResponse.json(
      {
        error: "Payment required",
        message: "Unlock paid generation to access deployment and mobile handoff assets.",
      },
      { status: 402 }
    );
  }

  const shouldConsumeCredit =
    user.generationCredits > 0 && !user.hasPaidExport && user.plan !== "PRO";

  if (shouldConsumeCredit) {
    await prisma.user.update({
      where: { id: user.id },
      data: { generationCredits: { decrement: 1 } },
    });
  }

  await logConversionEvent({
    userId: user.id,
    eventType: "generation_delivered",
    eventSource: "api_generation_package",
    metadata: JSON.stringify({
      channel: "api",
      consumedCredit: shouldConsumeCredit,
      platformTargets: ["web", "android", "ios"],
    }),
  });

  return NextResponse.json({
    packageVersion: "v1",
    status: "paid_unlocked",
    entitlement: {
      plan: user.plan,
      hasPaidExport: user.hasPaidExport,
      generationCreditsRemaining: shouldConsumeCredit ? user.generationCredits - 1 : user.generationCredits,
    },
    targets: ["web", "android", "ios"],
    assets: [
      "website-spec.json",
      "website-components.md",
      "deployment-checklist.md",
      "mobile-handoff-contract.json",
    ],
    generatedAt: new Date().toISOString(),
  });
}
