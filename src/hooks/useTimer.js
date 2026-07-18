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

// Toca um "apito" curto e ascendente — usado no aviso de 1 minuto restante.
function playWarning(ctx, gainPeak) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  const t0 = ctx.currentTime
  osc.frequency.setValueAtTime(700, t0)
  osc.frequency.exponentialRampToValueAtTime(1200, t0 + 0.15)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(gainPeak, t0 + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22)
  osc.start(t0)
  osc.stop(t0 + 0.25)
}

// `onComplete(finishedMode)` é chamado sempre que uma sessão termina (seja
// por zerar o tempo, seja pelo botão "Concluir"). Quem chama useTimer decide
// o que acontece a seguir (auto-encadear pomodoros de uma tarefa, avançar
// pra próxima tarefa, ou não fazer nada) — o timer em si não sabe de tarefas.
export function useTimer(userId = null, settings, onComplete) {
  const durations = settings?.durations ?? { focus: 25, short: 5, long: 15 }
  const alarmOn = settings?.alarmOn ?? true
  const alarmType = settings?.alarmType ?? 'digital'
  const alarmVolume = settings?.alarmVolume ?? 0.6

  const [mode, setModeState] = useState('short')
  const [remaining, setRemaining] = useState(durations.short * 60)
  const [running, setRunning] = useState(false)
  const [counts, setCounts] = useState({ focus: 0, short: 0, long: 0 })
  const intervalRef = useRef(null)
  const warnedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const totalSeconds = durations[mode] * 60

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!running) setRemaining(durations[mode] * 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations[mode]])

  const chime = useCallback(
    (finishedMode) => {
      if (!alarmOn) return
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const peak = 0.05 + alarmVolume * 0.35
        // Cada tipo de sessão soa diferente: foco = tom "padrão", pausa
        // curta = mais aguda e rápida (animada), pausa longa = mais grave
        // e espaçada (relaxante) — mantendo o timbre escolhido em Configurações.
        const pitch = finishedMode === 'short' ? 1.25 : finishedMode === 'long' ? 0.75 : 1
        const pace = finishedMode === 'short' ? 0.8 : finishedMode === 'long' ? 1.3 : 1

        if (alarmType === 'sino') {
          playTone(ctx, { freq: 660 * pitch, start: 0, duration: 1.2 * pace, gainPeak: peak })
          playTone(ctx, { freq: 990 * pitch, start: 0, duration: 1.0 * pace, gainPeak: peak * 0.5 })
        } else if (alarmType === 'carrilhao') {
          playTone(ctx, { freq: 523 * pitch, start: 0, duration: 0.5 * pace, gainPeak: peak })
          playTone(ctx, { freq: 659 * pitch, start: 0.18 * pace, duration: 0.5 * pace, gainPeak: peak })
          playTone(ctx, { freq: 784 * pitch, start: 0.36 * pace, duration: 0.6 * pace, gainPeak: peak })
        } else {
          playTone(ctx, { freq: 880 * pitch, start: 0, duration: 0.6 * pace, gainPeak: peak })
        }
      } catch {
        // Web Audio indisponível — ignora
      }
    },
    [alarmOn, alarmType, alarmVolume]
  )

  const warn = useCallback(() => {
    if (!alarmOn) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      playWarning(ctx, 0.05 + alarmVolume * 0.3)
    } catch {
      // Web Audio indisponível — ignora
    }
  }, [alarmOn, alarmVolume])

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
      warnedRef.current = false
      setModeState(newMode)
      setRemaining(durations[newMode] * 60)
      setRunning(autoStart)
    },
    [durations]
  )

  const complete = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setCounts((c) => ({ ...c, [mode]: c[mode] + 1 }))
    chime(mode)
    logSession(mode)
    onCompleteRef.current?.(mode)
  }, [mode, chime, logSession])

  // Termina a sessão atual imediatamente, mesmo com tempo sobrando —
  // usado pelo botão "Concluir" quando a tarefa acaba antes do previsto.
  const finishNow = useCallback(() => {
    complete()
  }, [complete])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          complete()
          return 0
        }
        const next = r - 1
        if (next === 60 && !warnedRef.current) {
          warnedRef.current = true
          warn()
        }
        return next
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, complete, warn])

  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    warnedRef.current = false
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
    finishNow,
    counts,
    label: LABELS[mode],
  }
}
