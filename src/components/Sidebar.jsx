import { useState } from 'react'
import TaskItem from './TaskItem.jsx'

const QUICK_OPTIONS = [1, 2, 3]

function formatEstimate(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export default function Sidebar({ tasks, onAdd, onToggle, onRemove, onMove, activeTaskId, onSelectTask, focusMinutes = 25 }) {
  const [step, setStep] = useState('idle') // idle | title | pomodoros
  const [titleValue, setTitleValue] = useState('')
  const [customPomodoros, setCustomPomodoros] = useState('')

  function startAdding() {
    setStep('title')
  }

  function handleTitleSubmit(e) {
    e.preventDefault()
    if (!titleValue.trim()) return
    setStep('pomodoros')
  }

  function confirmPomodoros(count) {
    onAdd(titleValue, count)
    setTitleValue('')
    setCustomPomodoros('')
    setStep('idle')
  }

  function handleCustomSubmit(e) {
    e.preventDefault()
    const n = parseInt(customPomodoros, 10)
    if (!n || n < 1) return
    confirmPomodoros(n)
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const totalPomodoros = pendingTasks.reduce((sum, t) => sum + (t.pomodoros_needed || 1), 0)
  const estimatedMinutes = totalPomodoros * focusMinutes

  return (
    <aside className="w-full lg:w-[380px] glass rounded-3xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg">Tarefas</h2>
        <div className="flex items-center gap-2">
          <button aria-label="Buscar tarefas" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button aria-label="Filtrar tarefas" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="flex items-center gap-3 text-[11px] text-white/60 glass rounded-2xl px-3 py-2 mb-3">
          <span>{pendingTasks.length} tarefa{pendingTasks.length !== 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>🍅 {totalPomodoros}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>≈ {formatEstimate(estimatedMinutes)}</span>
        </div>
      )}

      <div className="mb-2">
        {step === 'idle' && (
          <button
            type="button"
            onClick={startAdding}
            className="w-full text-left glass rounded-2xl px-4 py-3 text-sm text-white/60 flex items-center gap-2 hover:bg-white/10 transition"
          >
            <span className="text-emerald-400 font-bold">+</span> Adicionar tarefa
          </button>
        )}

        {step === 'title' && (
          <form onSubmit={handleTitleSubmit} className="flex gap-2">
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              type="text"
              placeholder="O que você precisa fazer?"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm placeholder-white/40 focus:bg-white/10 transition"
            />
            <button type="submit" className="px-4 rounded-2xl bg-emerald-500 text-[#0a2e1c] font-semibold text-sm hover:brightness-105 transition">
              OK
            </button>
          </form>
        )}

        {step === 'pomodoros' && (
          <div className="glass rounded-2xl p-3">
            <p className="text-xs text-white/60 mb-2">Quantos pomodoros "{titleValue}" vai precisar?</p>
            <div className="flex items-center gap-2 flex-wrap">
              {QUICK_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => confirmPomodoros(n)}
                  className="w-9 h-9 rounded-full glass hover:bg-white/10 transition text-sm font-semibold"
                >
                  {n}
                </button>
              ))}
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  value={customPomodoros}
                  onChange={(e) => setCustomPomodoros(e.target.value)}
                  placeholder="+"
                  className="w-14 bg-white/5 border border-white/10 rounded-full px-2 py-2 text-sm text-center placeholder-white/40 focus:bg-white/10 transition"
                />
                <button type="submit" className="text-xs px-2 py-2 rounded-full glass hover:bg-white/10 transition">
                  OK
                </button>
              </form>
            </div>
            <button
              onClick={() => setStep('idle')}
              className="text-[11px] text-white/40 hover:text-white/70 transition mt-2"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {tasks.length > 0 ? (
        <ul className="flex-1 flex flex-col gap-2 mt-2">
          {tasks.map((task, i) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onRemove={onRemove}
              onMove={onMove}
              isFirst={i === 0}
              isLast={i === tasks.length - 1}
              isActive={task.id === activeTaskId}
              onSelect={onSelectTask}
            />
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-16">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2h6l1 4h4v16H4V6h4z" />
              <path d="M9 11h6M9 15h6" />
            </svg>
          </div>
          <p className="text-sm text-white/50 max-w-[220px]">
            Ainda não há tarefas — adicione uma acima para manter o foco.
          </p>
        </div>
      )}
    </aside>
  )
}
