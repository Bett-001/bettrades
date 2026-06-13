-- Run this in Supabase SQL Editor

-- ── Admin table ────────────────────────────────────────────────────────────
create table if not exists admins (
  user_id uuid references auth.users(id) on delete cascade primary key
);

-- After running this file, sign up on the site, then come back and run:
-- insert into admins (user_id) select id from auth.users where email = 'your@email.com';

create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from admins where user_id = auth.uid())
$$;
grant execute on function is_admin() to authenticated;

-- ── Signals ────────────────────────────────────────────────────────────────
create table if not exists signals (
  id         uuid default gen_random_uuid() primary key,
  asset      text not null,
  type       text not null check (type in ('BUY','SELL')),
  entry      numeric not null,
  sl         numeric not null,
  tp         text[] not null default '{}',
  timeframe  text,
  status     text default 'active' check (status in ('active','tp_hit','sl_hit','cancelled')),
  pips       numeric default 0,
  notes      text,
  created_at timestamptz default now()
);
alter table signals enable row level security;
drop policy if exists "Read signals" on signals;
drop policy if exists "Admin signals" on signals;
create policy "Read signals" on signals for select to authenticated using (true);
create policy "Admin signals" on signals for all using (is_admin()) with check (is_admin());
grant all on signals to authenticated;

-- ── Strategies ─────────────────────────────────────────────────────────────
create table if not exists strategies (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  description text,
  content     text,
  category    text default 'Forex',
  timeframe   text default 'H4',
  created_at  timestamptz default now()
);
alter table strategies enable row level security;
drop policy if exists "Read strategies" on strategies;
drop policy if exists "Admin strategies" on strategies;
create policy "Read strategies" on strategies for select to authenticated using (true);
create policy "Admin strategies" on strategies for all using (is_admin()) with check (is_admin());
grant all on strategies to authenticated;

-- ── Announcements ──────────────────────────────────────────────────────────
create table if not exists announcements (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  body       text,
  type       text default 'info' check (type in ('info','warning','success','urgent')),
  pinned     boolean default false,
  created_at timestamptz default now()
);
alter table announcements enable row level security;
drop policy if exists "Read announcements" on announcements;
drop policy if exists "Admin announcements" on announcements;
create policy "Read announcements" on announcements for select to authenticated using (true);
create policy "Admin announcements" on announcements for all using (is_admin()) with check (is_admin());
grant all on announcements to authenticated;

-- ── Get all subscribers (admin only) ───────────────────────────────────────
create or replace function get_all_subscribers()
returns table(user_id uuid, email text, joined timestamptz, active boolean, plan text, next_billing timestamptz, method text)
language plpgsql security definer as $$
begin
  if not is_admin() then raise exception 'Access denied'; end if;
  return query
    select u.id, u.email::text, u.created_at,
      coalesce(s.active, false), coalesce(s.plan,'none'::text),
      s.next_billing, s.method
    from auth.users u
    left join subscriptions s on s.user_id = u.id
    order by u.created_at desc;
end; $$;
grant execute on function get_all_subscribers() to authenticated;

-- ── Admin toggle subscription ───────────────────────────────────────────────
create or replace function admin_set_subscription(p_user_id uuid, p_active boolean)
returns void language plpgsql security definer as $$
begin
  if not is_admin() then raise exception 'Access denied'; end if;
  insert into subscriptions (user_id, active, plan, next_billing, method)
  values (p_user_id, p_active, 'monthly',
    case when p_active then now() + interval '1 month' else null end, 'admin')
  on conflict (user_id) do update
    set active = p_active,
        next_billing = case when p_active then now() + interval '1 month' else null end,
        updated_at = now();
end; $$;
grant execute on function admin_set_subscription(uuid, boolean) to authenticated;

grant all on admins to authenticated;
