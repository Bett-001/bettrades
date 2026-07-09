-- ══════════════════════════════════════════════════════════════════════════
-- MQTRADE PRO — Missing Tables & Columns
-- Run this entire file in Supabase SQL Editor AFTER supabase_setup.sql
-- and supabase_admin_setup.sql have already been run.
-- Dashboard → SQL Editor → New query → paste → Run
-- ══════════════════════════════════════════════════════════════════════════


-- ── 1. Add missing columns to the trades table ─────────────────────────────
alter table trades add column if not exists source    text default 'manual' check (source in ('manual','mt5'));
alter table trades add column if not exists mt5_ticket bigint default null;

-- Unique index required for MT5 upsert conflict detection
create unique index if not exists trades_user_mt5_ticket
  on trades(user_id, mt5_ticket)
  where mt5_ticket is not null;

-- Realtime for trades is already enabled — skipped


-- ── 2. MT5 API tokens table ─────────────────────────────────────────────────
create table if not exists mt5_tokens (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null unique,
  token      text not null unique,
  created_at timestamptz default now()
);

alter table mt5_tokens enable row level security;

create policy "Users manage own MT5 token"
  on mt5_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 3. Referrals table ─────────────────────────────────────────────────────
create table if not exists referrals (
  id          uuid default gen_random_uuid() primary key,
  referrer_id uuid references auth.users(id) on delete cascade not null,
  referred_id uuid references auth.users(id) on delete cascade not null unique,
  active      boolean default false,
  created_at  timestamptz default now()
);

alter table referrals enable row level security;

-- Referrers can see their own referrals
create policy "Referrers see own referrals"
  on referrals for select
  using (auth.uid() = referrer_id);

-- Only the system (service role) can insert referrals
create policy "System inserts referrals"
  on referrals for insert
  with check (true);

-- Index for fast lookup by referrer
create index if not exists referrals_referrer_idx on referrals(referrer_id);


-- ── 4. Coupon codes table ───────────────────────────────────────────────────
create table if not exists coupons (
  id          uuid default gen_random_uuid() primary key,
  code        text not null unique,
  discount    text not null,                -- e.g. "20%" or "1 Month Free"
  discount_pct numeric default 0,           -- numeric % for Stripe: 0-100
  max_uses    integer default 100,
  used_count  integer default 0,
  active      boolean default true,
  expires_at  date,
  created_at  timestamptz default now()
);

alter table coupons enable row level security;

-- Anyone authenticated can read active coupons (to validate at checkout)
create policy "Read active coupons"
  on coupons for select to authenticated
  using (active = true);

-- Only admins can manage coupons
create policy "Admin manages coupons"
  on coupons for all
  using (is_admin()) with check (is_admin());

grant all on coupons to authenticated;


-- ── 5. Broadcast / email log table ─────────────────────────────────────────
create table if not exists broadcasts (
  id           uuid default gen_random_uuid() primary key,
  subject      text not null,
  body         text not null,
  type         text default 'info',
  sent_to      integer default 0,           -- subscriber count at send time
  sent_by      uuid references auth.users(id),
  created_at   timestamptz default now()
);

alter table broadcasts enable row level security;

create policy "Admin manages broadcasts"
  on broadcasts for all
  using (is_admin()) with check (is_admin());

grant all on broadcasts to authenticated;


-- ── 6. Signal performance tracking (mark TP/SL from admin panel) ──────────
-- Add resolved fields to the signals table
alter table signals add column if not exists resolved_at  timestamptz default null;
alter table signals add column if not exists actual_pips  numeric     default null;


-- ── 7. User preferences table ──────────────────────────────────────────────
-- Stores onboarding preferences (markets, session, risk, timeframe)
create table if not exists user_preferences (
  user_id             uuid references auth.users(id) on delete cascade primary key,
  preferred_markets   text[] default '{}'::text[],
  preferred_session   text   default 'London',
  risk_level          text   default 'Moderate (1-2%)',
  preferred_timeframe text   default 'H4',
  onboarded           boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table user_preferences enable row level security;

create policy "Users manage own preferences"
  on user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 8. Referral code helper function ───────────────────────────────────────
-- Called when a referred user signs up via ?ref=CODE
create or replace function register_referral(p_referral_code text, p_referred_id uuid)
returns void language plpgsql security definer as $$
declare
  v_referrer_id uuid;
begin
  -- Lookup the referrer by their code stored in user_metadata
  select id into v_referrer_id
  from auth.users
  where (raw_user_meta_data->>'referral_code') = p_referral_code
  limit 1;

  if v_referrer_id is null then return; end if;
  if v_referrer_id = p_referred_id then return; end if; -- can't refer yourself

  insert into referrals (referrer_id, referred_id, active)
  values (v_referrer_id, p_referred_id, false)
  on conflict (referred_id) do nothing;
end;
$$;

grant execute on function register_referral(text, uuid) to authenticated;


-- ── 9. Function: activate referral when referred user pays ─────────────────
create or replace function activate_referral(p_referred_id uuid)
returns void language plpgsql security definer as $$
begin
  update referrals set active = true
  where referred_id = p_referred_id and active = false;
end;
$$;

grant execute on function activate_referral(uuid) to service_role;


-- ══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET — Run this separately in SQL Editor
-- Creates the public avatars bucket for profile pictures
-- ══════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,                        -- public: anyone can read avatar URLs
  5242880,                     -- 5 MB max
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- RLS: authenticated users can upload/update their own avatar
create policy "Users upload own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users update own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Public read for all avatars
create policy "Public avatar read"
  on storage.objects for select
  using (bucket_id = 'avatars');
