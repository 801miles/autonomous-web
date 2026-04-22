# Archon Go-To-Market MVP

## Product scope (shippable now)
- Web app with paid generation unlock.
- Mobile availability via PWA install on Android and iOS.
- Shared generation API contract for web/mobile clients.

## Monetization flow
1. User completes intake and views generated dashboard.
2. User taps generation/deploy action.
3. Stripe Checkout session is created with attribution metadata (`channel`, `referralCode`).
4. Webhook upgrades user entitlement and records conversion event.
5. Paid user retrieves package from `/api/generation/package`.

## Core routes
- `/pricing` - conversion page and offer.
- `/dashboard` - generation experience and checkout entry.
- `/mobile` - Android/iOS install + delivery guidance.
- `/revenue` - operator funnel console.
- `/api/generation/package` - paid-gated asset contract.
- `/api/ready` - launch readiness health endpoint.

## Required env vars
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `POST_PURCHASE_WEBHOOK_URL` (optional automation hook)

## Launch checklist
- Configure production Clerk + Stripe keys.
- Set Stripe webhook target to `/api/stripe/webhook`.
- Verify `/api/ready` returns `status: ready`.
- Smoke-test checkout start and completion.
- Confirm `checkout_completed` appears in `/revenue`.
- Confirm paid call to `/api/generation/package` returns `status: paid_unlocked`.

## First 7-day KPI targets
- Checkout start rate: >8% of dashboard visitors.
- Checkout completion rate: >35% of checkout starts.
- Delivery success: >95% of paid users.
- Referral-attributed paid checkouts: at least 20% of total.
