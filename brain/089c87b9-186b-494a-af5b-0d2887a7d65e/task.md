# Execution Plan: Archon Platform Monetization

- [x] Install dependencies (`@clerk/nextjs`, `stripe`, `@stripe/stripe-js`, `prisma`, `@prisma/client`)
- [x] Initialize Prisma (`npx prisma init --datasource-provider sqlite`)
- [x] Create Database schema (`prisma/schema.prisma` and `.env` updates)
- [x] Create Clerk Security Middleware (`src/middleware.ts`)
- [x] Create Auth Layer
  - [x] `src/app/sign-in/[[...sign-in]]/page.tsx`
  - [x] `src/app/sign-up/[[...sign-up]]/page.tsx`
  - [x] Integrate ClerkProvider in `src/app/layout.tsx`
- [x] Create Payment Integration
  - [x] `src/app/api/stripe/webhook/route.ts`
  - [x] `src/actions/stripe.ts`
- [x] UI Paywall Integration
  - [x] `src/components/layout/Navbar.tsx` (Add UserButton and Auth conditional logic)
  - [x] `src/components/dashboard/SpecAsCode.tsx` (Hijack export button to trigger Stripe checkout)
