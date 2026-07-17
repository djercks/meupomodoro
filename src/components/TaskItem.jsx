export default function TaskItem({ task, onToggle, onRemove }) {
  return (
    <li className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 text-sm">
      <button
        onClick={() => onToggle(task.id)}
        aria-label="Concluir tarefa"
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
          task.completed ? 'bg-emerald-400 border-emerald-400' : 'border-white/30 hover:border-emerald-400'
        }`}
      />
      <span className={`flex-1 ${task.completed ? 'line-through text-white/40' : ''}`}>{task.title}</span>
      <button
        onClick={() => onRemove(task.id)}
        aria-label="Remover tarefa"
        className="text-white/30 hover:text-white/70 transition"
      >
        ✕
      </button>
    </li>
  )
}
