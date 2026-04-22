# Autonomous Deployment Sprint (Supabase + Vercel)

This runbook is optimized for fast MVP go-live.

## 1) Supabase database
- Create Supabase project.
- Copy pooled connection string (Transaction mode) from Database settings.
- Set as `DATABASE_URL` in Vercel.

Expected format:
`postgresql://postgres:<PASSWORD>@<HOST>:6543/postgres?pgbouncer=true&connection_limit=1`

## 2) Vercel project
- Import GitHub repo.
- Set root directory to `scratch`.
- Build command: `npm run build`
- Install command: `npm install`

## 3) Production environment variables
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `POST_PURCHASE_WEBHOOK_URL` (optional)

## 4) Apply schema in production
Use deployment shell (or CI) to run:

```bash
npm run db:push
```

## 5) Stripe webhook
- Add endpoint: `https://<your-domain>/api/stripe/webhook`
- Enable event: `checkout.session.completed`
- Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## 6) Readiness check
Open:

`https://<your-domain>/api/ready`

Must return:
- `status: "ready"`
- `checks.database.usesPostgresUrl: true`
- `checks.database.ok: true`

## 7) Monetization smoke test
1. Visit `https://<your-domain>/?ref=launch`
2. Complete intake, open dashboard.
3. Start Stripe checkout.
4. Complete payment.
5. Verify:
   - `/revenue` shows checkout completion
   - `/api/generation/package` returns `status: "paid_unlocked"`

## 8) Mobile launch checks
- Android: install PWA from Chrome.
- iOS: Add to Home Screen from Safari.
- Verify dashboard + checkout + package retrieval works in standalone mode.
