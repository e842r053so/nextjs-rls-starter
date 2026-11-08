-- Demo table for the RLS walkthrough. Policies here are the entire
-- authorization model, so keep them in sync with src/lib/data/notes.ts.

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text not null default '',
  shared boolean not null default false,
  created_at timestamptz not null default now()
);

create index notes_owner_id_idx on public.notes (owner_id);
create index notes_shared_created_at_idx
  on public.notes (created_at desc)
  where shared;

alter table public.notes enable row level security;

create policy "read own or shared notes"
  on public.notes
  for select
  to authenticated
  using (owner_id = auth.uid() or shared);

create policy "insert own notes"
  on public.notes
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "update own notes"
  on public.notes
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "delete own notes"
  on public.notes
  for delete
  to authenticated
  using (owner_id = auth.uid());
