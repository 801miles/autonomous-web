import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/clerk-env";

const isProtectedRoute = createRouteMatcher([
  "/api/generate(.*)",
  "/api/generation(.*)",
]);

function applyReferralCookie(req: NextRequest): NextResponse {
  const referralCode = req.nextUrl.searchParams.get("ref");
  if (!referralCode) {
    return NextResponse.next();
  }
  const response = NextResponse.next();
  response.cookies.set("archon_ref", referralCode, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

const clerkOn = isClerkConfigured();

export default clerkOn
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const { userId, redirectToSignIn } = await auth();
        if (!userId) {
          return redirectToSignIn();
        }
      }
      return applyReferralCookie(req);
    })
  : function middleware(req: NextRequest) {
      if (isProtectedRoute(req)) {
        return NextResponse.json(
          { error: "Authentication is not configured on this deployment." },
          { status: 503 }
        );
      }
      return applyReferralCookie(req);
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
