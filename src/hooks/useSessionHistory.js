import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export function useSessionHistory(userId) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) {
      setSessions([])
      return
    }
    setLoading(true)
    setError(null)
    supabase
      .from('sessions')
      .select('completed_at, duration_minutes, type')
      .eq('user_id', userId)
      .eq('type', 'focus')
      .order('completed_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setSessions(data || [])
        setLoading(false)
      })
  }, [userId])

  return { sessions, loading, error }
}
