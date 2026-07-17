import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Sem Supabase configurado: tarefas vivem só no estado local (somem ao
// recarregar a página). Assim que userId existir e o .env estiver
// preenchido, essas mesmas funções passam a ler/escrever na tabela
// `tasks` (ver supabase/schema.sql) automaticamente.
export function useTasks(userId = null) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return
    setLoading(true)
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTasks(data)
        setLoading(false)
      })
  }, [userId])

  const addTask = useCallback(
    async (title) => {
      const trimmed = title.trim()
      if (!trimmed) return

      if (isSupabaseConfigured && userId) {
        const { data, error } = await supabase
          .from('tasks')
          .insert({ user_id: userId, title: trimmed, completed: false })
          .select()
          .single()
        if (!error && data) setTasks((t) => [...t, data])
        return
      }

      setTasks((t) => [...t, { id: crypto.randomUUID(), title: trimmed, completed: false }])
    },
    [userId]
  )

  const toggleTask = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return
      const completed = !task.completed

      if (isSupabaseConfigured && userId) {
        await supabase.from('tasks').update({ completed }).eq('id', id)
      }
      setTasks((t) => t.map((item) => (item.id === id ? { ...item, completed } : item)))
    },
    [tasks, userId]
  )

  const removeTask = useCallback(
    async (id) => {
      if (isSupabaseConfigured && userId) {
        await supabase.from('tasks').delete().eq('id', id)
      }
      setTasks((t) => t.filter((item) => item.id !== id))
    },
    [userId]
  )

  return { tasks, loading, addTask, toggleTask, removeTask }
}
