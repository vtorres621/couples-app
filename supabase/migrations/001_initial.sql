-- ============================================================
-- Couples App — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Tasks (persist until manually deleted)
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  is_checked  boolean not null default false,
  checked_by  uuid references auth.users(id) on delete set null,
  checked_at  timestamptz,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Grocery items (auto-cleared when checked on next page open)
create table if not exists public.grocery_items (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  is_checked  boolean not null default false,
  checked_by  uuid references auth.users(id) on delete set null,
  checked_at  timestamptz,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Trips
create table if not exists public.trips (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  destination text,
  trip_date   date not null,
  notes       text,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — both authenticated users share all data
-- ============================================================

alter table public.tasks enable row level security;
alter table public.grocery_items enable row level security;
alter table public.trips enable row level security;

create policy "Authenticated full access" on public.tasks
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated full access" on public.grocery_items
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated full access" on public.trips
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- Enable Realtime for tasks and grocery_items
-- ============================================================

alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.grocery_items;
