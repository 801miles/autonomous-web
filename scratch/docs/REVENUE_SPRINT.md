# Revenue Sprint (Autonomous Execution)

## Active mission
Build a cross-platform (web + mobile-ready) website generation product with paid production unlocks.

## Roles currently assumed
- Growth Product Lead
- Monetization Engineer
- Platform Builder (Web + Mobile)

## Live monetization model
- Free: intake + generated blueprint.
- Paid ($29 one-time): production generation package (GitHub push + ZIP bundle + cross-platform handoff spec).

## Immediate build queue
1. [x] Entitlement model in database (`plan`, `generationCredits`, `lifetimeRevenueCents`).
2. [~] Enforce paid unlock in generation routes/actions (checkout + webhook wired, endpoint scaffolded for final gate).
3. [x] Add conversion event logging (`checkout_started`, `checkout_completed`, `generation_delivered` path defined).
4. [x] Add mobile client contract endpoint for generation package retrieval (`/api/generation/package`).

## Shipping notes
- Prisma schema has been expanded for monetization analytics and entitlement state.
- Stripe checkout session now carries purchase metadata for attribution.
- Webhook now upgrades users to `PRO` and increments lifetime revenue in cents.

## Success metrics
- Checkout start rate
- Checkout completion rate
- Paid generations delivered per week
