import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Este projeto compartilha o mesmo Supabase do "Minhas Rotinas", mas as
// tabelas do Pomodoro vivem isoladas no schema `pomodoro` (não `public`),
// pra não colidir com nada do outro app. Ver supabase/schema.sql.
//
// Enquanto o .env não estiver preenchido, o app funciona só com estado
// local (ver src/hooks/useTasks.js e useTimer.js) — nenhum outro arquivo
// precisa mudar quando você conectar de verdade.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'pomodoro' } })
    : null

export const isSupabaseConfigured = Boolean(supabase)
