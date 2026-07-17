import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enquanto o projeto Supabase não existe, essas vars ficam vazias e o app
// funciona só com estado local (ver src/hooks/useTasks.js e useTimer.js).
// Assim que você criar o projeto no Supabase e preencher o .env, a auth e
// a persistência entram em ação automaticamente — nenhum outro arquivo
// precisa mudar.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = Boolean(supabase)
