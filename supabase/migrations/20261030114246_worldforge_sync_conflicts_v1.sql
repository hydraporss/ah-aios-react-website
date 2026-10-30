-- Persistent conflict records for WorldForge bidirectional synchronization.
-- Generic sync records conflicts but never resolves them or changes canon status.
create table public.sync_conflicts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  record_type text not null check (record_type in ('worlds','entities','relationships','sources','claims')),
  local_record_id text not null,
  remote_record_id uuid,
  base_version integer,
  remote_version integer,
  base_snapshot jsonb,
  local_snapshot jsonb,
  remote_snapshot jsonb,
  status text not null default 'open' check (status in ('open','resolved','deferred')),
  resolution text check (resolution in ('keep_local','keep_remote','manual_merge')),
  rationale text,
  created_by uuid not null references auth.users(id),
  resolved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);
alter table public.sync_conflicts enable row level security;
revoke all on public.sync_conflicts from anon;
grant select, insert, update on public.sync_conflicts to authenticated;
create policy "project owners read sync conflicts" on public.sync_conflicts
  for select to authenticated
  using (exists (select 1 from public.projects p where p.id = sync_conflicts.project_id and p.owner_id = (select auth.uid())));
create policy "project owners create sync conflicts" on public.sync_conflicts
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (select 1 from public.projects p where p.id = sync_conflicts.project_id and p.owner_id = (select auth.uid()))
  );
create policy "project owners resolve sync conflicts" on public.sync_conflicts
  for update to authenticated
  using (exists (select 1 from public.projects p where p.id = sync_conflicts.project_id and p.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.projects p where p.id = sync_conflicts.project_id and p.owner_id = (select auth.uid())));
create index sync_conflicts_project_status_created_idx on public.sync_conflicts(project_id,status,created_at desc);
create unique index sync_conflicts_one_open_per_record_idx on public.sync_conflicts(project_id,record_type,local_record_id) where status = 'open';
