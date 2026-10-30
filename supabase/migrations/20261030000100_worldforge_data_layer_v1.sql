-- WorldForge structured data layer v1 baseline.
-- Apply only through reviewed Supabase migrations. This file intentionally enables
-- RLS and creates no permissive client policies: access is denied until policies
-- are explicitly reviewed and added.
create extension if not exists pgcrypto;

create table if not exists public.worlds (
  id uuid primary key default gen_random_uuid(),
  stable_key text unique not null check (length(stable_key) between 3 and 160),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  workflow_status text not null default 'proposed' check (workflow_status in ('proposed','investigating','needs_evidence','validated','approved','rejected','superseded')),
  canon_status text not null default 'not_canon' check (canon_status in ('not_canon','verify_under_review','canon_aligned_interpretation','approved_visualization','established_canon')),
  record_version integer not null default 1 check (record_version > 0),
  schema_version text not null default '1.0.0',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  retired_at timestamptz
);

create table if not exists public.world_memberships (
  world_id uuid not null references public.worlds(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check (role in ('owner','canon_authority','architect','researcher','reviewer','contributor','reader')),
  created_at timestamptz not null default now(),
  primary key (world_id, user_id)
);

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  stable_key text unique not null check (length(stable_key) between 3 and 160),
  world_id uuid not null references public.worlds(id) on delete restrict,
  name text not null check (length(trim(name)) > 0),
  entity_type text not null,
  payload jsonb not null default '{}'::jsonb,
  workflow_status text not null default 'proposed' check (workflow_status in ('proposed','investigating','needs_evidence','validated','approved','rejected','superseded')),
  canon_status text not null default 'not_canon' check (canon_status in ('not_canon','verify_under_review','canon_aligned_interpretation','approved_visualization','established_canon')),
  record_version integer not null default 1 check (record_version > 0),
  schema_version text not null default '1.0.0',
  source_refs uuid[] not null default '{}',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  retired_at timestamptz
);

create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  stable_key text unique not null check (length(stable_key) between 3 and 160),
  world_id uuid not null references public.worlds(id) on delete restrict,
  source_id uuid not null references public.entities(id) on delete restrict,
  target_id uuid not null references public.entities(id) on delete restrict,
  relationship_type text not null,
  directionality text not null check (directionality in ('directed','symmetric')),
  payload jsonb not null default '{}'::jsonb,
  workflow_status text not null default 'proposed' check (workflow_status in ('proposed','investigating','needs_evidence','validated','approved','rejected','superseded')),
  record_version integer not null default 1 check (record_version > 0),
  schema_version text not null default '1.0.0',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_id <> target_id)
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  stable_key text unique not null,
  world_id uuid references public.worlds(id) on delete restrict,
  title text not null,
  source_type text not null,
  origin_locator text,
  content_hash text,
  payload jsonb not null default '{}'::jsonb,
  workflow_status text not null default 'proposed' check (workflow_status in ('proposed','investigating','needs_evidence','validated','approved','rejected','superseded')),
  record_version integer not null default 1 check (record_version > 0),
  schema_version text not null default '1.0.0',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  stable_key text unique not null,
  world_id uuid references public.worlds(id) on delete restrict,
  statement text not null check (length(trim(statement)) > 0),
  claim_type text not null check (claim_type in ('observation','fact_assertion','inference','interpretation','hypothesis','proposal')),
  evidence_state text not null default 'unknown' check (evidence_state in ('unknown','unsupported','partially_supported','supported','contradicted','mixed')),
  workflow_status text not null default 'proposed' check (workflow_status in ('proposed','investigating','needs_evidence','validated','approved','rejected','superseded')),
  canon_status text not null default 'not_canon' check (canon_status in ('not_canon','verify_under_review','canon_aligned_interpretation','approved_visualization','established_canon')),
  payload jsonb not null default '{}'::jsonb,
  record_version integer not null default 1 check (record_version > 0),
  schema_version text not null default '1.0.0',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claim_evidence (
  claim_id uuid not null references public.claims(id) on delete restrict,
  source_id uuid not null references public.sources(id) on delete restrict,
  relation text not null check (relation in ('supports','contradicts','qualifies','contextualizes')),
  locator text not null default '',
  primary key (claim_id, source_id, relation)
);

create table if not exists public.record_versions (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  record_version integer not null check (record_version > 0),
  record_snapshot jsonb not null,
  content_hash text,
  actor_id uuid references auth.users(id),
  change_reason text not null default '',
  created_at timestamptz not null default now(),
  unique (table_name, record_id, record_version)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_table text not null,
  target_id uuid,
  prior_version integer,
  resulting_version integer,
  decision_id uuid,
  correlation_id text,
  outcome text not null check (outcome in ('accepted','rejected','failed')),
  reason text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.validation_runs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  validator_version text not null,
  source_commit text,
  result text not null check (result in ('passed','failed','incomplete')),
  findings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists entities_world_id_idx on public.entities(world_id);
create index if not exists relationships_world_id_idx on public.relationships(world_id);
create index if not exists relationships_source_idx on public.relationships(source_id);
create index if not exists relationships_target_idx on public.relationships(target_id);
create index if not exists claims_world_id_idx on public.claims(world_id);
create index if not exists world_memberships_user_idx on public.world_memberships(user_id);
create index if not exists record_versions_target_idx on public.record_versions(table_name, record_id, record_version desc);
create index if not exists audit_events_target_idx on public.audit_events(target_table, target_id, created_at desc);

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

-- Intentionally no client policies yet. RLS default-deny remains in effect.
-- Follow-up migration must add reviewed policies and trusted mutation functions.
