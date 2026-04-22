# Phase 10: Ship to Market — Full Cross-Functional Execution

## Roles Activated
- **CTO / Lead Engineer** — Architecture, code quality, build pipeline
- **Product Manager** — Feature prioritization, conversion flows, user journeys
- **UX/UI Designer** — Visual polish, responsive design, brand consistency
- **Security Engineer** — Auth hardening, payment security, input sanitization
- **Marketing / Growth Lead** — SEO, copy optimization, social proof, OG tags
- **QA Engineer** — Cross-browser, mobile responsiveness, edge cases
- **Legal / Compliance** — Privacy Policy, Terms of Service, cookie consent
- **DevOps** — Deployment readiness, env config, error boundaries

---

## Critical Infrastructure (CTO + Security)
- [/] Fix ClerkProvider HTML structure (wraps `<html>` illegally)
- [ ] Add middleware deprecation TODO tracking comment
- [ ] Add global error boundary (`error.tsx` + `not-found.tsx`)
- [ ] Sanitize Prisma singleton (prevent connection leaks)

## Mobile & Responsive (UX Designer + QA)
- [ ] Build mobile navigation drawer (hamburger menu is dead)
- [ ] Verify all pages responsive at 375px, 768px, 1024px, 1440px

## Conversion Funnel (Product Manager + Marketing)
- [ ] Create `/pricing` page with feature comparison (Free vs Premium)
- [ ] Add export success/cancel toast on dashboard
- [ ] Refine Hero copy for conversion optimization
- [ ] Wire footer with real navigation links

## Legal Compliance (Legal + Security)
- [ ] Create `/privacy` page (Privacy Policy)
- [ ] Create `/terms` page (Terms of Service)
- [ ] Add footer links to legal pages

## Brand & Polish (UX Designer)
- [ ] Polish sign-in/sign-up pages (Midnight Luxe consistency)
- [ ] Add page transition animations
- [ ] Create custom 404 page matching brand
- [ ] Enhance PWA icons (192px + 512px)

## SEO & Discoverability (Marketing)
- [ ] Add OpenGraph image generation
- [ ] Add structured data (JSON-LD)
- [ ] Per-page meta descriptions for /intake, /dashboard, /pricing
- [ ] Robots.txt + sitemap

## Final Verification (QA + DevOps)
- [ ] Clean production build (exit 0)
- [ ] Visual verification of all routes via browser
- [ ] Mobile responsiveness spot-check
