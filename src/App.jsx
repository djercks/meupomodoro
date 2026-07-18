import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import ModeTabs from './components/ModeTabs.jsx'
import TimerRing from './components/TimerRing.jsx'
import Controls from './components/Controls.jsx'
import Footer from './components/Footer.jsx'
import Sidebar from './components/Sidebar.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import AmbientEffect from './components/AmbientEffect.jsx'
import MusicPanel from './components/MusicPanel.jsx'
import HistoryView from './components/HistoryView.jsx'
import { useTimer } from './hooks/useTimer.js'
import { useTasks } from './hooks/useTasks.js'
import { useAuth } from './hooks/useAuth.js'
import { useSettings, ACCENT_COLORS } from './hooks/useSettings.js'
import { useAmbientSound } from './hooks/useAmbientSound.js'
import { useYouTubePlayer } from './hooks/useYouTubePlayer.js'

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
  const [musicOpen, setMusicOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  useAmbientSound(settings.ambientSoundType, settings.ambientSoundVolume)
  const music = useYouTubePlayer(settings.musicUrl)
  const musicActive = settings.ambientSoundType !== 'off' || Boolean(music.videoId)

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
            auth={auth}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenHistory={() => setHistoryOpen(true)}
            onToggleMusic={() => setMusicOpen((v) => !v)}
            musicActive={musicActive}
          />

          <MusicPanel
            open={musicOpen}
            onClose={() => setMusicOpen(false)}
            settings={settings}
            update={update}
            music={music}
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

      <HistoryView
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        userId={userId}
        isSupabaseConfigured={auth.isSupabaseConfigured}
      />

      {/* Player de música flutuante — fica montado enquanto houver vídeo
          carregado, mesmo com o painel fechado, para não interromper o som. */}
      {music.videoId && (
        <div className="fixed bottom-5 left-5 z-30 w-[220px] glass !bg-[#1a1226]/95 rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video w-full bg-black">
            <div ref={music.containerRef} className="w-full h-full" />
          </div>
          <div className="flex items-center gap-2 p-2">
            <button
              onClick={music.togglePlay}
              className="w-8 h-8 rounded-full bg-[var(--accent)] text-[#0a0e1a] flex items-center justify-center flex-shrink-0"
              aria-label={music.playing ? 'Pausar música' : 'Tocar música'}
            >
              {music.playing ? '⏸' : '▶'}
            </button>
            <span className="text-[10px] text-white/50 flex-1 truncate">Tocando música</span>
            <button
              onClick={music.stopAndClear}
              aria-label="Fechar player"
              className="text-white/40 hover:text-white/70 transition text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
