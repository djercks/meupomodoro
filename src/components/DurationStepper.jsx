export default function DurationStepper({ icon, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="flex items-center gap-2 text-sm">
        <span aria-hidden="true" className="text-white/60">{icon}</span>
        {label}
      </span>
      <div className="flex items-center gap-2 glass rounded-full px-1 py-1">
        <button
          onClick={() => onChange(value - 1)}
          aria-label={`Diminuir ${label}`}
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition text-sm"
        >
          −
        </button>
        <span className="text-xs font-medium w-14 text-center tabular-nums">{value} min</span>
        <button
          onClick={() => onChange(value + 1)}
          aria-label={`Aumentar ${label}`}
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition text-sm"
        >
          +
        </button>
      </div>
    </div>
  )
}
