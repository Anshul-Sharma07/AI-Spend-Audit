# Reflection

## Hardest Bug

The hardest bug was a Vercel build failure during `Collecting page data` for `/audit/[id]`.

The root cause was that App Router route metadata and module imports can be evaluated during build/page-data collection. A previous version of the dynamic results page still had `generateMetadata()` calling Supabase. Even with `dynamic = "force-dynamic"`, the metadata path could trigger runtime database access at build time.

The fix was to remove database-backed metadata generation, keep the route fully runtime-rendered, and move audit fetching into a small helper used only by the page component. I also made Supabase client creation lazy so imports do not require live environment variables.

## Decision I Reversed

I initially treated the public share page as a separate route with richer Open Graph metadata. That was attractive from a marketing perspective, but it created deployment risk and duplicated dynamic fetching logic.

For the MVP, I reversed that decision and kept sharing simple: the result page itself is the shareable URL. That is less fancy, but it is more reliable and easier to submit confidently.

## How I Used AI Tooling

I used AI as a pair programmer for:

- Debugging the App Router deployment issue
- Reviewing dynamic rendering and Supabase access patterns
- Drafting documentation and submission materials
- Thinking through GTM, economics, metrics, and scaling tradeoffs

I did not use AI for the core savings math. The audit engine is deterministic and covered by unit tests, because financial recommendations need to be explainable.

## Self-Rating

I would rate this submission an 8 out of 10.

Strengths:

- The core product flow works end to end.
- The value proposition is specific and easy to understand.
- The audit engine is deterministic and tested.
- The app has realistic lead capture and follow-up mechanics.
- The documentation explains product, engineering, and business tradeoffs.

What keeps it from being a 10:

- The rules are based on approximate public pricing and heuristics, not real billing integrations.
- There is no analytics instrumentation yet.
- There is no user account model or private report permissions.
- Rate limiting is MVP-grade rather than production-grade.
- The app needs real-world calibration from actual customer audits.

## Week 2 Roadmap

1. Instrument the funnel.
   Track landing CTA clicks, audit starts, audit completions, savings found, lead submits, and follow-up bookings.

2. Improve report credibility.
   Add citations or pricing assumptions next to recommendations so users understand why a suggestion was made.

3. Add a CSV export.
   Let teams export recommendations for finance/procurement review.

4. Run founder-led customer development.
   Interview 10 engineering leaders or startup operators who use 3 or more AI tools.

5. Add one billing integration.
   Start with Stripe invoice upload or CSV import before building OAuth integrations.

6. Tighten qualification.
   Ask one optional question: "Do you want help implementing these savings?"

7. Add basic analytics.
   Use PostHog or Umami to measure activation and lead conversion.

8. Improve distribution.
   Publish benchmark content around "AI tool spend by team size" using anonymized aggregate audit data.
