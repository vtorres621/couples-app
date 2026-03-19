-- ============================================================
-- Couples App — Migration 002
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---- Grocery Sections ----

create table if not exists public.grocery_sections (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.grocery_sections enable row level security;

create policy "Authenticated full access" on public.grocery_sections
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Add section_id to grocery_items (nullable — items can be unsectioned)
alter table public.grocery_items add column if not exists section_id uuid references public.grocery_sections(id) on delete set null;

-- ---- Calendar Events ----

create table if not exists public.calendar_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  event_date  date not null,
  event_time  time,
  notes       text,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.calendar_events enable row level security;

create policy "Authenticated full access" on public.calendar_events
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---- Trip End Date ----

alter table public.trips add column if not exists end_date date;
