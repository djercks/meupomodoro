import { useEffect } from 'react'
import Header from './components/Header.jsx'
import ModeTabs from './components/ModeTabs.jsx'
import TimerRing from './components/TimerRing.jsx'
import Controls from './components/Controls.jsx'
import Footer from './components/Footer.jsx'
import Sidebar from './components/Sidebar.jsx'
import { useTimer } from './hooks/useTimer.js'
import { useTasks } from './hooks/useTasks.js'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const auth = useAuth()
  const userId = auth.user?.id ?? null

  const timer = useTimer(userId)
  const { tasks, addTask, toggleTask, removeTask } = useTasks(userId)

  const streak = timer.counts.focus > 0 ? Math.max(1, timer.counts.focus) : 1

  useEffect(() => {
    function handleKeydown(e) {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        timer.toggle()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [timer])

  useEffect(() => {
    document.title = `${timer.minutes}:${timer.seconds} · Pomodoro Timer`
  }, [timer.minutes, timer.seconds])

  return (
    <div className="app-bg text-white">
      <div className="stars" />
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row gap-6 p-5 sm:p-8">
        <div className="flex-1 flex flex-col">
          <Header streak={streak} soundOn={timer.soundOn} onToggleSound={() => timer.setSoundOn((s) => !s)} auth={auth} />

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
    </div>
  )
}