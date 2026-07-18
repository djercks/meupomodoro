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
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTasks(data)
        setLoading(false)
      })
  }, [userId])

  const addTask = useCallback(
    async (title, pomodorosNeeded = 1) => {
      const trimmed = title.trim()
      if (!trimmed) return
      const pomodoros = Math.max(1, Math.round(pomodorosNeeded) || 1)

      if (isSupabaseConfigured && userId) {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: userId,
            title: trimmed,
            completed: false,
            pomodoros_needed: pomodoros,
            pomodoros_done: 0,
            position: tasks.length,
          })
          .select()
          .single()
        if (!error && data) setTasks((t) => [...t, data])
        return
      }

      setTasks((t) => [
        ...t,
        {
          id: crypto.randomUUID(),
          title: trimmed,
          completed: false,
          pomodoros_needed: pomodoros,
          pomodoros_done: 0,
          position: t.length,
        },
      ])
    },
    [userId, tasks.length]
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

  // Marca a tarefa como concluída diretamente (usado quando o app conclui
  // automaticamente ao bater o número de pomodoros previstos).
  const completeTask = useCallback(
    async (id) => {
      if (isSupabaseConfigured && userId) {
        await supabase.from('tasks').update({ completed: true }).eq('id', id)
      }
      setTasks((t) => t.map((item) => (item.id === id ? { ...item, completed: true } : item)))
    },
    [userId]
  )

  // Soma 1 ao contador de pomodoros concluídos de uma tarefa.
  const incrementTaskProgress = useCallback(
    async (id) => {
      setTasks((current) => {
        const task = current.find((t) => t.id === id)
        if (!task) return current
        const newDone = (task.pomodoros_done || 0) + 1
        if (isSupabaseConfigured && userId) {
          supabase.from('tasks').update({ pomodoros_done: newDone }).eq('id', id).then()
        }
        return current.map((t) => (t.id === id ? { ...t, pomodoros_done: newDone } : t))
      })
    },
    [userId]
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

  // Move a tarefa uma posição pra cima ou pra baixo na lista, persistindo
  // a nova ordem.
  const moveTask = useCallback(
    (id, direction) => {
      setTasks((current) => {
        const idx = current.findIndex((t) => t.id === id)
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (idx === -1 || swapIdx < 0 || swapIdx >= current.length) return current

        const updated = [...current]
        ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
        const withPositions = updated.map((t, i) => ({ ...t, position: i }))

        if (isSupabaseConfigured && userId) {
          supabase.from('tasks').update({ position: idx }).eq('id', withPositions[idx].id).then()
          supabase.from('tasks').update({ position: swapIdx }).eq('id', withPositions[swapIdx].id).then()
        }

        return withPositions
      })
    },
    [userId]
  )

  return { tasks, loading, addTask, toggleTask, completeTask, incrementTaskProgress, removeTask, moveTask }
}
