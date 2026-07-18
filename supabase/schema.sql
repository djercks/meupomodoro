-- Rode isso no SQL Editor do projeto Supabase do "Minhas Rotinas".
-- Pressupõe login via Google OAuth (auth.users já existe por padrão).
--
-- Tudo fica isolado no schema `pomodoro`, separado do `public` usado
-- pelo Minhas Rotinas — não encosta em nenhuma tabela existente.

create schema if not exists pomodoro;

create table if not exists pomodoro.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  title text not null,
  completed boolean not null default false,
  pomodoros_needed int not null default 1,
  pomodoros_done int not null default 0,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists pomodoro.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  type text not null check (type in ('focus', 'short', 'long')),
  duration_minutes int not null,
  completed_at timestamptz not null default now()
);

-- Row Level Security: cada usuário só vê/edita seus próprios dados
alter table pomodoro.tasks enable row level security;
alter table pomodoro.sessions enable row level security;

create policy "tasks: usuário vê as próprias" on pomodoro.tasks
  for select using (auth.uid() = user_id);
create policy "tasks: usuário insere as próprias" on pomodoro.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks: usuário atualiza as próprias" on pomodoro.tasks
  for update using (auth.uid() = user_id);
create policy "tasks: usuário remove as próprias" on pomodoro.tasks
  for delete using (auth.uid() = user_id);

create policy "sessions: usuário vê as próprias" on pomodoro.sessions
  for select using (auth.uid() = user_id);
create policy "sessions: usuário insere as próprias" on pomodoro.sessions
  for insert with check (auth.uid() = user_id);

-- Índice para consultas de streak (sessões de foco por dia)
create index if not exists sessions_user_completed_idx
  on pomodoro.sessions (user_id, completed_at desc);

-- IMPORTANTE: depois de rodar isso, vá em
-- Project Settings → API → Exposed schemas
-- e adicione "pomodoro" na lista (por padrão só "public" fica exposto
-- pra API). Sem isso, o supabase-js não enxerga essas tabelas.
