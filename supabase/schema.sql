-- Rode isso no SQL Editor do Supabase depois de criar o projeto.
-- Pressupõe login via Google OAuth (auth.users já existe por padrão).

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  type text not null check (type in ('focus', 'short', 'long')),
  duration_minutes int not null,
  completed_at timestamptz not null default now()
);

-- Row Level Security: cada usuário só vê/edita seus próprios dados
alter table tasks enable row level security;
alter table sessions enable row level security;

create policy "tasks: usuário vê as próprias" on tasks
  for select using (auth.uid() = user_id);
create policy "tasks: usuário insere as próprias" on tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks: usuário atualiza as próprias" on tasks
  for update using (auth.uid() = user_id);
create policy "tasks: usuário remove as próprias" on tasks
  for delete using (auth.uid() = user_id);

create policy "sessions: usuário vê as próprias" on sessions
  for select using (auth.uid() = user_id);
create policy "sessions: usuário insere as próprias" on sessions
  for insert with check (auth.uid() = user_id);

-- Índice para consultas de streak (sessões de foco por dia)
create index if not exists sessions_user_completed_idx
  on sessions (user_id, completed_at desc);
