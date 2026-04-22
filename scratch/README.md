# Archon MVP

Archon is a monetized website-generation platform with:
- free intake + generation preview,
- paid production unlock via Stripe,
- web + mobile (Android/iOS) availability via PWA,
- conversion analytics and referral attribution.

## Product routes
- `/` marketing + product narrative
- `/intake` intent intake flow
- `/dashboard` generated output and paid unlock entry
- `/pricing` conversion and offer page
- `/mobile` install + delivery page for Android/iOS
- `/revenue` monetization console

## API routes
- `/api/ready` launch readiness (env + database checks)
- `/api/stripe/webhook` Stripe payment completion handler
- `/api/generation/package` paid-gated generation package contract

## Run locally
```bash
npm install
npm run dev
```

## Build for production
```bash
npm run build
npm start
```

## Environment variables
Create `.env` with:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:<PASSWORD>@<HOST>:6543/postgres?pgbouncer=true&connection_limit=1
CLERK_SECRET_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
# optional automation
POST_PURCHASE_WEBHOOK_URL=
```

## Launch readiness
Run:

```bash
curl http://localhost:3000/api/ready
```

Expect `status: "ready"` before launch.

## Deployment notes
- Deploy as a Next.js app (Vercel or Node host).
- For Supabase, use pooled Postgres URL in `DATABASE_URL`.
- Configure Stripe webhook to `https://<your-domain>/api/stripe/webhook`.
- Keep `NEXT_PUBLIC_APP_URL` set to production domain.
- Validate paid access by calling `/api/generation/package` after checkout.
- Run `npm run db:push` from CI/release pipeline after env setup.

Detailed GTM checklist: `docs/GO_TO_MARKET_MVP.md`
