-- WorldForge service security, scoped RLS, revision/audit triggers.
-- Safe-by-default: ordinary client CRUD cannot promote canon state.
create or replace function public.wf_has_world_role(p_world_id uuid, p_roles text[])
returns boolean
language sql stable security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.world_memberships m
    where m.world_id = p_world_id
      and m.user_id = auth.uid()
      and m.role = any(p_roles)
  );
$$;
revoke all on function public.wf_has_world_role(uuid,text[]) from public;
grant execute on function public.wf_has_world_role(uuid,text[]) to authenticated;

create or replace function public.wf_create_world(p_stable_key text, p_name text, p_description text default '')
returns public.worlds
language plpgsql security definer
set search_path = public, auth
as $$
declare result public.worlds;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_stable_key is null or length(trim(p_stable_key)) < 3 then raise exception 'Stable key is required'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'World name is required'; end if;
  insert into public.worlds(stable_key,name,description,created_by,updated_by)
    values(trim(p_stable_key),trim(p_name),coalesce(p_description,''),auth.uid(),auth.uid())
    returning * into result;
  insert into public.world_memberships(world_id,user_id,role) values(result.id,auth.uid(),'owner');
  return result;
end;
$$;
revoke all on function public.wf_create_world(text,text,text) from public;
grant execute on function public.wf_create_world(text,text,text) to authenticated;

create or replace function public.wf_guard_record_version()
returns trigger language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    if new.id <> old.id then raise exception 'Record identity is immutable'; end if;
    if new.record_version <> old.record_version + 1 then
      raise exception 'Version conflict: expected record_version %', old.record_version + 1;
    end if;
    new.created_at := old.created_at;
    new.created_by := old.created_by;
    new.updated_at := now();
    new.updated_by := auth.uid();
  else
    new.record_version := 1;
    new.created_at := coalesce(new.created_at, now());
    new.updated_at := coalesce(new.updated_at, now());
    new.created_by := coalesce(new.created_by, auth.uid());
    new.updated_by := coalesce(new.updated_by, auth.uid());
  end if;
  return new;
end;
$$;

create or replace function public.wf_capture_record_revision()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare row_json jsonb; row_id uuid; row_version integer; actor uuid; action_name text;
begin
  row_json := to_jsonb(new);
  row_id := (row_json->>'id')::uuid;
  row_version := (row_json->>'record_version')::integer;
  actor := auth.uid();
  action_name := lower(tg_op);
  insert into public.record_versions(table_name,record_id,record_version,record_snapshot,actor_id,change_reason)
    values(tg_table_name,row_id,row_version,row_json,actor,coalesce(current_setting('worldforge.change_reason',true),''));
  insert into public.audit_events(actor_id,action,target_table,target_id,prior_version,resulting_version,outcome,reason)
    values(actor,action_name,tg_table_name,row_id,case when tg_op='UPDATE' then (to_jsonb(old)->>'record_version')::integer else null end,row_version,'accepted',coalesce(current_setting('worldforge.change_reason',true),''));
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['worlds','entities','relationships','sources','claims'] loop
    execute format('drop trigger if exists wf_guard_version on public.%I',t);
    execute format('create trigger wf_guard_version before insert or update on public.%I for each row execute function public.wf_guard_record_version()',t);
    execute format('drop trigger if exists wf_capture_revision on public.%I',t);
    execute format('create trigger wf_capture_revision after insert or update on public.%I for each row execute function public.wf_capture_record_revision()',t);
  end loop;
end $$;

create or replace function public.wf_guard_relationship_scope()
returns trigger language plpgsql
set search_path = public
as $$
declare source_world uuid; target_world uuid;
begin
  select world_id into source_world from public.entities where id = new.source_id;
  select world_id into target_world from public.entities where id = new.target_id;
  if source_world is null or target_world is null then raise exception 'Relationship endpoints must exist'; end if;
  if source_world <> target_world or new.world_id <> source_world then raise exception 'Cross-world relationship is not permitted by this relationship contract'; end if;
  if new.source_id = new.target_id then raise exception 'Self-relationships are not permitted'; end if;
  return new;
end;
$$;
drop trigger if exists wf_relationship_scope on public.relationships;
create trigger wf_relationship_scope before insert or update on public.relationships
for each row execute function public.wf_guard_relationship_scope();

-- Membership table is not client-writable. Owner membership is created only by wf_create_world
-- or a separately reviewed administrative path.
alter table public.worlds enable row level security;
alter table public.world_memberships enable row level security;
alter table public.entities enable row level security;
alter table public.relationships enable row level security;
alter table public.sources enable row level security;
alter table public.claims enable row level security;
alter table public.claim_evidence enable row level security;
alter table public.record_versions enable row level security;
alter table public.audit_events enable row level security;
alter table public.validation_runs enable row level security;

drop policy if exists wf_world_read on public.worlds;
create policy wf_world_read on public.worlds for select to authenticated
using (public.wf_has_world_role(id,array['owner','canon_authority','architect','researcher','reviewer','contributor','reader']));
drop policy if exists wf_world_update_draft on public.worlds;
create policy wf_world_update_draft on public.worlds for update to authenticated
using (public.wf_has_world_role(id,array['owner','architect']) and canon_status='not_canon')
with check (public.wf_has_world_role(id,array['owner','architect']) and canon_status='not_canon');

drop policy if exists wf_membership_read on public.world_memberships;
create policy wf_membership_read on public.world_memberships for select to authenticated
using (user_id=auth.uid() or public.wf_has_world_role(world_id,array['owner','canon_authority']));

drop policy if exists wf_entity_read on public.entities;
create policy wf_entity_read on public.entities for select to authenticated
using (public.wf_has_world_role(world_id,array['owner','canon_authority','architect','researcher','reviewer','contributor','reader']));
drop policy if exists wf_entity_insert_draft on public.entities;
create policy wf_entity_insert_draft on public.entities for insert to authenticated
with check (public.wf_has_world_role(world_id,array['owner','architect','contributor']) and canon_status='not_canon' and created_by=auth.uid());
drop policy if exists wf_entity_update_draft on public.entities;
create policy wf_entity_update_draft on public.entities for update to authenticated
using (public.wf_has_world_role(world_id,array['owner','architect']) and canon_status='not_canon')
with check (public.wf_has_world_role(world_id,array['owner','architect']) and canon_status='not_canon');

drop policy if exists wf_relationship_read on public.relationships;
create policy wf_relationship_read on public.relationships for select to authenticated
using (public.wf_has_world_role(world_id,array['owner','canon_authority','architect','researcher','reviewer','contributor','reader']));
drop policy if exists wf_relationship_insert on public.relationships;
create policy wf_relationship_insert on public.relationships for insert to authenticated
with check (public.wf_has_world_role(world_id,array['owner','architect','contributor']) and created_by=auth.uid());
drop policy if exists wf_relationship_update on public.relationships;
create policy wf_relationship_update on public.relationships for update to authenticated
using (public.wf_has_world_role(world_id,array['owner','architect']))
with check (public.wf_has_world_role(world_id,array['owner','architect']));

drop policy if exists wf_source_read on public.sources;
create policy wf_source_read on public.sources for select to authenticated
using (world_id is null or public.wf_has_world_role(world_id,array['owner','canon_authority','architect','researcher','reviewer','contributor','reader']));
drop policy if exists wf_source_insert on public.sources;
create policy wf_source_insert on public.sources for insert to authenticated
with check ((world_id is null or public.wf_has_world_role(world_id,array['owner','architect','researcher','contributor'])) and created_by=auth.uid());
drop policy if exists wf_source_update on public.sources;
create policy wf_source_update on public.sources for update to authenticated
using (world_id is null or public.wf_has_world_role(world_id,array['owner','architect','researcher']))
with check (world_id is null or public.wf_has_world_role(world_id,array['owner','architect','researcher']));

drop policy if exists wf_claim_read on public.claims;
create policy wf_claim_read on public.claims for select to authenticated
using (world_id is null or public.wf_has_world_role(world_id,array['owner','canon_authority','architect','researcher','reviewer','contributor','reader']));
drop policy if exists wf_claim_insert_draft on public.claims;
create policy wf_claim_insert_draft on public.claims for insert to authenticated
with check ((world_id is null or public.wf_has_world_role(world_id,array['owner','architect','researcher','contributor'])) and canon_status='not_canon' and created_by=auth.uid());
drop policy if exists wf_claim_update_draft on public.claims;
create policy wf_claim_update_draft on public.claims for update to authenticated
using ((world_id is null or public.wf_has_world_role(world_id,array['owner','architect','researcher'])) and canon_status='not_canon')
with check ((world_id is null or public.wf_has_world_role(world_id,array['owner','architect','researcher'])) and canon_status='not_canon');

drop policy if exists wf_evidence_read on public.claim_evidence;
create policy wf_evidence_read on public.claim_evidence for select to authenticated
using (exists (select 1 from public.claims c where c.id=claim_id and (c.world_id is null or public.wf_has_world_role(c.world_id,array['owner','canon_authority','architect','researcher','reviewer','contributor','reader']))));
drop policy if exists wf_evidence_write on public.claim_evidence;
create policy wf_evidence_write on public.claim_evidence for all to authenticated
using (exists (select 1 from public.claims c where c.id=claim_id and (c.world_id is null or public.wf_has_world_role(c.world_id,array['owner','architect','researcher','contributor']))))
with check (exists (select 1 from public.claims c where c.id=claim_id and (c.world_id is null or public.wf_has_world_role(c.world_id,array['owner','architect','researcher','contributor']))));

drop policy if exists wf_versions_read on public.record_versions;
create policy wf_versions_read on public.record_versions for select to authenticated
using (case table_name when 'worlds' then public.wf_has_world_role(record_id,array['owner','canon_authority','reviewer']) else true end);
drop policy if exists wf_audit_read on public.audit_events;
create policy wf_audit_read on public.audit_events for select to authenticated
using (true);
drop policy if exists wf_validation_read on public.validation_runs;
create policy wf_validation_read on public.validation_runs for select to authenticated
using (actor_id=auth.uid());

-- No client INSERT/UPDATE/DELETE policies are granted for audit/version rows.
-- Canon promotion remains blocked for generic client CRUD; add a separate,
-- explicitly authorized governance RPC only after decision-record policy is approved.
