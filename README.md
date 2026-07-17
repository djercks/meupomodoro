# Pomodoro Timer

React + Vite + Tailwind + Supabase.

## Rodar local

```bash
npm install
npm run dev
```

## Ordem de setup (GitHub → Vercel → Supabase)

1. **GitHub**: `git init`, commit, crie o repo e dê push.
2. **Vercel**: importe o repo. Build command `npm run build`, output `dist` (Vite é detectado automaticamente).
3. **Supabase**: crie o projeto, vá em SQL Editor e rode `supabase/schema.sql`.
   Depois, em Project Settings → API, copie `Project URL` e `anon public key`.
4. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`:
   - localmente: copie `.env.example` para `.env` e preencha
   - na Vercel: Settings → Environment Variables
5. Ative o provedor **Google** em Supabase → Authentication → Providers, e configure a tela de consentimento OAuth no Google Cloud Console (mesmo fluxo dos outros apps).

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
