-- supabase/schema.sql
-- Run this in the Supabase SQL editor to set up your database

-- ─── audits table ─────────────────────────────────────────────────────────────
create table if not exists audits (
  id uuid primary key,
  form_data jsonb not null,
  recommendations jsonb not null default '[]'::jsonb,
  total_monthly_savings integer not null default 0,
  total_annual_savings integer not null default 0,
  ai_summary text,
  created_at timestamptz not null default now()
);

-- Index for recent audits lookup
create index if not exists audits_created_at_idx on audits (created_at desc);

-- ─── leads table ──────────────────────────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company text,
  role text,
  audit_id uuid references audits(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Prevent duplicate email submissions for the same audit
create unique index if not exists leads_email_audit_unique on leads (email, audit_id);

-- Index for email lookups
create index if not exists leads_email_idx on leads (email);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Audits are publicly readable (for share pages) but only insertable via service role
alter table audits enable row level security;

create policy "Audits are publicly readable"
  on audits for select
  using (true);

create policy "Audits are insertable by service role only"
  on audits for insert
  with check (false); -- anon cannot insert; use service role key in server actions

-- Leads are only accessible by service role (no public reads)
alter table leads enable row level security;

create policy "Leads are not publicly readable"
  on leads for select
  using (false);

create policy "Leads are insertable by service role only"
  on leads for insert
  with check (false);
