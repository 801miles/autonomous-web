# Phase 10: Production Hardening & Ship Polish

The AAO core build (Phase 8) and monetization layer are functionally complete. This phase closes the gap between "working prototype" and "shippable SaaS product" by fixing structural bugs, adding missing UX flows, and delivering production-grade polish.

## Current Status (Clean Build ✓)

| Layer | Status |
|---|---|
| AAO Core (Intake → Dashboard) | ✅ Complete |
| Monetization (Clerk + Stripe + Prisma) | ✅ Complete |
| PWA (manifest + service worker) | ✅ Complete |
| **Build** | **✅ Exit 0, 0 TS errors** |

---

## Critical Bugs to Fix

> [!CAUTION]
> These are structural issues that will break the app in production.

### 1. Layout HTML Structure — `ClerkProvider` wraps `<html>` incorrectly
Currently `<ClerkProvider>` opens *before* `<html>` but closes *after* `</html>`, producing invalid HTML. Must wrap only the `<body>` children.

#### [MODIFY] [layout.tsx](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/app/layout.tsx)
- Move `<ClerkProvider>` inside `<body>` to wrap only the app content (Navbar + main + footer).

### 2. Next.js 16 Middleware Deprecation
The build warns: `"middleware" file convention is deprecated. Please use "proxy" instead.` While functional today, this will break on the next Next.js update.

#### [MODIFY] [middleware.ts](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/middleware.ts)
- Acknowledge the warning; keep current implementation since Clerk SDK hasn't migrated to the proxy convention yet. Add a `// TODO` comment for tracking.

---

## UX Gaps to Close

### 3. Mobile Navigation — Hamburger menu is a dead button
The `<Menu>` icon renders but has no onClick handler and no mobile drawer.

#### [MODIFY] [Navbar.tsx](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/components/layout/Navbar.tsx)
- Add mobile slide-out drawer with Framer Motion `AnimatePresence`
- Include all nav links + auth controls for mobile

### 4. Pricing / Export Info Page
Users clicking "Push to GitHub" or "Download .ZIP" hit a Stripe checkout, but there's no dedicated page explaining what they're paying for. This kills conversion.

#### [NEW] [page.tsx](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/app/pricing/page.tsx)
- Single product card: **$29 One-Time Architectural Export**
- Feature comparison (Free vs. Premium)
- CTA button → Stripe checkout
- Midnight Luxe design consistency

### 5. Footer Links — All `#` placeholders
Footer has Documentation, Registry, and Nexus links that go nowhere.

#### [MODIFY] [layout.tsx](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/app/layout.tsx)
- Wire footer links to real routes (`/pricing`, `/intake`, `/dashboard`)
- Add GitHub repo link

### 6. Export Success/Cancel UX
After Stripe checkout, users land on `/dashboard/{id}?export_success=true` which is a 404. Need to handle the success/cancel query params on the existing dashboard.

#### [MODIFY] [page.tsx](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/app/dashboard/page.tsx)
- Detect `export_success` / `export_cancelled` query params
- Show success toast/banner or cancellation message

---

## Visual Polish

### 7. Enhanced Animations & Micro-interactions
- Add page transition wrapper using Framer Motion `layout` animations
- Improve hero gradient pulse animation
- Add skeleton loading states for dashboard components

### 8. Sign-in/Sign-up Page Polish
- Match the Midnight Luxe theme more precisely
- Add background orbs and gradient consistent with the rest of the app

#### [MODIFY] [sign-in page](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/app/sign-in/[[...sign-in]]/page.tsx)
#### [MODIFY] [sign-up page](file:///c:/Users/hlim/.gemini/antigravity/scratch/src/app/sign-up/[[...sign-up]]/page.tsx)

---

## Proposed Execution Order

1. Fix `ClerkProvider` layout (critical HTML bug)
2. Build mobile navigation drawer
3. Create `/pricing` page
4. Wire footer links
5. Handle export success/cancel on dashboard
6. Polish sign-in/sign-up pages
7. Add page transitions & micro-animations
8. Final build verification

## Verification Plan

### Automated
- `npm run build` — exit 0, 0 TS errors
- Browser verification of all routes: `/`, `/intake`, `/dashboard`, `/pricing`, `/sign-in`, `/sign-up`

### Manual
- Mobile responsiveness check (hamburger menu, drawer)
- Stripe checkout flow (with test keys)

---

> [!IMPORTANT]
> Say **"Approve"** to begin execution, or flag any items you want adjusted.
