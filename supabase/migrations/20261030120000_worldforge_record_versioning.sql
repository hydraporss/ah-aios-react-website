-- WorldForge v1 structured-record evolution for the EXISTING AH-AIOS Supabase schema.
-- Existing table mapping: projects = world container; entities, relationships,
-- claims, sources and governance_reviews are preserved and extended in place.
-- No tables are dropped and no existing user records are rewritten beyond defaults.
begin;

alter table public.projects add column if not exists schema_version text not null default '1.0.0';
alter table public.projects add column if not exists record_version integer not null default 1 check (record_version > 0);
alter table public.projects add column if not exists content_hash text;
alter table public.projects add column if not exists updated_by uuid references auth.users(id);

alter table public.entities add column if not exists schema_version text not null default '1.0.0';
alter table public.entities add column if not exists record_version integer not null default 1 check (record_version > 0);
alter table public.entities add column if not exists workflow_status text not null default 'Draft'
  check (workflow_status in ('Draft','Proposed','Investigated','Validated','Approved','Rejected','Needs Evidence','Superseded'));
alter table public.entities add column if not exists content_hash text;
alter table public.entities add column if not exists updated_by uuid references auth.users(id);

alter table public.relationships add column if not exists schema_version text not null default '1.0.0';
alter table public.relationships add column if not exists record_version integer not null default 1 check (record_version > 0);
alter table public.relationships add column if not exists content_hash text;
alter table public.relationships add column if not exists updated_by uuid references auth.users(id);

alter table public.claims add column if not exists schema_version text not null default '1.0.0';
alter table public.claims add column if not exists record_version integer not null default 1 check (record_version > 0);
alter table public.claims add column if not exists evidence_state text not null default 'Unknown'
  check (evidence_state in ('Unknown','Unsupported','Partially Supported','Supported','Contradicted','Mixed'));
alter table public.claims add column if not exists content_hash text;
alter table public.claims add column if not exists updated_by uuid references auth.users(id);

alter table public.sources add column if not exists schema_version text not null default '1.0.0';
alter table public.sources add column if not exists record_version integer not null default 1 check (record_version > 0);
alter table public.sources add column if not exists workflow_status text not null default 'Draft'
  check (workflow_status in ('Draft','Proposed','Investigated','Validated','Approved','Rejected','Needs Evidence','Superseded'));
alter table public.sources add column if not exists content_hash text;
alter table public.sources add column if not exists updated_by uuid references auth.users(id);
alter table public.sources add column if not exists updated_at timestamptz not null default now();

create table if not exists public.record_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  table_name text not null check (table_name in ('projects','entities','relationships','claims','sources')),
  record_id uuid not null,
  record_version integer not null check (record_version > 0),
  record_snapshot jsonb not null,
  content_hash text,
  actor_id uuid references auth.users(id),
  change_reason text not null default '',
  created_at timestamptz not null default now(),
  unique(table_name,record_id,record_version)
);
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  actor_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id uuid not null,
  prior_version integer,
  resulting_version integer not null,
  outcome text not null check(outcome in ('accepted','rejected','failed')),
  reason text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists record_versions_project_idx on public.record_versions(project_id,created_at desc);
create index if not exists record_versions_record_idx on public.record_versions(table_name,record_id,record_version desc);
create index if not exists audit_events_project_idx on public.audit_events(project_id,created_at desc);
create index if not exists audit_events_record_idx on public.audit_events(table_name,record_id,created_at desc);

alter table public.record_versions enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.wf_version_before_write()
returns trigger language plpgsql
set search_path = public
as $$
begin
  if tg_op='INSERT' then
    new.record_version := 1;
    if tg_table_name='projects' then new.updated_by := auth.uid(); new.updated_at := coalesce(new.updated_at,now());
    else new.updated_by := auth.uid(); end if;
  else
    if new.id <> old.id then raise exception 'Record ID is immutable'; end if;
    if new.record_version = old.record_version then
      -- Compatibility for older clients; the new service adapter supplies the next version
      -- and filters updates by the version it originally read.
      new.record_version := old.record_version + 1;
    elsif new.record_version <> old.record_version + 1 then
      raise exception 'Version conflict: expected record_version %', old.record_version + 1;
    end if;
    new.updated_by := auth.uid();
    if tg_table_name='sources' then new.updated_at := now(); end if;
  end if;
  return new;
end;
$$;
revoke all on function public.wf_version_before_write() from public;

create or replace function public.wf_capture_record_revision()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare j jsonb; rid uuid; pid uuid; rv integer; actor uuid; action_name text; prior integer;
begin
  j := to_jsonb(new);
  rid := (j->>'id')::uuid;
  rv := (j->>'record_version')::integer;
  actor := auth.uid();
  if tg_table_name='projects' then pid := rid; else pid := (j->>'project_id')::uuid; end if;
  action_name := lower(tg_op);
  if tg_op='UPDATE' then prior := (to_jsonb(old)->>'record_version')::integer; end if;
  insert into public.record_versions(project_id,table_name,record_id,record_version,record_snapshot,content_hash,actor_id,change_reason)
    values(pid,tg_table_name,rid,rv,j,j->>'content_hash',actor,coalesce(current_setting('worldforge.change_reason',true),''));
  insert into public.audit_events(project_id,actor_id,action,table_name,record_id,prior_version,resulting_version,outcome,reason)
    values(pid,actor,action_name,tg_table_name,rid,prior,rv,'accepted',coalesce(current_setting('worldforge.change_reason',true),''));
  return new;
end;
$$;
revoke all on function public.wf_capture_record_revision() from public;

do $$
declare t text;
begin
  foreach t in array array['projects','entities','relationships','claims','sources'] loop
    execute format('drop trigger if exists wf_version_before_write on public.%I',t);
    execute format('create trigger wf_version_before_write before insert or update on public.%I for each row execute function public.wf_version_before_write()',t);
    execute format('drop trigger if exists wf_capture_record_revision on public.%I',t);
    execute format('create trigger wf_capture_record_revision after insert or update on public.%I for each row execute function public.wf_capture_record_revision()',t);
  end loop;
end $$;

-- Canon status cannot be changed by generic CRUD. The controlled RPC below is the
-- only supported path and records the rationale/evidence in governance_reviews.
create or replace function public.wf_guard_entity_canon_status()
returns trigger language plpgsql
set search_path = public
as $$
begin
  if new.canon_status is distinct from old.canon_status
     and nullif(current_setting('worldforge.governance_decision_id',true),'') is null then
    raise exception 'Canon status changes require the WorldForge governance RPC';
  end if;
  return new;
end;
$$;
revoke all on function public.wf_guard_entity_canon_status() from public;
drop trigger if exists wf_guard_entity_canon_status on public.entities;
create trigger wf_guard_entity_canon_status before update on public.entities
for each row execute function public.wf_guard_entity_canon_status();

create or replace function public.wf_set_entity_canon_status(
  p_entity_id uuid, p_to_state text, p_rationale text, p_evidence jsonb default '[]'::jsonb
) returns public.entities
language plpgsql
set search_path = public, auth
as $$
declare old_row public.entities; new_row public.entities; from_state text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_rationale is null or length(trim(p_rationale))=0 then raise exception 'Governance rationale is required'; end if;
  if jsonb_typeof(coalesce(p_evidence,'[]'::jsonb)) <> 'array' then raise exception 'Evidence must be a JSON array'; end if;
  if p_to_state not in ('ESTABLISHED CANON','CANON-ALIGNED INTERPRETATION','APPROVED VISUALIZATION','VERIFY / UNDER REVIEW','NOT CANON') then
    raise exception 'Unsupported canon status';
  end if;
  select * into old_row from public.entities where id=p_entity_id for update;
  if not found then raise exception 'Entity not found'; end if;
  if not exists(select 1 from public.projects p where p.id=old_row.project_id and p.owner_id=auth.uid()) then
    raise exception 'Only the authorized project owner may record this governance decision';
  end if;
  from_state := old_row.canon_status;
  insert into public.governance_reviews(project_id,record_type,record_id,from_state,to_state,reviewer_id,rationale,evidence)
    values(old_row.project_id,'entity',old_row.id,from_state,p_to_state,auth.uid(),trim(p_rationale),coalesce(p_evidence,'[]'::jsonb));
  perform set_config('worldforge.governance_decision_id','recorded',true);
  perform set_config('worldforge.change_reason',trim(p_rationale),true);
  update public.entities set canon_status=p_to_state, record_version=old_row.record_version+1 where id=p_entity_id returning * into new_row;
  perform set_config('worldforge.governance_decision_id','',true);
  return new_row;
exception when others then
  perform set_config('worldforge.governance_decision_id','',true);
  raise;
end;
$$;
revoke all on function public.wf_set_entity_canon_status(uuid,text,text,jsonb) from public;
grant execute on function public.wf_set_entity_canon_status(uuid,text,text,jsonb) to authenticated;

drop policy if exists "project owners read record versions" on public.record_versions;
create policy "project owners read record versions" on public.record_versions for select to authenticated
using (exists(select 1 from public.projects p where p.id=record_versions.project_id and p.owner_id=(select auth.uid())));
drop policy if exists "project owners read audit events" on public.audit_events;
create policy "project owners read audit events" on public.audit_events for select to authenticated
using (exists(select 1 from public.projects p where p.id=audit_events.project_id and p.owner_id=(select auth.uid())));

-- There are deliberately no client write policies for record_versions/audit_events.
-- Their rows are written atomically by the trusted trigger. Generic entity CRUD
-- cannot alter canon_status; only wf_set_entity_canon_status records that decision.
commit;
