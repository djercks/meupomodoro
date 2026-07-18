export default function TaskItem({ task, onToggle, onRemove, isActive, onSelect, onMove, isFirst, isLast }) {
  const needed = task.pomodoros_needed || 1
  const done = task.pomodoros_done || 0

  return (
    <li
      onClick={() => onSelect(task.id)}
      className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-sm cursor-pointer transition ${
        isActive ? 'bg-[var(--accent)]/15 ring-1 ring-[var(--accent)]' : 'bg-white/5 hover:bg-white/[0.07]'
      }`}
    >
      <div className="flex flex-col -my-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onMove(task.id, 'up')}
          disabled={isFirst}
          aria-label="Mover para cima"
          className="text-white/25 hover:text-white/70 disabled:opacity-20 disabled:hover:text-white/25 transition leading-none px-0.5"
        >
          ▲
        </button>
        <button
          onClick={() => onMove(task.id, 'down')}
          disabled={isLast}
          aria-label="Mover para baixo"
          className="text-white/25 hover:text-white/70 disabled:opacity-20 disabled:hover:text-white/25 transition leading-none px-0.5"
        >
          ▼
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(task.id)
        }}
        aria-label="Concluir tarefa"
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
          task.completed ? 'bg-emerald-400 border-emerald-400' : 'border-white/30 hover:border-emerald-400'
        }`}
      />
      <span className={`flex-1 ${task.completed ? 'line-through text-white/40' : ''}`}>{task.title}</span>
      <span
        className="text-[10px] glass rounded-full px-2 py-0.5 flex items-center gap-1 flex-shrink-0"
        title={`${done} de ${needed} pomodoro(s) concluídos`}
      >
        🍅 {done}/{needed}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(task.id)
        }}
        aria-label="Remover tarefa"
        className="text-white/30 hover:text-white/70 transition flex-shrink-0"
      >
        ✕
      </button>
    </li>
  )
}
