-- Run this entire file once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run)

-- ── Subscriptions ──────────────────────────────────────────────────────────
create table if not exists subscriptions (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null unique,
  active       boolean default false,
  plan         text default 'monthly',
  next_billing timestamptz,
  method       text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users manage own subscription"
  on subscriptions for all
  using (auth.uid() = user_id);

-- ── Trades ─────────────────────────────────────────────────────────────────
create table if not exists trades (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  asset       text not null,
  type        text not null check (type in ('BUY','SELL')),
  entry       numeric default 0,
  exit_price  numeric default 0,
  sl          numeric default 0,
  tp          numeric default 0,
  lots        numeric default 0,
  pnl         numeric default 0,
  rr          numeric default 0,
  timeframe   text,
  session     text,
  strategy    text,
  emotion     text,
  notes       text,
  created_at  timestamptz default now()
);

alter table trades enable row level security;

create policy "Users manage own trades"
  on trades for all
  using (auth.uid() = user_id);

-- Index for fast per-user queries sorted by date
create index if not exists trades_user_date on trades(user_id, date);
