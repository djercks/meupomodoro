import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pomodoro:settings'

export const ACCENT_COLORS = [
  { id: 'blue', hex: '#3b82f6' },
  { id: 'violet', hex: '#a78bfa' },
  { id: 'teal', hex: '#34e6a8' },
  { id: 'green', hex: '#4ade80' },
  { id: 'pink', hex: '#f472b6' },
  { id: 'orange', hex: '#fb923c' },
]

export const BACKGROUND_PRESETS = [
  { id: 'aurora', label: 'Aurora' },
  { id: 'sunset', label: 'Pôr do sol' },
  { id: 'ocean', label: 'Oceano' },
  { id: 'forest', label: 'Floresta' },
]

const DEFAULTS = {
  durations: { focus: 25, short: 5, long: 15 },
  autoStartBreak: false,
  autoStartFocus: false,
  alarmOn: true,
  alarmTypes: { focus: 'digital', short: 'carrilhao', long: 'sino' }, // carrilhao | sino | digital
  alarmVolume: 0.6,
  accentColor: 'violet',
  backgroundMode: 'preset', // preset | custom
  backgroundPreset: 'aurora',
  customBackground: null, // data URL
  ambientEffect: 'stars', // off | particles | stars | rain | bubbles
  notificationsEnabled: false,
  ambientSoundType: 'off', // off | rain | cafe | white | waves
  ambientSoundVolume: 0.4,
  musicUrls: { focus: '', short: '', long: '' },
  musicHistory: [],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // storage indisponível (modo privado, etc.) — segue sem persistir
    }
  }, [settings])

  const update = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }))
  }, [])

  const setDuration = useCallback((key, minutes) => {
    setSettings((s) => ({
      ...s,
      durations: { ...s.durations, [key]: Math.max(1, Math.min(180, minutes)) },
    }))
  }, [])

  const setCustomBackground = useCallback((dataUrl) => {
    setSettings((s) => ({ ...s, backgroundMode: 'custom', customBackground: dataUrl }))
  }, [])

  const assignModeUrl = useCallback((mode, url) => {
    setSettings((s) => {
      const history = [url, ...s.musicHistory.filter((u) => u !== url)].slice(0, 8)
      return { ...s, musicUrls: { ...s.musicUrls, [mode]: url }, musicHistory: history }
    })
  }, [])

  const removeMusicUrl = useCallback((url) => {
    setSettings((s) => ({ ...s, musicHistory: s.musicHistory.filter((u) => u !== url) }))
  }, [])

  return { settings, update, setDuration, setCustomBackground, assignModeUrl, removeMusicUrl }
}
