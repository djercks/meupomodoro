import { useState } from 'react'
import TaskItem from './TaskItem.jsx'

export default function Sidebar({ tasks, onAdd, onToggle, onRemove }) {
  const [adding, setAdding] = useState(false)
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

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

      <form onSubmit={handleSubmit} className="mb-2">
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full text-left glass rounded-2xl px-4 py-3 text-sm text-white/60 flex items-center gap-2 hover:bg-white/10 transition"
          >
            <span className="text-emerald-400 font-bold">+</span> Adicionar tarefa
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="O que você precisa fazer?"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm placeholder-white/40 focus:bg-white/10 transition"
            />
            <button type="submit" className="px-4 rounded-2xl bg-emerald-500 text-[#0a2e1c] font-semibold text-sm hover:brightness-105 transition">
              OK
            </button>
          </div>
        )}
      </form>

      {tasks.length > 0 ? (
        <ul className="flex-1 flex flex-col gap-2 mt-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} />
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
