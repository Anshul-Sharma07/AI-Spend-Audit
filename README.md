# AI Spend Audit

AI Spend Audit is a startup-style SaaS MVP that helps small teams find wasted spend across AI tools such as Cursor, GitHub Copilot, ChatGPT, Claude, OpenAI API, Anthropic API, Gemini, and Windsurf.

The product asks for a team's AI stack, runs a deterministic savings audit, saves the report in Supabase, generates an optional AI-written summary, and captures qualified leads for follow-up.

Production: `https://spendaudit.credex.ai`

## What It Does

- Audits AI subscriptions by tool, plan, monthly spend, and seat count.
- Flags plan mismatches, unused seat risk, high API spend, and overlapping tools.
- Calculates monthly and annual savings with deterministic rules.
- Generates a concise AI summary with a deterministic fallback if the AI API is unavailable.
- Saves reports to Supabase and provides a shareable result URL.
- Captures work emails for follow-up when users want help implementing savings.

## Screenshots

Add final submission screenshots here:

| Screen | Suggested Capture |
| --- | --- |
| Landing page | Hero, CTA, supported tools |
| Audit form | Team context and AI tool input |
| Results page | Savings summary and recommendations |
| Lead capture | Email capture state after an audit |
| Mobile view | Audit form or results page on a narrow viewport |

Recommended filenames:

```text
docs/screenshots/landing.png
docs/screenshots/audit-form.png
docs/screenshots/results.png
docs/screenshots/mobile.png
```

## Tech Stack

- Next.js App Router with Server Actions
- TypeScript
- Tailwind CSS and lightweight shadcn-style primitives
- Supabase Postgres for audits and leads
- Anthropic API for narrative summaries
- Resend for optional confirmation email
- Vitest for audit-engine unit tests
- Vercel for deployment

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.
- `ANTHROPIC_API_KEY` is optional for local testing because the app has a deterministic fallback summary.
- `RESEND_API_KEY` is optional for core audit flow; lead capture still saves without email delivery if Resend is absent.

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run [supabase/schema.sql](supabase/schema.sql).
4. Add the environment variables above to `.env.local` and Vercel.

## Commands

```bash
npm run dev      # local development
npm run build    # production build
npm run lint     # ESLint
npm test         # Vitest audit-engine tests
```

## Architecture Overview

The app intentionally keeps the savings logic deterministic. AI is used only for summarizing the result, not for calculating savings.

```text
User -> Audit Form -> Server Action -> Rule Engine -> Supabase
                                      -> AI Summary with fallback
                                      -> Results Page
Results Page -> Lead Capture -> Server Action -> Supabase -> Optional Resend Email
```

More detail: [ARCHITECTURE.md](ARCHITECTURE.md)

## Key Decisions and Tradeoffs

- Deterministic audit rules over AI-only analysis: easier to test, explain, and trust.
- Server Actions over a separate API layer: faster MVP delivery with less boilerplate.
- Supabase service role on the server only: simple secure writes for a prototype.
- AI summary is non-critical: if Anthropic fails, users still receive a complete report.
- Shareable result URLs are simple public report links for the MVP. Auth can be added later if reports become sensitive.
- In-memory rate limiting is acceptable for MVP abuse reduction, but would move to Redis or Upstash at scale.

## Tests

The current test suite focuses on the highest-risk logic: savings recommendations.

```bash
npm test
```

Current coverage:

- Cursor plan right-sizing
- ChatGPT plan right-sizing
- GitHub Copilot plan right-sizing
- API spend thresholds
- Tool overlap detection
- Savings total calculation

More detail: [TESTS.md](TESTS.md)

## Submission Docs

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [REFLECTION.md](REFLECTION.md)
- [GTM.md](GTM.md)
- [ECONOMICS.md](ECONOMICS.md)
- [METRICS.md](METRICS.md)
- [TESTS.md](TESTS.md)
- [SUBMISSION_REVIEW.md](SUBMISSION_REVIEW.md)

## Deployment

The project deploys on Vercel.

1. Push to `main`.
2. Add production environment variables in Vercel.
3. Run the default Vercel build command:

```bash
npm run build
```

Important production variables:

```text
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it with attribution.

---

## Contact

**Author**: Anshul Sharma
GitHub: [@Anshul-Sharma07](https://github.com/Anshul-Sharma07)  
Email: anshulsharma2818@gmail.com

For suggestions, improvements, or issues, feel free to open a [GitHub Issue](https://github.com/Anshul-Sharma07/multi-pdf-qa-chatbot/issues).

