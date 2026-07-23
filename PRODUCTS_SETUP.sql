-- ============================================================================
-- MQTRADE PRO — Products, Webinars & Reports schema
-- Run this in the Supabase SQL editor.
-- Access to Mentorship / Prop Firm Prep is per-product and NOT unlocked by the
-- main $50 MQTRADE PRO subscription. Webinars & Reports are open to any
-- logged-in user.
-- ============================================================================

-- ── Per-product paid access (mentorship, prop_firm) ─────────────────────────
create table if not exists product_access (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product     text not null,               -- 'mentorship' | 'prop_firm'
  status      text not null default 'pending', -- 'pending' | 'granted' | 'revoked'
  full_name   text,
  contact     text,                        -- phone / telegram the user leaves
  note        text,                        -- optional message from the user
  created_at  timestamptz not null default now(),
  granted_at  timestamptz,
  unique (user_id, product)
);

alter table product_access enable row level security;

-- Users manage their own request rows
drop policy if exists "product_access own select" on product_access;
create policy "product_access own select" on product_access
  for select using (auth.uid() = user_id or is_admin());

drop policy if exists "product_access own insert" on product_access;
create policy "product_access own insert" on product_access
  for insert with check (auth.uid() = user_id);

drop policy if exists "product_access own update" on product_access;
create policy "product_access own update" on product_access
  for update using (auth.uid() = user_id or is_admin());

-- ── Webinars (recorded YouTube videos + live sessions) ──────────────────────
create table if not exists webinars (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  youtube_url   text not null,             -- full YouTube watch/live URL
  is_live       boolean not null default false, -- toggle ON when streaming live
  published_at  timestamptz not null default now()
);

alter table webinars enable row level security;

drop policy if exists "webinars public read" on webinars;
create policy "webinars public read" on webinars
  for select using (true);

drop policy if exists "webinars admin write" on webinars;
create policy "webinars admin write" on webinars
  for all using (is_admin()) with check (is_admin());

-- ── Market Analysis Reports ─────────────────────────────────────────────────
create table if not exists reports (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  summary       text,
  body          text,
  market        text,                      -- e.g. 'Forex', 'Gold', 'Indices'
  bias          text,                      -- 'Bullish' | 'Bearish' | 'Neutral'
  image_url     text,
  published_at  timestamptz not null default now()
);

alter table reports enable row level security;

drop policy if exists "reports public read" on reports;
create policy "reports public read" on reports
  for select using (true);

drop policy if exists "reports admin write" on reports;
create policy "reports admin write" on reports
  for all using (is_admin()) with check (is_admin());

-- ── Realtime — so the LIVE banner updates the instant you go live ────────────
-- (safe to re-run; ignore "already member" notices)
do $$
begin
  alter publication supabase_realtime add table webinars;
exception when duplicate_object then null;
end $$;
