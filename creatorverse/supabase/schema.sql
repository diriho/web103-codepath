-- Creatorverse — Supabase schema bootstrap
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

-- 1. Table -------------------------------------------------------------------

create table if not exists public.creators (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  name        text not null,
  url         text not null,
  description text not null,
  image_url   text,
  platform    text,
  platforms   jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_creators_user_id
  on public.creators (user_id);

-- 2. Row Level Security ------------------------------------------------------

alter table public.creators enable row level security;

drop policy if exists "Users can view own creators"   on public.creators;
drop policy if exists "Users can insert own creators" on public.creators;
drop policy if exists "Users can update own creators" on public.creators;
drop policy if exists "Users can delete own creators" on public.creators;

create policy "Users can view own creators"
  on public.creators
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own creators"
  on public.creators
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creators"
  on public.creators
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own creators"
  on public.creators
  for delete
  using (auth.uid() = user_id);

