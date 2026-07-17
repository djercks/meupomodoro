import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export const DURATIONS = { focus: 25, short: 5, long: 15 }
export const LABELS = {
  focus: 'Sessão de Foco',
  short: 'Sessão de Pausa curta',
  long: 'Sessão de Pausa longa',
}

// Quando o Supabase estiver configurado, cada sessão concluída pode ser
// gravada na tabela `sessions` (ver supabase/schema.sql) para alimentar
// o streak e o histórico. Passe userId assim que a auth estiver pronta.
export function useTimer(userId = null) {
  const [mode, setModeState] = useState('short')
  const [remaining, setRemaining] = useState(DURATIONS.short * 60)
  const [running, setRunning] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [counts, setCounts] = useState({ focus: 0, short: 0, long: 0 })
  const intervalRef = useRef(null)
  const totalSeconds = DURATIONS[mode] * 60

  const chime = useCallback(() => {
    if (!soundOn) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } catch {
      // Web Audio indisponível (ex: navegador bloqueando autoplay) — ignora
    }
  }, [soundOn])

  const logSession = useCallback(
    async (finishedMode) => {
      if (!isSupabaseConfigured || !userId) return
      await supabase.from('sessions').insert({
        user_id: userId,
        type: finishedMode,
        duration_minutes: DURATIONS[finishedMode],
        completed_at: new Date().toISOString(),
      })
    },
    [userId]
  )

  const complete = useCallback(() => {
    setRunning(false)
    setCounts((c) => ({ ...c, [mode]: c[mode] + 1 }))
    chime()
    logSession(mode)
  }, [mode, chime, logSession])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          complete()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, complete])

  const setMode = useCallback((newMode) => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setModeState(newMode)
    setRemaining(DURATIONS[newMode] * 60)
  }, [])

  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setRemaining(totalSeconds)
  }, [totalSeconds])

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')
  const progress = 1 - remaining / totalSeconds

  return {
    mode,
    setMode,
    minutes,
    seconds,
    progress,
    running,
    toggle,
    reset,
    soundOn,
    setSoundOn,
    counts,
    label: LABELS[mode],
  }
}
