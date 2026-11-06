-- Temple Student Hub: schema inicial (demo)
-- Espelha 1:1 o modelo de dados do app (src/types/index.ts / DATA_MODELS.md).
-- IDs são texto estável (ex.: 'stu-jordan', 'post-1') para o front mapear sem conversão.
-- TODO o conteúdo é fictício. Não há credenciais: "contas" são personas de demonstração.

create schema if not exists public;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type visibility as enum ('public', 'temple-only', 'private');
  create type org_role as enum ('president', 'vice-president', 'treasurer', 'secretary', 'board-member', 'moderator', 'member');
  create type membership_status as enum ('pending', 'active', 'declined', 'inactive');
  create type post_type as enum ('text', 'photo', 'album', 'video', 'audio', 'link', 'quote', 'discussion', 'event', 'organization', 'project', 'resource');
  create type project_status as enum ('private', 'recruiting', 'active', 'completed', 'archived');
  create type project_kind as enum ('collaborators', 'need-help', 'offer-help');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Identidade (personas demo + perfis)
-- ---------------------------------------------------------------------------
create table if not exists students (
  id            text primary key,
  display_name  text not null,
  major         text,
  college       text,
  class_year    text,
  bio           text,
  avatar_url    text,
  cover_url     text,
  interests     text[] not null default '{}',
  skills        text[] not null default '{}',
  theme         int,
  section_order text[],
  privacy       jsonb  not null default '{}',   -- { overview: 'temple-only', blog: 'public', ... }
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists demo_accounts (       -- persona de demo, NUNCA credencial
  id           text primary key,
  profile_id   text not null references students(id) on delete cascade,
  display_name text not null,
  is_default   boolean not null default false
);

-- ---------------------------------------------------------------------------
-- Organizações
-- ---------------------------------------------------------------------------
create table if not exists organizations (
  id                  text primary key,
  name                text not null,
  description         text not null,
  tags                text[] not null default '{}',
  verification_status text not null default 'demo' check (verification_status in ('demo', 'unverified', 'verified')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists organization_memberships (
  id              text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  student_id      text not null references students(id) on delete cascade,
  role            org_role not null,
  status          membership_status not null,
  permissions     text[] not null default '{}',  -- permissões explícitas e escopadas por organização
  joined_at       timestamptz,
  unique (organization_id, student_id)
);

create table if not exists organization_applications (
  id              text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  student_id      text not null references students(id) on delete cascade,
  message         text,
  status          text not null check (status in ('pending', 'approved', 'declined')),
  created_at      timestamptz not null default now()
);

create table if not exists organization_invitations (
  id              text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  student_id      text not null references students(id) on delete cascade,
  invited_by_id   text not null references students(id) on delete cascade,
  status          text not null check (status in ('pending', 'accepted', 'declined', 'revoked')),
  created_at      timestamptz not null default now()
);

create table if not exists organization_inquiries (
  id              text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  student_id      text not null references students(id) on delete cascade,
  subject         text not null,
  body            text not null,
  status          text not null check (status in ('new', 'assigned', 'replied', 'closed')),
  assigned_to_id  text references students(id) on delete set null,
  created_at      timestamptz not null default now()
);

create table if not exists inquiry_replies (
  id         text primary key,
  inquiry_id text not null references organization_inquiries(id) on delete cascade,
  author_id  text not null references students(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create table if not exists organization_interests (
  id              text primary key,
  student_id      text not null references students(id) on delete cascade,
  organization_id text not null references organizations(id) on delete cascade
);

create table if not exists organization_collaborations (
  id            text primary key,
  org_a_id      text not null references organizations(id) on delete cascade,  -- organização que convida
  org_b_id      text not null references organizations(id) on delete cascade,  -- organização convidada
  status        text not null check (status in ('pending', 'active', 'declined', 'revoked')),
  project_title text not null,
  created_at    timestamptz not null default now()
);

create table if not exists collaboration_files (
  id               text primary key,
  collaboration_id text not null references organization_collaborations(id) on delete cascade,
  name             text not null,
  shared_by_org_id text not null references organizations(id) on delete cascade,
  permission       text not null check (permission in ('view', 'edit'))
);

create table if not exists collaboration_activity (
  id               text primary key,
  collaboration_id text not null references organization_collaborations(id) on delete cascade,
  organization_id  text not null references organizations(id) on delete cascade,
  text             text not null,
  at               timestamptz not null default now()
);

create table if not exists announcements (
  id              text primary key,
  organization_id text references organizations(id) on delete cascade,  -- null = comunicado do campus
  author_id       text references students(id) on delete set null,
  title           text not null,
  body            text not null,
  pinned          boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Feed e social
-- ---------------------------------------------------------------------------
create table if not exists posts (
  id              text primary key,
  author_id       text not null references students(id) on delete cascade,
  organization_id text references organizations(id) on delete set null,
  type            post_type not null,
  title           text,
  body            text,
  media_label     text,
  media_urls      text[] not null default '{}',
  audio_url       text,
  link_url        text,
  is_draft        boolean not null default false,
  pinned          boolean not null default false,
  related_id      text,                      -- evento/projeto/organização relacionado
  tags            text[] not null default '{}',
  visibility      visibility not null default 'public',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists posts_created_idx on posts (created_at desc);
create index if not exists posts_author_idx on posts (author_id);

create table if not exists comments (
  id         text primary key,
  post_id    text not null references posts(id) on delete cascade,
  author_id  text not null references students(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on comments (post_id);

create table if not exists follows (
  id          text primary key,
  follower_id text not null references students(id) on delete cascade,
  target_type text not null check (target_type in ('student', 'organization', 'topic', 'community')),
  target_id   text not null,
  created_at  timestamptz not null default now(),
  unique (follower_id, target_type, target_id)
);

create table if not exists hidden_posts (
  id         text primary key,
  student_id text not null references students(id) on delete cascade,
  post_id    text not null references posts(id) on delete cascade,
  reason     text not null check (reason in ('hidden', 'not-interested'))
);

create table if not exists blocks (
  id         text primary key,
  student_id text not null references students(id) on delete cascade,
  blocked_id text not null references students(id) on delete cascade
);

create table if not exists saved_items (
  id         text primary key,
  student_id text not null references students(id) on delete cascade,
  item_type  text not null check (item_type in ('post', 'event', 'project', 'resource', 'collection')),
  item_id    text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id         text primary key,
  student_id text not null references students(id) on delete cascade,
  title      text not null,
  body       text not null,
  link       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Eventos
-- ---------------------------------------------------------------------------
create table if not exists events (
  id                   text primary key,
  title                text not null,
  description          text not null,
  host_organization_id text references organizations(id) on delete set null,
  category             text not null,
  start_at             timestamptz not null,
  end_at               timestamptz not null,
  location_name        text not null,
  price_label          text not null,
  cover_url            text,
  campus               text check (campus in ('Main Campus', 'Center City', 'Online')),
  status               text not null default 'published' check (status in ('draft', 'published', 'cancelled'))
);
create index if not exists events_start_idx on events (start_at);

create table if not exists event_participations (
  id         text primary key,
  event_id   text not null references events(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  state      text not null check (state in ('saved', 'going', 'attended')),
  updated_at timestamptz not null default now(),
  unique (event_id, student_id)
);

-- ---------------------------------------------------------------------------
-- Comunidades (grupos informais; NÃO são organizações oficiais)
-- ---------------------------------------------------------------------------
create table if not exists communities (
  id                      text primary key,
  name                    text not null,
  description             text not null,
  category                text not null,
  tags                    text[] not null default '{}',
  created_by_student_id   text not null references students(id) on delete cascade,
  visibility              text not null default 'open' check (visibility in ('open', 'private')),
  is_official_organization boolean not null default false check (is_official_organization = false)
);

create table if not exists community_memberships (
  id           text primary key,
  community_id text not null references communities(id) on delete cascade,
  student_id   text not null references students(id) on delete cascade,
  role         text not null check (role in ('participant', 'moderator', 'founder')),
  status       text not null check (status in ('active', 'invited', 'pending')),
  unique (community_id, student_id)
);

create table if not exists discussion_threads (
  id           text primary key,
  community_id text not null references communities(id) on delete cascade,
  author_id    text not null references students(id) on delete cascade,
  kind         text check (kind in ('discussion', 'question', 'announcement', 'collab-request', 'resource')),
  title        text not null,
  body         text not null,
  link_url     text,
  created_at   timestamptz not null default now()
);

create table if not exists thread_replies (
  id         text primary key,
  thread_id  text not null references discussion_threads(id) on delete cascade,
  author_id  text not null references students(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create table if not exists founding_workspaces (
  id           text primary key,
  community_id text not null references communities(id) on delete cascade,
  owner_id     text not null references students(id) on delete cascade,
  notes        text not null default '',
  stage        text not null check (stage in ('founding', 'recognition-prep')),
  created_at   timestamptz not null default now()
);

create table if not exists founding_founders (
  workspace_id text not null references founding_workspaces(id) on delete cascade,
  student_id   text not null references students(id) on delete cascade,
  status       text not null check (status in ('invited', 'accepted', 'declined')),
  primary key (workspace_id, student_id)
);

create table if not exists founding_checklist (
  id           text primary key,
  workspace_id text not null references founding_workspaces(id) on delete cascade,
  label        text not null,
  done         boolean not null default false,
  position     int not null default 0
);

-- ---------------------------------------------------------------------------
-- Projetos
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id            text primary key,
  owner_id      text not null references students(id) on delete cascade,
  kind          project_kind not null default 'collaborators',
  title         text not null,
  description   text not null,
  category      text not null,
  skills_needed text[] not null default '{}',
  status        project_status not null default 'private',
  is_published  boolean not null default false,
  deadline      date,
  pitch         text,
  cover_url     text,
  roles         jsonb not null default '[]',   -- [{ title, description }]
  perks         text[] not null default '{}',
  commitment    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists project_memberships (
  id                   text primary key,
  project_id           text not null references projects(id) on delete cascade,
  student_id           text not null references students(id) on delete cascade,
  role                 text not null,
  status               text not null check (status in ('invited', 'active', 'removed')),
  contribution_summary text,
  unique (project_id, student_id)
);

create table if not exists project_join_requests (
  id         text primary key,
  project_id text not null references projects(id) on delete cascade,
  student_id text not null references students(id) on delete cascade,
  message    text,
  status     text not null check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  created_at timestamptz not null default now()
);

create table if not exists project_tasks (
  id          text primary key,
  project_id  text not null references projects(id) on delete cascade,
  title       text not null,
  description text,
  assignee_id text references students(id) on delete set null,
  status      text not null check (status in ('todo', 'in-progress', 'done')),
  due_at      date
);

create table if not exists project_milestones (
  id         text primary key,
  project_id text not null references projects(id) on delete cascade,
  title      text not null,
  due_at     date,
  done       boolean not null default false
);

create table if not exists project_files (
  id          text primary key,
  project_id  text not null references projects(id) on delete cascade,
  name        text not null,
  added_by_id text not null references students(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Perfil: coleções e portfólio
-- ---------------------------------------------------------------------------
create table if not exists collections (
  id          text primary key,
  owner_id    text not null references students(id) on delete cascade,
  title       text not null,
  description text,
  visibility  visibility not null default 'public'
);

create table if not exists collection_items (
  collection_id text not null references collections(id) on delete cascade,
  post_id       text not null references posts(id) on delete cascade,
  position      int not null default 0,
  primary key (collection_id, post_id)
);

create table if not exists portfolio_items (
  id          text primary key,
  owner_id    text not null references students(id) on delete cascade,
  title       text not null,
  description text,
  category    text not null,
  credits     text[] not null default '{}',
  skills      text[] not null default '{}',
  link_url    text,
  visibility  visibility not null default 'public'
);

-- ---------------------------------------------------------------------------
-- Mensagens
-- ---------------------------------------------------------------------------
create table if not exists conversations (
  id              text primary key,
  type            text not null check (type in ('direct', 'organization-board', 'organization-members', 'organization-inquiries', 'project', 'custom')),
  organization_id text references organizations(id) on delete cascade,
  project_id      text references projects(id) on delete cascade,
  title           text
);

create table if not exists conversation_participants (
  conversation_id text not null references conversations(id) on delete cascade,
  student_id      text not null references students(id) on delete cascade,
  primary key (conversation_id, student_id)
);

create table if not exists messages (
  id              text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  sender_id       text not null references students(id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now()
);
create index if not exists messages_conv_idx on messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- Recursos, mapa e assistente
-- ---------------------------------------------------------------------------
create table if not exists resources (
  id               text primary key,
  title            text not null,
  description      text not null,
  category         text not null check (category in ('academic', 'career', 'wellness', 'financial', 'campus-life')),
  official_url     text,
  contact          text,
  location_name    text,
  eligibility      text,
  cost             text,
  source_type      text not null check (source_type in ('official', 'student-submitted', 'unverified')),
  last_verified_at timestamptz
);

create table if not exists campus_places (
  id       text primary key,
  name     text not null,
  lat      double precision not null,
  lng      double precision not null,
  layers   text[] not null default '{}',     -- Study, Dining, Events, Resources, Organizations, Technology, Campus Life, Other
  note     text not null,
  featured boolean not null default false
);

create table if not exists assistant_scripts (  -- assistente simulado (não é IA ao vivo)
  id                  text primary key,
  keywords            text[] not null default '{}',
  response            text not null,
  source_resource_ids text[] not null default '{}',
  is_fallback         boolean not null default false
);

-- ---------------------------------------------------------------------------
-- Views úteis (valores derivados, nunca armazenados)
-- ---------------------------------------------------------------------------
-- Contadores públicos de seguidores NÃO existem por regra de produto; só contagens privadas ao dono.
create or replace view event_attendance as
  select e.id as event_id,
         count(*) filter (where p.state = 'going')    as going,
         count(*) filter (where p.state = 'attended') as attended,
         count(*) filter (where p.state = 'saved')    as saved
  from events e left join event_participations p on p.event_id = e.id
  group by e.id;

-- ---------------------------------------------------------------------------
-- RLS (DEMO): leitura e escrita abertas para anon/authenticated.
-- Os dados são fictícios e o app usa personas, não login real.
-- Antes de qualquer uso real: troque por políticas baseadas em auth.uid().
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists demo_all on public.%I', t);
    execute format('create policy demo_all on public.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
