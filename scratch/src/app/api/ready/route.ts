import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REQUIRED_ENV = [
  "NEXT_PUBLIC_APP_URL",
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

export async function GET() {
  const envStatus = REQUIRED_ENV.map((key) => ({
    key,
    configured: Boolean(process.env[key]),
  }));

  const missing = envStatus.filter((entry) => !entry.configured).map((entry) => entry.key);
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const postgresUrl = databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");
  let dbOk = false;
  let dbError: string | null = null;

  if (!postgresUrl) {
    dbError = "DATABASE_URL must use postgres/postgresql scheme for Supabase production.";
  } else {
    try {
      const { prisma } = await import("@/lib/db");
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch (error) {
      dbError = error instanceof Error ? error.message : "Unknown database error";
    }
  }

  const ready = missing.length === 0 && dbOk;
  return NextResponse.json(
    {
      status: ready ? "ready" : "not_ready",
      ready,
      checks: {
        env: envStatus,
        database: { ok: dbOk, usesPostgresUrl: postgresUrl, error: dbError },
      },
      targetPlatforms: ["web", "android", "ios"],
      timestamp: new Date().toISOString(),
    },
    { status: ready ? 200 : 503 }
  );
}
