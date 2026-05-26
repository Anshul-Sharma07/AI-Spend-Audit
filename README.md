# AI Spend Audit — Credex

A free SaaS-style tool that helps startups identify and reduce overspending on AI tools (Cursor, ChatGPT, Claude, GitHub Copilot, etc.).

## Tech Stack

- **Next.js 15** App Router + Server Actions
- **TypeScript** — strict mode
- **Tailwind CSS** + shadcn/ui
- **Supabase** — PostgreSQL (audits + leads)
- **Anthropic API** — AI summary generation (with deterministic fallback)
- **Resend** — confirmation emails
- **Vitest** — unit tests
- **GitHub Actions** — CI (lint → test → build)

## Features

- 🔍 **Audit form** — Add tools with plan, spend, and seat count; persisted to localStorage
- 🧮 **Deterministic audit engine** — Rule-based savings analysis (no AI for calculations)
- 📊 **Results page** — Per-tool recommendations with monthly/annual savings
- 🤖 **AI summary** — Personalized paragraph via Claude API with fallback
- 🔗 **Shareable public URL** — `/audit/[id]/share` (excludes email/company)
- 📧 **Lead capture** — Email + optional company/role, stored in Supabase + Resend email
- 🛡️ **Abuse protection** — Honeypot fields + in-memory rate limiting

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/ai-spend-audit
cd ai-spend-audit
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Supabase, Anthropic, and Resend keys
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase/schema.sql` in the SQL Editor
3. Copy your project URL and keys into `.env.local`

> **Important:** The `audits` and `leads` tables use service-role-only insert policies.
> All writes go through server actions using `SUPABASE_SERVICE_ROLE_KEY`.
> The anon key is only used for the client-side Supabase instance (reads on public audits).

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Run tests

```bash
npm test
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server only) |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key for AI summary |
| `RESEND_API_KEY` | ✅ | Resend API key for confirmation emails |
| `RESEND_FROM_EMAIL` | Optional | Sender address (default: `audit@credex.ai`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Full app URL (e.g. `https://spendaudit.credex.ai`) |

## Project Structure

```
app/
  page.tsx                    # Landing page
  layout.tsx                  # Root layout (fonts, metadata)
  globals.css                 # Design tokens + Tailwind
  not-found.tsx               # 404 page
  audit/
    layout.tsx                # Audit section nav
    page.tsx                  # Audit form page
    [id]/
      page.tsx                # Results page (private — shows lead form)
      share/
        page.tsx              # Public share page (no personal data, OG tags)

components/
  AuditForm.tsx               # Main form with localStorage persistence
  ResultsView.tsx             # Results display + share/CTA
  RecommendationCard.tsx      # Per-tool finding card
  SavingsSummary.tsx          # Big numbers summary card
  LeadCaptureForm.tsx         # Email capture form
  ui/                         # shadcn/ui primitives

lib/
  types.ts                    # Shared TypeScript types
  pricing.ts                  # Centralized tool pricing config
  audit-engine.ts             # Deterministic rule-based audit logic
  ai-summary.ts               # AI summary + deterministic fallback
  actions.ts                  # Server actions (submitAudit, captureLead, getAudit)
  supabase.ts                 # Supabase client setup
  utils.ts                    # cn(), formatCurrency()

__tests__/
  audit-engine.test.ts        # 15 unit tests for audit logic

supabase/
  schema.sql                  # Database schema + RLS policies

.github/workflows/
  ci.yml                      # Lint → Test → Build pipeline
```

## Audit Engine

The audit engine (`lib/audit-engine.ts`) is fully deterministic — no AI involved in savings calculations. Rules include:

- **Cursor Business ≤2 seats** → recommend Pro ($20/seat saves 50%)
- **ChatGPT Team for tiny teams** → recommend Plus individual plans
- **GitHub Copilot Enterprise for small teams** → recommend Business
- **High API spend per-person** → flag with caching/model recommendations
- **Tool overlap** (Cursor + Copilot + Windsurf) → consolidation warning
- **ChatGPT + OpenAI API** → redundancy check
- **Claude + Anthropic API** → duplication check

## Deploy to Vercel

```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard under Project Settings → Environment Variables.

## License

MIT
