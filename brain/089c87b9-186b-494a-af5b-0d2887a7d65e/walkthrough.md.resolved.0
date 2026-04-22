# Monetization Implementation Walkthrough

The Archon platform has successfully transitioned from a functional prototype into a monetized SaaS product using a "freemium" loop. Based on the agreed-upon strategy, we implemented the $29 One-Time Export paywall.

## 1. Systems architecture update
We updated the core technology stack to include robust systems for identity, payments, and data tracking:
- Installed and configured `@clerk/nextjs` for seamless authentication.
- Installed `stripe` and `@stripe/stripe-js` to process checkout sessions confidently.
- Installed and initialized Prisma ORM (`@prisma/client`) with a standard local SQLite database to gracefully handle mappings between user accounts and active subscriptions.

## 2. Platform Authentication layer
- **Clerk UI Provider**: Wraps the root layout to maintain persistent session state across the app.
- **Middleware**: A newly implemented `src/middleware.ts` routes and secures protected edge-cases while keeping the dashboard logic open for the freemium view.
- **Custom Pages**: Deployed fully styled Next.js pages at `/sign-in` and `/sign-up` applying the modern "Midnight Luxe" aesthetic.
- **Navigation Controls**: The Navbar (`Navbar.tsx`) now intelligently swaps the "Sign In" link for an interactive Clerk `UserButton` once the session is established.

## 3. Stripe Paywall integration & Webhooks
- **UI Paywall Hijack**: We successfully intercepted the standard "Push to GitHub" and "Download .ZIP" export commands inside `SpecAsCode.tsx`. Triggering these actions now securely pings Stripe instead of giving away value immediately.
- **Server Action**: Initiated a secure Server Action (`src/actions/stripe.ts`) that verifies the `userId`, creates/updates the Prisma database model, and dynamically generates a personalized `$29` Stripe Checkout Session URL without exposing the process to client-side manipulation.
- **Webhook Endpoint**: Deployed a fully functional backend receiver route (`src/app/api/stripe/webhook/route.ts`). Upon a `checkout.session.completed` firing, it validates the Stripe signature and automatically updates the `hasPaidExport` flag and `stripeCustomerId` in the backend database.

> [!IMPORTANT]
> To thoroughly test or run this deployment locally, you must provide your unique API keys. I have stubbed out placeholders inside `.env` for:
> - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`
> - `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`
>
> You can acquire these via the dashboard endpoints for both Clerk and Stripe respectively.
