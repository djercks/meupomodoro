import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import ModeTabs from './components/ModeTabs.jsx'
import TimerRing from './components/TimerRing.jsx'
import Controls from './components/Controls.jsx'
import Footer from './components/Footer.jsx'
import Sidebar from './components/Sidebar.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import AmbientEffect from './components/AmbientEffect.jsx'
import { useTimer } from './hooks/useTimer.js'
import { useTasks } from './hooks/useTasks.js'
import { useAuth } from './hooks/useAuth.js'
import { useSettings, ACCENT_COLORS } from './hooks/useSettings.js'

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`
}

const BG_CLASS = {
  aurora: '',
  sunset: 'app-bg--sunset',
  ocean: 'app-bg--ocean',
  forest: 'app-bg--forest',
}

export default function App() {
  const auth = useAuth()
  const userId = auth.user?.id ?? null
  const { settings, update, setDuration, setCustomBackground } = useSettings()

  const timer = useTimer(userId, settings)
  const { tasks, addTask, toggleTask, removeTask } = useTasks(userId)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const streak = timer.counts.focus > 0 ? Math.max(1, timer.counts.focus) : 1

  useEffect(() => {
    function handleKeydown(e) {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        timer.toggle()
      }
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [timer])

  useEffect(() => {
    document.title = `${timer.minutes}:${timer.seconds} · Pomodoro Timer`
  }, [timer.minutes, timer.seconds])

  const accentHex = ACCENT_COLORS.find((c) => c.id === settings.accentColor)?.hex ?? '#34e6a8'
  const isCustomBg = settings.backgroundMode === 'custom' && settings.customBackground
  const bgClass = isCustomBg ? 'app-bg--custom' : BG_CLASS[settings.backgroundPreset] || ''

  return (
    <div
      className={`app-bg ${bgClass} text-white`}
      style={{
        '--accent': accentHex,
        '--accent-rgb': hexToRgb(accentHex),
        ...(isCustomBg ? { backgroundImage: `url(${settings.customBackground})` } : {}),
      }}
    >
      <AmbientEffect type={settings.ambientEffect} />
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row gap-6 p-5 sm:p-8">
        <div className="flex-1 flex flex-col">
          <Header
            streak={streak}
            alarmOn={settings.alarmOn}
            onToggleAlarm={() => update({ alarmOn: !settings.alarmOn })}
            auth={auth}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <main className="flex-1 flex flex-col items-center justify-center gap-8 py-10">
            <ModeTabs mode={timer.mode} onChange={timer.setMode} counts={timer.counts} />
            <TimerRing minutes={timer.minutes} seconds={timer.seconds} progress={timer.progress} label={timer.label} />
            <Controls running={timer.running} onToggle={timer.toggle} onReset={timer.reset} />
            <p className="italic text-white/50 text-sm text-center max-w-xs">
              "Foco é decidir quais coisas você não vai fazer."
            </p>
          </main>

          <Footer />
        </div>

        <Sidebar tasks={tasks} onAdd={addTask} onToggle={toggleTask} onRemove={removeTask} />
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        update={update}
        setDuration={setDuration}
        setCustomBackground={setCustomBackground}
      />
    </div>
  )
}
