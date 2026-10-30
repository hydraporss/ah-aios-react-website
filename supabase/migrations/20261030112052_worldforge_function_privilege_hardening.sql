-- Harden callable function privileges and index audit actor references.
-- Trigger functions are callable only by PostgreSQL trigger machinery, not the Data API.
revoke all on function public.wf_capture_record_revision() from public, anon, authenticated;
revoke all on function public.wf_version_before_write() from public, anon, authenticated;
revoke all on function public.wf_guard_entity_canon_status() from public, anon, authenticated;
revoke all on function public.wf_set_entity_canon_status(uuid,text,text,jsonb) from public, anon;
grant execute on function public.wf_set_entity_canon_status(uuid,text,text,jsonb) to authenticated;

create index if not exists projects_updated_by_idx on public.projects(updated_by);
create index if not exists entities_updated_by_idx on public.entities(updated_by);
create index if not exists relationships_updated_by_idx on public.relationships(updated_by);
create index if not exists claims_updated_by_idx on public.claims(updated_by);
create index if not exists sources_updated_by_idx on public.sources(updated_by);
create index if not exists record_versions_actor_idx on public.record_versions(actor_id);
create index if not exists audit_events_actor_idx on public.audit_events(actor_id);
