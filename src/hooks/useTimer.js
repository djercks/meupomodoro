import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export const LABELS = {
  focus: 'Sessão de Foco',
  short: 'Sessão de Pausa curta',
  long: 'Sessão de Pausa longa',
}

function playTone(ctx, { freq, start, duration, gainPeak }) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  const t0 = ctx.currentTime + start
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(gainPeak, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.start(t0)
  osc.stop(t0 + duration)
}

// Quando o Supabase estiver configurado, cada sessão concluída pode ser
// gravada na tabela `sessions` (ver supabase/schema.sql) para alimentar
// o streak e o histórico. Passe userId assim que a auth estiver pronta.
//
// `settings` vem do useSettings(): durações, alarme e início automático
// são todos controláveis pelo painel de Configurações.
export function useTimer(userId = null, settings) {
  const durations = settings?.durations ?? { focus: 25, short: 5, long: 15 }
  const alarmOn = settings?.alarmOn ?? true
  const alarmType = settings?.alarmType ?? 'digital'
  const alarmVolume = settings?.alarmVolume ?? 0.6
  const autoStartBreak = settings?.autoStartBreak ?? false
  const autoStartFocus = settings?.autoStartFocus ?? false

  const [mode, setModeState] = useState('short')
  const [remaining, setRemaining] = useState(durations.short * 60)
  const [running, setRunning] = useState(false)
  const [counts, setCounts] = useState({ focus: 0, short: 0, long: 0 })
  const intervalRef = useRef(null)
  const totalSeconds = durations[mode] * 60

  // Se a pessoa mudar a duração no painel enquanto o timer está parado,
  // reflete a mudança no tempo restante.
  useEffect(() => {
    if (!running) setRemaining(durations[mode] * 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations[mode]])

  const chime = useCallback(() => {
    if (!alarmOn) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const peak = 0.05 + alarmVolume * 0.35
      if (alarmType === 'sino') {
        playTone(ctx, { freq: 660, start: 0, duration: 1.2, gainPeak: peak })
        playTone(ctx, { freq: 990, start: 0, duration: 1.0, gainPeak: peak * 0.5 })
      } else if (alarmType === 'carrilhao') {
        playTone(ctx, { freq: 523, start: 0, duration: 0.5, gainPeak: peak })
        playTone(ctx, { freq: 659, start: 0.18, duration: 0.5, gainPeak: peak })
        playTone(ctx, { freq: 784, start: 0.36, duration: 0.6, gainPeak: peak })
      } else {
        playTone(ctx, { freq: 880, start: 0, duration: 0.6, gainPeak: peak })
      }
    } catch {
      // Web Audio indisponível (ex: navegador bloqueando autoplay) — ignora
    }
  }, [alarmOn, alarmType, alarmVolume])

  const logSession = useCallback(
    async (finishedMode) => {
      if (!isSupabaseConfigured || !userId) return
      await supabase.from('sessions').insert({
        user_id: userId,
        type: finishedMode,
        duration_minutes: durations[finishedMode],
        completed_at: new Date().toISOString(),
      })
    },
    [userId, durations]
  )

  const setMode = useCallback(
    (newMode, autoStart = false) => {
      clearInterval(intervalRef.current)
      setModeState(newMode)
      setRemaining(durations[newMode] * 60)
      setRunning(autoStart)
    },
    [durations]
  )

  const complete = useCallback(() => {
    setRunning(false)
    setCounts((c) => ({ ...c, [mode]: c[mode] + 1 }))
    chime()
    logSession(mode)

    if (mode === 'focus' && autoStartBreak) {
      setMode('short', true)
    } else if ((mode === 'short' || mode === 'long') && autoStartFocus) {
      setMode('focus', true)
    }
  }, [mode, chime, logSession, autoStartBreak, autoStartFocus, setMode])

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
    counts,
    label: LABELS[mode],
  }
}
