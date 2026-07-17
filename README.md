# Pomodoro Timer

React + Vite + Tailwind + Supabase.

## Rodar local

```bash
npm install
npm run dev
```

## Ordem de setup (GitHub → Vercel → Supabase)

1. **GitHub**: `git init`, commit, crie o repo e dê push. ✅
2. **Vercel**: importe o repo. Build command `npm run build`, output `dist` (Vite é detectado automaticamente). ✅
3. **Supabase**: este projeto reaproveita o Supabase do **Minhas Rotinas** (sem custo extra, sem criar projeto novo).
   As tabelas do Pomodoro vivem isoladas no schema `pomodoro`, separadas do `public` usado pelo Minhas Rotinas.
   - Abra o projeto Supabase do Minhas Rotinas → SQL Editor → rode `supabase/schema.sql`
   - Vá em **Project Settings → API → Exposed schemas** e adicione `pomodoro` na lista (por padrão só `public` fica exposto pra API — sem isso o app não enxerga as tabelas)
   - Em Project Settings → API, copie `Project URL` e `anon public key` (são os mesmos que o Minhas Rotinas já usa)
4. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`:
   - localmente: copie `.env.example` para `.env` e preencha
   - na Vercel: Settings → Environment Variables, depois faça um redeploy
5. Ative o provedor **Google** em Supabase → Authentication → Providers (se o Minhas Rotinas já usa Google OAuth nesse mesmo projeto, esse passo já está pronto).

Até o passo 3 estar feito, o app funciona normalmente com estado local (tarefas somem ao recarregar, streak não persiste) — nada quebra.

## Estrutura

```
src/
  components/   Header, ModeTabs, TimerRing, Controls, Footer, Sidebar, TaskItem
  hooks/        useTimer.js (contagem regressiva), useTasks.js (CRUD de tarefas)
  lib/          supabaseClient.js
supabase/
  schema.sql    tabelas tasks + sessions, RLS por user_id
```
