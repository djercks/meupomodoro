import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Sem Supabase configurado (.env vazio), o app roda em modo anônimo:
// user fica null e tudo cai de volta pro estado local (ver useTasks/useTimer).
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  return { user, loading, signInWithGoogle, signOut, isSupabaseConfigured }
}
